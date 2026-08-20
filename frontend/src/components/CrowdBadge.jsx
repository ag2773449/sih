import React from 'react'

const STYLES = {
  Low: 'bg-moss-100 text-moss-700',
  Medium: 'bg-marigold-100 text-marigold-700',
  High: 'bg-clay-100 text-clay-700'
}

export default function CrowdBadge({ level }) {
  if (!level) return null
  return <span className={`hc-surface inline-flex rounded-full px-3 py-1 text-sm font-semibold ${STYLES[level] || STYLES.Medium}`}>{level} crowd</span>
}