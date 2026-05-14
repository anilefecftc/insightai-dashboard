"""
AI reporting service: calls gpt-4.1-mini to generate KPI analysis and
weekly management summaries. Gracefully handles missing/invalid API keys.

When no key is set, _mock_analysis and _mock_weekly_summary generate
template-based responses that reference REAL metric values from the DB.
"""

import os
import json
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """You are a senior SaaS analytics expert providing executive-level KPI analysis.

Analyze the provided metrics and:
1. Identify the top 3-5 most significant metric changes (positive and negative)
2. Correlate metrics to explain root causes (e.g., "revenue dropped because conversion fell after activation")
3. Provide 3-5 specific, actionable recommendations
4. Assess overall risk level: Low (metrics stable/growing), Medium (some concerning trends), High (multiple declining metrics)

Respond in this exact JSON format:
{
  "analysis": "2-3 paragraph executive summary",
  "key_insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["action1", "action2", "action3"],
  "risk_level": "low|medium|high"
}"""

WEEKLY_SYSTEM_PROMPT = """You are a senior SaaS analytics expert writing an executive weekly report.
Write a professional management-ready summary covering user growth, revenue, funnel health, and risks.
Keep it under 300 words. Structure it with clear sections using markdown:
**Executive Summary**, **Key Metrics**, **Risks & Recommendations**."""


def _get_api_key() -> str:
    """Re-read the API key from .env on each call so live key changes take effect."""
    load_dotenv(override=True)
    return os.getenv("OPENAI_API_KEY", "")


def _is_mock_key(key: str) -> bool:
    return not key or key in ("your_openai_api_key_here", "sk-your-key-here")


def get_status() -> dict:
    """Return current AI mode (mock or live gpt-4.1-mini)."""
    key = _get_api_key()
    if _is_mock_key(key):
        return {"mode": "mock", "model": None}
    return {"mode": "live", "model": "gpt-4.1-mini"}


def _build_kpi_message(kpi_summary: dict, period: str) -> str:
    """Format KPI data into a structured prompt message."""
    changes = kpi_summary.get("changes", {})
    return f"""Period: {period}

Current KPIs:
- Daily Active Users (DAU): {kpi_summary.get('dau', 'N/A'):,} ({changes.get('dau_change', 0) or 0:+.1f}% vs prior period)
- Daily Signups: {kpi_summary.get('signups', 'N/A'):,} ({changes.get('signups_change', 0) or 0:+.1f}%)
- Activation Rate: {kpi_summary.get('activation_rate', 0):.1f}% ({changes.get('activation_rate_change', 0) or 0:+.1f}%)
- Retention Rate: {kpi_summary.get('retention_rate', 0):.1f}% ({changes.get('retention_rate_change', 0) or 0:+.1f}%)
- Daily Revenue: ${kpi_summary.get('revenue', 0):.2f} ({changes.get('revenue_change', 0) or 0:+.1f}%)
- Conversion Rate (Free→Paid): {kpi_summary.get('conversion_rate', 0):.1f}% ({changes.get('conversion_rate_change', 0) or 0:+.1f}%)
- Churn Rate: {kpi_summary.get('churn_rate', 0):.2f}% ({changes.get('churn_rate_change', 0) or 0:+.1f}%)

Analyze these metrics, identify root causes by correlating related metrics, and provide specific recommendations."""


def analyze_kpis(kpi_summary: dict, period: str) -> dict:
    """Send KPI data to gpt-4.1-mini; fall back to smart mock if no key."""
    api_key = _get_api_key()

    if _is_mock_key(api_key):
        return _mock_analysis(kpi_summary)

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": _build_kpi_message(kpi_summary, period)},
            ],
            temperature=0.3,
            max_tokens=1200,
            response_format={"type": "json_object"},
        )

        result = json.loads(response.choices[0].message.content)
        return {
            "analysis":        result.get("analysis", ""),
            "key_insights":    result.get("key_insights", []),
            "recommendations": result.get("recommendations", []),
            "risk_level":      result.get("risk_level", "medium").lower(),
        }

    except Exception as exc:
        return {
            "analysis":        f"AI analysis unavailable: {exc}",
            "key_insights":    [],
            "recommendations": ["Check your OpenAI API key in backend/.env"],
            "risk_level":      "medium",
        }


