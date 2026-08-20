from math import atan2, cos, radians, sin, sqrt
from typing import Optional

import requests

OSRM_ROUTE_URL = "https://router.project-osrm.org/route/v1/driving"
EARTH_RADIUS_KM = 6371.0


def _is_number(value) -> bool:
    return isinstance(value, (int, float))


def haversine_distance_km(start_lat, start_lon, end_lat, end_lon) -> Optional[float]:
    if not all(_is_number(v) for v in [start_lat, start_lon, end_lat, end_lon]):
        return None

    d_lat = radians(end_lat - start_lat)
    d_lon = radians(end_lon - start_lon)
    lat1 = radians(start_lat)
    lat2 = radians(end_lat)
    a = sin(d_lat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(d_lon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return round(EARTH_RADIUS_KM * c, 2)


def _fallback_route(start_lat, start_lon, end_lat, end_lon) -> dict:
    distance = haversine_distance_km(start_lat, start_lon, end_lat, end_lon)
    if distance is None:
        return {"distance_km": None, "duration_min": None, "source": "unavailable"}

    duration = round(max(distance / 25 * 60, 1), 1)
    return {"distance_km": distance, "duration_min": duration, "source": "straight_line"}


def get_route(start_lat, start_lon, end_lat, end_lon) -> dict:
    fallback = _fallback_route(start_lat, start_lon, end_lat, end_lon)
    if fallback["distance_km"] is None:
        return fallback

    url = f"{OSRM_ROUTE_URL}/{start_lon},{start_lat};{end_lon},{end_lat}"

    try:
        response = requests.get(url, params={"overview": "false"}, timeout=6)
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, ValueError, TypeError):
        return fallback

    if data.get("code") != "Ok" or not data.get("routes"):
        return fallback

    route = data["routes"][0]
    try:
        return {
            "distance_km": round(route["distance"] / 1000, 2),
            "duration_min": round(route["duration"] / 60, 1),
            "source": "osrm",
        }
    except (KeyError, TypeError, ValueError):
        return fallback