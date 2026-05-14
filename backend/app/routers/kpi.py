"""
KPI router: /api/kpi endpoints for summary, trends, sparklines, and detail.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services import kpi_service

router = APIRouter(prefix="/api/kpi", tags=["KPI"])

ALLOWED_METRICS = {
    "dau", "signups", "activation_rate", "retention_rate",
    "revenue", "conversion_rate", "churn_rate",
}


@router.get("/summary")
def kpi_summary(
    days: int = Query(default=7, ge=7, le=365),
    start_date: Optional[str] = Query(default=None, description="ISO date string YYYY-MM-DD"),
    end_date: Optional[str] = Query(default=None, description="ISO date string YYYY-MM-DD"),
):
    """
    Return aggregated KPI summary for current vs previous period.
    Pass `days` for a rolling window, or `start_date` + `end_date` for a custom range.
    When the previous period has no data the endpoint splits available data in half
    so the user always sees a meaningful comparison (fixes the 90d edge-case).
    """
    try:
        return kpi_service.get_kpi_summary(days, start_date, end_date)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/trends")
def kpi_trends(
    days: int = Query(default=30, ge=7, le=365),
    start_date: Optional[str] = Query(default=None),
    end_date: Optional[str] = Query(default=None),
):
    """Return per-day KPI data. Supports both rolling `days` and custom date range."""
    try:
        return kpi_service.get_kpi_trends(days, start_date, end_date)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/sparkline")
def kpi_sparkline(
    metric: str = Query(default="dau"),
    days: int = Query(default=14, ge=7, le=365),
):
    """Return minimal {date, value} pairs for a sparkline chart."""
    if metric not in ALLOWED_METRICS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid metric. Allowed: {', '.join(sorted(ALLOWED_METRICS))}",
        )
    try:
        return kpi_service.get_sparkline(metric, days)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/detail")
def kpi_detail(
    metric: str = Query(..., description="One of: dau, signups, activation_rate, ..."),
    days: int = Query(default=90, ge=7, le=365),
):
    """
    Return full history + statistical summary for a single metric.
    Used by the KPI card detail/drilldown page.
    """
    if metric not in ALLOWED_METRICS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid metric. Allowed: {', '.join(sorted(ALLOWED_METRICS))}",
        )
    try:
        return kpi_service.get_metric_detail(metric, days)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
