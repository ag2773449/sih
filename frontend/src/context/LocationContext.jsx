import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { formatCoordinates, reverseGeocode } from '../services/api.js'
import { watchUserLocation } from '../services/geo.js'

const LocationContext = createContext(null)

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(null)
  const [status, setStatus] = useState('requesting')
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    let requestId = 0

    const stopWatching = watchUserLocation(
      (coords) => {
        if (!active) return
        const nextRequestId = requestId + 1
        requestId = nextRequestId
        const baseLocation = {
          ...coords,
          name: formatCoordinates(coords.lat, coords.lon),
          source: 'browser'
        }

        setStatus('granted')
        setError(null)
        setLocation(baseLocation)

        reverseGeocode(coords)
          .then((resolved) => {
            if (!active || nextRequestId !== requestId) return
            setLocation({
              ...baseLocation,
              name: resolved?.name || baseLocation.name,
              source: resolved?.source || baseLocation.source
            })
          })
          .catch((error) => {
            console.error('Failed to reverse geocode:', error)
            if (!active || nextRequestId !== requestId) return
            setLocation(baseLocation)
          })
      },
      (geoError) => {
        if (!active) return
        setStatus('unavailable')
        setError(geoError?.message || 'Location unavailable')
      }
    )

    if (!stopWatching) {
      setStatus('unavailable')
      setError('Browser geolocation is unavailable')
    }

    return () => {
      active = false
      stopWatching?.()
    }
  }, [])

  const value = useMemo(() => ({ location, status, error }), [location, status, error])

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useUserLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useUserLocation must be used within LocationProvider')
  return ctx
}