import re
file_path = "app/api/schedule.py"
with open(file_path, "r") as f:
    content = f.read()

replacement = """    if not leave_id:
        raise HTTPException(status_code=422, detail="Field 'leave_id' is required")
    try:
        result = _svc.reoptimize(leave_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))"""

content = re.sub(
    r"    if not leave_id:\n        raise HTTPException\(status_code=422, detail=\"Field 'leave_id' is required\"\)\n    result = _svc\.reoptimize\(leave_id\)\n    return result",
    replacement,
    content
)

with open(file_path, "w") as f:
    f.write(content)

