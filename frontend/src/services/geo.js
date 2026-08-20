const EARTH_RADIUS_KM = 6371

export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

export function watchUserLocation(onLocation, onError, options = {}) {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    onError?.(new Error('Browser geolocation is unavailable'))
    return null
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracyMeters: position.coords.accuracy,
        accuracy: 'precise',
        timestamp: position.timestamp
      })
    },
    (error) => onError?.(error),
    {
      enableHighAccuracy: true,
      maximumAge: 15000,
      timeout: 10000,
      ...options
    }
  )

  return () => navigator.geolocation.clearWatch(watchId)
}