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
    location = None
    try:
        location = geocode_place(request.destination)
    except Exception:
        location = None

    if location is None:
        places_data = get_places()
        matched = None
        if request.destination:
            q = request.destination.lower().strip()
            for p in places_data:
                if q in p.get("name", "").lower() or q in p.get("description", "").lower():
                    matched = p
                    break
        if matched:
            dest_lat = matched["latitude"]
            dest_lon = matched["longitude"]
            dest_name = matched["name"]
        else:
            dest_lat = 20.2961
            dest_lon = 85.8245
            dest_name = request.destination
    else:
        dest_lat = location.get("latitude") if "latitude" in location else location.get("lat")
        dest_lon = location.get("longitude") if "longitude" in location else location.get("lon")
        dest_name = location.get("name", request.destination)

    destination_data = {
        "name": dest_name,
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