def generate_weekly_summary(kpi_summary: dict) -> dict:
    """Generate a management-ready weekly summary; fallback to smart mock."""
    api_key = _get_api_key()

    if _is_mock_key(api_key):
        return _mock_weekly_summary(kpi_summary)

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)

        user_msg = (
            "Generate a weekly executive summary based on these metrics:\n"
            + _build_kpi_message(kpi_summary, "last_7_days")
        )

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": WEEKLY_SYSTEM_PROMPT},
                {"role": "user",   "content": user_msg},
            ],
            temperature=0.4,
            max_tokens=600,
        )

        return {
            "summary":      response.choices[0].message.content,
            "generated_at": datetime.utcnow().isoformat(),
        }

    except Exception as exc:
        return {
            "summary":      f"Weekly summary unavailable: {exc}",
            "generated_at": datetime.utcnow().isoformat(),
        }


# ─────────────────────────────────────────────────────────────────────────────
# Smart mock responses — dynamically reference real metric values
# ─────────────────────────────────────────────────────────────────────────────

def _mock_analysis(kpi: dict) -> dict:
    """
    Template-based analysis that adapts its language and risk assessment to the
    actual metric values so it looks professional even without an API key.
    """
    dau            = kpi.get("dau", 0)
    signups        = kpi.get("signups", 0)
    activation     = kpi.get("activation_rate", 0)
    retention      = kpi.get("retention_rate", 0)
    revenue        = kpi.get("revenue", 0)
    conversion     = kpi.get("conversion_rate", 0)
    churn          = kpi.get("churn_rate", 0)
    changes        = kpi.get("changes", {})
    dau_chg        = changes.get("dau_change")        or 0
    rev_chg        = changes.get("revenue_change")    or 0
    ret_chg        = changes.get("retention_rate_change") or 0
    churn_chg      = changes.get("churn_rate_change") or 0

    # ── Risk assessment ───────────────────────────────────────────────────────
    risk_score = 0
    if churn > 5:          risk_score += 2
    if retention < 70:     risk_score += 2
    if rev_chg < -10:      risk_score += 1
    if activation < 50:    risk_score += 1
    if conversion < 5:     risk_score += 1
    if dau_chg < -5:       risk_score += 1
    risk = "high" if risk_score >= 4 else ("medium" if risk_score >= 2 else "low")

    # ── Retention commentary ──────────────────────────────────────────────────
    ret_comment = (
        f"Retention is strong at {retention:.1f}%, well above the 70% benchmark."
        if retention >= 75 else
        f"Retention at {retention:.1f}% is below the 75% benchmark — investigate drop-off triggers."
    )

    # ── Churn commentary ─────────────────────────────────────────────────────
    churn_comment = (
        f"Weekly churn of {churn:.2f}% is within the healthy 1–3% range."
        if churn <= 3 else
        f"Churn at {churn:.2f}% is elevated (healthy target: ≤3% weekly). "
        f"Implement retention campaigns immediately."
    )

    # ── Revenue commentary ────────────────────────────────────────────────────
    if rev_chg > 0:
        rev_comment = f"Revenue is trending up at ${revenue:.2f}/day (+{rev_chg:.1f}% vs prior period), indicating healthy monetisation."
    elif rev_chg < 0:
        rev_comment = f"Revenue declined {rev_chg:.1f}% to ${revenue:.2f}/day. Investigate whether conversion or churn is the driver."
    else:
        rev_comment = f"Revenue is stable at ${revenue:.2f}/day."

    analysis = (
        f"Your platform has {dau:,} daily active users with {signups:,} new signups per day. "
        f"{ret_comment} {churn_comment}\n\n"
        f"{rev_comment} "
        f"Activation rate stands at {activation:.1f}%, meaning roughly {activation:.0f}% of new signups "
        f"complete the core onboarding action within 3 days. "
        f"Conversion from free to paid is {conversion:.1f}%.\n\n"
        f"*Note: This analysis is generated from live database metrics using smart templates. "
        f"Add your OpenAI API key to `backend/.env` to unlock gpt-4.1-mini powered analysis.*"
    )

    # ── Dynamic insights ─────────────────────────────────────────────────────
    insights = [
        f"DAU: {dau:,} users — {'+' if dau_chg >= 0 else ''}{dau_chg:.1f}% week-over-week",
        f"Retention {retention:.1f}% → {'✓ Healthy' if retention >= 75 else '⚠ Below benchmark (75%)'}",
        f"Churn {churn:.2f}% → {'✓ Within healthy range' if churn <= 3 else '⚠ Elevated — review offboarding survey data'}",
        f"Activation {activation:.1f}% — "
        + ("strong onboarding performance" if activation >= 60 else "optimize the first-session experience"),
        f"Revenue ${revenue:.2f}/day — {'+' if rev_chg >= 0 else ''}{rev_chg:.1f}% change",
    ]

    # ── Dynamic recommendations ───────────────────────────────────────────────
    recs = []
    if activation < 60:
        recs.append(f"Activation rate is {activation:.1f}% — add an in-app checklist to guide users to their first value moment.")
    if retention < 75:
        recs.append("Run a 7-day re-engagement email sequence for users who activated but returned less than twice.")
    if churn > 3:
        recs.append(f"Churn at {churn:.2f}% exceeds the 3% threshold — survey churned users and address the top cancellation reason.")
    if conversion < 8:
        recs.append(f"Conversion rate of {conversion:.1f}% has room to grow — A/B test an upgrade prompt at the feature limit.")
    recs.append("Review the Funnel Analysis page: the Retention→Payment drop-off is typically the highest friction point.")
    recs.append("Add your OpenAI API key to `backend/.env` for AI-generated narrative analysis.")

    return {
        "analysis":        analysis,
        "key_insights":    insights[:5],
        "recommendations": recs[:5],
        "risk_level":      risk,
    }


