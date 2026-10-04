"""
Metrics Calculator
Computes: labor_cost, coverage, overtime_hours, fairness_score,
          availability_violations, skill_violations, savings, savings_percentage.
"""
from __future__ import annotations
from typing import List, Dict
from ..models.schedule import Schedule, Assignment
from ..models.shift import Shift
from ..models.employee import Employee
from ..models.optimization import Metrics

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


class MetricsCalculator:

    def __init__(self, employees: List[Employee], shifts: List[Shift]):
        self._emp_map: Dict[str, Employee] = {e.id: e for e in employees}
        self._shift_map: Dict[str, Shift] = {s.id: s for s in shifts}

    def calculate(self, schedule: Schedule, baseline: Schedule | None = None) -> Metrics:
        assignments = schedule.assignments

        # Labor cost
        labor_cost = sum(a.cost for a in assignments)

        # Coverage: (days × shifts covered ≥ required) / (days × total shifts)
        coverage_num, coverage_den = 0, 0
        for day in DAYS_OF_WEEK:
            for shift in self._shift_map.values():
                day_shift_assigned = sum(
                    1 for a in assignments if a.day == day and a.shift_id == shift.id
                )
                coverage_den += 1
                if day_shift_assigned >= shift.required_staff:
                    coverage_num += 1
        coverage = coverage_num / max(coverage_den, 1)

        # Overtime hours: hours beyond max_hours_per_week
        hours_by_emp: Dict[str, float] = {}
        for a in assignments:
            hours_by_emp[a.employee_id] = hours_by_emp.get(a.employee_id, 0) + a.hours
        overtime_hours = sum(
            max(0, hrs - self._emp_map[emp_id].max_hours_per_week)
            for emp_id, hrs in hours_by_emp.items()
            if emp_id in self._emp_map
        )

        # Fairness score (0–100): 100 = perfectly equal hours
        # Uses coefficient of variation (lower CV = higher score)
        if len(hours_by_emp) < 2:
            fairness_score = 100.0
        else:
            vals = list(hours_by_emp.values())
            mean = sum(vals) / len(vals)
            variance = sum((v - mean) ** 2 for v in vals) / len(vals)
            std = variance ** 0.5
            cv = std / mean if mean > 0 else 0
            fairness_score = round(max(0, 100 * (1 - cv)), 1)

        # Availability violations: assigned on unavailable day
        avail_violations = sum(
            1 for a in assignments
            if not self._emp_map.get(a.employee_id, Employee(
                id="", name="", role="", hourly_rate=0, skills=[]
            )).is_available_on(a.day)
        )

        # Skill violations: assigned to shift without required skills
        skill_violations = 0
        for a in assignments:
            shift = self._shift_map.get(a.shift_id)
            emp = self._emp_map.get(a.employee_id)
            if shift and emp:
                if not all(sk in emp.skills for sk in shift.required_skills):
                    skill_violations += 1

        # Savings vs baseline
        savings: float | None = None
        savings_pct: float | None = None
        if baseline is not None:
            baseline_cost = sum(a.cost for a in baseline.assignments)
            savings = round(baseline_cost - labor_cost, 2)
            savings_pct = round((savings / baseline_cost) * 100, 2) if baseline_cost > 0 else 0.0

        return Metrics(
            labor_cost=round(labor_cost, 2),
            coverage=round(coverage, 4),
            overtime_hours=round(overtime_hours, 2),
            fairness_score=fairness_score,
            availability_violations=avail_violations,
            skill_violations=skill_violations,
            savings=savings,
            savings_percentage=savings_pct,
        )

    def baseline_cost(self, schedule: Schedule) -> float:
        return round(sum(a.cost for a in schedule.assignments), 2)
