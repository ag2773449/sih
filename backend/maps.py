from typing import Optional

import requests

USER_AGENT = "AccessibleJourneyPlanner/1.0 (+https://localhost)"
NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search"
NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse"


def geocode_place(place_name: str) -> Optional[dict]:
    query = (place_name or "").strip()
    if len(query) < 2:
        return None

    try:
        response = requests.get(
            NOMINATIM_SEARCH_URL,
            params={
                "q": query,
                "format": "jsonv2",
                "limit": 1,
                "countrycodes": "in",
                "addressdetails": 1,
                "accept-language": "en",
            },
            headers={"User-Agent": USER_AGENT},
            timeout=6,
        )
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, ValueError, TypeError):
        return None

    if not data:
        return None

    result = data[0]
    try:
        return {
            "name": result.get("display_name") or query,
            "latitude": float(result["lat"]),
            "longitude": float(result["lon"]),
            "source": "nominatim",
        }
    except (KeyError, TypeError, ValueError):
        return None


def reverse_geocode(latitude: float, longitude: float) -> Optional[str]:
    try:
        response = requests.get(
            NOMINATIM_REVERSE_URL,
            params={
                "lat": latitude,
                "lon": longitude,
                "format": "jsonv2",
                "zoom": 14,
                "addressdetails": 1,
                "accept-language": "en",
            },
            headers={"User-Agent": USER_AGENT},
            timeout=5,
        )
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, ValueError, TypeError):
        return None

    return data.get("display_name") if isinstance(data, dict) else None