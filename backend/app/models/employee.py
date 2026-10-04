"""Employee Pydantic model."""
from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field


class Availability(BaseModel):
    """Day-level availability for an employee."""
    day: str  # e.g., "Monday"
    available: bool = True
    preferred_shifts: List[str] = Field(default_factory=list)  # shift ids


class Employee(BaseModel):
    id: str
    name: str
    role: str
    skills: List[str] = Field(default_factory=list)
    hourly_rate: float  # in ₹
    max_hours_per_week: float = 40.0
    availability: List[Availability] = Field(default_factory=list)
    email: Optional[str] = None

    def is_available_on(self, day: str) -> bool:
        for a in self.availability:
            if a.day.lower() == day.lower():
                return a.available
        return True  # default available if not specified

    def preferred_shift_ids(self, day: str) -> List[str]:
        for a in self.availability:
            if a.day.lower() == day.lower():
                return a.preferred_shifts
        return []
