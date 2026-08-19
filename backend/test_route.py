from backend.route import get_route


# Bhubaneswar
start_lat = 20.2961
start_lon = 85.8245

# Puri
end_lat = 19.8076083
end_lon = 85.8252538


result = get_route(
    start_lat,
    start_lon,
    end_lat,
    end_lon
)

print(result)