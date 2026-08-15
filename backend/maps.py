import requests


def geocode_place(place_name):

    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": place_name,
        "format": "jsonv2",
        "limit": 1,
        "countrycodes": "in"
    }

    headers = {
        "User-Agent": "AccessibleJourneyPlanner/1.0"
    }

    response = requests.get(
        url,
        params=params,
        headers=headers,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    if not data:
        return None

    result = data[0]

    return {
        "name": result["display_name"],
        "latitude": float(result["lat"]),
        "longitude": float(result["lon"])
    }