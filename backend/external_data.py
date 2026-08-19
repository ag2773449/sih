from backend.maps import geocode_place
from backend.weather import get_weather
from backend.route import get_route


def get_destination_data(
    destination,
    start_lat,
    start_lon,
    start_name="Starting Location"
):

    # Find destination coordinates
    location = geocode_place(destination)

    if location is None:
        return {
            "error": "Destination not found"
        }

    latitude = location["latitude"]
    longitude = location["longitude"]

    # Get weather
    weather = get_weather(
        latitude,
        longitude
    )

    # Get route
    route = get_route(
        start_lat,
        start_lon,
        latitude,
        longitude
    )

    # Return all information
    return {
        "starting_location": {
            "name": start_name,
            "latitude": start_lat,
            "longitude": start_lon
        },

        "destination": {
            "name": location["name"],
            "latitude": latitude,
            "longitude": longitude
        },

        "weather": weather,

        "route": route
    }