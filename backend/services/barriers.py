import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "barriers.json"


def _read() -> List[Dict[str, Any]]:
    if not DATA_FILE.exists():
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
    except (json.JSONDecodeError, OSError):
        return []

    return [dict(item) for item in data if isinstance(item, dict)]


def _write(items: List[Dict[str, Any]]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as file:
        json.dump(items, file, indent=2)


def _next_id(items: List[Dict[str, Any]]) -> int:
    existing = [item.get("id") for item in items if isinstance(item.get("id"), int)]
    return (max(existing) + 1) if existing else 1


def save_barrier(report: Dict[str, Any]) -> Dict[str, Any]:
    items = _read()
    saved = dict(report)
    saved["id"] = _next_id(items)
    saved.setdefault("reported_at", datetime.now(timezone.utc).isoformat())
    saved.setdefault("status", "Under Verification")
    saved.setdefault("updated", "Just now")
    saved.setdefault("reported_by", "Frontend User")
    items.append(saved)
    _write(items)
    return saved


def get_barriers() -> List[Dict[str, Any]]:
    return sorted(_read(), key=lambda item: item.get("reported_at", ""), reverse=True)


def get_barrier_by_id(barrier_id: int) -> Optional[Dict[str, Any]]:
    for item in _read():
        if item.get("id") == barrier_id:
            return item
    return None


def get_active_barriers_count_by_place() -> Dict[int, int]:
    counts: Dict[int, int] = {}
    for item in _read():
        if item.get("status") == "Resolved":
            continue
        place_id = item.get("place_id")
        if isinstance(place_id, int):
            counts[place_id] = counts.get(place_id, 0) + 1
    return counts