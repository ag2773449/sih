from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.models import RecommendationRequest, BarrierReport
from backend.services.places import get_places
from backend.services.recommendation import recommend_places
from backend.services.weather import get_weather
from backend.services.routing import geocode, get_route
from backend.services.barriers import save_barrier, get_barriers

app = FastAPI(title="Accessible Journey Planner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Accessible Journey Planner API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/places")
def places():
    return {"places": get_places()}

@app.get("/places/{place_id}")
def place(place_id: int):
    for p in get_places():
        if p["id"] == place_id:
            return p
    raise HTTPException(status_code=404, detail="Place not found")

@app.post("/recommend")
def recommend(request: RecommendationRequest):
    places = get_places()

    destination = geocode(request.destination)
    if destination is None:
        raise HTTPException(status_code=404, detail="Destination could not be found")

    weather = get_weather(destination["lat"], destination["lon"])

    enriched = []
    for place in places:
        try:
            route = get_route(
                destination["lat"],
                destination["lon"],
                place["latitude"],
                place["longitude"],
            )
        except Exception:
            route = {"distance_km": None, "duration_min": None}

        enriched.append({
            **place,
            "route": route,
        })

    recommendations = recommend_places(
        user_needs=request.accessibility_needs,
        preferences=request.preferences,
        places=enriched,
        weather=weather,
    )

    return {
        "destination": destination,
        "weather": weather,
        "recommendations": recommendations,
    }

@app.post("/barriers")
def create_barrier(report: BarrierReport):
    return save_barrier(report.model_dump())

@app.get("/barriers")
def barriers():
    return {"barriers": get_barriers()}
