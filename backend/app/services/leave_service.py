"""
Leave Service — submit, list, approve, reject, impact.
Workflow: submit → PENDING → impact analysis → manager → approve/reject → re-optimize
"""
from __future__ import annotations
import uuid
import logging
from typing import List, Optional

from ..data.store import DataStore
from ..models.leave import Leave, LeaveStatus
from ..models.leave_impact import LeaveImpact
from .impact_service import ImpactService

logger = logging.getLogger(__name__)


class LeaveService:

    def __init__(self, store: DataStore):
        self.store = store
        self.impact_service = ImpactService(store)

    def submit_leave(self, leave_data: dict) -> Leave:
        leave_id = leave_data.get("id") or f"leave_{uuid.uuid4().hex[:8]}"
        leave = Leave(
            id=leave_id,
            employee_id=leave_data["employee_id"],
            start_date=leave_data["start_date"],
            end_date=leave_data["end_date"],
            type=leave_data["type"],
            reason=leave_data["reason"],
            status=LeaveStatus.pending,
        )
        self.store.add_leave(leave)
        logger.info(f"Leave {leave.id} submitted for employee {leave.employee_id}")
        return leave

    def get_leaves(self) -> List[Leave]:
        return self.store.get_leaves()

    def get_leave(self, leave_id: str) -> Optional[Leave]:
        return self.store.get_leave(leave_id)

    def get_impact(self, leave_id: str) -> LeaveImpact:
        leave = self.store.get_leave(leave_id)
        if not leave:
            raise ValueError(f"Leave {leave_id} not found")
        return self.impact_service.analyze(leave)

    def approve(self, leave_id: str, note: Optional[str] = None) -> Leave:
        leave = self.store.update_leave_status(leave_id, LeaveStatus.approved, note)
        if not leave:
            raise ValueError(f"Leave {leave_id} not found")
        logger.info(f"Leave {leave_id} approved")
        return leave

    def reject(self, leave_id: str, note: Optional[str] = None) -> Leave:
        leave = self.store.update_leave_status(leave_id, LeaveStatus.rejected, note)
        if not leave:
            raise ValueError(f"Leave {leave_id} not found")
        logger.info(f"Leave {leave_id} rejected")
        return leave
