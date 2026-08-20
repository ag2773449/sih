from fastapi import APIRouter, HTTPException

from backend.maps import reverse_geocode
from backend.models import LocationRequest, LocationResponse

router = APIRouter(tags=["Location"])


def _location_response(payload: LocationRequest) -> dict:
    try:
        name = reverse_geocode(payload.latitude, payload.longitude)
        return {
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "name": name,
            "accuracy": payload.accuracy,
            "source": "nominatim" if name else "browser",
        }
    except Exception as e:
        return {
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "name": None,
            "accuracy": payload.accuracy,
            "source": "fallback",
        }


@router.post("/location/reverse", response_model=LocationResponse)
def reverse_location(payload: LocationRequest):
    try:
        return _location_response(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reverse geocode: {str(e)}")


@router.post("/location/track", response_model=LocationResponse)
def track_location(payload: LocationRequest):
    try:
        return _location_response(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to track location: {str(e)}")