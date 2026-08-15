import requests


def get_weather(latitude, longitude):

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,rain,weather_code",
        "timezone": "auto"
    }

    response = requests.get(
        url,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    current = data["current"]

    temperature = current["temperature_2m"]
    rain = current["rain"]
    weather_code = current["weather_code"]

    if weather_code == 0:
        condition = "Clear"

    elif weather_code in [1, 2, 3]:
        condition = "Cloudy"

    elif weather_code in [45, 48]:
        condition = "Foggy"

    elif weather_code in [51, 53, 55, 56, 57]:
        condition = "Drizzle"

    elif weather_code in [61, 63, 65, 66, 67]:
        condition = "Rain"

    elif weather_code in [71, 73, 75, 77]:
        condition = "Snow"

    elif weather_code in [80, 81, 82]:
        condition = "Rain Showers"

    elif weather_code in [95, 96, 99]:
        condition = "Thunderstorm"

    else:
        condition = "Unknown"

    # Determine whether the weather is clear
    if condition == "Clear" and rain == 0:
        weather_status = "Clear"
    else:
        weather_status = "Not Clear"

    return {
        "temperature": temperature,
        "rain": rain,
        "condition": condition,
        "status": weather_status
    }