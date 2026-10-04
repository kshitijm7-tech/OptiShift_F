import re

# Fix test_impact.py
with open("tests/test_impact.py", "r") as f:
    content = f.read()

content = content.replace('impact = svc.analyze_leave("leave_001")',
                          'leave = store.get_leave("leave_001")\n    impact = svc.analyze(leave)')
with open("tests/test_impact.py", "w") as f:
    f.write(content)

# Fix test_reoptimize.py
with open("tests/test_reoptimize.py", "r") as f:
    content = f.read()

content = content.replace('l = store.get_leave("leave_001")\n    l.status = "approved"\n    store.update_leave(l)',
                          'from app.models.leave import LeaveStatus\n    store.update_leave_status("leave_001", LeaveStatus.approved)')
with open("tests/test_reoptimize.py", "w") as f:
    f.write(content)

