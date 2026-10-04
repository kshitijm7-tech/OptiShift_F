"""Optimization request/result models."""
from __future__ import annotations
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class OptimizerWeights(BaseModel):
    alpha: float = 1.0    # labor cost weight
    beta: float = 0.5     # overtime penalty weight
    gamma: float = 0.3    # preference violation weight
    delta: float = 0.2    # fairness imbalance weight


class OptimizationRequest(BaseModel):
    week_start: str           # "YYYY-MM-DD"
    approved_leave_ids: List[str] = Field(default_factory=list)
    weights: OptimizerWeights = Field(default_factory=OptimizerWeights)
    include_baseline: bool = True


class Metrics(BaseModel):
    labor_cost: float
    coverage: float           # 0.0 – 1.0
    overtime_hours: float
    fairness_score: float     # 0 – 100
    availability_violations: int
    skill_violations: int
    savings: Optional[float] = None
    savings_percentage: Optional[float] = None


class ScheduleDiff(BaseModel):
    removed_assignments: List[Dict[str, Any]] = Field(default_factory=list)
    added_assignments: List[Dict[str, Any]] = Field(default_factory=list)
    affected_tasks: List[str] = Field(default_factory=list)
    affected_employees: List[str] = Field(default_factory=list)


class OptimizationResult(BaseModel):
    status: str                    # "feasible" | "infeasible"
    message: Optional[str] = None
    week_start: str
    optimized_metrics: Optional[Metrics] = None
    baseline_metrics: Optional[Metrics] = None
    assignments: List[Dict[str, Any]] = Field(default_factory=list)
    infeasibility_causes: List[str] = Field(default_factory=list)
