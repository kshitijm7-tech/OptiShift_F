"""Employee API routes."""
from fastapi import APIRouter, HTTPException
from typing import List
from ..data.store import store
from ..models.employee import Employee

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("/", response_model=List[Employee])
def list_employees():
    """Return all employees."""
    return store.get_employees()


@router.get("/{employee_id}", response_model=Employee)
def get_employee(employee_id: str):
    emp = store.get_employee(employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail=f"Employee '{employee_id}' not found")
    return emp


@router.post("/", response_model=Employee, status_code=201)
def create_employee(emp: Employee):
    if store.get_employee(emp.id):
        raise HTTPException(status_code=409, detail=f"Employee '{emp.id}' already exists")
    return store.add_employee(emp)
