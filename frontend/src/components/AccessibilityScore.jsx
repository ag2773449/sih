import React from 'react'

export default function AccessibilityScore({ score, size = 'md' }) {
  const value = Number.isFinite(Number(score)) ? Math.max(0, Math.min(100, Math.round(Number(score)))) : null
  const segments = 10
  const filled = value === null ? 0 : Math.round((value / 100) * segments)
  const tone = value === null ? 'unknown' : value >= 75 ? 'good' : value >= 50 ? 'ok' : 'low'

  const toneColor = {
    good: { on: '#0E5C5C', text: 'text-teal-700', label: 'High accessibility' },
    ok: { on: '#C97F1E', text: 'text-marigold-700', label: 'Moderate accessibility' },
    low: { on: '#C0392B', text: 'text-clay-700', label: 'Limited accessibility' },
    unknown: { on: '#6B7280', text: 'text-ink-500', label: 'Accessibility score unavailable' }
  }[tone]

  const height = size === 'lg' ? 'h-4' : 'h-3'

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold text-ink-700">Accessibility</span>
        <span className={`font-mono font-bold ${size === 'lg' ? 'text-2xl' : 'text-lg'} ${toneColor.text}`}>
          {value === null ? 'Unknown' : `${value}%`}
        </span>
      </div>
      <div
        className={`paving-track ${height}`}
        style={{ '--dot-on': toneColor.on, gridTemplateColumns: `repeat(${segments}, minmax(0,1fr))` }}
        role="img"
        aria-label={value === null ? toneColor.label : `Accessibility score ${value} percent, ${toneColor.label}`}
      >
        {Array.from({ length: segments }).map((_, index) => (
          <span key={index} className="paving-dot" data-filled={index < filled} aria-hidden="true" />
        ))}
      </div>
    </div>
  )
}