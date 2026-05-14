"""
FastAPI application entry point.
Registers all routers, configures CORS, and initializes the database on startup.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import init_db
from app.routers import kpi, funnel, abtest, ai_report

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app = FastAPI(
    title="SaaS Analytics Dashboard API",
    description="KPI, Funnel, A/B Test, and AI Reporting endpoints",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """Initialize the SQLite database schema on first startup."""
    init_db()


app.include_router(kpi.router)
app.include_router(funnel.router)
app.include_router(abtest.router)
app.include_router(ai_report.router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "SaaS Analytics Dashboard API",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
