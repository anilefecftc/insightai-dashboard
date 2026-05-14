"""
Mock data generator for the SaaS Analytics Dashboard.

Key realistic patterns:
- 5000 users over 90 days
- Weekday signups higher than weekends
- Dip around days 45-50 (simulating a product issue)
- Gradual recovery after the dip
- Revenue correlated with paying user count
- SESSION EVENTS: activated users return on a realistic weekly cadence
  * Week 1 after activation: 78% chance of returning
  * Each subsequent week: 76% of previously-active users return
  * 10% re-activation chance for lapsed users
  This produces ~76% week-over-week retention and ~1-3% weekly churn
  for paying users.

Run with: python seed_data.py
"""

import sqlite3
import random
import json
from datetime import datetime, timedelta
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.database import get_connection, init_db

random.seed(42)

TODAY = datetime.now().date()
START_DATE = TODAY - timedelta(days=89)  # 90 days inclusive

PLAN_DISTRIBUTION = [
    ("free",       0.60, 0.0),
    ("starter",    0.20, 9.0),
    ("pro",        0.15, 29.0),
    ("enterprise", 0.05, 99.0),
]

WEEKDAY_WEIGHT = 1.3
WEEKEND_WEIGHT = 0.7
DIP_START = 44
DIP_END = 50
DIP_FACTOR = 0.4


def dip_factor(day_offset: int) -> float:
    if DIP_START <= day_offset <= DIP_END:
        center = (DIP_START + DIP_END) / 2
        depth = 1 - abs(day_offset - center) / ((DIP_END - DIP_START) / 2) * (1 - DIP_FACTOR)
        return depth
    elif DIP_END < day_offset <= DIP_END + 10:
        recovery = (day_offset - DIP_END) / 10
        return DIP_FACTOR + (1 - DIP_FACTOR) * recovery
    return 1.0


def pick_plan() -> tuple:
    r = random.random()
    cumulative = 0.0
    for name, prob, rev in PLAN_DISTRIBUTION:
        cumulative += prob
        if r < cumulative:
            return name, rev
    return "free", 0.0


def generate_users(conn: sqlite3.Connection) -> list:
    num_days = 90
    raw_counts = []
    for d in range(num_days):
        date = START_DATE + timedelta(days=d)
        is_weekend = date.weekday() >= 5
        base = 5000 / num_days
        day_weight = WEEKEND_WEIGHT if is_weekend else WEEKDAY_WEIGHT
        trend_factor = 1.0 + (d / num_days) * 0.3
        noise = random.uniform(0.9, 1.1)
        raw_counts.append(max(1, int(base * day_weight * trend_factor * dip_factor(d) * noise)))

    total_raw = sum(raw_counts)
    scale = 5000 / total_raw

    users = []
    user_id = 1

    for day_offset in range(num_days):
        signup_date = START_DATE + timedelta(days=day_offset)
        count = max(1, int(raw_counts[day_offset] * scale))
        df = dip_factor(day_offset)

        for _ in range(count):
            activation_rate = random.uniform(0.55, 0.65) * df
            activated = random.random() < activation_rate
            activation_date = None
            if activated:
                days_to_activate = random.randint(0, 3)
                activation_date = str(signup_date + timedelta(days=days_to_activate))

            retained = False
            if activated:
                ret_rate = random.uniform(0.70, 0.80) * min(df + 0.2, 1.0)
                retained = random.random() < ret_rate

            ab_group = "control" if random.random() < 0.5 else "variant"
            base_conversion = 0.18 if ab_group == "control" else 0.23

            converted = False
            first_payment_date = None
            plan, monthly_revenue = "free", 0.0

            if retained:
                converted = random.random() < base_conversion
                if converted:
                    days_to_pay = random.randint(1, 14)
                    first_payment_date = str(signup_date + timedelta(days=days_to_pay))
                    plan, monthly_revenue = pick_plan()
                    if plan == "free":
                        plan = "starter"
                        monthly_revenue = 9.0

            churn_date = None
            if converted:
                monthly_churn = random.uniform(0.03, 0.07)
                daily_churn = monthly_churn / 30
                if random.random() < daily_churn * (89 - day_offset):
                    days_until_churn = random.randint(14, max(15, 89 - day_offset))
                    churn_day = signup_date + timedelta(days=days_until_churn)
                    if churn_day <= TODAY:
                        churn_date = str(churn_day)

            users.append({
                "id": user_id,
                "email": f"user{user_id}@example.com",
                "signup_date": str(signup_date),
                "activation_date": activation_date,
                "first_payment_date": first_payment_date,
                "churn_date": churn_date,
                "plan": plan,
                "monthly_revenue": monthly_revenue,
                "ab_test_group": ab_group,
            })
            user_id += 1

    conn.executemany(
        """INSERT OR IGNORE INTO users
           (id, email, signup_date, activation_date, first_payment_date,
            churn_date, plan, monthly_revenue, ab_test_group)
           VALUES (:id, :email, :signup_date, :activation_date, :first_payment_date,
                   :churn_date, :plan, :monthly_revenue, :ab_test_group)""",
        users,
    )
    conn.commit()
    print(f"  Inserted {len(users)} users")
    return users


