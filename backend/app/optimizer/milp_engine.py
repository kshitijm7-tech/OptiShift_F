"""
MILP Optimizer — PuLP + CBC
Decision variable: x[e, d, s] ∈ {0, 1}
  Employee e works shift s on day d.

Hard constraints:
  1. Availability
  2. Approved leave
  3. One shift per day
  4. Maximum weekly hours
  5. Staffing requirements
  6. Skill requirements

Objective (minimise):
  α × labor_cost + β × overtime_penalty + γ × preference_violation + δ × fairness_imbalance
"""
from __future__ import annotations
import logging
from datetime import date, timedelta
from typing import List, Dict, Optional, Set, Tuple

from pulp import (
    LpProblem, LpMinimize, LpVariable, lpSum, LpBinary,
    LpStatus, PULP_CBC_CMD, value,
)

from ..models.employee import Employee
from ..models.shift import Shift
from ..models.leave import Leave, LeaveStatus
from ..models.schedule import Schedule, Assignment
from ..models.optimization import OptimizationRequest, OptimizerWeights

logger = logging.getLogger(__name__)

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def _iso_to_day(iso: str, week_start: str) -> Optional[str]:
    """Map an ISO date to a weekday name given the week start (Monday)."""
    ws = date.fromisoformat(week_start)
    d = date.fromisoformat(iso)
    delta = (d - ws).days
    if 0 <= delta < 7:
        return DAYS_OF_WEEK[delta]
    return None


def _day_to_iso(day: str, week_start: str) -> str:
    ws = date.fromisoformat(week_start)
    idx = DAYS_OF_WEEK.index(day)
    return (ws + timedelta(days=idx)).isoformat()


