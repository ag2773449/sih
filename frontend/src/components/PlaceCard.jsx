import React from 'react'
import { Link } from 'react-router-dom'
import AccessibilityScore from './AccessibilityScore.jsx'
import WeatherBadge from './WeatherBadge.jsx'
import CrowdBadge from './CrowdBadge.jsx'
import FacilityTags from './FacilityTags.jsx'
import { formatCoordinates } from '../services/api.js'

export default function PlaceCard({ place }) {
  const score = place.score ?? place.accessibilityScore
  const distanceText = place.distance === null || place.distance === undefined ? 'Route distance unavailable' : `${place.distance} km`

  return (
    <article className="hc-surface group bg-white rounded-xl2 border border-ink-100 shadow-soft p-5 flex flex-col gap-4">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-ink-900 leading-tight">{place.name}</h3>
          {place.source === 'live' && (
            <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 border border-teal-100">
              Live
            </span>
          )}
        </div>
        <p className="text-sm text-ink-500 mt-1">{place.description || place.location}</p>
        <p className="text-xs text-ink-500 mt-2">Coordinates: {formatCoordinates(place.latitude, place.longitude)}</p>
      </div>

      <AccessibilityScore score={score} />

      <div className="flex flex-wrap gap-2">
        <span className="hc-surface inline-flex rounded-full border border-ink-100 bg-white px-3 py-1 text-sm font-semibold text-ink-700">
          {distanceText}
        </span>
        <CrowdBadge level={place.crowdLevel} />
        <WeatherBadge weather={place.weather} temp={place.weatherTemp} />
      </div>

      <FacilityTags place={place} compact />

      {(place.recommendationReasons || []).length > 0 && (
        <ul className="text-sm text-ink-600 flex flex-col gap-1">
          {place.recommendationReasons.slice(0, 2).map((reason, i) => (
            <li key={i}>{reason}</li>
          ))}
        </ul>
      )}

      <Link
        to={`/route/${place.id}`}
        className="mt-auto text-center rounded-lg bg-teal-700 text-white font-semibold px-4 py-2.5 hover:bg-teal-900 transition-colors"
      >
        View Route Details
      </Link>
    </article>
  )
}