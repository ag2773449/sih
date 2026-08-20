import React from 'react'

const STATUS_STYLES = {
  Pending: 'bg-ink-100 text-ink-700',
  'Under Verification': 'bg-marigold-100 text-marigold-700',
  Verified: 'bg-teal-100 text-teal-900',
  Resolved: 'bg-moss-100 text-moss-700'
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending
  return <span className={`hc-surface inline-flex rounded-full px-3 py-1.5 text-sm font-bold ${style}`}>{status}</span>
}