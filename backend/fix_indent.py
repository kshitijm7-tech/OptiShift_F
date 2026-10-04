import re
with open("app/services/schedule_service.py", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() == "current_schedule = self.store.get_schedule()":
        new_lines.append("        current_schedule = self.store.get_schedule()\n")
    elif line.strip() == "week_start = self.store.get_week_start()":
        new_lines.append("        week_start = self.store.get_week_start()\n")
    elif line.strip() == "if not current_schedule or not week_start:":
        new_lines.append("        if not current_schedule or not week_start:\n")
    elif line.strip() == "raise ValueError(\"No baseline schedule exists. Run /optimize first.\")":
        new_lines.append("            raise ValueError(\"No baseline schedule exists. Run /optimize first.\")\n")
    else:
        new_lines.append(line)

with open("app/services/schedule_service.py", "w") as f:
    f.writelines(new_lines)
