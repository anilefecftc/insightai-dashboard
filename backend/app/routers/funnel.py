"""
Funnel router: /api/funnel endpoints.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services import funnel_service

router = APIRouter(prefix="/api/funnel", tags=["Funnel"])


@router.get("/data")
def funnel_data(
    start_date: Optional[str] = Query(default=None),
    end_date: Optional[str] = Query(default=None),
):
    """
    Return funnel stages, drop-off analysis, and the worst drop-off recommendation.
    Optionally filter by signup date range (ISO format: YYYY-MM-DD).
    """
    try:
        return funnel_service.get_funnel_data(start_date, end_date)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
