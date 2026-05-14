"""
Statistical helper functions for the A/B testing module.
Wraps scipy to provide chi-square and conversion uplift calculations.
"""

from scipy.stats import chi2_contingency
import math


def chi_square_test(
    control_users: int,
    control_conversions: int,
    variant_users: int,
    variant_conversions: int,
) -> dict:
    """
    Perform a chi-square test of independence between two conversion groups.

    Returns a dict with:
      chi2_statistic, p_value, is_significant, confidence_level, interpretation
    """
    control_no_conv = control_users - control_conversions
    variant_no_conv = variant_users - variant_conversions

    # Contingency table: [[converted, not converted], [converted, not converted]]
    table = [
        [control_conversions, control_no_conv],
        [variant_conversions, variant_no_conv],
    ]

    chi2, p_value, dof, expected = chi2_contingency(table)

    control_rate = control_conversions / control_users * 100 if control_users else 0
    variant_rate = variant_conversions / variant_users * 100 if variant_users else 0
    diff = variant_rate - control_rate

    if p_value < 0.001:
        confidence_level = "99.9%"
        is_significant = True
    elif p_value < 0.01:
        confidence_level = "99%"
        is_significant = True
    elif p_value < 0.05:
        confidence_level = "95%"
        is_significant = True
    else:
        confidence_level = "<95%"
        is_significant = False

    direction = "improvement" if diff > 0 else "decline"
    sig_word = "statistically significant" if is_significant else "not yet statistically significant"

    interpretation = (
        f"The Variant shows a {sig_word} {direction} of "
        f"{abs(diff):.1f} percentage points vs Control "
        f"(p = {p_value:.5f}). "
    )
    if is_significant and diff > 0:
        interpretation += "Recommend rolling out the Variant to all users."
    elif is_significant and diff < 0:
        interpretation += "The Variant performs worse — do not ship."
    else:
        interpretation += "Collect more data before making a decision."

    return {
        "chi2_statistic": round(float(chi2), 4),
        "p_value": round(float(p_value), 6),
        "is_significant": is_significant,
        "confidence_level": confidence_level,
        "interpretation": interpretation,
    }


def conversion_uplift(control_rate: float, variant_rate: float) -> float:
    """Return percentage uplift of variant over control."""
    if control_rate == 0:
        return 0.0
    return round((variant_rate - control_rate) / control_rate * 100, 2)
