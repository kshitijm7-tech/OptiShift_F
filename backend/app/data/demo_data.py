"""
UrbanBrew Café, Mumbai — Demo Dataset
Designed to showcase multiple risk levels from a single leave request.

Priya Sharma owns the "Client Presentation" (CRITICAL) task + Evening Shift.
Her leave → CRITICAL (no replacement for Client Presentation)
           + MEDIUM  (Evening Shift has Aisha as replacement)
"""
from __future__ import annotations
from ..models.employee import Employee, Availability
from ..models.shift import Shift
from ..models.task import Task, TaskCriticality
from ..models.leave import Leave, LeaveType, LeaveStatus


# ── Shifts ────────────────────────────────────────────────────────────────────

SHIFTS: list[Shift] = [
    Shift(
        id="shift_morning",
        name="Morning Shift",
        start_time="07:00",
        end_time="13:00",
        hours=6.0,
        required_staff=2,
        required_skills=["barista", "cashier"],
    ),
    Shift(
        id="shift_afternoon",
        name="Afternoon Shift",
        start_time="13:00",
        end_time="19:00",
        hours=6.0,
        required_staff=2,
        required_skills=["barista", "food_prep"],
    ),
    Shift(
        id="shift_evening",
        name="Evening Shift",
        start_time="19:00",
        end_time="23:00",
        hours=4.0,
        required_staff=2,
        required_skills=["barista", "cashier"],
    ),
]

# ── Days of the demo week ──────────────────────────────────────────────────────
# Week: 2024-12-09 (Monday) – 2024-12-15 (Sunday)

WEEK_START = "2024-12-09"
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
DAY_DATES = {
    "Monday":    "2024-12-09",
    "Tuesday":   "2024-12-10",
    "Wednesday": "2024-12-11",
    "Thursday":  "2024-12-12",
    "Friday":    "2024-12-13",
    "Saturday":  "2024-12-14",
    "Sunday":    "2024-12-15",
}

# ── Employees ─────────────────────────────────────────────────────────────────

