"""Task API routes."""
from fastapi import APIRouter, HTTPException
from typing import List
from ..data.store import store
from ..models.task import Task

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/", response_model=List[Task])
def list_tasks():
    return store.get_tasks()


@router.get("/{task_id}", response_model=Task)
def get_task(task_id: str):
    task = store.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task '{task_id}' not found")
    return task
