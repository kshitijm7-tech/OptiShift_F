import pytest
from app.data.store import DataStore
from app.services.impact_service import ImpactService
from app.data.demo_data import EMPLOYEES, SHIFTS, LEAVES, TASKS

@pytest.fixture
def store():
    s = DataStore()
    s._employees = {e.id: e for e in EMPLOYEES}
    s._shifts = {s.id: s for s in SHIFTS}
    s._tasks = {t.id: t for t in TASKS}
    s._leaves = {l.id: l for l in LEAVES}
    # Need a schedule to evaluate shift impact
    from app.optimizer.milp_engine import MILPOptimizer
    opt = MILPOptimizer(EMPLOYEES, SHIFTS, LEAVES, '2024-12-09')
    sched = opt.solve()
    s.set_schedule(sched)
    s.set_week_start('2024-12-09')
    return s

def test_leave_impact_correctly_identifies_affected_tasks(store):
    svc = ImpactService(store)
    leave = store.get_leave("leave_001")
    impact = svc.analyze(leave) # Priya's leave on Friday
    
    task_ids = [t.task_id for t in impact.affected_tasks]
    assert "task_001" in task_ids # Client Presentation
    assert "task_002" in task_ids # Inventory Audit

def test_risk_levels_backed_by_evidence(store):
    svc = ImpactService(store)
    leave = store.get_leave("leave_001")
    impact = svc.analyze(leave)
    
    assert impact.overall_risk == "CRITICAL"
    
    # Check specific task risk
    t1 = next(t for t in impact.affected_tasks if t.task_id == "task_001")
    assert t1.risk_level == "CRITICAL"
    assert t1.replacement_available is False
    assert "owner-only" in t1.risk_reason.lower()

def test_replacement_candidates_correctly_qualified(store):
    svc = ImpactService(store)
    leave = store.get_leave("leave_001")
    impact = svc.analyze(leave)
    
    t2 = next(t for t in impact.affected_tasks if t.task_id == "task_002")
    assert t2.risk_level == "HIGH" 
    assert t2.replacement_available is True
    # Verify candidate has team_lead skill
    cands = t2.replacement_details
    assert len(cands) > 0
    
    # The actual store data should show Meera has team_lead
    meera_found = any(c.employee_id == "emp_008" for c in cands)
    assert meera_found, "Meera should be a candidate for task_002"

def test_task_level_skill_matching(store):
    svc = ImpactService(store)
    leave = store.get_leave("leave_001")
    impact = svc.analyze(leave)
    t2 = next(t for t in impact.affected_tasks if t.task_id == "task_002")
    
    # Assert none of the unqualified people are in candidates
    unqualified = ["emp_001", "emp_002", "emp_003"] # Don't have team_lead
    for c in t2.replacement_details:
        assert c.employee_id not in unqualified

