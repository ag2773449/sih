def accessibility_score(place, needs, preferences):
    score = 0
    reasons = []

    need_map = {
        "Mobility": "wheelchair_accessible",
        "Visual": "visual_accessibility",
        "Hearing": "hearing_accessibility",
        "Cognitive": "cognitive_accessibility",
        "Age-related": "age_friendly",
    }

    active_needs = [need_map[n] for n in needs if n in need_map]

    if not active_needs:
        score += 50
    else:
        matched = sum(bool(place.get(field, False)) for field in active_needs)
        score += (matched / len(active_needs)) * 60
        if matched:
            reasons.append(f"Matches {matched}/{len(active_needs)} accessibility needs")

    preference_map = {
        "Wheelchair Accessible": "wheelchair_accessible",
        "Accessible Toilet": "accessible_toilet",
        "Low Stairs": "low_stairs",
        "Less Crowded": "crowd_level",
    }

    for pref in preferences:
        field = preference_map.get(pref)
        if not field:
            continue
        if pref == "Less Crowded":
            if place.get(field) == "Low":
                score += 10
                reasons.append("Low crowd level")
        elif place.get(field):
            score += 10
            reasons.append(pref)

    return min(score, 80), reasons

def recommend_places(user_needs, preferences, places, weather):
    results = []

    rain = weather.get("rain", False)

    for place in places:
        base, reasons = accessibility_score(place, user_needs, preferences)

        distance = place["route"].get("distance_km")
        distance_score = 0
        if distance is not None:
            distance_score = max(0, 15 - min(distance, 15))
            if distance <= 3:
                reasons.append("Short route distance")

        crowd_score = {"Low": 10, "Medium": 6, "High": 2}.get(
            place.get("crowd_level"), 5
        )

        weather_score = 5
        if rain and place.get("outdoor", True):
            weather_score = 1
            reasons.append("Outdoor activity affected by rain")
        elif not rain:
            reasons.append("Weather is suitable")

        barrier_penalty = 0
        if place.get("active_barriers", 0) > 0:
            barrier_penalty = 10
            reasons.append("Active temporary barrier reported")

        final_score = round(
            min(100, base + distance_score + crowd_score + weather_score)
            - barrier_penalty,
            1,
        )

        results.append({
            **place,
            "score": final_score,
            "recommendation_reasons": reasons,
            "barrier_penalty": barrier_penalty,
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results
