import React from 'react'

const LEGEND = [
  { color: '#2E7D5B', label: 'Accessible path', icon: '🟢' },
  { color: '#C97F1E', label: 'Caution / moderate accessibility', icon: '🟡' },
  { color: '#C0392B', label: 'Temporary barrier', icon: '🔴' }
]

// A stylized, illustrative route diagram (not a real geographic map) —
// clearly communicates the accessible / caution / barrier path segments
// referenced in "Why this route" and "Potential Barriers" below it.
export default function RouteMap({ place }) {
  const hasBarrier = place.temporaryBarriers?.length > 0

  return (
    <div className="hc-surface bg-white rounded-xl2 border border-ink-100 shadow-soft overflow-hidden">
      <div className="p-5 sm:p-6">
        <svg
          viewBox="0 0 600 260"
          className="w-full h-auto"
          role="img"
          aria-label={`Illustrative accessible route map to ${place.name}, showing accessible path segments${
            hasBarrier ? ' and one flagged barrier' : ''
          }`}
        >
          <rect x="0" y="0" width="600" height="260" rx="16" fill="#F2F9F8" />
          <circle cx="80" cy="70" r="26" fill="#0E5C5C" />
          <text x="80" y="76" textAnchor="middle" fontSize="20" fill="white">🚏</text>
          <text x="80" y="115" textAnchor="middle" fontSize="13" fontWeight="700" fill="#12211D">
            Start
          </text>

          <path
            d="M 106 70 C 200 20, 260 20, 320 70"
            stroke="#2E7D5B"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 320 70 C 380 120, 400 150, 440 150"
            stroke={hasBarrier ? '#C97F1E' : '#2E7D5B'}
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 440 150 C 480 150, 500 165, 520 190"
            stroke={hasBarrier ? '#C0392B' : '#2E7D5B'}
            strokeWidth="7"
            fill="none"
            strokeDasharray={hasBarrier ? '2 10' : '0'}
            strokeLinecap="round"
          />

          {hasBarrier && (
            <g>
              <circle cx="480" cy="170" r="16" fill="#C0392B" />
              <text x="480" y="176" textAnchor="middle" fontSize="16" fill="white">⚠️</text>
            </g>
          )}

          <circle cx="540" cy="210" r="26" fill="#D9A441" />
          <text x="540" y="216" textAnchor="middle" fontSize="20" fill="white">🏛️</text>
          <text x="540" y="252" textAnchor="middle" fontSize="13" fontWeight="700" fill="#12211D">
            {place.name.length > 22 ? `${place.name.slice(0, 20)}…` : place.name}
          </text>
        </svg>
      </div>

      <div className="border-t border-ink-100 px-5 sm:px-6 py-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Map legend">
          {LEGEND.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
