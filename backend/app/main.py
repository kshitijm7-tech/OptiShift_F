"""
OptiShift — Backend API
FastAPI application entry point.

Architecture:
  API → Service → Optimizer
"""
from __future__ import annotations
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.employees import router as employees_router
from .api.shifts import router as shifts_router
from .api.tasks import router as tasks_router
from .api.schedule import router as schedule_router
from .api.leave import router as leave_router

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="OptiShift API",
    description=(
        "AI-powered workforce scheduling optimizer for UrbanBrew Café.\n\n"
        "**Core Flow:**\n"
        "1. `POST /api/v1/optimize` — run MILP scheduler (PuLP + CBC)\n"
        "2. `POST /api/v1/leave` — submit a leave request\n"
        "3. `GET  /api/v1/leave/{id}/impact` — Task Impact + Risk analysis\n"
        "4. `POST /api/v1/leave/{id}/approve` — approve leave\n"
        "5. `POST /api/v1/reoptimize` — re-run MILP, get before/after diff\n\n"
        "**Risk levels returned always include affected_tasks — never a bare risk label.**"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
PREFIX = "/api/v1"

app.include_router(employees_router, prefix=PREFIX)
app.include_router(shifts_router,    prefix=PREFIX)
app.include_router(tasks_router,     prefix=PREFIX)
app.include_router(schedule_router,  prefix=PREFIX)
app.include_router(leave_router,     prefix=PREFIX)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "service": "OptiShift API", "version": "1.0.0"}


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "OptiShift API is running",
        "docs": "/docs",
        "health": "/health",
    }
