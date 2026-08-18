def _normalize_text(value):
    if value is None:
        return ""
    return str(value).strip().lower().replace("_", " ")


def _place_matches(place, field_name):
    return bool(place.get(field_name, False))


def _distance_score(distance_km):
    if distance_km is None:
        return 50.0
    if distance_km <= 1:
        return 100.0
    if distance_km <= 3:
        return 85.0
    if distance_km <= 5:
        return 70.0
    if distance_km <= 8:
        return 50.0
    return 30.0


def _crowd_score(crowd_level):
    crowd = _normalize_text(crowd_level)
    if crowd == "low":
        return 100.0
    if crowd == "medium":
        return 70.0
    if crowd == "high":
        return 40.0
    return 60.0


def _weather_score(place, weather):
    rain = bool(weather.get("rain", False)) if isinstance(weather, dict) else False
    outdoor = bool(place.get("outdoor", False))

    if rain and outdoor:
        return 35.0
    if weather.get("status") in {"Clear", "clear"}:
        return 100.0
    if weather.get("condition") in {"Clear", "Cloudy"}:
        return 85.0
    return 60.0


def _facilities_score(place):
    facility_fields = [
        "accessible_toilet",
        "low_stairs",
        "age_friendly",
        "wheelchair_accessible",
    ]
    if not facility_fields:
        return 50.0
    matched = sum(1 for field in facility_fields if _place_matches(place, field))
    return (matched / len(facility_fields)) * 100.0


def _priority_requirement_fields(needs, preferences):
    requirement_map = {
        "mobility": ["wheelchair_accessible"],
        "wheelchair accessible": ["wheelchair_accessible"],
        "visual": ["visual_accessibility"],
        "hearing": ["hearing_accessibility"],
        "cognitive": ["cognitive_accessibility"],
        "age related": ["age_friendly"],
        "age-related": ["age_friendly"],
        "age related/general accessibility": ["age_friendly"],
        "accessibility": ["wheelchair_accessible"],
        "accessible toilet": ["accessible_toilet"],
        "low stairs": ["low_stairs"],
        "ramp": ["wheelchair_accessible"],
        "elevator": ["wheelchair_accessible"],
    }

    fields = []
    for raw_value in list(needs or []) + list(preferences or []):
        key = _normalize_text(raw_value)
        if key in requirement_map:
            fields.extend(requirement_map[key])
    return list(dict.fromkeys(fields))


def filter_accessible_places(places, user_needs, preferences):
    if not places:
        return []

    required_fields = _priority_requirement_fields(user_needs, preferences)
    if not required_fields:
        return list(places)

    filtered = []
    for place in places:
        suitable = True
        for field in required_fields:
            if not _place_matches(place, field):
                suitable = False
                break
        if suitable:
            filtered.append(place)
    return filtered


def accessibility_score(place, needs, preferences):
    score = 0.0
    reasons = []
    need_fields = []
    need_map = {
        "mobility": "wheelchair_accessible",
        "visual": "visual_accessibility",
        "hearing": "hearing_accessibility",
        "cognitive": "cognitive_accessibility",
        "age-related": "age_friendly",
        "age related": "age_friendly",
    }

    for need in needs or []:
        normalized = _normalize_text(need)
        field = need_map.get(normalized)
        if field:
            need_fields.append(field)

    for pref in preferences or []:
        normalized = _normalize_text(pref)
        if normalized == "wheelchair accessible":
            need_fields.append("wheelchair_accessible")
        elif normalized == "accessible toilet":
            need_fields.append("accessible_toilet")
        elif normalized == "low stairs":
            need_fields.append("low_stairs")

    unique_fields = list(dict.fromkeys(need_fields))

    if not unique_fields:
        score = 50.0
    else:
        matched = sum(1 for field in unique_fields if _place_matches(place, field))
        if matched:
            score += (matched / len(unique_fields)) * 60.0
            reasons.append(f"Matches {matched}/{len(unique_fields)} accessibility needs")
        if matched == len(unique_fields):
            score += 20.0
            reasons.append("All requested needs are covered")

    for pref in preferences or []:
        normalized = _normalize_text(pref)
        if normalized == "wheelchair accessible" and _place_matches(place, "wheelchair_accessible"):
            score += 10.0
            reasons.append("Wheelchair accessible")
        elif normalized == "accessible toilet" and _place_matches(place, "accessible_toilet"):
            score += 10.0
            reasons.append("Accessible toilet available")
        elif normalized == "low stairs" and _place_matches(place, "low_stairs"):
            score += 10.0
            reasons.append("Low stairs")
        elif normalized == "less crowded" and place.get("crowd_level") == "Low":
            score += 10.0
            reasons.append("Lower crowd level")

    return min(score, 100.0), reasons


def generate_recommendation_reason(place, user_needs, preferences, weather):
    reasons = []

    if _place_matches(place, "wheelchair_accessible"):
        reasons.append("wheelchair accessible")
    if _place_matches(place, "accessible_toilet"):
        reasons.append("accessible toilet")
    if _place_matches(place, "low_stairs"):
        reasons.append("low stairs")

    route = place.get("route") or {}
    distance = route.get("distance_km") if isinstance(route, dict) else None
    if distance is not None and distance <= 3:
        reasons.append("short walking distance")

    if place.get("crowd_level") == "Low":
        reasons.append("lower crowd")

    weather_status = (weather or {}).get("status") if isinstance(weather, dict) else None
    if weather_status in {"Clear", "clear"}:
        reasons.append("suitable weather")

    if reasons:
        summary = ", ".join(reasons[:4])
        return f"Recommended because it is {summary}."
    return "Recommended because it matches your accessibility needs and is a suitable option."


def recommend_places(user_needs, preferences, places, weather):
    if not places:
        return []

    selected_places = filter_accessible_places(places, user_needs, preferences)
    if not selected_places:
        return []

    results = []
    for place in selected_places:
        base_score, reasons = accessibility_score(place, user_needs, preferences)

        route = place.get("route") or {}
        distance = route.get("distance_km") if isinstance(route, dict) else None
        distance_score = _distance_score(distance)
        crowd_score = _crowd_score(place.get("crowd_level"))
        weather_score = _weather_score(place, weather)
        facilities_score = _facilities_score(place)

        if distance is not None and distance <= 3:
            reasons.append("Short walking distance")
        if place.get("crowd_level") == "Low":
            reasons.append("Lower crowd level")
        if weather and isinstance(weather, dict) and weather.get("status") in {"Clear", "clear"}:
            reasons.append("Weather is suitable")

        if place.get("active_barriers", 0) > 0:
            reasons.append("Temporary barrier reported")

        final_score = round(
            (base_score * 0.40)
            + (distance_score * 0.20)
            + (crowd_score * 0.15)
            + (weather_score * 0.15)
            + (facilities_score * 0.10),
            1,
        )

        deduped_reasons = []
        seen = set()
        for reason in reasons:
            key = reason.lower()
            if key not in seen:
                deduped_reasons.append(reason)
                seen.add(key)

        result = {
            **place,
            "score": float(final_score),
            "recommendation_reasons": deduped_reasons,
            "barrier_penalty": 0,
        }
        if place.get("active_barriers", 0) > 0:
            result["barrier_penalty"] = 0
        results.append(result)

    results.sort(key=lambda item: item["score"], reverse=True)
    for item in results:
        item["recommendation_reasons"] = item["recommendation_reasons"] or [
            generate_recommendation_reason(item, user_needs, preferences, weather)
        ]
    return results
