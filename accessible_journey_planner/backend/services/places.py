import json
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "places.json"

def get_places():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)
