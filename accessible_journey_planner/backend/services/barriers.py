import json
from pathlib import Path
from datetime import datetime, timezone

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "barriers.json"

def _read():
    if not DATA_FILE.exists():
        return []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def _write(items):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)

def save_barrier(report):
    items = _read()
    report["id"] = len(items) + 1
    report["reported_at"] = datetime.now(timezone.utc).isoformat()
    items.append(report)
    _write(items)
    return report

def get_barriers():
    return _read()
