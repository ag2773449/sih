from backend.services.barriers import get_barriers, save_barrier

def test_save_and_get_barriers():
    initial_count = len(get_barriers())
    
    report = {
        "place_id": 1,
        "barrier_type": "Blocked Ramp",
        "description": "Construction material blocking ramp",
        "confidence": "High",
        "reported_by": "Test Runner"
    }
    
    saved = save_barrier(report)
    assert saved["id"] is not None
    assert saved["place_id"] == 1
    assert "reported_at" in saved
    
    current_barriers = get_barriers()
    assert len(current_barriers) == initial_count + 1