def _mock_weekly_summary(kpi: dict) -> dict:
    dau        = kpi.get("dau", 0)
    signups    = kpi.get("signups", 0)
    activation = kpi.get("activation_rate", 0)
    retention  = kpi.get("retention_rate", 0)
    revenue    = kpi.get("revenue", 0)
    conversion = kpi.get("conversion_rate", 0)
    churn      = kpi.get("churn_rate", 0)
    changes    = kpi.get("changes", {})
    rev_chg    = changes.get("revenue_change") or 0

    health = "positive" if rev_chg >= 0 and churn <= 3 else "needs attention"

    summary = (
        "**Executive Summary — Weekly KPI Report**\n\n"
        f"The platform's overall health is **{health}** this week. "
        f"We ended the period with **{dau:,} daily active users**, averaging **{signups:,} new signups per day**. "
        f"Revenue tracked at **${revenue:.2f}/day** ({'+' if rev_chg >= 0 else ''}{rev_chg:.1f}% vs prior period).\n\n"
        "**Key Metrics**\n\n"
        f"- Activation Rate: **{activation:.1f}%** "
        + ("✓" if activation >= 60 else "⚠ below 60% target") + "\n"
        f"- Retention Rate: **{retention:.1f}%** "
        + ("✓" if retention >= 75 else "⚠ below 75% benchmark") + "\n"
        f"- Conversion Rate: **{conversion:.1f}%** (free → paid)\n"
        f"- Weekly Churn: **{churn:.2f}%** "
        + ("✓" if churn <= 3 else "⚠ above 3% threshold") + "\n\n"
        "**Risks & Recommendations**\n\n"
    )

    if churn > 3:
        summary += f"- ⚠ Churn at {churn:.2f}% — deploy retention playbook and survey exiting users.\n"
    if retention < 75:
        summary += f"- ⚠ Retention ({retention:.1f}%) below benchmark — strengthen day-7 and day-14 touchpoints.\n"
    if activation < 60:
        summary += f"- ⚠ Activation ({activation:.1f}%) has room to improve — simplify the first-run experience.\n"
    summary += "- Add your OpenAI API key to `backend/.env` for gpt-4.1-mini powered narrative summaries.\n"

    return {
        "summary":      summary,
        "generated_at": datetime.utcnow().isoformat(),
    }