def generate_session_events(conn: sqlite3.Connection, users: list) -> None:
    """
    Generate realistic session/activity events for activated users.

    Weekly cadence:
      - Week 1 after activation: 78% probability of returning
      - Subsequent weeks: 76% of previously-active users return
      - Lapsed users: 10% re-activation chance per week

    This creates ~76% week-over-week retention and realistic engagement gaps.
    """
    session_events = []

    for u in users:
        if not u["activation_date"]:
            continue

        activation_date = datetime.strptime(u["activation_date"], "%Y-%m-%d").date()
        was_active_prev_week = False

        for week in range(1, 14):  # Up to 13 weeks (91 days)
            week_start = activation_date + timedelta(days=week * 7)
            if week_start > TODAY:
                break

            # Probability of being active this week
            if week == 1:
                prob = 0.78
            elif was_active_prev_week:
                prob = 0.76  # Core weekly retention → ~76% period retention
            else:
                prob = 0.10  # Re-activation chance

            if random.random() < prob:
                was_active_prev_week = True
                # 1-5 sessions per active week, spread randomly
                num_sessions = random.randint(1, 5)
                for _ in range(num_sessions):
                    max_offset = min(6, (TODAY - week_start).days)
                    if max_offset < 0:
                        break
                    session_date = week_start + timedelta(days=random.randint(0, max_offset))
                    if session_date > TODAY:
                        continue
                    session_events.append({
                        "user_id": u["id"],
                        "event_type": "session",
                        "event_date": str(session_date),
                        "metadata": None,
                    })
            else:
                was_active_prev_week = False

    conn.executemany(
        """INSERT INTO events (user_id, event_type, event_date, metadata)
           VALUES (:user_id, :event_type, :event_date, :metadata)""",
        session_events,
    )
    conn.commit()
    print(f"  Inserted {len(session_events)} session events")


def generate_base_events(conn: sqlite3.Connection, users: list) -> None:
    """Insert one event row per user lifecycle action (non-session)."""
    events = []
    for u in users:
        events.append({
            "user_id": u["id"],
            "event_type": "signup",
            "event_date": u["signup_date"],
            "metadata": json.dumps({"ab_group": u["ab_test_group"]}),
        })
        if u["activation_date"]:
            events.append({
                "user_id": u["id"],
                "event_type": "activation",
                "event_date": u["activation_date"],
                "metadata": None,
            })
        if u["first_payment_date"]:
            events.append({
                "user_id": u["id"],
                "event_type": "payment",
                "event_date": u["first_payment_date"],
                "metadata": json.dumps({"plan": u["plan"], "revenue": u["monthly_revenue"]}),
            })
        if u["churn_date"]:
            events.append({
                "user_id": u["id"],
                "event_type": "churn",
                "event_date": u["churn_date"],
                "metadata": None,
            })

    conn.executemany(
        """INSERT INTO events (user_id, event_type, event_date, metadata)
           VALUES (:user_id, :event_type, :event_date, :metadata)""",
        events,
    )
    conn.commit()
    print(f"  Inserted {len(events)} lifecycle events")


def generate_ab_test_results(conn: sqlite3.Connection, users: list) -> None:
    results = []
    for u in users:
        if u["ab_test_group"] not in ("control", "variant"):
            continue
        results.append({
            "test_name": "new_onboarding",
            "variant": u["ab_test_group"],
            "user_id": u["id"],
            "converted": 1 if u["first_payment_date"] else 0,
            "conversion_event": "first_payment",
            "created_at": u["signup_date"],
        })
    conn.executemany(
        """INSERT INTO ab_test_results
           (test_name, variant, user_id, converted, conversion_event, created_at)
           VALUES (:test_name, :variant, :user_id, :converted, :conversion_event, :created_at)""",
        results,
    )
    conn.commit()
    print(f"  Inserted {len(results)} AB test result rows")


