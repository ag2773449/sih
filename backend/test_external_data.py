from backend.external_data import get_destination_data


# Starting location
start_name = "Bhubaneswar"
start_lat = 20.2961
start_lon = 85.8245

# Destination
destination = "Puri, India"


# Get complete M3 data
result = get_destination_data(
    destination,
    start_lat,
    start_lon,
    start_name
)


# Check for errors
if "error" in result:
    print("Error:", result["error"])
    exit()


# Starting location
print("\n========================================")
print("          ACCESSIBLE JOURNEY DATA")
print("========================================")

print("\nSTARTING LOCATION")
print("----------------------------------------")
print("Name:", result["starting_location"]["name"])
print("Latitude:", result["starting_location"]["latitude"])
print("Longitude:", result["starting_location"]["longitude"])


# Destination
print("\nDESTINATION")
print("----------------------------------------")
print("Name:", result["destination"]["name"])
print("Latitude:", result["destination"]["latitude"])
print("Longitude:", result["destination"]["longitude"])


# Weather
print("\nWEATHER")
print("----------------------------------------")
print("Temperature:", result["weather"]["temperature"], "°C")
print("Rain:", result["weather"]["rain"], "mm")
print("Condition:", result["weather"]["condition"])
print("Status:", result["weather"]["status"])


# Route
print("\nROUTE")
print("----------------------------------------")
print("Distance:", result["route"]["distance_km"], "km")
print("Travel Time:", result["route"]["duration_min"], "minutes")

print("\n========================================")