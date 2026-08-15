from fastapi import APIRouter, HTTPException
from backend.models import RecommendationRequest
from backend.services.places import get_places
from backend.services.recommendation import recommend_places
from backend.maps import geocode_place
from backend.weather import get_weather
from backend.route import get_route

router = APIRouter(tags=["Recommendations"])

@router.post("/recommend")
def recommend(request: RecommendationRequest):
    location = geocode_place(request.destination)
    if location is None:
        raise HTTPException(status_code=404, detail="Destination could not be found")

    dest_lat = location.get("latitude") if "latitude" in location else location.get("lat")
    dest_lon = location.get("longitude") if "longitude" in location else location.get("lon")

    destination_data = {
        "name": location.get("name", request.destination),
        "lat": dest_lat,
        "lon": dest_lon,
        "latitude": dest_lat,
        "longitude": dest_lon,
    }

    try:
        weather = get_weather(dest_lat, dest_lon)
    except Exception:
        weather = {
            "temperature": None,
            "rain": False,
            "condition": "Unknown",
            "status": "Unknown",
        }

    places = get_places()
    enriched_places = []
    for place in places:
        try:
            r = get_route(dest_lat, dest_lon, place["latitude"], place["longitude"])
            if not r:
                r = {"distance_km": None, "duration_min": None}
        except Exception:
            r = {"distance_km": None, "duration_min": None}

        enriched_places.append({
            **place,
            "route": r,
        })

    recommendations = recommend_places(
        user_needs=request.accessibility_needs,
        preferences=request.preferences,
        places=enriched_places,
        weather=weather,
    )

    return {
        "destination": destination_data,
        "weather": weather,
        "recommendations": recommendations,
    }
