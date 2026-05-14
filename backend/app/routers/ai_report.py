"""
AI reporting router: /api/ai endpoints for KPI analysis, weekly summaries, and status.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import ai_service, kpi_service

router = APIRouter(prefix="/api/ai", tags=["AI Report"])


class AnalyzeRequest(BaseModel):
    period: str = "last_7_days"


@router.get("/status")
def ai_status():
    """Return whether the AI service is running in mock or live GPT-4o-mini mode."""
    return ai_service.get_status()


@router.post("/analyze")
def analyze_kpis(body: AnalyzeRequest):
    """
    Fetch current KPI data and generate analysis.
    Uses GPT-4o-mini when an API key is configured, otherwise returns smart mock data.
    """
    try:
        kpi_summary = kpi_service.get_kpi_summary()
        return ai_service.analyze_kpis(kpi_summary, body.period)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/weekly-summary")
def weekly_summary():
    """Generate a management-ready weekly executive summary."""
    try:
        kpi_summary = kpi_service.get_kpi_summary()
        return ai_service.generate_weekly_summary(kpi_summary)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