EMPLOYEES: list[Employee] = [
    Employee(
        id="emp_001",
        name="Priya Sharma",
        role="Senior Barista / Shift Lead",
        skills=["barista", "cashier", "food_prep", "team_lead", "client_relations"],
        hourly_rate=180.0,
        max_hours_per_week=40.0,
        email="priya@urbanbrew.in",
        availability=[
            Availability(day="Monday",    available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Tuesday",   available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Wednesday", available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Thursday",  available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Friday",    available=True,  preferred_shifts=["shift_morning", "shift_evening"]),
            Availability(day="Saturday",  available=True,  preferred_shifts=["shift_evening"]),
            Availability(day="Sunday",    available=False, preferred_shifts=[]),
        ],
    ),
    Employee(
        id="emp_002",
        name="Rahul Kumar",
        role="Barista",
        skills=["barista", "cashier", "food_prep"],
        hourly_rate=150.0,
        max_hours_per_week=42.0,
        email="rahul@urbanbrew.in",
        availability=[
            Availability(day="Monday",    available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Tuesday",   available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Wednesday", available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Thursday",  available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Friday",    available=True,  preferred_shifts=["shift_evening"]),
            Availability(day="Saturday",  available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Sunday",    available=True,  preferred_shifts=["shift_afternoon"]),
        ],
    ),
    Employee(
        id="emp_003",
        name="Aisha Patel",
        role="Barista",
        skills=["barista", "cashier", "food_prep"],
        hourly_rate=150.0,
        max_hours_per_week=42.0,
        email="aisha@urbanbrew.in",
        availability=[
            Availability(day="Monday",    available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Tuesday",   available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Wednesday", available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Thursday",  available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Friday",    available=True,  preferred_shifts=["shift_evening"]),
            Availability(day="Saturday",  available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Sunday",    available=True,  preferred_shifts=["shift_morning"]),
        ],
    ),
    Employee(
        id="emp_004",
        name="Neha Joshi",
        role="Cashier",
        # Fix: barista cross-training added — every shift requires the
        # barista skill, so without it Neha could never be scheduled
        # (0 assignments all week despite 5 available days).
        skills=["cashier", "food_prep", "barista"],
        hourly_rate=130.0,
        max_hours_per_week=32.0,
        email="neha@urbanbrew.in",
        availability=[
            Availability(day="Monday",    available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Tuesday",   available=False, preferred_shifts=[]),
            Availability(day="Wednesday", available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Thursday",  available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Friday",    available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Saturday",  available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Sunday",    available=False, preferred_shifts=[]),
        ],
    ),
    Employee(
        id="emp_005",
        name="Arjun Singh",
        role="Food Prep / Barista",
        skills=["barista", "food_prep"],
        hourly_rate=140.0,
        max_hours_per_week=44.0,
        email="arjun@urbanbrew.in",
        availability=[
            Availability(day="Monday",    available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Tuesday",   available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Wednesday", available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Thursday",  available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Friday",    available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Saturday",  available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Sunday",    available=True,  preferred_shifts=["shift_afternoon"]),
        ],
    ),
    Employee(
        id="emp_006",
        name="Kavya Nair",
        role="Barista",
        skills=["barista", "cashier"],
        hourly_rate=145.0,
        max_hours_per_week=40.0,
        email="kavya@urbanbrew.in",
        availability=[
            Availability(day="Monday",    available=True,  preferred_shifts=["shift_evening"]),
            Availability(day="Tuesday",   available=True,  preferred_shifts=["shift_evening"]),
            Availability(day="Wednesday", available=True,  preferred_shifts=["shift_afternoon"]),
            Availability(day="Thursday",  available=True,  preferred_shifts=["shift_evening"]),
            Availability(day="Friday",    available=True,  preferred_shifts=["shift_evening"]),
            Availability(day="Saturday",  available=True,  preferred_shifts=["shift_evening"]),
            Availability(day="Sunday",    available=True,  preferred_shifts=["shift_evening"]),
        ],
    ),
    Employee(
        id="emp_007",
        name="Rohan Desai",
        role="Cashier / Food Prep",
        # Fix 1: barista added — Friday's qualified pool had zero slack (6/6) and
        # Sunday was short (4/6). Without this, Sunday is infeasible and any
        # approval collapses Friday. Cross-training is realistic for café staff.
        skills=["cashier", "food_prep", "barista"],
        hourly_rate=125.0,
        max_hours_per_week=32.0,
        email="rohan@urbanbrew.in",
        availability=[
            Availability(day="Monday",    available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Tuesday",   available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Wednesday", available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Thursday",  available=False, preferred_shifts=[]),
            Availability(day="Friday",    available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Saturday",  available=False, preferred_shifts=[]),
            Availability(day="Sunday",    available=True,  preferred_shifts=["shift_afternoon"]),
        ],
    ),
    Employee(
        id="emp_008",
        name="Meera Iyer",
        role="Manager / Barista",
        skills=["barista", "cashier", "food_prep", "team_lead", "client_relations"],
        hourly_rate=200.0,
        max_hours_per_week=44.0,
        email="meera@urbanbrew.in",
        availability=[
            Availability(day="Monday",    available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Tuesday",   available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Wednesday", available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Thursday",  available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Friday",    available=True,  preferred_shifts=["shift_morning"]),
            Availability(day="Saturday",  available=True,  preferred_shifts=["shift_morning"]),
            # Fix 1: Sunday enabled — with Priya unavailable Sundays, the
            # qualified+available pool was 4 vs 6 required, making the week infeasible.
            Availability(day="Sunday",    available=True,  preferred_shifts=["shift_morning"]),
        ],
    ),
]

# ── Tasks ──────────────────────────────────────────────────────────────────────
# Designed so Priya's Friday leave creates both CRITICAL and MEDIUM risk.

TASKS: list[Task] = [
    # CRITICAL — Priya only, no replacement allowed
    Task(
        id="task_001",
        employee_id="emp_001",
        title="Client Presentation — Premium Catering Proposal",
        date="2024-12-13",  # Friday
        start_time="10:00",
        end_time="12:00",
        criticality=TaskCriticality.critical,
        priority=1,
        required_skills=["client_relations", "team_lead"],
        replacement_allowed=False,   # <-- CRITICAL trigger
        description="Present catering proposal to Taj Hotels client. Priya has been briefed exclusively.",
    ),
    # HIGH — important task, replacement available (Meera)
    Task(
        id="task_002",
        employee_id="emp_001",
        title="Monthly Inventory Audit",
        date="2024-12-13",  # Friday
        start_time="08:00",
        end_time="10:00",
        criticality=TaskCriticality.high,
        priority=2,
        required_skills=["team_lead"],
        replacement_allowed=True,
        description="Conduct monthly stock count and reconcile with purchase orders.",
    ),
    # MEDIUM — routine shift coverage
    Task(
        id="task_003",
        employee_id="emp_001",
        title="Evening Shift Supervision",
        date="2024-12-13",  # Friday
        start_time="19:00",
        end_time="23:00",
        criticality=TaskCriticality.medium,
        priority=3,
        required_skills=["barista", "cashier"],
        replacement_allowed=True,
        description="Supervise Friday evening shift. Multiple qualified staff available.",
    ),
    # LOW — routine, multiple candidates
    Task(
        id="task_004",
        employee_id="emp_001",
        title="Weekly Staff Briefing Notes",
        date="2024-12-09",  # Monday (different week day — not on leave date)
        start_time="07:30",
        end_time="08:00",
        criticality=TaskCriticality.low,
        priority=5,
        required_skills=["barista"],
        replacement_allowed=True,
        description="Distribute weekly briefing notes to team.",
    ),
    # Normal Rahul task
    Task(
        id="task_005",
        employee_id="emp_002",
        title="Supplier Delivery Inspection",
        date="2024-12-10",  # Tuesday
        start_time="09:00",
        end_time="10:00",
        criticality=TaskCriticality.medium,
        priority=3,
        required_skills=["food_prep"],
        replacement_allowed=True,
        description="Inspect and sign off on weekly food supplies delivery.",
    ),
    # Normal Meera task
    Task(
        id="task_006",
        employee_id="emp_008",
        title="Staff Performance Reviews",
        date="2024-12-11",  # Wednesday
        start_time="14:00",
        end_time="16:00",
        criticality=TaskCriticality.high,
        priority=2,
        required_skills=["team_lead", "client_relations"],
        replacement_allowed=False,
        description="Quarterly performance review sessions with each team member.",
    ),
]

# ── Leave Requests ─────────────────────────────────────────────────────────────
# The demo leave: Priya requests Friday off → CRITICAL + MEDIUM + HIGH risk

LEAVES: list[Leave] = [
    Leave(
        id="leave_001",
        employee_id="emp_001",
        start_date="2024-12-13",   # Friday
        end_date="2024-12-13",
        type=LeaveType.sick,
        reason="High fever — doctor's advice to rest.",
        status=LeaveStatus.pending,
    ),
    # A second pre-approved leave to show constraint interaction
    Leave(
        id="leave_002",
        employee_id="emp_004",
        start_date="2024-12-14",   # Saturday
        end_date="2024-12-14",
        type=LeaveType.casual,
        reason="Family function.",
        status=LeaveStatus.approved,
    ),
]
