"""
Task Impact + Risk Engine — the main differentiator.

Rules:
  CRITICAL  → critical task + replacement_allowed=False + no qualified replacement available
  HIGH      → (critical or high priority task) + replacement exists
  MEDIUM    → medium task or shift under-staffed but replacement exists
  LOW       → low-priority / routine task with multiple candidates

Overall leave risk = max(task risks)
Risk + AffectedTasks are ALWAYS returned together.
"""
from __future__ import annotations
import logging
from typing import List, Dict, Optional, Set

from ..data.store import DataStore
from ..models.employee import Employee
from ..models.task import Task, TaskCriticality
from ..models.leave import Leave, LeaveStatus
from ..models.shift import Shift
from ..models.leave_impact import (
    LeaveImpact, AffectedTask, AffectedShift,
    ReplacementCandidate, RiskLevel,
)

logger = logging.getLogger(__name__)

_RISK_ORDER = {RiskLevel.CRITICAL: 4, RiskLevel.HIGH: 3, RiskLevel.MEDIUM: 2, RiskLevel.LOW: 1}

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _max_risk(risks: List[RiskLevel]) -> RiskLevel:
    if not risks:
        return RiskLevel.LOW
    return max(risks, key=lambda r: _RISK_ORDER[r])


class ImpactService:

    def __init__(self, store: DataStore):
        self.store = store

    # ── Public API ─────────────────────────────────────────────────────────────

    def analyze(self, leave: Leave) -> LeaveImpact:
        employee = self.store.get_employee(leave.employee_id)
        if not employee:
            raise ValueError(f"Employee {leave.employee_id} not found")

        leave_dates = leave.leave_dates()

        # --- Step 1: Find affected tasks ---------------------------------
        tasks_on_leave = self.store.get_tasks_on_dates(leave_dates)
        owned_tasks = [t for t in tasks_on_leave if t.employee_id == leave.employee_id]

        affected_tasks: List[AffectedTask] = []
        for task in owned_tasks:
            at = self._evaluate_task(task, employee, leave_dates)
            affected_tasks.append(at)

        # --- Step 2: Affected shifts -------------------------------------
        affected_shifts = self._evaluate_shifts(leave, employee, leave_dates)

        # --- Step 3: Overall risk ----------------------------------------
        task_risks = [at.risk_level for at in affected_tasks]
        shift_risks = [ash.risk_level for ash in affected_shifts]
        all_risks = task_risks + shift_risks
        overall_risk = _max_risk(all_risks)

        # --- Step 4: Overall replacement candidates ----------------------
        replacement_options = self._find_replacements_for_employee(employee, leave_dates)

        # --- Step 5: Summary and reason ----------------------------------
        summary, reason, action_required, is_infeasible = self._build_summary(
            overall_risk, affected_tasks, affected_shifts, employee
        )

        return LeaveImpact(
            leave_id=leave.id,
            employee_id=employee.id,
            employee_name=employee.name,
            leave_dates=leave_dates,
            overall_risk=overall_risk,
            overall_risk_reason=reason,
            affected_tasks=affected_tasks,
            affected_shifts=affected_shifts,
            replacement_options=replacement_options,
            summary=summary,
            action_required=action_required,
            is_infeasible=is_infeasible,
            infeasibility_message=(
                "No feasible schedule exists after this leave approval. Manual intervention required."
                if is_infeasible else None
            ),
        )

    # ── Task evaluation ────────────────────────────────────────────────────────

    def _evaluate_task(
        self, task: Task, owner: Employee, leave_dates: List[str]
    ) -> AffectedTask:
        # Find replacement candidates
        candidates = self._find_task_replacements(task, owner)

        replacement_available = len(candidates) > 0
        replacement_names = [c.name for c in candidates]

        # Risk classification (Section H)
        risk, reason = self._classify_task_risk(task, replacement_available, candidates)

        return AffectedTask(
            task_id=task.id,
            title=task.title,
            date=task.date,
            criticality=task.criticality.value,
            priority=task.priority,
            owner_id=owner.id,
            owner=owner.name,
            replacement_allowed=task.replacement_allowed,
            replacement_available=replacement_available,
            replacement_candidates=replacement_names,
            replacement_details=candidates,
            risk_level=risk,
            risk_reason=reason,
        )

    def _classify_task_risk(
        self,
        task: Task,
        replacement_available: bool,
        candidates: List[ReplacementCandidate],
    ) -> tuple[RiskLevel, str]:
        """Section H risk classification logic."""

        # CRITICAL: replacement not allowed OR (critical + no candidate)
        if not task.replacement_allowed:
            return (
                RiskLevel.CRITICAL,
                f"'{task.title}' is owner-only (replacement_allowed=False). "
                f"Owner must be present. No substitute can cover this responsibility.",
            )

        if task.criticality == TaskCriticality.critical and not replacement_available:
            return (
                RiskLevel.CRITICAL,
                f"'{task.title}' is a critical task with no qualified replacement available. "
                f"Critical responsibility cannot be covered.",
            )

        # HIGH: critical/high task but replacement exists
        if task.criticality in (TaskCriticality.critical, TaskCriticality.high):
            names = ", ".join(c.name for c in candidates) if candidates else "none found"
            return (
                RiskLevel.HIGH,
                f"'{task.title}' is a {task.criticality.value}-priority task. "
                f"Reassignment required. Replacement candidate(s): {names}.",
            )

        # MEDIUM: medium criticality task
        if task.criticality == TaskCriticality.medium:
            names = ", ".join(c.name for c in candidates) if candidates else "none found"
            return (
                RiskLevel.MEDIUM,
                f"'{task.title}' requires reassignment. "
                f"Sufficient candidates available: {names}. Schedule re-optimisation needed.",
            )

        # LOW: low criticality with multiple replacements
        names = ", ".join(c.name for c in candidates) if candidates else "none found"
        return (
            RiskLevel.LOW,
            f"'{task.title}' is a routine task. Minimal disruption. "
            f"Replacement candidates: {names}.",
        )

    # ── Replacement finding ────────────────────────────────────────────────────

    def _find_task_replacements(
        self, task: Task, owner: Employee
    ) -> List[ReplacementCandidate]:
        if not task.replacement_allowed:
            return []

        all_employees = self.store.get_employees()
        candidates: List[ReplacementCandidate] = []

        for emp in all_employees:
            if emp.id == owner.id:
                continue
            # Skill match
            skill_match = all(sk in emp.skills for sk in task.required_skills)
            if not skill_match:
                continue
            # Availability on that date
            from datetime import date as _date
            d = _date.fromisoformat(task.date)
            day_name = DAYS_OF_WEEK[d.weekday()]
            available = emp.is_available_on(day_name)
            # Not already on approved leave that day
            if self.store.employee_on_leave(emp.id, task.date):
                available = False

            # Current hours (from stored schedule)
            current_hours = self._get_current_hours(emp.id)
            # Task duration
            start_h, start_m = map(int, task.start_time.split(":"))
            end_h, end_m = map(int, task.end_time.split(":"))
            task_hours = (end_h + end_m / 60) - (start_h + start_m / 60)
            additional_hours = task_hours

            candidates.append(ReplacementCandidate(
                employee_id=emp.id,
                name=emp.name,
                skill_match=skill_match,
                available=available,
                current_hours=current_hours,
                additional_hours=round(additional_hours, 2),
            ))

        # Sort: available first, then by current_hours ascending
        candidates.sort(key=lambda c: (not c.available, c.current_hours))
        return candidates

    def _find_replacements_for_employee(
        self, employee: Employee, leave_dates: List[str]
    ) -> List[ReplacementCandidate]:
        """High-level replacement candidates for the employee across all leave dates.

        Skill qualification is anchored to the affected tasks: a candidate is a
        skill match only if they hold ALL skills required by the owner's tasks
        on the leave dates (task-level rules already use this semantics). Empty
        required_skills means the task imposes no skill qualification.
        """
        all_employees = self.store.get_employees()
        results: List[ReplacementCandidate] = []

        # Owned tasks on the leave dates define the skill qualification scope.
        owned_tasks = [
            t for t in self.store.get_tasks_on_dates(leave_dates)
            if t.employee_id == employee.id
        ]

        for emp in all_employees:
            if emp.id == employee.id:
                continue

            # Skill anchor: qualifies if they hold all skills of at least one
            # affected owned task. Empty required_skills -> qualifies vacuously
            # (no skill requirement). No task on leave dates -> not a match.
            skill_match = False
            for task in owned_tasks:
                required = task.required_skills
                if not required:
                    skill_match = True
                    break
                if all(sk in emp.skills for sk in required):
                    skill_match = True
                    break

            available = all(
                emp.is_available_on(
                    DAYS_OF_WEEK[__import__('datetime').date.fromisoformat(d).weekday()]
                )
                and not self.store.employee_on_leave(emp.id, d)
                for d in leave_dates
            )
            current_hours = self._get_current_hours(emp.id)
            results.append(ReplacementCandidate(
                employee_id=emp.id,
                name=emp.name,
                skill_match=skill_match,
                available=available,
                current_hours=current_hours,
                additional_hours=0.0,
            ))

        results.sort(key=lambda c: (not c.available, not c.skill_match, c.current_hours))
        return results

    # ── Shift evaluation ───────────────────────────────────────────────────────

    def _evaluate_shifts(
        self, leave: Leave, employee: Employee, leave_dates: List[str]
    ) -> List[AffectedShift]:
        """For each (day, shift) in leave_dates, check if the employee was scheduled."""
        schedule = self.store.get_schedule()
        if not schedule:
            return []

        shifts = {s.id: s for s in self.store.get_shifts()}
        affected: List[AffectedShift] = []

        for assignment in schedule.assignments:
            if assignment.employee_id != employee.id:
                continue
            if assignment.date not in leave_dates:
                continue

            shift = shifts.get(assignment.shift_id)
            if not shift:
                continue

            # Count total assigned to this shift/day before leave
            assigned_before = sum(
                1 for a in schedule.assignments
                if a.shift_id == assignment.shift_id and a.date == assignment.date
            )
            assigned_after = assigned_before - 1
            missing = max(0, shift.required_staff - assigned_after)

            # Find replacement candidates for this shift
            candidates = self._find_shift_replacements(shift, assignment.date, employee.id)
            replacement_available = len(candidates) > 0
            risk = self._classify_shift_risk(missing, replacement_available)

            affected.append(AffectedShift(
                shift_id=shift.id,
                shift=shift.name,
                day=assignment.day,
                date=assignment.date,
                required_staff=shift.required_staff,
                assigned_before_leave=assigned_before,
                assigned_after_leave=assigned_after,
                missing_staff=missing,
                replacement_available=replacement_available,
                replacement_candidates=candidates,
                risk_level=risk,
            ))

        return affected

    def _find_shift_replacements(
        self, shift: Shift, date_iso: str, exclude_emp_id: str
    ) -> List[str]:
        from datetime import date as _date
        d = _date.fromisoformat(date_iso)
        day_name = DAYS_OF_WEEK[d.weekday()]

        schedule = self.store.get_schedule()
        already_working: Set[str] = set()
        if schedule:
            for a in schedule.assignments:
                if a.date == date_iso:
                    already_working.add(a.employee_id)

        candidates = []
        for emp in self.store.get_employees():
            if emp.id == exclude_emp_id:
                continue
            if emp.id in already_working:
                continue
            if not all(sk in emp.skills for sk in shift.required_skills):
                continue
            if not emp.is_available_on(day_name):
                continue
            if self.store.employee_on_leave(emp.id, date_iso):
                continue
            candidates.append(emp.name)

        return candidates

    def _classify_shift_risk(
        self, missing_staff: int, replacement_available: bool
    ) -> RiskLevel:
        if missing_staff == 0:
            return RiskLevel.LOW
        if not replacement_available:
            return RiskLevel.CRITICAL
        return RiskLevel.MEDIUM

    # ── Summary builder ────────────────────────────────────────────────────────

    def _build_summary(
        self,
        overall_risk: RiskLevel,
        affected_tasks: List[AffectedTask],
        affected_shifts: List[AffectedShift],
        employee: Employee,
    ) -> tuple[str, str, bool, bool]:
        """Returns (summary, reason, action_required, is_infeasible)."""
        risk_icon = {
            RiskLevel.CRITICAL: "🔴",
            RiskLevel.HIGH: "🔴",
            RiskLevel.MEDIUM: "🟡",
            RiskLevel.LOW: "🟢",
        }

        lines = [f"Overall Risk: {overall_risk.value}\n\nWhy:\n"]
        for at in affected_tasks:
            icon = risk_icon[at.risk_level]
            lines.append(f"{icon} {at.title}")
            lines.append(f"   Risk: {at.risk_level.value}")
            lines.append(f"   {at.risk_reason}\n")

        for ash in affected_shifts:
            icon = risk_icon[ash.risk_level]
            lines.append(f"{icon} {ash.shift} ({ash.day})")
            lines.append(f"   Risk: {ash.risk_level.value}")
            if ash.replacement_available:
                lines.append(f"   Replacement available: {', '.join(ash.replacement_candidates)}\n")
            else:
                lines.append(f"   No replacement available\n")

        reason = "\n".join(lines)

        is_infeasible = overall_risk == RiskLevel.CRITICAL and not any(
            at.replacement_available for at in affected_tasks if at.risk_level == RiskLevel.CRITICAL
        )

        action_required = overall_risk in (RiskLevel.CRITICAL, RiskLevel.HIGH)

        summary = (
            f"{employee.name}'s leave impacts {len(affected_tasks)} task(s) and "
            f"{len(affected_shifts)} shift(s). "
            f"Overall risk: {overall_risk.value}. "
            + ("Immediate action required." if action_required else "Routine reassignment needed.")
        )

        return summary, reason, action_required, is_infeasible

    # ── Helper ────────────────────────────────────────────────────────────────

    def _get_current_hours(self, emp_id: str) -> float:
        schedule = self.store.get_schedule()
        if not schedule:
            return 0.0
        return sum(a.hours for a in schedule.assignments if a.employee_id == emp_id)
