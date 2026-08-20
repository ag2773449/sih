from fastapi import APIRouter, HTTPException, Query

from backend.models import Place, PlacesResponse, RoutePreviewResponse
from backend.route import get_route
from backend.services.places import get_place_by_id, get_places

router = APIRouter(tags=["Places"])


@router.get("/places", response_model=PlacesResponse)
def list_places(query: str = Query("", max_length=120)):
    try:
        places = get_places(query=query)
        return {"places": places}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve places: {str(e)}")


@router.get("/places/{place_id}/route", response_model=RoutePreviewResponse)
def get_place_route(place_id: str, latitude: float, longitude: float):
    try:
        place = get_place_by_id(place_id)
        if not place:
            raise HTTPException(status_code=404, detail="Place not found")

        route = get_route(latitude, longitude, place["latitude"], place["longitude"])
        return {
            "place_id": place.get("id"),
            "route": route,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate route: {str(e)}")


@router.get("/places/{place_id}", response_model=Place)
def get_place_by_id_endpoint(place_id: str):
    try:
        place = get_place_by_id(place_id)
        if not place:
            raise HTTPException(status_code=404, detail="Place not found")
        return place
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve place: {str(e)}")