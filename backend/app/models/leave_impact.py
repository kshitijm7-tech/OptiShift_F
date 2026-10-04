"""Leave impact and risk models — risk + affected_tasks always travel together."""
from __future__ import annotations
from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class ReplacementCandidate(BaseModel):
    employee_id: str
    name: str
    skill_match: bool
    available: bool
    current_hours: float
    additional_hours: float    # hours that would be added


class AffectedTask(BaseModel):
    task_id: str
    title: str
    date: str
    criticality: str
    priority: int
    owner_id: str
    owner: str
    replacement_allowed: bool
    replacement_available: bool
    replacement_candidates: List[str] = Field(default_factory=list)    # names
    replacement_details: List[ReplacementCandidate] = Field(default_factory=list)
    risk_level: RiskLevel
    risk_reason: str           # human-readable explanation of why this risk level


class AffectedShift(BaseModel):
    shift_id: str
    shift: str
    day: str
    date: str
    required_staff: int
    assigned_before_leave: int
    assigned_after_leave: int
    missing_staff: int
    replacement_available: bool
    replacement_candidates: List[str] = Field(default_factory=list)
    risk_level: RiskLevel


class LeaveImpact(BaseModel):
    leave_id: str
    employee_id: str
    employee_name: str
    leave_dates: List[str]
    overall_risk: RiskLevel
    overall_risk_reason: str   # always explains WHY — never bare risk label
    affected_tasks: List[AffectedTask] = Field(default_factory=list)
    affected_shifts: List[AffectedShift] = Field(default_factory=list)
    replacement_options: List[ReplacementCandidate] = Field(default_factory=list)
    summary: str
    action_required: bool
    is_infeasible: bool = False
    infeasibility_message: Optional[str] = None
