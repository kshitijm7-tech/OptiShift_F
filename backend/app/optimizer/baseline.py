"""
Greedy / Round-Robin Baseline Scheduler.

Produces a baseline schedule for head-to-head comparison with the MILP output.
Algorithm:
  For each (day, shift): assign the cheapest available qualified employee
  who hasn't exceeded their max hours, in round-robin order.
"""
from __future__ import annotations
import logging
from datetime import timedelta, date as _date
from typing import List, Dict, Set

from ..models.employee import Employee
from ..models.shift import Shift
from ..models.leave import Leave, LeaveStatus
from ..models.schedule import Schedule, Assignment

logger = logging.getLogger(__name__)

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _day_to_iso(day: str, week_start: str) -> str:
    ws = _date.fromisoformat(week_start)
    idx = DAYS_OF_WEEK.index(day)
    return (ws + timedelta(days=idx)).isoformat()


class GreedyScheduler:
    """Simple greedy baseline for comparison with MILP."""

    def __init__(
        self,
        employees: List[Employee],
        shifts: List[Shift],
        leaves: List[Leave],
        week_start: str,
    ):
        self.employees = employees
        self.shifts = shifts
        self.approved_leaves = [l for l in leaves if l.status == LeaveStatus.approved]
        self.week_start = week_start

    def solve(self) -> Schedule:
        # Track hours assigned per employee this week
        hours_used: Dict[str, float] = {e.id: 0.0 for e in self.employees}
        # Track which days each employee is already assigned
        assigned_days: Dict[str, Set[str]] = {e.id: set() for e in self.employees}
        # Build approved leave date map
        leave_dates: Dict[str, Set[str]] = {}
        for leave in self.approved_leaves:
            leave_dates.setdefault(leave.employee_id, set()).update(leave.leave_dates())

        assignments: List[Assignment] = []
        violation_count = 0

        for day in DAYS_OF_WEEK:
            d_iso = _day_to_iso(day, self.week_start)

            for shift in self.shifts:
                # Qualified, available, not on leave, not already assigned today
                candidates = [
                    e for e in self.employees
                    if self._qualifies(e, shift)
                    and e.is_available_on(day)
                    and d_iso not in leave_dates.get(e.id, set())
                    and day not in assigned_days[e.id]
                    and hours_used[e.id] + shift.hours <= e.max_hours_per_week
                ]

                # Sort by hourly rate (cheapest first) — greedy cost optimisation
                candidates.sort(key=lambda e: e.hourly_rate)

                assigned = 0
                for emp in candidates:
                    if assigned >= shift.required_staff:
                        break
                    assignments.append(Assignment(
                        employee_id=emp.id,
                        employee_name=emp.name,
                        shift_id=shift.id,
                        shift_name=shift.name,
                        day=day,
                        date=d_iso,
                        hours=shift.hours,
                        cost=round(emp.hourly_rate * shift.hours, 2),
                    ))
                    hours_used[emp.id] += shift.hours
                    assigned_days[emp.id].add(day)
                    assigned += 1

                if assigned < shift.required_staff:
                    violation_count += 1
                    logger.warning(
                        f"Greedy: understaffed on {day} {shift.name} "
                        f"({assigned}/{shift.required_staff})"
                    )

        return Schedule(
            assignments=assignments,
            week_start=self.week_start,
            generated_by="greedy",
            status="feasible",
        )

    def _qualifies(self, emp: Employee, shift: Shift) -> bool:
        if not shift.required_skills:
            return True
        return all(sk in emp.skills for sk in shift.required_skills)
