import sys
import logging
logging.basicConfig(level=logging.INFO)

from app.data.demo_data import EMPLOYEES, SHIFTS, LEAVES
from app.optimizer.milp_engine import MILPOptimizer

print("Running MILPOptimizer Verification...")

opt = MILPOptimizer(EMPLOYEES, SHIFTS, LEAVES, '2024-12-09')
schedule = opt.solve()

print(f"\nSolve Status: {schedule.status}")
if schedule.status == "feasible":
    print(f"Total Assignments: {len(schedule.assignments)}")
    print("Optimization successful!")
else:
    print(f"Infeasibility Reason:\n{schedule.infeasibility_reason}")

