import json
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Any

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "barriers.json"

def _read() -> List[Dict[str, Any]]:
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def _write(items: List[Dict[str, Any]]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)

def save_barrier(report: Dict[str, Any]) -> Dict[str, Any]:
    items = _read()
    report["id"] = len(items) + 1
    if "reported_at" not in report or not report["reported_at"]:
        report["reported_at"] = datetime.now(timezone.utc).isoformat()
    items.append(report)
    _write(items)
    return report

def get_barriers() -> List[Dict[str, Any]]:
    return _read()

def get_active_barriers_count_by_place() -> Dict[int, int]:
    items = _read()
    counts: Dict[int, int] = {}
    for item in items:
        pid = item.get("place_id")
        if pid:
            counts[pid] = counts.get(pid, 0) + 1
    return counts
