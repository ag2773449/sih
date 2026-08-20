import React from 'react'
import StatusBadge from './StatusBadge.jsx'

const TYPE_ICON = {
  'Blocked Ramp': '🚧',
  'Broken Lift': '🛗',
  'Closed Accessible Toilet': '🚻',
  'Blocked Path': '🚫',
  'Stairs / Construction': '🪜',
  'Crowded Area': '🧑‍🤝‍🧑',
  Other: '⚠️'
}

export default function BarrierCard({ report, highlight = false }) {
  return (
    <li
      className={`hc-surface rounded-xl2 border bg-white p-5 shadow-soft ${
        highlight ? 'border-teal-700 ring-2 ring-teal-100' : 'border-ink-100'
      }`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-semibold text-ink-900 flex items-center gap-2">
            <span aria-hidden="true">{TYPE_ICON[report.barrier_type || report.type] || '⚠️'}</span>
            {report.barrier_type || report.type}
          </h3>
          <p className="text-sm text-ink-500 mt-0.5">
            {report.destination_name || report.destinationName || 'Unknown location'} &middot; {report.location || 'No details'}
          </p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      {report.description && <p className="text-sm text-ink-700 mt-3">{report.description}</p>}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-100 text-xs text-ink-500">
        <span>Confidence: <span className="font-semibold text-ink-700">{report.confidence || 'Medium'}</span></span>
        <span>Updated {report.updated || report.reported_at || 'Just now'}</span>
      </div>
    </li>
  )
}
