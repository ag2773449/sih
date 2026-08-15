from fastapi import APIRouter, HTTPException
from backend.services.places import get_places, get_place_by_id

router = APIRouter(tags=["Places"])

@router.get("/places")
def list_places():
    return {"places": get_places()}

@router.get("/places/{place_id}")
def get_place(place_id: int):
    place = get_place_by_id(place_id)
    if not place:
        raise HTTPException(status_code=404, detail="Place not found")
    return place