class MILPOptimizer:
    """Mixed-Integer Linear Program schedule optimizer."""

    def __init__(
        self,
        employees: List[Employee],
        shifts: List[Shift],
        leaves: List[Leave],
        week_start: str,
        weights: Optional[OptimizerWeights] = None,
    ):
        self.employees = employees
        self.shifts = shifts
        self.approved_leaves = [l for l in leaves if l.status == LeaveStatus.approved]
        self.week_start = week_start
        self.weights = weights or OptimizerWeights()

        self._emp_ids = [e.id for e in employees]
        self._shift_ids = [s.id for s in shifts]
        self._emp_map: Dict[str, Employee] = {e.id: e for e in employees}
        self._shift_map: Dict[str, Shift] = {s.id: s for s in shifts}

    # ── Public entry point ────────────────────────────────────────────────────

    def solve(self) -> Schedule:
        days = DAYS_OF_WEEK
        prob = LpProblem("optishift_schedule", LpMinimize)

        # ── Decision variables ─────────────────────────────────────────────
        # x[(e, d, s)] ∈ {0, 1}
        x: Dict[Tuple[str, str, str], LpVariable] = {}
        for e_id in self._emp_ids:
            for d in days:
                for s_id in self._shift_ids:
                    var_name = f"x_{e_id}_{d}_{s_id}".replace("-", "_")
                    x[(e_id, d, s_id)] = LpVariable(var_name, cat=LpBinary)

        # ── Hard constraints ───────────────────────────────────────────────

        leave_dates = self._build_leave_date_map()  # emp_id -> set of ISO dates

        for e_id in self._emp_ids:
            emp = self._emp_map[e_id]
            for d in days:
                d_iso = _day_to_iso(d, self.week_start)

                # 1. Availability
                if not emp.is_available_on(d):
                    for s_id in self._shift_ids:
                        prob += x[(e_id, d, s_id)] == 0, f"avail_{e_id}_{d}_{s_id}"

                # 2. Approved leave
                elif d_iso in leave_dates.get(e_id, set()):
                    for s_id in self._shift_ids:
                        prob += x[(e_id, d, s_id)] == 0, f"leave_{e_id}_{d}_{s_id}"

                # 3. One shift per day
                prob += (
                    lpSum(x[(e_id, d, s_id)] for s_id in self._shift_ids) <= 1,
                    f"one_shift_{e_id}_{d}",
                )

            # 4. Maximum weekly hours
            prob += (
                lpSum(
                    self._shift_map[s_id].hours * x[(e_id, d, s_id)]
                    for d in days
                    for s_id in self._shift_ids
                )
                <= emp.max_hours_per_week,
                f"max_hours_{e_id}",
            )

        # 5 & 6. Staffing + skill constraints
        for d in days:
            for shift in self.shifts:
                # Qualified employees for this shift
                qualified = [
                    e_id for e_id in self._emp_ids
                    if self._has_required_skills(e_id, shift.required_skills)
                ]

                # Staffing: sum of qualified assignments >= required_staff
                prob += (
                    lpSum(x[(e_id, d, shift.id)] for e_id in qualified) >= shift.required_staff,
                    f"staffing_{d}_{shift.id}",
                )

                # Non-qualified employees cannot cover this shift
                non_qualified = [e_id for e_id in self._emp_ids if e_id not in qualified]
                for e_id in non_qualified:
                    prob += x[(e_id, d, shift.id)] == 0, f"skill_{e_id}_{d}_{shift.id}"


        # ── Objective function ─────────────────────────────────────────────
        w = self.weights

        # α × Labor cost
        labor_cost = lpSum(
            self._emp_map[e_id].hourly_rate * self._shift_map[s_id].hours * x[(e_id, d, s_id)]
            for e_id in self._emp_ids
            for d in days
            for s_id in self._shift_ids
        )

        # β × Overtime penalty: weekly hours beyond a standard 40h week.
        # Linear epigraph (auxiliary variable per employee)
        ot_threshold = 40.0
        ot = {}
        for e_id in self._emp_ids:
            ot[e_id] = LpVariable(f"ot_{e_id}", lowBound=0)
            prob += (
                ot[e_id]
                >= lpSum(
                    self._shift_map[s_id].hours * x[(e_id, d, s_id)]
                    for d in days
                    for s_id in self._shift_ids
                )
                - ot_threshold,
                f"ot_bound_{e_id}",
            )
        overtime = lpSum(ot.values())

        # γ × Preference violation (employee assigned to non-preferred shift)
        pref_violation = lpSum(
            x[(e_id, d, s_id)]
            for e_id in self._emp_ids
            for d in days
            for s_id in self._shift_ids
            if s_id not in self._emp_map[e_id].preferred_shift_ids(d)
        )

        # δ × Fairness imbalance
        eligible_ids = [
            e_id for e_id in self._emp_ids
            if any(self._has_required_skills(e_id, s.required_skills) for s in self.shifts)
        ]
        total_hours = {}
        for e_id in eligible_ids:
            total_hours[e_id] = lpSum(
                self._shift_map[s_id].hours * x[(e_id, d, s_id)]
                for d in days
                for s_id in self._shift_ids
            )
        M = LpVariable("fairness_max", lowBound=0)
        m = LpVariable("fairness_min", lowBound=0)
        for e_id in eligible_ids:
            prob += M >= total_hours[e_id], f"fair_max_{e_id}"
            prob += m <= total_hours[e_id], f"fair_min_{e_id}"
        fairness_imbalance = M - m

        prob += (
            w.alpha * labor_cost
            + w.beta * overtime
            + w.gamma * pref_violation
            + w.delta * fairness_imbalance,
            "objective",
        )

        # ── Solve ──────────────────────────────────────────────────────────
        solver = PULP_CBC_CMD(msg=0, timeLimit=30)
        prob.solve(solver)

        status = LpStatus[prob.status]
        logger.info(f"MILP solve status: {status}")

        if status not in ("Optimal", "Feasible"):
            return Schedule(
                week_start=self.week_start,
                generated_by="milp",
                status="infeasible",
                infeasibility_reason=self._diagnose_infeasibility(),
            )

        # ── Build schedule from solution ────────────────────────────────────
        assignments: List[Assignment] = []
        for e_id in self._emp_ids:
            emp = self._emp_map[e_id]
            for d in days:
                for s_id in self._shift_ids:
                    if value(x[(e_id, d, s_id)]) and value(x[(e_id, d, s_id)]) > 0.5:
                        shift = self._shift_map[s_id]
                        assignments.append(Assignment(
                            employee_id=e_id,
                            employee_name=emp.name,
                            shift_id=s_id,
                            shift_name=shift.name,
                            day=d,
                            date=_day_to_iso(d, self.week_start),
                            hours=shift.hours,
                            cost=round(emp.hourly_rate * shift.hours, 2),
                        ))

        return Schedule(
            assignments=assignments,
            week_start=self.week_start,
            generated_by="milp",
            status="feasible",
        )

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _build_leave_date_map(self) -> Dict[str, Set[str]]:
        """Map employee_id -> set of ISO date strings they're on approved leave."""
        result: Dict[str, Set[str]] = {}
        for leave in self.approved_leaves:
            dates = set(leave.leave_dates())
            result.setdefault(leave.employee_id, set()).update(dates)
        return result

    def _has_required_skills(self, emp_id: str, required: List[str]) -> bool:
        emp = self._emp_map.get(emp_id)
        if not emp:
            return False
        if not required:
            return True
        return all(skill in emp.skills for skill in required)

    def _diagnose_infeasibility(self) -> str:
        """Return a human-readable reason for infeasibility.

        Day-aware check first (per shift, per day: available+qualified vs required).
        Falls back to the legacy global check only when no day-aware gap is found.
        """
        evidence: List[str] = []
        leave_dates = self._build_leave_date_map()
        
        # 1. Day-aware evidence
        for d in DAYS_OF_WEEK:
            d_iso = _day_to_iso(d, self.week_start)
            for shift in self.shifts:
                qualified = [
                    e_id for e_id in self._emp_ids
                    if self._has_required_skills(e_id, shift.required_skills)
                ]
                # Filter by availability and leave
                available_and_qualified = [
                    e_id for e_id in qualified
                    if self._emp_map[e_id].is_available_on(d)
                    and d_iso not in leave_dates.get(e_id, set())
                ]
                if len(available_and_qualified) < shift.required_staff:
                    evidence.append(
                        f"Day '{d}': '{shift.name}' needs {shift.required_staff} staff "
                        f"(skills {shift.required_skills}) but only "
                        f"{len(available_and_qualified)} are available and qualified."
                    )
                    
        if evidence:
            return "Day-aware infeasibility detected:\n  " + "\n  ".join(evidence)

        # 2. General fallback (e.g. max_hours constraint conflict)
        return (
            "Not enough available employees satisfy all constraints simultaneously. "
            "Check approved leaves, availability, and max-hours limits."
        )

