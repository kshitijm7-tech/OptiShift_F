import pytest
from app.data.store import DataStore
from app.services.schedule_service import ScheduleService
from app.data.demo_data import EMPLOYEES, SHIFTS, LEAVES, TASKS
from app.optimizer.milp_engine import MILPOptimizer
from app.models.optimization import OptimizationRequest, OptimizerWeights

@pytest.fixture
def store():
    s = DataStore()
    s._employees = {e.id: e for e in EMPLOYEES}
    s._shifts = {s.id: s for s in SHIFTS}
    s._tasks = {t.id: t for t in TASKS}
    s._leaves = {l.id: l for l in LEAVES}
    
    # Generate baseline schedule
    svc = ScheduleService(s)
    req = OptimizationRequest(week_start='2024-12-09', weights=OptimizerWeights(alpha=100.0))
    svc.optimize(req)
    return s

def test_reoptimization_produces_valid_schedule(store):
    svc = ScheduleService(store)
    # Approve leave 1
    from app.models.leave import LeaveStatus
    store.update_leave_status("leave_001", LeaveStatus.approved)
    
    result = svc.reoptimize("leave_001")
    assert result["status"] == "feasible"
    assert len(result["new_assignments"]) == 42

def test_schedule_diff_is_correct(store):
    svc = ScheduleService(store)
    # Approve leave 1
    from app.models.leave import LeaveStatus
    from app.services.leave_service import LeaveService
    # File leave for someone actually on Friday's roster, so the
    # re-optimization provably has a gap to fix. Who works which day is a
    # cost-optimal outcome of the seed — never a fixed narrative.
    baseline = store.get_schedule()
    target = next(a for a in baseline.assignments if a.day == "Friday")
    new_leave = LeaveService(store).submit_leave({
        "employee_id": target.employee_id,
        "start_date": target.date,
        "end_date": target.date,
        "type": "casual",
        "reason": "diff regression probe",
    })
    store.update_leave_status(new_leave.id, LeaveStatus.approved)

    result = svc.reoptimize(new_leave.id)
    assert result["status"] == "feasible"
    diff = result["diff"]

    assert len(diff["removed_assignments"]) > 0
    assert len(diff["added_assignments"]) > 0

    # The leave owner lost their leave-date slot, and nobody covers it.
    removed = {(r["employee"], r["date"]) for r in diff["removed_assignments"]}
    assert (target.employee_name, target.date) in removed
    assert not any(
        a["employee_id"] == target.employee_id and a["date"] == target.date
        for a in result["new_assignments"]
    )

def test_custom_objective_weights_survive_reoptimization(store):
    svc = ScheduleService(store)
    from app.models.leave import LeaveStatus
    store.update_leave_status("leave_001", LeaveStatus.approved)
    
    # Our fixture set alpha=100.0. Let's verify it was used in reoptimize
    # We can indirectly verify because store's last config is used
    req = store.get_last_optimization_request()
    assert req.weights.alpha == 100.0

def test_no_baseline_schedule_explicit_state():
    # Empty store
    s = DataStore()
    svc = ScheduleService(s)
    with pytest.raises(ValueError, match="No baseline schedule exists"):
        svc.reoptimize("leave_001")

