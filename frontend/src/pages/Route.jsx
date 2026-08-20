import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import RouteSummary from '../components/RouteSummary.jsx'
import RouteMap from '../components/RouteMap.jsx'
import FacilityTags from '../components/FacilityTags.jsx'
import { getRoute, getRouteTransport } from '../services/api'
import { useWikiImage } from '../hooks/useWikiImage.js'
import { useUserLocation } from '../context/LocationContext.jsx'
import { haversineDistanceKm } from '../services/geo'

export default function RoutePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [transport, setTransport] = useState(null)
  const heroImage = useWikiImage(place?.wikiTitle || place?.name, id)
  const { location } = useUserLocation()

  useEffect(() => {
    let active = true
    setLoading(true)
    setTransport(null)
    
    getRoute(id)
      .then((data) => {
        if (active) {
          setPlace(data)
          setLoading(false)
        }
        if (active && data) {
          getRouteTransport(data)
            .then((t) => {
              if (active) setTransport(t)
            })
            .catch(() => {
              if (active) setTransport({ cabsAvailable: false, busAvailable: false, cabCount: 0, busStopCount: 0, unknown: true })
            })
        }
      })
      .catch((error) => {
        console.error('Failed to load route:', error)
        if (active) {
          setPlace(null)
          setLoading(false)
        }
      })
    
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-content mx-auto px-4 py-10" aria-live="polite" aria-busy="true">
        <div className="h-8 w-40 bg-ink-100/60 rounded mb-6 animate-pulse" />
        <div className="h-64 bg-ink-100/50 rounded-xl2 animate-pulse" />
      </div>
    )
  }

  if (!place) {
    return (
      <div className="max-w-content mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold text-ink-900 mb-2">Route not found</p>
        <Link to="/explore" className="text-teal-700 font-semibold">← Back to results</Link>
      </div>
    )
  }

  const hasRealDistance = location && typeof place.lat === 'number' && typeof place.lon === 'number'
  const distanceKm = hasRealDistance
    ? Math.round(haversineDistanceKm(location.lat, location.lon, place.lat, place.lon) * 10) / 10
    : place.distance
  const placeWithDistance = { ...place, distance: distanceKm, distanceIsReal: Boolean(hasRealDistance) }

  return (
    <div className="max-w-content mx-auto px-4 py-10">
      <Link to="/explore" className="text-sm font-semibold text-teal-700 hover:text-teal-900 w-fit inline-block mb-6">
        ← Back to results
      </Link>

      <div className="flex flex-col gap-6">
        <div className="relative h-56 sm:h-72 rounded-xl2 overflow-hidden hc-surface border border-ink-100 shadow-soft">
          <img
            src={heroImage}
            alt={`${place.name}, ${place.location}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {place.source === 'live' && (
            <span className="hc-surface absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink-700 border border-ink-100">
              <span aria-hidden="true">🌐</span> Estimated data
            </span>
          )}
        </div>
        <RouteSummary place={placeWithDistance} />
        <RouteMap place={place} />

        <div className="hc-surface bg-white rounded-xl2 border border-ink-100 shadow-soft p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold text-ink-900 mb-4">Getting There</h2>
          {transport === null ? (
            <div className="flex gap-3">
              <div className="h-10 w-40 rounded-lg bg-ink-100/50 animate-pulse" />
              <div className="h-10 w-40 rounded-lg bg-ink-100/50 animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <TransportBadge
                icon="🚕"
                label="Cabs"
                available={transport.cabsAvailable}
                unknown={transport.unknown}
                detail={transport.cabCount > 0 ? `${transport.cabCount} taxi stand${transport.cabCount > 1 ? 's' : ''} nearby` : null}
              />
              <TransportBadge
                icon="🚌"
                label="Bus"
                available={transport.busAvailable}
                unknown={transport.unknown}
                detail={transport.busStopCount > 0 ? `${transport.busStopCount} stop${transport.busStopCount > 1 ? 's' : ''} nearby` : null}
              />
            </div>
          )}
          <p className="text-xs text-ink-500 mt-3">
            Based on taxi stands and bus stops mapped on OpenStreetMap within 800m — actual availability on the ground may vary.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="hc-surface bg-white rounded-xl2 border border-ink-100 shadow-soft p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink-900 mb-4">Why this route?</h2>
            <ul className="flex flex-col gap-3">
              {(place.recommendationReasons || place.reasons || []).map((reason, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-ink-700">
                  <span aria-hidden="true" className="mt-0.5 text-moss-600 font-bold">✓</span>
                  {reason}
                </li>
              ))}
              {(place.recommendationReasons || place.reasons || []).length === 0 && (
                <li className="text-sm text-ink-500">This place matches your accessibility preferences.</li>
              )}
            </ul>
            <div className="mt-5 pt-5 border-t border-ink-100">
              <FacilityTags place={place} />
            </div>
          </div>

          <div className="hc-surface bg-white rounded-xl2 border border-ink-100 shadow-soft p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-ink-900 mb-4">Potential Barriers</h2>
            {(place.temporaryBarriers || []).length === 0 ? (
              <p className="text-sm text-ink-500">
                {place.activeBarriers > 0 
                  ? `${place.activeBarriers} active barrier report${place.activeBarriers > 1 ? 's' : ''} for this location.`
                  : 'No barriers currently reported on this route.'}
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {(place.temporaryBarriers || []).map((b, i) => (
                  <li key={`tb-${i}`} className="flex items-start gap-2.5 text-sm text-marigold-800 bg-marigold-100 rounded-lg p-3">
                    <span aria-hidden="true" className="mt-0.5">⚠️</span>
                    <span><strong>{b.type}.</strong> {b.note}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => navigate('/report-barrier')}
              className="mt-5 w-full rounded-lg border-2 border-clay-600 text-clay-700 font-semibold px-4 py-3 hover:bg-clay-100 transition-colors"
            >
              🚧 Report a Barrier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TransportBadge({ icon, label, available, unknown, detail }) {
  const style = unknown
    ? 'border-ink-100 bg-ink-100/40 text-ink-500'
    : available
      ? 'border-moss-600 bg-moss-100 text-moss-800'
      : 'border-ink-100 bg-white text-ink-500'

  return (
    <span className={`hc-surface inline-flex flex-col rounded-lg border-2 px-4 py-2.5 text-sm font-semibold ${style}`}>
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true">{icon}</span>
        {label}: {unknown ? 'Unknown' : available ? 'Available' : 'Not found nearby'}
      </span>
      {detail && <span className="text-xs font-normal mt-0.5">{detail}</span>}
    </span>
  )
}
