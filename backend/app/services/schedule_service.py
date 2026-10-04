"""
Schedule Service — orchestrates MILP + Greedy + Metrics.
"""
from __future__ import annotations
import logging
from typing import List, Optional, Dict, Any

from ..data.store import DataStore
from ..models.leave import LeaveStatus
from ..models.optimization import OptimizationRequest, OptimizationResult, Metrics, ScheduleDiff
from ..models.schedule import Schedule
from ..optimizer.milp_engine import MILPOptimizer
from ..optimizer.baseline import GreedyScheduler
from ..optimizer.metrics import MetricsCalculator

logger = logging.getLogger(__name__)


class ScheduleService:

    def __init__(self, store: DataStore):
        self.store = store

    def optimize(self, request: OptimizationRequest) -> OptimizationResult:
        employees = self.store.get_employees()
        shifts = self.store.get_shifts()
        leaves = self.store.get_leaves()

        calculator = MetricsCalculator(employees, shifts)

        # ── Baseline (Greedy) ───────────────────────────────────────────────
        baseline_schedule: Optional[Schedule] = None
        baseline_metrics: Optional[Metrics] = None

        if request.include_baseline:
            greedy = GreedyScheduler(employees, shifts, leaves, request.week_start)
            baseline_schedule = greedy.solve()
            baseline_metrics = calculator.calculate(baseline_schedule)

        # ── MILP Optimisation ────────────────────────────────────────────────
        optimizer = MILPOptimizer(
            employees=employees,
            shifts=shifts,
            leaves=leaves,
            week_start=request.week_start,
            weights=request.weights,
        )
        milp_schedule = optimizer.solve()

        if milp_schedule.status == "infeasible":
            return OptimizationResult(
                status="infeasible",
                message=milp_schedule.infeasibility_reason
                    or "No feasible schedule exists under the current constraints.",
                week_start=request.week_start,
                infeasibility_causes=self._extract_causes(milp_schedule.infeasibility_reason),
            )

        # Store MILP schedule + persist the winning request config (only for
        # a successful solve, so a failed or infeasible run never overwrites).
        self.store.set_schedule(milp_schedule)
        self.store.set_week_start(request.week_start)
        self.store.set_last_optimization_request(request)

        optimized_metrics = calculator.calculate(milp_schedule, baseline_schedule)

        return OptimizationResult(
            status="feasible",
            week_start=request.week_start,
            optimized_metrics=optimized_metrics,
            baseline_metrics=baseline_metrics,
            assignments=[a.model_dump() for a in milp_schedule.assignments],
        )

    def reoptimize(self, leave_id: str) -> Dict[str, Any]:
        """Re-run MILP after leave is approved. Return diff + before/after metrics."""
        from ..models.optimization import OptimizerWeights

        current_schedule = self.store.get_schedule()
        week_start = self.store.get_week_start()

        if not current_schedule or not week_start:
            raise ValueError("No baseline schedule exists. Run /optimize first.")
        employees = self.store.get_employees()
        shifts = self.store.get_shifts()
        leaves = self.store.get_leaves()

        calculator = MetricsCalculator(employees, shifts)

        # Before metrics
        before_metrics: Optional[Metrics] = None
        before_assignments: List[Dict[str, Any]] = []
        if current_schedule:
            before_metrics = calculator.calculate(current_schedule)
            before_assignments = [a.model_dump() for a in current_schedule.assignments]

        # Re-solve with updated leaves; the optimizer config (weights) is
        # preserved from the last successful optimization if one exists.
        last_config = self.store.get_last_optimization_request()
        weights = last_config.weights if last_config is not None else OptimizerWeights()

        optimizer = MILPOptimizer(
            employees=employees,
            shifts=shifts,
            leaves=leaves,
            week_start=week_start,
            weights=weights,
        )
        new_schedule = optimizer.solve()

        if new_schedule.status == "infeasible":
            return {
                "status": "infeasible",
                "message": new_schedule.infeasibility_reason
                    or "Re-optimization failed: no feasible schedule after leave approval.",
                "infeasibility_causes": self._extract_causes(new_schedule.infeasibility_reason),
            }

        self.store.set_schedule(new_schedule)
        after_metrics = calculator.calculate(new_schedule, current_schedule)
        after_assignments = [a.model_dump() for a in new_schedule.assignments]

        # ── Task linkage for the diff ──────────────────────────────────
        # The schedule is employee×shift×date; diff.affected_tasks needs the
        # tasks whose execution changes. Derive the owner's tasks that lie on
        # the approved leave's dates, and map each removed/added assignment
        # to its task where possible, so diff.affected_tasks carries real
        # evidence rather than [].
        affected_task_ids = self._resolve_affected_tasks(
            current_schedule, new_schedule, leave_id, self.store
        )

        diff = self._compute_diff(
            before_assignments,
            after_assignments,
            affected_task_ids,
        )

        return {
            "status": "feasible",
            "before_metrics": before_metrics.model_dump() if before_metrics else None,
            "after_metrics": after_metrics.model_dump(),
            "diff": diff.model_dump(),
            "new_assignments": after_assignments,
        }

    # ── Helpers ────────────────────────────────────────────────────────────────

    @staticmethod
    def _extract_causes(reason: Optional[str]) -> List[str]:
        if not reason:
            return [
                "Not enough available employees",
                "Required skill unavailable",
                "Staffing requirement too high",
                "Maximum hours too restrictive",
                "Approved leave created a staffing conflict",
            ]
        return [r.strip() for r in reason.split("|")]

    @staticmethod
    def _compute_diff(
        before: List[Dict[str, Any]],
        after: List[Dict[str, Any]],
        affected_task_ids: Optional[List[str]] = None,
    ) -> ScheduleDiff:
        def key(a: Dict[str, Any]) -> str:
            return f"{a['employee_id']}_{a['date']}_{a['shift_id']}"

        before_keys = {key(a): a for a in before}
        after_keys = {key(a): a for a in after}

        removed = [
            {"employee": v["employee_name"], "shift": v["shift_name"], "date": v["date"]}
            for k, v in before_keys.items() if k not in after_keys
        ]
        added = [
            {"employee": v["employee_name"], "shift": v["shift_name"], "date": v["date"]}
            for k, v in after_keys.items() if k not in before_keys
        ]

        affected_emps = list({
            *[r["employee"] for r in removed],
            *[a["employee"] for a in added],
        })

        return ScheduleDiff(
            removed_assignments=removed,
            added_assignments=added,
            affected_employees=affected_emps,
            affected_tasks=affected_task_ids or [],
        )

    # ── Task linkage for the re-optimization diff (Fix 5) ────────────────

    def _resolve_affected_tasks(
        self,
        current_schedule: Optional[Schedule],
        new_schedule: Schedule,
        leave_id: str,
        store: DataStore,
    ) -> List[str]:
        """Map the approved leave to the tasks whose execution changes.

        The schedule is purely employee×shift×date; task identity only exists
        in the leave's scope. Resolve the tasks that the approved leave
        touches (tasks owned by the leavers on the leave dates) and return the
        IDs that changed during the re-optimization.
        """
        from ..models.task import Task

        tasks = self.store.get_tasks()
        affected: List[str] = []

        schedule = self.store.get_schedule()
        if schedule is None:
            return affected

        # Approved leave(s) that this re-optimization was triggered by
        approved_leaves = [l for l in self.store.get_leaves() if l.status == LeaveStatus.approved]
        if not approved_leaves:
            return affected

        # Collect task IDs owned by the leavers on the leave dates
        task_set = set()
        for leave in approved_leaves:
            for t in tasks:
                if t.employee_id == leave.employee_id and t.date in leave.leave_dates():
                    task_set.add(t.id)

        # Assignment keys that changed between before/after are the ones whose
        # tasks must be reported (idempotent set union across all leave dates).
        # Assignments arrive as Pydantic Assignment models; key by (employee,date,shift).
        before_keys = {f"{a.employee_id}_{a.date}_{a.shift_id}" for a in current_schedule.assignments} if current_schedule else set()
        after_keys = {f"{a.employee_id}_{a.date}_{a.shift_id}" for a in new_schedule.assignments}
        changed_keys = before_keys.symmetric_difference(after_keys)

        # Map changed assignment keys to tasks owned by the leaver on that date.
        # A changed assignment (employee, date, shift) indicates the leaver was
        # reassigned or removed; the tasks owned by that employee+date are
        # affected. Fall back to the leave-wide task set if no mapping exists.
        for key in changed_keys:
            emp_id, date, _ = key.split("_", 2)
            matched = [t.id for t in tasks if t.employee_id == emp_id and t.date == date]
            if matched:
                task_set.update(matched)

        return list(task_set)
