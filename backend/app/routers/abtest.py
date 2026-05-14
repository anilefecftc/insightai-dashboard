"""
A/B test router: /api/abtest endpoints.
"""

from fastapi import APIRouter, HTTPException, Query
from app.services import abtest_service

router = APIRouter(prefix="/api/abtest", tags=["A/B Test"])


@router.get("/results")
def abtest_results(test_name: str = Query(default="new_onboarding")):
    """
    Return conversion statistics and chi-square test results for the given
    A/B test. Defaults to the 'new_onboarding' test seeded in the database.
    """
    try:
        result = abtest_service.get_abtest_results(test_name)
        if result is None:
            raise HTTPException(
                status_code=404,
                detail=f"No A/B test data found for test_name='{test_name}'",
            )
        return result
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
