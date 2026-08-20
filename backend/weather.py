import requests

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


def _weather_condition(weather_code: int) -> str:
    if weather_code == 0:
        return "Clear"
    if weather_code in [1, 2, 3]:
        return "Cloudy"
    if weather_code in [45, 48]:
        return "Foggy"
    if weather_code in [51, 53, 55, 56, 57]:
        return "Drizzle"
    if weather_code in [61, 63, 65, 66, 67]:
        return "Rain"
    if weather_code in [71, 73, 75, 77]:
        return "Snow"
    if weather_code in [80, 81, 82]:
        return "Rain Showers"
    if weather_code in [95, 96, 99]:
        return "Thunderstorm"
    return "Unknown"


def get_weather(latitude, longitude) -> dict:
    unavailable = {
        "temperature": None,
        "rain": None,
        "condition": "Unknown",
        "status": "Unknown",
        "source": "unavailable",
    }

    try:
        response = requests.get(
            OPEN_METEO_URL,
            params={
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,rain,weather_code",
                "timezone": "auto",
            },
            timeout=6,
        )
        response.raise_for_status()
        current = response.json()["current"]
        temperature = current.get("temperature_2m")
        rain = current.get("rain")
        condition = _weather_condition(int(current.get("weather_code")))
    except (requests.RequestException, ValueError, KeyError, TypeError):
        return unavailable

    status = "Clear" if condition == "Clear" and rain == 0 else "Not Clear"
    return {
        "temperature": temperature,
        "rain": rain,
        "condition": condition,
        "status": status,
        "source": "open-meteo",
    }