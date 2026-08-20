import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BarrierCard from '../components/BarrierCard.jsx'
import { useJourney } from '../context/JourneyContext.jsx'

const STATUS_FILTERS = ['All', 'Pending', 'Under Verification', 'Verified', 'Resolved']

export default function BarrierStatus() {
  const { reports, lastReportId, reportsLoading, reportsError } = useJourney()
  const [filter, setFilter] = useState('All')

  const filtered = useMemo(
    () => (filter === 'All' ? reports : reports.filter((r) => r.status === filter)),
    [reports, filter]
  )

  if (reportsLoading) {
    return (
      <div className="max-w-content mx-auto px-4 py-10" aria-live="polite" aria-busy="true">
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl2 bg-ink-100/50 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (reportsError) {
    return (
      <div className="max-w-content mx-auto px-4 py-10">
        <div className="text-center py-20 border-2 border-dashed border-clay-600 rounded-xl2">
          <p className="text-xl font-semibold text-clay-700 mb-2">Failed to load barrier reports</p>
          <p className="text-ink-500 mb-6">{reportsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-teal-700 text-white font-semibold px-5 py-3 hover:bg-teal-900 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-content mx-auto px-4 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-900">
          Barrier Reports & Verification Status
        </h1>
        <p className="text-ink-500 max-w-2xl">
          Every report is reviewed before it influences route recommendations. Verified reports
          update accessibility scores for everyone.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1" role="group" aria-label="Filter by status">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
            className={`hc-surface shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
              filter === s
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'border-ink-100 bg-white text-ink-700 hover:border-teal-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-ink-100 rounded-xl2">
          <p className="text-xl font-semibold text-ink-900 mb-2">No reports in this status</p>
          <Link to="/report-barrier" className="text-teal-700 font-semibold">
            🚧 Report a barrier
          </Link>
        </div>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {filtered.map((report) => (
            <BarrierCard key={report.id} report={report} highlight={report.id === lastReportId} />
          ))}
        </ul>
      )}
    </div>
  )
}
