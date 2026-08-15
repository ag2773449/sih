from fastapi import APIRouter
from backend.models import BarrierReport
from backend.services.barriers import save_barrier, get_barriers

router = APIRouter(tags=["Barriers"])

@router.post("/barriers")
def create_barrier(report: BarrierReport):
    return save_barrier(report.model_dump())

@router.get("/barriers")
def list_barriers():
    return {"barriers": get_barriers()}
