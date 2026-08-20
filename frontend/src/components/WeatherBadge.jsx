import React from 'react'

export default function WeatherBadge({ weather, temp }) {
  if (!weather) return null
  return (
    <span className="hc-surface inline-flex rounded-full border border-ink-100 bg-white px-3 py-1 text-sm font-semibold text-ink-700">
      {weather}
      {temp ? <span className="text-ink-500 font-normal">, {temp}</span> : null}
    </span>
  )
}