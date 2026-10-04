# OptiShift Backend

## Stack
- **Python 3.11+**
- **FastAPI** — async REST API
- **Pydantic v2** — type-safe data models
- **PuLP + CBC** — MILP optimization engine
- **Uvicorn** — ASGI server

## Quick Start

```bash
cd backend
bash start.sh
```

API available at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

---

## Architecture

```
API Layer (FastAPI)
      ↓
Service Layer
  ├── ScheduleService  — orchestrates MILP + Baseline + Metrics
  ├── LeaveService     — submit / approve / reject
  └── ImpactService    — Task Impact + Risk Engine
      ↓
Optimizer Layer
  ├── MILPOptimizer    — PuLP + CBC solver
  ├── GreedyScheduler  — Baseline for comparison
  └── MetricsCalculator
      ↓
Data Store (in-memory, seeded from demo_data.py)
```

---

## Demo Dataset — UrbanBrew Café, Mumbai

| Employee | Role | Rate | Skills |
|---|---|---|---|
| Priya Sharma | Senior Barista / Shift Lead | ₹180/h | barista, cashier, food_prep, team_lead, **client_relations** |
| Rahul Kumar | Barista | ₹150/h | barista, cashier, food_prep |
| Aisha Patel | Barista | ₹150/h | barista, cashier, food_prep |
| Neha Joshi | Cashier | ₹130/h | cashier, food_prep |
| Arjun Singh | Food Prep / Barista | ₹140/h | barista, food_prep |
| Kavya Nair | Barista | ₹145/h | barista, cashier |
| Rohan Desai | Cashier / Food Prep | ₹125/h | cashier, food_prep |
| Meera Iyer | Manager | ₹200/h | barista, cashier, food_prep, team_lead, **client_relations** |

**Demo leave scenario:** Priya requests Friday (2024-12-13) off.

| Task | Risk | Why |
|---|---|---|
| Client Presentation | 🔴 CRITICAL | `replacement_allowed=False` — owner-only |
| Monthly Inventory Audit | 🔴 HIGH | High-priority, but Meera can cover |
| Evening Shift Supervision | 🟡 MEDIUM | Aisha / Kavya available |
| Overall | 🔴 CRITICAL | Worst unresolved task drives it |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/v1/employees` | List all employees |
| POST | `/api/v1/employees` | Create employee |
| GET | `/api/v1/shifts` | List all shifts |
| GET | `/api/v1/tasks` | List all tasks |
| GET | `/api/v1/schedule` | Current optimized schedule |
| **POST** | **`/api/v1/optimize`** | **Run MILP optimizer** |
| **POST** | **`/api/v1/reoptimize`** | **Re-solve after leave approval** |
| POST | `/api/v1/leave` | Submit leave request |
| GET | `/api/v1/leave` | List all leaves |
| **GET** | **`/api/v1/leave/{id}/impact`** | **Task Impact + Risk Analysis** |
| POST | `/api/v1/leave/{id}/approve` | Approve leave |
| POST | `/api/v1/leave/{id}/reject` | Reject leave |

---

## Demo Flow

```bash
# 1. Run optimizer
curl -X POST http://localhost:8000/api/v1/optimize \
  -H "Content-Type: application/json" \
  -d '{"week_start": "2024-12-09", "include_baseline": true}'

# 2. Check impact of Priya's Friday leave
curl http://localhost:8000/api/v1/leave/leave_001/impact

# 3. Approve the leave
curl -X POST http://localhost:8000/api/v1/leave/leave_001/approve \
  -H "Content-Type: application/json" \
  -d '{"note": "Approved. Rahul to cover evening shift."}'

# 4. Re-optimize
curl -X POST http://localhost:8000/api/v1/reoptimize \
  -H "Content-Type: application/json" \
  -d '{"leave_id": "leave_001"}'
```

---

## MILP Decision Variable

```
x[e, d, s] ∈ {0, 1}
```
Employee `e` works shift `s` on day `d`.

## Objective Function

```
Minimize:
  α × Labor Cost
+ β × Overtime Penalty
+ γ × Preference Violations
+ δ × Fairness Imbalance
```

Default weights: α=1.0, β=0.5, γ=0.3, δ=0.2  
Weights are configurable per request via `OptimizationRequest.weights`.

## Risk Classification

| Level | Condition |
|---|---|
| 🔴 CRITICAL | Critical task + no replacement, OR replacement_allowed=False |
| 🔴 HIGH | Critical/High task + replacement exists |
| 🟡 MEDIUM | Medium task or understaffed shift with replacement available |
| 🟢 LOW | Routine task, multiple candidates |
