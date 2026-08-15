from unittest.mock import patch
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Accessible Journey Planner API is running"}

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_places_endpoint():
    response = client.get("/places")
    assert response.status_code == 200
    data = response.json()
    assert "places" in data
    assert isinstance(data["places"], list)

def test_get_place_by_id_endpoint_success():
    response = client.get("/places/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_get_place_by_id_endpoint_not_found():
    response = client.get("/places/99999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Place not found"

def test_barriers_endpoints():
    response = client.get("/barriers")
    assert response.status_code == 200
    assert "barriers" in response.json()

    new_report = {
        "place_id": 2,
        "barrier_type": "Broken Lift",
        "description": "Elevator out of service",
        "confidence": "Medium",
        "reported_by": "API Test"
    }
    post_response = client.post("/barriers", json=new_report)
    assert post_response.status_code == 200
    saved = post_response.json()
    assert saved["place_id"] == 2
    assert saved["barrier_type"] == "Broken Lift"

@patch("backend.routers.recommendations.geocode_place")
@patch("backend.routers.recommendations.get_weather")
@patch("backend.routers.recommendations.get_route")
def test_recommend_endpoint(mock_route, mock_weather, mock_geocode):
    mock_geocode.return_value = {
        "name": "Puri, Odisha, India",
        "latitude": 19.8076,
        "longitude": 85.8252
    }
    mock_weather.return_value = {
        "temperature": 28.5,
        "rain": False,
        "condition": "Clear",
        "status": "Clear"
    }
    mock_route.return_value = {
        "distance_km": 5.2,
        "duration_min": 12.0
    }

    payload = {
        "destination": "Puri, Odisha",
        "accessibility_needs": ["Mobility"],
        "preferences": ["Wheelchair Accessible"]
    }

    response = client.post("/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "destination" in data
    assert "weather" in data
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
    assert data["destination"]["name"] == "Puri, Odisha, India"
