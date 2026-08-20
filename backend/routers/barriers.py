from fastapi import APIRouter, HTTPException

from backend.models import BarrierReport, BarrierResponse, BarriersResponse
from backend.services.barriers import get_barrier_by_id, get_barriers, save_barrier

router = APIRouter(tags=["Barriers"])


@router.post("/barriers", response_model=BarrierResponse)
def create_barrier(report: BarrierReport):
    try:
        return save_barrier(report.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save barrier report: {str(e)}")


@router.get("/barriers", response_model=BarriersResponse)
def list_barriers():
    try:
        barriers = get_barriers()
        return {"barriers": barriers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve barrier reports: {str(e)}")


@router.get("/barriers/{barrier_id}", response_model=BarrierResponse)
def get_barrier_status(barrier_id: int):
    try:
        report = get_barrier_by_id(barrier_id)
        if not report:
            raise HTTPException(status_code=404, detail="Barrier report not found")
        return report
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve barrier report: {str(e)}")