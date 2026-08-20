from fastapi import APIRouter, HTTPException

from backend.maps import geocode_place
from backend.models import RecommendationRequest, RecommendationResponse
from backend.route import get_route
from backend.services.places import get_places
from backend.services.recommendation import recommend_places
from backend.weather import get_weather

router = APIRouter(tags=["Recommendations"])

DEFAULT_LOCATION = {
    "name": "Bhubaneswar, Odisha, India",
    "latitude": 20.2961,
    "longitude": 85.8245,
    "source": "fallback",
}


def _local_destination_match(destination: str):
    try:
        query = (destination or "").strip().lower()
        if not query:
            return None

        for place in get_places():
            if query in place.get("name", "").lower() or query in place.get("description", "").lower():
                return {
                    "name": place["name"],
                    "latitude": place["latitude"],
                    "longitude": place["longitude"],
                    "source": "backend",
                }
        return None
    except Exception:
        return None


def _destination_payload(request: RecommendationRequest) -> dict:
    try:
        destination = (request.destination or "").strip()

        if destination:
            resolved = geocode_place(destination) or _local_destination_match(destination)
            if resolved:
                return resolved

        if request.current_location:
            return {
                "name": "Current location",
                "latitude": request.current_location.latitude,
                "longitude": request.current_location.longitude,
                "source": "browser",
            }

        return DEFAULT_LOCATION.copy()
    except Exception:
        return DEFAULT_LOCATION.copy()


@router.post("/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest):
    try:
        destination = _destination_payload(request)
        weather = get_weather(destination["latitude"], destination["longitude"])

        route_origin = request.current_location or destination
        origin_lat = route_origin.latitude if request.current_location else route_origin["latitude"]
        origin_lon = route_origin.longitude if request.current_location else route_origin["longitude"]

        places = get_places(query=request.destination)
        if not places:
            places = get_places()

        enriched_places = []
        for place in places:
            try:
                route = get_route(origin_lat, origin_lon, place["latitude"], place["longitude"])
                enriched_places.append(
                    {
                        **place,
                        "route": route,
                    }
                )
            except Exception:
                enriched_places.append(
                    {
                        **place,
                        "route": {"distance_km": None, "duration_min": None, "source": "unavailable"},
                    }
                )

        recommendations = recommend_places(
            user_needs=request.accessibility_needs,
            preferences=request.preferences,
            places=enriched_places,
            weather=weather,
        )

        return {
            "destination": {
                "name": destination.get("name"),
                "latitude": destination["latitude"],
                "longitude": destination["longitude"],
                "source": destination.get("source", "backend"),
            },
            "weather": weather,
            "recommendations": recommendations,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")