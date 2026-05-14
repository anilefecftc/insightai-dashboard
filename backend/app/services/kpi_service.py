"""
KPI service: queries daily_metrics, events, and users tables.

Period logic
────────────
Normal mode (days param):
  current  = [today-days+1 … today]
  previous = [today-2*days+1 … today-days]

Custom mode (start_date / end_date params):
  current  = [start_date … end_date]
  previous = same width shifted back

90-day (edge) fix:
  When the previous period would start before the earliest available data we
  instead compare the FIRST HALF vs SECOND HALF of the available window so
  the user always sees a meaningful comparison.
  When there is truly no previous data (< 14 days of history), all change
  values are returned as None and the frontend shows "N/A".

Retention Rate  = retained / prev_active × 100        (event-based, 70-85%)
Churn Rate      = churned_paying / paying_at_start × 100  (1-3% weekly, 3-7% monthly)
"""

import statistics as _statistics
from app.database import get_connection
from datetime import date, timedelta


def _safe_pct(curr, prev) -> float | None:
    """Percentage change curr vs prev; None when denominator is zero or None."""
    if curr is None or prev is None or prev == 0:
        return None
    return round((curr - prev) / prev * 100, 2)


def get_kpi_summary(
    days: int = 7,
    start_date: str | None = None,
    end_date: str | None = None,
) -> dict:
    today = date.today()

    # ── Determine period boundaries ───────────────────────────────────────────
    if start_date and end_date:
        period_start = date.fromisoformat(start_date)
        today_eff = date.fromisoformat(end_date)
        period_len = (today_eff - period_start).days + 1
        prev_end = period_start - timedelta(days=1)
        prev_start = prev_end - timedelta(days=period_len - 1)
    else:
        today_eff = today
        period_start = today - timedelta(days=days - 1)
        prev_start = today - timedelta(days=days * 2 - 1)
        prev_end = today - timedelta(days=days)

    conn = get_connection()
    try:
        # Find earliest data point
        earliest_row = conn.execute(
            "SELECT MIN(date) as d FROM daily_metrics"
        ).fetchone()
        earliest_date = (
            date.fromisoformat(earliest_row["d"])
            if earliest_row and earliest_row["d"]
            else period_start
        )

        # ── 90d edge-case: split available data in half ───────────────────────
        split_mode = prev_start < earliest_date
        no_prior_data = False

        if split_mode:
            available = (today_eff - earliest_date).days + 1
            if available >= 14:
                half = available // 2
                mid = earliest_date + timedelta(days=half)
                prev_start = earliest_date
                prev_end = mid - timedelta(days=1)
                period_start = mid
            else:
                no_prior_data = True
                prev_start = period_start
                prev_end = period_start

        # ── daily_metrics averages for current and previous periods ───────────
        current_rows = conn.execute(
            """SELECT dau, signups, activation_rate, revenue, conversion_rate
               FROM daily_metrics WHERE date BETWEEN ? AND ?""",
            (str(period_start), str(today_eff)),
        ).fetchall()

        previous_rows = conn.execute(
            """SELECT dau, signups, activation_rate, revenue, conversion_rate
               FROM daily_metrics WHERE date BETWEEN ? AND ?""",
            (str(prev_start), str(prev_end)),
        ).fetchall()

        # ── Retention from events (period-over-period activity) ───────────────
        def active_ids_in(start, end):
            rows = conn.execute(
                """SELECT DISTINCT user_id FROM events
                   WHERE event_date BETWEEN ? AND ?
                   AND event_type NOT IN ('churn', 'signup')""",
                (str(start), str(end)),
            ).fetchall()
            return {r[0] for r in rows}

        prev_active_ids = active_ids_in(prev_start, prev_end)
        curr_active_ids = active_ids_in(period_start, today_eff)
        retained_count = len(prev_active_ids & curr_active_ids)
        prev_active_count = len(prev_active_ids)
        curr_retention = (
            retained_count / prev_active_count * 100 if prev_active_count else 0.0
        )

        # Previous-previous period for retention change
        pp_period_len = max((prev_end - prev_start).days, 1)
        pp_end = prev_start - timedelta(days=1)
        pp_start = pp_end - timedelta(days=pp_period_len - 1)
        no_pp_data = pp_start < earliest_date

        if no_pp_data or no_prior_data:
            prev_retention = None
        else:
            pp_active_ids = active_ids_in(pp_start, pp_end)
            pp_retained = len(pp_active_ids & prev_active_ids)
            pp_count = len(pp_active_ids)
            prev_retention = (pp_retained / pp_count * 100) if pp_count else None

        # ── Churn: paying customers who cancelled in current period ───────────
        paying_at_start = conn.execute(
            """SELECT COUNT(*) as cnt FROM users
               WHERE first_payment_date IS NOT NULL AND first_payment_date <= ?
               AND (churn_date IS NULL OR churn_date > ?)""",
            (str(prev_end), str(prev_end)),
        ).fetchone()["cnt"]

        churned_in_period = conn.execute(
            """SELECT COUNT(*) as cnt FROM users
               WHERE churn_date BETWEEN ? AND ?""",
            (str(period_start), str(today_eff)),
        ).fetchone()["cnt"]

        curr_churn = (
            churned_in_period / paying_at_start * 100 if paying_at_start else 0.0
        )

        # Previous churn
        if no_pp_data or no_prior_data:
            prev_churn = None
        else:
            paying_at_pp = conn.execute(
                """SELECT COUNT(*) as cnt FROM users
                   WHERE first_payment_date IS NOT NULL AND first_payment_date <= ?
                   AND (churn_date IS NULL OR churn_date > ?)""",
                (str(pp_end), str(pp_end)),
            ).fetchone()["cnt"]
            churned_in_prev = conn.execute(
                """SELECT COUNT(*) as cnt FROM users
                   WHERE churn_date BETWEEN ? AND ?""",
                (str(prev_start), str(prev_end)),
            ).fetchone()["cnt"]
            prev_churn = (
                churned_in_prev / paying_at_pp * 100 if paying_at_pp else None
            )

    finally:
        conn.close()

    def avg(rows, col):
        vals = [r[col] for r in rows if r[col] is not None]
        return sum(vals) / len(vals) if vals else 0.0

    metrics = ["dau", "signups", "activation_rate", "revenue", "conversion_rate"]
    curr_vals = {m: avg(current_rows, m) for m in metrics}
    prev_vals = {m: avg(previous_rows, m) for m in metrics}

    # When there's no prior data at all, return None for all changes
    if no_prior_data or not previous_rows:
        changes = {f"{m}_change": None for m in metrics}
        changes["retention_rate_change"] = None
        changes["churn_rate_change"] = None
    else:
        changes = {
            "dau_change":              _safe_pct(curr_vals["dau"],             prev_vals["dau"]),
            "signups_change":          _safe_pct(curr_vals["signups"],         prev_vals["signups"]),
            "activation_rate_change":  _safe_pct(curr_vals["activation_rate"], prev_vals["activation_rate"]),
            "retention_rate_change":   _safe_pct(curr_retention,               prev_retention),
            "revenue_change":          _safe_pct(curr_vals["revenue"],         prev_vals["revenue"]),
            "conversion_rate_change":  _safe_pct(curr_vals["conversion_rate"], prev_vals["conversion_rate"]),
            "churn_rate_change":       _safe_pct(curr_churn,                   prev_churn),
        }

    return {
        "dau":              int(curr_vals["dau"]),
        "signups":          int(curr_vals["signups"]),
        "activation_rate":  round(curr_vals["activation_rate"], 2),
        "retention_rate":   round(curr_retention, 2),
        "revenue":          round(curr_vals["revenue"], 2),
        "conversion_rate":  round(curr_vals["conversion_rate"], 2),
        "churn_rate":       round(curr_churn, 2),
        "changes":          changes,
    }


