import requests

def get_weather(lat: float, lon: float):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,precipitation,rain,weather_code",
        "timezone": "auto",
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        current = data.get("current", {})
        rain = float(current.get("rain", 0) or 0) > 0

        return {
            "temperature": current.get("temperature_2m"),
            "precipitation": current.get("precipitation"),
            "rain": rain,
            "weather_code": current.get("weather_code"),
            "timezone": data.get("timezone"),
        }
    except Exception:
        return {
            "temperature": None,
            "precipitation": None,
            "rain": False,
            "weather_code": None,
            "timezone": None,
            "error": "Weather service unavailable",
        }
