import pytest
from app.data.demo_data import EMPLOYEES, SHIFTS, LEAVES
from app.optimizer.milp_engine import MILPOptimizer, _day_to_iso
from app.models.optimization import OptimizerWeights

def test_demo_optimization_feasible():
    """Test that the demo data is mathematically feasible."""
    opt = MILPOptimizer(EMPLOYEES, SHIFTS, LEAVES, '2024-12-09')
    schedule = opt.solve()
    assert schedule.status == "feasible"
    assert len(schedule.assignments) == 42  # 3 shifts * 2 staff * 7 days

def test_hard_constraints_validated():
    """Verify max hours, 1 shift per day, and required staff are enforced."""
    opt = MILPOptimizer(EMPLOYEES, SHIFTS, LEAVES, '2024-12-09')
    schedule = opt.solve()
    
    # 1 shift per day
    emp_day_counts = {}
    emp_hours = {}
    shift_staff_counts = {}
    
    for a in schedule.assignments:
        emp_day_counts.setdefault(a.employee_id, {}).setdefault(a.day, 0)
        emp_day_counts[a.employee_id][a.day] += 1
        
        emp_hours.setdefault(a.employee_id, 0)
        emp_hours[a.employee_id] += a.hours
        
        shift_key = f"{a.day}_{a.shift_id}"
        shift_staff_counts.setdefault(shift_key, 0)
        shift_staff_counts[shift_key] += 1
        
    for emp_id, days in emp_day_counts.items():
        for d, count in days.items():
            assert count <= 1, f"Employee {emp_id} works >1 shift on {d}"
            
    for emp in EMPLOYEES:
        hours = emp_hours.get(emp.id, 0)
        assert hours <= emp.max_hours_per_week, f"{emp.id} exceeded max hours"
        
    for s in SHIFTS:
        for d in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]:
            count = shift_staff_counts.get(f"{d}_{s.id}", 0)
            assert count == s.required_staff, f"Shift {s.id} on {d} missing staff"

def test_custom_objective_weights():
    """Test that custom weights change the result or are at least parsed properly."""
    weights = OptimizerWeights(alpha=100.0, beta=0.0, gamma=0.0, delta=0.0)
    opt = MILPOptimizer(EMPLOYEES, SHIFTS, LEAVES, '2024-12-09', weights=weights)
    assert opt.weights.alpha == 100.0

def test_infeasible_scenarios_detected():
    """Test that impossible constraints result in infeasible status."""
    # Force everyone to have 0 max hours
    mod_emps = [e.model_copy(update={"max_hours_per_week": 0}) for e in EMPLOYEES]
    opt = MILPOptimizer(mod_emps, SHIFTS, LEAVES, '2024-12-09')
    schedule = opt.solve()
    
    assert schedule.status == "infeasible"
    assert schedule.infeasibility_reason is not None

def test_infeasibility_explanation_evidence_based():
    """Verify that the day-aware explanation specifically mentions the bottleneck."""
    # Make Priya unavailable on Monday, but she is required?
    # Better: Give no one the 'barista' skill.
    mod_emps = [e.model_copy(update={"skills": ["cashier"]}) for e in EMPLOYEES]
    opt = MILPOptimizer(mod_emps, SHIFTS, LEAVES, '2024-12-09')
    schedule = opt.solve()
    
    assert schedule.status == "infeasible"
    assert "Day-aware infeasibility detected" in schedule.infeasibility_reason
    assert "needs" in schedule.infeasibility_reason
