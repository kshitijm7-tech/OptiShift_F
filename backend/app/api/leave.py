"""
Leave API routes.

POST   /leave                → Submit leave request
GET    /leave                → List all leave requests
GET    /leave/{id}           → Get single leave request
GET    /leave/{id}/impact    → Get Task Impact + Risk analysis
POST   /leave/{id}/approve   → Approve leave
POST   /leave/{id}/reject    → Reject leave
"""
from fastapi import APIRouter, HTTPException
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

from ..data.store import store
from ..models.leave import Leave, LeaveType
from ..models.leave_impact import LeaveImpact
from ..services.leave_service import LeaveService

router = APIRouter(prefix="/leave", tags=["Leave"])
_svc = LeaveService(store)


class LeaveSubmitRequest(BaseModel):
    employee_id: str
    start_date: str
    end_date: str
    type: LeaveType
    reason: str
    id: Optional[str] = None


class ActionRequest(BaseModel):
    note: Optional[str] = None


@router.post("/", response_model=Leave, status_code=201, summary="Submit a leave request")
def submit_leave(req: LeaveSubmitRequest):
    """
    Submit a new leave request. Status defaults to PENDING.
    Impact analysis is available immediately via GET /leave/{id}/impact.
    """
    return _svc.submit_leave(req.model_dump())


@router.get("/", response_model=List[Leave], summary="List all leave requests")
def list_leaves():
    return _svc.get_leaves()


@router.get("/{leave_id}", response_model=Leave, summary="Get a leave request")
def get_leave(leave_id: str):
    leave = _svc.get_leave(leave_id)
    if not leave:
        raise HTTPException(status_code=404, detail=f"Leave '{leave_id}' not found")
    return leave


@router.get("/{leave_id}/impact", response_model=LeaveImpact, summary="Task Impact + Risk Analysis")
def get_impact(leave_id: str):
    """
    Returns the full Task Impact Analysis for this leave request.

    **Risk + AffectedTasks are always returned together — never a bare risk label.**

    Response includes:
    - overall_risk (CRITICAL / HIGH / MEDIUM / LOW) with explanation
    - affected_tasks — each with risk_level + risk_reason
    - affected_shifts — staffing gap analysis
    - replacement_candidates — per task/shift
    - summary and action_required flag
    """
    try:
        return _svc.get_impact(leave_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{leave_id}/approve", response_model=Leave, summary="Approve a leave request")
def approve_leave(leave_id: str, req: ActionRequest = ActionRequest()):
    """
    Approve the leave. Status changes to APPROVED.
    Run POST /reoptimize after approval to generate updated schedule.
    """
    try:
        return _svc.approve(leave_id, req.note)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{leave_id}/reject", response_model=Leave, summary="Reject a leave request")
def reject_leave(leave_id: str, req: ActionRequest = ActionRequest()):
    try:
        return _svc.reject(leave_id, req.note)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
