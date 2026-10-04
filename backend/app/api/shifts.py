"""Shift API routes."""
from fastapi import APIRouter, HTTPException
from typing import List
from ..data.store import store
from ..models.shift import Shift

router = APIRouter(prefix="/shifts", tags=["Shifts"])


@router.get("/", response_model=List[Shift])
def list_shifts():
    return store.get_shifts()


@router.get("/{shift_id}", response_model=Shift)
def get_shift(shift_id: str):
    shift = store.get_shift(shift_id)
    if not shift:
        raise HTTPException(status_code=404, detail=f"Shift '{shift_id}' not found")
    return shift
