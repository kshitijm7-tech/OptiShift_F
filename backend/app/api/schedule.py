"""Schedule and Optimization API routes."""
from fastapi import APIRouter, HTTPException
from typing import Any, Dict
from ..data.store import store
from ..models.optimization import OptimizationRequest, OptimizationResult
from ..services.schedule_service import ScheduleService

router = APIRouter(tags=["Schedule & Optimization"])
_svc = ScheduleService(store)


@router.get("/schedule", summary="Get current stored schedule")
def get_schedule():
    sched = store.get_schedule()
    if not sched:
        raise HTTPException(status_code=404, detail="No schedule generated yet. POST /optimize first.")
    return sched.model_dump()


@router.post("/optimize", response_model=OptimizationResult, summary="Run MILP optimization")
def optimize(request: OptimizationRequest):
    """
    Run the MILP optimizer for the given week.
    Optionally returns a baseline greedy schedule for comparison.
    """
    result = _svc.optimize(request)
    return result


@router.post("/reoptimize", summary="Re-optimize after a leave approval")
def reoptimize(body: Dict[str, Any]):
    """
    Re-run MILP after a leave is approved.
    Provide {"leave_id": "<id>"} in the body.
    Returns diff + before/after metrics.
    """
    leave_id = body.get("leave_id")
    if not leave_id:
        raise HTTPException(status_code=422, detail="Field 'leave_id' is required")
    try:
        result = _svc.reoptimize(leave_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
