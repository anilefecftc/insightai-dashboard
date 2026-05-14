"""
Pydantic response models used by all API routers.
These define the exact shape of every JSON response the API returns.
"""

from pydantic import BaseModel
from typing import Optional


# ─────────────────────────────────────────────
# KPI models
# ─────────────────────────────────────────────

class KPIChanges(BaseModel):
    dau_change: float
    signups_change: float
    activation_rate_change: float
    retention_rate_change: float
    revenue_change: float
    conversion_rate_change: float
    churn_rate_change: float


class KPISummary(BaseModel):
    dau: int
    signups: int
    activation_rate: float
    retention_rate: float
    revenue: float
    conversion_rate: float
    churn_rate: float
    changes: KPIChanges


class DailyMetric(BaseModel):
    date: str
    dau: int
    signups: int
    activation_rate: float
    retention_rate: float
    revenue: float
    conversion_rate: float
    churn_rate: float


class SparklinePoint(BaseModel):
    date: str
    value: float


# ─────────────────────────────────────────────
# Funnel models
# ─────────────────────────────────────────────

class FunnelStage(BaseModel):
    name: str
    count: int
    percentage: float


class DropOff(BaseModel):
    from_stage: str
    to_stage: str
    lost: int
    drop_rate: float


class WorstDropOff(BaseModel):
    from_stage: str
    to_stage: str
    drop_rate: float
    recommendation: str


class FunnelData(BaseModel):
    stages: list[FunnelStage]
    drop_offs: list[DropOff]
    worst_drop_off: WorstDropOff


# ─────────────────────────────────────────────
# A/B Test models
# ─────────────────────────────────────────────

class ABGroup(BaseModel):
    users: int
    conversions: int
    conversion_rate: float


class StatisticalTest(BaseModel):
    method: str
    chi2_statistic: float
    p_value: float
    is_significant: bool
    confidence_level: str
    interpretation: str


class ABTestResult(BaseModel):
    test_name: str
    control: ABGroup
    variant: ABGroup
    uplift: float
    statistical_test: StatisticalTest


# ─────────────────────────────────────────────
# AI Report models
# ─────────────────────────────────────────────

class AIAnalysisRequest(BaseModel):
    period: str = "last_7_days"


class AIAnalysis(BaseModel):
    analysis: str
    key_insights: list[str]
    recommendations: list[str]
    risk_level: str


class WeeklySummary(BaseModel):
    summary: str
    generated_at: str
