import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from backend.services.barriers import get_active_barriers_count_by_place

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "places.json"


def _read_places() -> List[Dict[str, Any]]:
    if not DATA_FILE.exists():
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
    except (json.JSONDecodeError, OSError):
        return []

    return [dict(item) for item in data if isinstance(item, dict)]


def get_places(query: str = "") -> List[Dict[str, Any]]:
    places = _read_places()
    barrier_counts = get_active_barriers_count_by_place()

    for place in places:
        place_id = place.get("id")
        place["active_barriers"] = barrier_counts.get(place_id, place.get("active_barriers", 0) or 0)
        place["source"] = "backend"

    q = (query or "").strip().lower()
    if not q:
        return places

    return [
        place
        for place in places
        if q in str(place.get("name", "")).lower()
        or q in str(place.get("description", "")).lower()
    ]


def get_place_by_id(place_id: str) -> Optional[Dict[str, Any]]:
    for place in get_places():
        if str(place.get("id")) == str(place_id):
            return place
    return None