def get_kpi_trends(
    days: int = 30,
    start_date: str | None = None,
    end_date: str | None = None,
) -> list:
    """Return per-day KPI rows, oldest first."""
    conn = get_connection()
    try:
        if start_date and end_date:
            rows = conn.execute(
                """SELECT date, dau, signups, activation_rate, retention_rate,
                          revenue, conversion_rate, churn_rate
                   FROM daily_metrics
                   WHERE date BETWEEN ? AND ?
                   ORDER BY date ASC""",
                (start_date, end_date),
            ).fetchall()
        else:
            rows = conn.execute(
                """SELECT date, dau, signups, activation_rate, retention_rate,
                          revenue, conversion_rate, churn_rate
                   FROM daily_metrics
                   ORDER BY date DESC LIMIT ?""",
                (days,),
            ).fetchall()
            rows = list(reversed(rows))
    finally:
        conn.close()
    return [dict(r) for r in rows]


def get_sparkline(metric: str, days: int = 14) -> list:
    allowed = {"dau", "signups", "activation_rate", "retention_rate",
               "revenue", "conversion_rate", "churn_rate"}
    if metric not in allowed:
        return []
    conn = get_connection()
    try:
        rows = conn.execute(
            f"""SELECT date, {metric} as value FROM daily_metrics
                ORDER BY date DESC LIMIT ?""",
            (days,),
        ).fetchall()
    finally:
        conn.close()
    return [{"date": r["date"], "value": r["value"]} for r in reversed(rows)]


def get_metric_detail(metric: str, days: int = 90) -> dict:
    """
    Return full history + statistical summary for a single metric.
    Used by the KPI card detail page.
    """
    allowed = {"dau", "signups", "activation_rate", "retention_rate",
               "revenue", "conversion_rate", "churn_rate"}
    if metric not in allowed:
        return {}

    conn = get_connection()
    try:
        rows = conn.execute(
            f"""SELECT date, {metric} as value FROM daily_metrics
                ORDER BY date DESC LIMIT ?""",
            (days,),
        ).fetchall()
    finally:
        conn.close()

    rows = list(reversed(rows))
    values = [r["value"] for r in rows if r["value"] is not None]
    if not values:
        return {"metric": metric, "current_value": 0, "values": [], "stats": {}}

    # Current value (latest day)
    current = values[-1]

    # Averages
    def avg_last(n):
        subset = values[-n:] if len(values) >= n else values
        return round(sum(subset) / len(subset), 2) if subset else 0.0

    # Min / Max with date
    paired = [(r["value"], r["date"]) for r in rows if r["value"] is not None]
    min_val, min_date = min(paired, key=lambda x: x[0])
    max_val, max_date = max(paired, key=lambda x: x[0])

    std_dev = round(_statistics.stdev(values), 2) if len(values) > 1 else 0.0

    return {
        "metric": metric,
        "current_value": current,
        "values": [{"date": r["date"], "value": r["value"]} for r in rows],
        "stats": {
            "avg_7d":  avg_last(7),
            "avg_30d": avg_last(30),
            "avg_90d": avg_last(90),
            "min":     {"value": min_val, "date": min_date},
            "max":     {"value": max_val, "date": max_date},
            "std_dev": std_dev,
        },
    }
