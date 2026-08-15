import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from backend.services.barriers import get_active_barriers_count_by_place

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "places.json"

def get_places() -> List[Dict[str, Any]]:
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        places = json.load(f)
    
    barrier_counts = get_active_barriers_count_by_place()
    for place in places:
        pid = place.get("id")
        if pid in barrier_counts:
            place["active_barriers"] = barrier_counts[pid]
    return places

def get_place_by_id(place_id: int) -> Optional[Dict[str, Any]]:
    places = get_places()
    for place in places:
        if place.get("id") == place_id:
            return place
    return None
