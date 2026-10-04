"""Schedule and Assignment models."""
from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field


class Assignment(BaseModel):
    employee_id: str
    employee_name: str
    shift_id: str
    shift_name: str
    day: str          # e.g., "Monday"
    date: str         # "YYYY-MM-DD"
    hours: float
    cost: float       # in ₹


class Schedule(BaseModel):
    assignments: List[Assignment] = Field(default_factory=list)
    week_start: Optional[str] = None   # "YYYY-MM-DD"
    generated_by: str = "milp"         # "milp" | "greedy"
    status: str = "feasible"           # "feasible" | "infeasible"
    infeasibility_reason: Optional[str] = None
