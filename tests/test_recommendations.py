from backend.services.recommendation import (
    recommend_places,
    generate_recommendation_reason,
)


def _base_places():
    return [
        {
            "id": 1,
            "name": "Accessible Museum",
            "description": "Indoor museum with ramps and accessible toilet.",
            "latitude": 20.2644,
            "longitude": 85.8339,
            "wheelchair_accessible": True,
            "visual_accessibility": True,
            "hearing_accessibility": True,
            "cognitive_accessibility": True,
            "age_friendly": True,
            "accessible_toilet": True,
            "low_stairs": True,
            "crowd_level": "Low",
            "outdoor": False,
            "active_barriers": 0,
            "route": {"distance_km": 1.2, "duration_min": 5},
        },
        {
            "id": 2,
            "name": "Historic Temple Complex",
            "description": "Popular heritage site with stairs and high crowd.",
            "latitude": 19.8876,
            "longitude": 86.0945,
            "wheelchair_accessible": False,
            "visual_accessibility": True,
            "hearing_accessibility": True,
            "cognitive_accessibility": False,
            "age_friendly": False,
            "accessible_toilet": False,
            "low_stairs": False,
            "crowd_level": "High",
            "outdoor": True,
            "active_barriers": 0,
            "route": {"distance_km": 8.5, "duration_min": 20},
        },
    ]


def test_wheelchair_mobility_requirement_returns_suitable_places_first():
    places = _base_places()

    results = recommend_places(["Mobility"], ["Wheelchair Accessible"], places, {"rain": False})

    assert len(results) >= 1
    assert results[0]["id"] == 1
    assert all(place["wheelchair_accessible"] is True for place in results)


def test_inaccessible_place_does_not_rank_above_suitable_place():
    places = _base_places()

    results = recommend_places(["Mobility"], ["Wheelchair Accessible"], places, {"rain": False})

    assert results
    assert all(place["wheelchair_accessible"] is True for place in results)


def test_higher_accessibility_score_produces_better_recommendation_when_other_factors_are_similar():
    places = [
        {
            "id": 11,
            "name": "Strong Match",
            "wheelchair_accessible": True,
            "visual_accessibility": True,
            "hearing_accessibility": True,
            "cognitive_accessibility": True,
            "age_friendly": True,
            "accessible_toilet": True,
            "low_stairs": True,
            "crowd_level": "Low",
            "outdoor": False,
            "active_barriers": 0,
            "route": {"distance_km": 2.0, "duration_min": 8},
        },
        {
            "id": 12,
            "name": "Weaker Match",
            "wheelchair_accessible": True,
            "visual_accessibility": True,
            "hearing_accessibility": False,
            "cognitive_accessibility": True,
            "age_friendly": False,
            "accessible_toilet": True,
            "low_stairs": True,
            "crowd_level": "Low",
            "outdoor": False,
            "active_barriers": 0,
            "route": {"distance_km": 2.1, "duration_min": 9},
        },
    ]

    results = recommend_places(["Mobility", "Visual"], [], places, {"rain": False})

    assert [place["id"] for place in results] == [11, 12]
    assert results[0]["score"] > results[1]["score"]


def test_ranking_is_descending_by_final_score():
    places = [
        {"id": 21, "name": "Lower Score", "wheelchair_accessible": True, "visual_accessibility": True, "accessible_toilet": False, "low_stairs": False, "crowd_level": "High", "outdoor": True, "active_barriers": 0, "route": {"distance_km": 9.0, "duration_min": 25}},
        {"id": 22, "name": "Higher Score", "wheelchair_accessible": True, "visual_accessibility": True, "accessible_toilet": True, "low_stairs": True, "crowd_level": "Low", "outdoor": False, "active_barriers": 0, "route": {"distance_km": 1.0, "duration_min": 5}},
    ]

    results = recommend_places(["Mobility", "Visual"], ["Wheelchair Accessible"], places, {"rain": False})

    assert [place["id"] for place in results] == [22, 21]


def test_empty_place_list_is_handled_safely():
    results = recommend_places(["Mobility"], ["Wheelchair Accessible"], [], {"rain": False})

    assert results == []


def test_missing_optional_data_does_not_crash_the_recommendation_engine():
    places = [
        {
            "id": 31,
            "name": "Partial Place",
            "wheelchair_accessible": True,
            "visual_accessibility": True,
            "crowd_level": "Medium",
            "outdoor": True,
            "active_barriers": 0,
        }
    ]

    results = recommend_places(["Mobility", "Visual"], ["Wheelchair Accessible"], places, {"rain": True})

    assert len(results) == 1
    assert results[0]["id"] == 31


def test_recommendation_reason_is_generated_correctly():
    place = {
        "id": 41,
        "name": "Reasonable Place",
        "wheelchair_accessible": True,
        "visual_accessibility": True,
        "hearing_accessibility": True,
        "accessible_toilet": True,
        "low_stairs": True,
        "crowd_level": "Low",
        "outdoor": False,
        "active_barriers": 0,
        "route": {"distance_km": 1.0, "duration_min": 6},
    }

    reason = generate_recommendation_reason(place, ["Mobility", "Visual"], ["Wheelchair Accessible"], {"rain": False})

    assert "wheelchair" in reason.lower()
    assert "short walking distance" in reason.lower() or "distance" in reason.lower()
