"""Task and TaskRisk Pydantic models."""
from __future__ import annotations
from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, Field


class TaskCriticality(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"


class TaskRisk(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class Task(BaseModel):
    id: str
    employee_id: str           # primary owner
    title: str
    date: str                  # "YYYY-MM-DD"
    start_time: str            # "HH:MM"
    end_time: str              # "HH:MM"
    criticality: TaskCriticality = TaskCriticality.medium
    priority: int = Field(default=3, ge=1, le=5)  # 1 = highest
    required_skills: List[str] = Field(default_factory=list)
    replacement_allowed: bool = True
    description: Optional[str] = None
