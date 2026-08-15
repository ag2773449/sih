from backend.services.places import get_places, get_place_by_id

def test_get_places():
    places = get_places()
    assert isinstance(places, list)
    assert len(places) > 0
    assert "name" in places[0]
    assert "latitude" in places[0]

def test_get_place_by_id_found():
    place = get_place_by_id(1)
    assert place is not None
    assert place["id"] == 1

def test_get_place_by_id_not_found():
    place = get_place_by_id(99999)
    assert place is None
