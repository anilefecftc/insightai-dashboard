"""
A/B test service: queries ab_test_results and runs chi-square statistical test.
"""

from app.database import get_connection
from app.utils.statistics import chi_square_test, conversion_uplift


def get_abtest_results(test_name: str) -> dict | None:
    """
    Aggregate conversion data for both variants of the given test and
    return statistical analysis results.
    """
    conn = get_connection()
    try:
        rows = conn.execute(
            """SELECT variant,
                      COUNT(*) as users,
                      SUM(converted) as conversions
               FROM ab_test_results
               WHERE test_name = ?
               GROUP BY variant""",
            (test_name,),
        ).fetchall()
    finally:
        conn.close()

    if not rows:
        return None

    data: dict[str, dict] = {}
    for row in rows:
        data[row["variant"]] = {
            "users": row["users"],
            "conversions": row["conversions"],
        }

    control = data.get("control", {"users": 0, "conversions": 0})
    variant = data.get("variant", {"users": 0, "conversions": 0})

    control_rate = (control["conversions"] / control["users"] * 100) if control["users"] else 0.0
    variant_rate = (variant["conversions"] / variant["users"] * 100) if variant["users"] else 0.0

    uplift = conversion_uplift(control_rate, variant_rate)

    stat_result = chi_square_test(
        control["users"],
        control["conversions"],
        variant["users"],
        variant["conversions"],
    )

    return {
        "test_name": test_name,
        "control": {
            "users": control["users"],
            "conversions": control["conversions"],
            "conversion_rate": round(control_rate, 2),
        },
        "variant": {
            "users": variant["users"],
            "conversions": variant["conversions"],
            "conversion_rate": round(variant_rate, 2),
        },
        "uplift": uplift,
        "statistical_test": {
            "method": "chi_square",
            **stat_result,
        },
    }
