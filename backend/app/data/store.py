"""
In-memory data store (no database needed for the hackathon).
All services read/write through here.
"""
from __future__ import annotations
from typing import Dict, List, Optional
from ..models.employee import Employee
from ..models.shift import Shift
from ..models.task import Task
from ..models.leave import Leave, LeaveStatus
from ..models.schedule import Schedule
from ..data.demo_data import EMPLOYEES, SHIFTS, TASKS, LEAVES, WEEK_START


class DataStore:
    def __init__(self) -> None:
        # Seed from demo data
        self._employees: Dict[str, Employee] = {e.id: e for e in EMPLOYEES}
        self._shifts: Dict[str, Shift] = {s.id: s for s in SHIFTS}
        self._tasks: Dict[str, Task] = {t.id: t for t in TASKS}
        self._leaves: Dict[str, Leave] = {l.id: l for l in LEAVES}
        self._schedule: Optional[Schedule] = None
        self._week_start: str = WEEK_START

        # Fix 4 — last successful optimization configuration.
        self._last_optimization_request: Optional[OptimizationRequest] = None

    # ── Employees ──────────────────────────────────────────────────────────────

    def get_employees(self) -> List[Employee]:
        return list(self._employees.values())

    def get_employee(self, emp_id: str) -> Optional[Employee]:
        return self._employees.get(emp_id)

    def add_employee(self, emp: Employee) -> Employee:
        self._employees[emp.id] = emp
        return emp

    # ── Shifts ─────────────────────────────────────────────────────────────────

    def get_shifts(self) -> List[Shift]:
        return list(self._shifts.values())

    def get_shift(self, shift_id: str) -> Optional[Shift]:
        return self._shifts.get(shift_id)

    # ── Tasks ──────────────────────────────────────────────────────────────────

    def get_tasks(self) -> List[Task]:
        return list(self._tasks.values())

    def get_task(self, task_id: str) -> Optional[Task]:
        return self._tasks.get(task_id)

    def get_tasks_for_employee(self, emp_id: str) -> List[Task]:
        return [t for t in self._tasks.values() if t.employee_id == emp_id]

    def get_tasks_on_dates(self, dates: List[str]) -> List[Task]:
        return [t for t in self._tasks.values() if t.date in dates]

    # ── Leaves ─────────────────────────────────────────────────────────────────

    def get_leaves(self) -> List[Leave]:
        return list(self._leaves.values())

    def get_leave(self, leave_id: str) -> Optional[Leave]:
        return self._leaves.get(leave_id)

    def add_leave(self, leave: Leave) -> Leave:
        self._leaves[leave.id] = leave
        return leave

    def update_leave_status(self, leave_id: str, status: LeaveStatus, note: Optional[str] = None) -> Optional[Leave]:
        leave = self._leaves.get(leave_id)
        if not leave:
            return None
        updated = leave.model_copy(update={"status": status, "manager_note": note})
        self._leaves[leave_id] = updated
        return updated

    def get_approved_leaves(self) -> List[Leave]:
        return [l for l in self._leaves.values() if l.status == LeaveStatus.approved]

    def get_leaves_for_employee(self, emp_id: str) -> List[Leave]:
        return [l for l in self._leaves.values() if l.employee_id == emp_id]

    def employee_on_leave(self, emp_id: str, date: str) -> bool:
        """Return True if emp has approved leave covering this date."""
        for leave in self._leaves.values():
            if leave.employee_id == emp_id and leave.status == LeaveStatus.approved:
                if date in leave.leave_dates():
                    return True
        return False

    # ── Schedule ───────────────────────────────────────────────────────────────

    def get_schedule(self) -> Optional[Schedule]:
        return self._schedule

    def set_schedule(self, schedule: Schedule) -> Schedule:
        self._schedule = schedule
        return schedule

    # ── Last optimization configuration ──────────────────────────────────────

    def set_last_optimization_request(self, request: "OptimizationRequest") -> None:
        """Persist the winning OptimizationRequest for later re-optimization."""
        self._last_optimization_request = request

    def get_last_optimization_request(self) -> Optional["OptimizationRequest"]:
        """Return the last successful OptimizationRequest, or None."""
        return self._last_optimization_request

    def reset_last_optimization_request(self) -> None:
        """Clear the stored request (used between independent optimizations)."""
        self._last_optimization_request = None

    def get_week_start(self) -> str:
        return self._week_start

    def set_week_start(self, ws: str) -> None:
        self._week_start = ws


# Singleton instance used across the app
store = DataStore()
