import React from 'react'
import AccessibilityScore from './AccessibilityScore.jsx'

export default function RouteSummary({ place }) {
  const distance = place.distance || place.route?.distance_km
  const duration = place.duration || place.route?.duration_min
  const estMinutes = duration ? Math.round(duration) : Math.max(5, Math.round((distance || 0) * 12))
  const score = place.accessibilityScore || place.score

  return (
    <div className="hc-surface bg-white rounded-xl2 border border-ink-100 shadow-soft p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-marigold-700 mb-1">Destination</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">
            <span aria-hidden="true">🏛️</span> {place.name}
          </h1>
          <p className="text-ink-500 mt-1">{place.location || place.description}</p>
        </div>
        <div className="w-full sm:w-48">
          <AccessibilityScore score={score} size="lg" />
        </div>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-ink-100">
        <Stat label="Estimated travel time" value={`${estMinutes} min`} icon="⏱️" />
        <Stat
          label="Distance"
          value={distance ? `${distance} km${place.distanceIsReal ? '' : ' (approx)'}` : 'Distance unavailable'}
          icon="📍"
        />
        <Stat label="Crowd level" value={place.crowdLevel || 'Unknown'} icon="🧑‍🤝‍🧑" />
        <Stat label="Weather" value={place.weather || place.weatherStatus || 'Unknown'} icon="☀️" />
      </dl>
    </div>
  )
}

function Stat({ label, value, icon }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500 flex items-center gap-1.5 mb-1">
        <span aria-hidden="true">{icon}</span> {label}
      </dt>
      <dd className="text-lg font-semibold text-ink-900">{value}</dd>
    </div>
  )
}
