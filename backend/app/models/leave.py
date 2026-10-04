"""Leave Pydantic model."""
from __future__ import annotations
from typing import Optional
from enum import Enum
from datetime import date
from pydantic import BaseModel


class LeaveType(str, Enum):
    sick = "sick"
    casual = "casual"
    annual = "annual"
    emergency = "emergency"
    maternity = "maternity"
    unpaid = "unpaid"


class LeaveStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Leave(BaseModel):
    id: str
    employee_id: str
    start_date: str   # "YYYY-MM-DD"
    end_date: str     # "YYYY-MM-DD"
    type: LeaveType
    reason: str
    status: LeaveStatus = LeaveStatus.pending
    manager_note: Optional[str] = None

    def leave_dates(self) -> list[str]:
        """Return list of all ISO date strings covered by this leave."""
        from datetime import date, timedelta
        start = date.fromisoformat(self.start_date)
        end = date.fromisoformat(self.end_date)
        days = []
        current = start
        while current <= end:
            days.append(current.isoformat())
            current += timedelta(days=1)
        return days
