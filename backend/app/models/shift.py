"""Shift Pydantic model."""
from __future__ import annotations
from typing import List
from pydantic import BaseModel, Field


class Shift(BaseModel):
    id: str
    name: str
    start_time: str   # "HH:MM"
    end_time: str     # "HH:MM"
    hours: float      # duration in hours
    required_staff: int = 1
    required_skills: List[str] = Field(default_factory=list)