def generate_daily_metrics(conn: sqlite3.Connection, users: list) -> None:
    """
    Aggregate per-day metrics including proper retention/churn calculated from
    session events (week-over-week active users).
    """
    by_signup: dict = {}
    for u in users:
        by_signup.setdefault(u["signup_date"], []).append(u)

    metrics_rows = []

    for day_offset in range(90):
        date = START_DATE + timedelta(days=day_offset)
        date_str = str(date)
        prev7_str = str(date - timedelta(days=7))
        prev14_str = str(date - timedelta(days=14))

        signups_today = by_signup.get(date_str, [])
        signups = len(signups_today)

        activations = sum(1 for u in users if u["activation_date"] == date_str)

        active_paying = sum(
            1 for u in users
            if u["first_payment_date"]
            and u["first_payment_date"] <= date_str
            and (not u["churn_date"] or u["churn_date"] > date_str)
        )

        churned_today = sum(1 for u in users if u["churn_date"] == date_str)

        revenue = sum(
            u["monthly_revenue"] / 30
            for u in users
            if u["first_payment_date"]
            and u["first_payment_date"] <= date_str
            and (not u["churn_date"] or u["churn_date"] > date_str)
        )

        dau = sum(
            1 for u in users
            if u["signup_date"] <= date_str
            and (not u["churn_date"] or u["churn_date"] > date_str)
        )

        activation_rate = (activations / signups * 100) if signups > 0 else 0.0

        # ── Retention from activity events (period-over-period) ──────────────
        prev_active_ids = set(
            r[0] for r in conn.execute(
                """SELECT DISTINCT user_id FROM events
                   WHERE event_date BETWEEN ? AND ?
                   AND event_type NOT IN ('churn', 'signup')""",
                (prev14_str, prev7_str),
            ).fetchall()
        )
        curr_active_ids = set(
            r[0] for r in conn.execute(
                """SELECT DISTINCT user_id FROM events
                   WHERE event_date BETWEEN ? AND ?
                   AND event_type NOT IN ('churn', 'signup')""",
                (prev7_str, date_str),
            ).fetchall()
        )

        retained_count = len(prev_active_ids & curr_active_ids)
        prev_active_count = len(prev_active_ids)
        retention_rate = (retained_count / prev_active_count * 100) if prev_active_count else 0.0

        # ── Churn rate: paying customers who cancelled in last 7 days ────────
        paying_at_prev = sum(
            1 for u in users
            if u["first_payment_date"]
            and u["first_payment_date"] <= prev7_str
            and (not u["churn_date"] or u["churn_date"] > prev7_str)
        )
        churned_in_window = sum(
            1 for u in users
            if u["churn_date"]
            and prev7_str < u["churn_date"] <= date_str
        )
        churn_rate = (churned_in_window / paying_at_prev * 100) if paying_at_prev else 0.0

        total_to_date = sum(1 for u in users if u["signup_date"] <= date_str)
        conversion_rate = (active_paying / total_to_date * 100) if total_to_date else 0.0

        metrics_rows.append({
            "date": date_str,
            "dau": dau,
            "signups": signups,
            "activations": activations,
            "active_paying": active_paying,
            "churned": churned_today,
            "revenue": round(revenue, 2),
            "activation_rate": round(activation_rate, 2),
            "retention_rate": round(retention_rate, 2),
            "conversion_rate": round(conversion_rate, 2),
            "churn_rate": round(churn_rate, 2),
        })

    conn.executemany(
        """INSERT OR REPLACE INTO daily_metrics
           (date, dau, signups, activations, active_paying, churned, revenue,
            activation_rate, retention_rate, conversion_rate, churn_rate)
           VALUES (:date, :dau, :signups, :activations, :active_paying, :churned,
                   :revenue, :activation_rate, :retention_rate, :conversion_rate, :churn_rate)""",
        metrics_rows,
    )
    conn.commit()
    print(f"  Inserted {len(metrics_rows)} daily metric rows")


def clear_existing_data(conn: sqlite3.Connection) -> None:
    conn.execute("DELETE FROM ab_test_results")
    conn.execute("DELETE FROM events")
    conn.execute("DELETE FROM daily_metrics")
    conn.execute("DELETE FROM users")
    conn.execute("DELETE FROM sqlite_sequence")
    conn.commit()
    print("  Cleared existing data")


if __name__ == "__main__":
    print("Initializing database schema...")
    init_db()

    conn = get_connection()

    print("Clearing existing data...")
    clear_existing_data(conn)

    print("Generating users...")
    users = generate_users(conn)

    print("Generating lifecycle events (signup, activation, payment, churn)...")
    generate_base_events(conn, users)

    print("Generating session events (realistic activity cadence)...")
    generate_session_events(conn, users)

    print("Generating A/B test results...")
    generate_ab_test_results(conn, users)

    print("Generating daily metrics (retention computed from events — may take ~30s)...")
    generate_daily_metrics(conn, users)

    conn.close()
    print("\nSeed data generation complete!")
    db_path = os.path.abspath(os.getenv("DATABASE_PATH", "./saas_analytics.db"))
    print(f"Database: {db_path}")
