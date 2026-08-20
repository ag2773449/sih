import React from 'react'

const FACILITY_MAP = [
  { key: 'wheelchairAccessible', label: 'Wheelchair' },
  { key: 'accessibleToilet', label: 'Accessible Toilet' },
  { key: 'lowStairs', label: 'Low Stairs' },
  { key: 'liftAvailable', label: 'Lift' },
  { key: 'assistanceAvailable', label: 'Assistance' },
  { key: 'visualAccessibility', label: 'Visual Aids' },
  { key: 'hearingAccessibility', label: 'Hearing Aids' },
  { key: 'cognitiveAccessibility', label: 'Cognitive Aids' },
  { key: 'ageFriendly', label: 'Age Friendly' }
]

export default function FacilityTags({ place, compact = false }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Available facilities">
      {FACILITY_MAP.map(({ key, label }) => {
        const value = place[key]
        const available = value === true
        const unknown = value === null || value === undefined
        return (
          <li
            key={key}
            className={`hc-surface inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              compact ? 'text-xs' : 'text-sm'
            } font-medium ${
              available
                ? 'border-teal-100 bg-teal-50 text-teal-800'
                : unknown
                  ? 'border-ink-100 bg-white text-ink-500'
                  : 'border-ink-100 bg-ink-100/40 text-ink-500 line-through decoration-1'
            }`}
          >
            {label}: {available ? 'Yes' : unknown ? 'Unknown' : 'No'}
          </li>
        )
      })}
    </ul>
  )
}