import requests
import streamlit as st

API_URL = "http://localhost:8000"

st.set_page_config(
    page_title="Accessible Journey Planner",
    page_icon="♿",
    layout="wide",
)

st.title("♿ Accessible Journey Planner")
st.caption("Basic MVP — accessibility-aware travel recommendations")

with st.sidebar:
    st.header("Accessibility Profile")

    needs = st.multiselect(
        "Your accessibility needs",
        ["Mobility", "Visual", "Hearing", "Cognitive", "Age-related"],
    )

    preferences = st.multiselect(
        "Preferences",
        [
            "Wheelchair Accessible",
            "Accessible Toilet",
            "Low Stairs",
            "Less Crowded",
        ],
    )

st.subheader("Find an Accessible Journey")

destination = st.text_input(
    "Destination",
    placeholder="Example: Puri, Odisha",
)

if st.button("🔎 Find Accessible Journey", type="primary"):
    if not destination.strip():
        st.warning("Please enter a destination.")
    else:
        with st.spinner("Checking accessibility, route and weather..."):
            try:
                response = requests.post(
                    f"{API_URL}/recommend",
                    json={
                        "destination": destination,
                        "accessibility_needs": needs,
                        "preferences": preferences,
                    },
                    timeout=40,
                )
                response.raise_for_status()
                data = response.json()

                st.session_state["results"] = data
            except Exception as e:
                st.error(f"Could not connect to backend: {e}")

if "results" in st.session_state:
    data = st.session_state["results"]

    destination_data = data["destination"]
    weather = data["weather"]
    results = data["recommendations"]

    st.success(f"Destination found: {destination_data['name']}")

    c1, c2, c3 = st.columns(3)
    c1.metric("Temperature", f"{weather['temperature']} °C" if weather["temperature"] is not None else "N/A")
    c2.metric("Rain", "Yes" if weather["rain"] else "No")
    c3.metric("Recommendations", len(results))

    st.subheader("🏆 Recommended Places")

    for index, place in enumerate(results):
        with st.container(border=True):
            st.markdown(f"### {index + 1}. {place['name']}")
            st.write(place["description"])

            c1, c2, c3, c4 = st.columns(4)
            c1.metric("Accessibility Score", f"{place['score']}/100")
            c2.metric("Distance", f"{place['route']['distance_km']} km" if place["route"]["distance_km"] is not None else "N/A")
            c3.metric("Travel Time", f"{place['route']['duration_min']} min" if place["route"]["duration_min"] is not None else "N/A")
            c4.metric("Crowd", place["crowd_level"])

            if place["recommendation_reasons"]:
                st.markdown("**Why this is recommended:**")
                for reason in place["recommendation_reasons"]:
                    st.write(f"✅ {reason}")

            if place.get("active_barriers", 0) > 0:
                st.warning("🚧 Temporary accessibility barrier reported at this location.")

st.divider()

st.subheader("🚧 Report a Temporary Barrier")

with st.form("barrier_form"):
    place_id = st.number_input("Place ID", min_value=1, step=1)
    barrier_type = st.selectbox(
        "Barrier type",
        ["Blocked Ramp", "Broken Lift", "Construction", "Blocked Path", "Other"],
    )
    description = st.text_area("Description")
    confidence = st.selectbox("Confidence", ["Low", "Medium", "High"])

    submitted = st.form_submit_button("Submit Barrier Report")

    if submitted:
        try:
            response = requests.post(
                f"{API_URL}/barriers",
                json={
                    "place_id": int(place_id),
                    "barrier_type": barrier_type,
                    "description": description,
                    "confidence": confidence,
                },
                timeout=10,
            )
            response.raise_for_status()
            st.success("Barrier report submitted successfully.")
        except Exception as e:
            st.error(f"Could not submit report: {e}")

st.caption("Demo MVP. External map/weather services may occasionally be unavailable.")
