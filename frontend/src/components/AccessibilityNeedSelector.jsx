import React from 'react'
import { ACCESSIBILITY_NEEDS } from '../config/accessibility.js'

export default function AccessibilityNeedSelector({ value, onChange }) {
  return (
    <fieldset>
      <legend className="font-semibold text-ink-900 mb-3">Your Accessibility Need</legend>
      <div
        role="radiogroup"
        aria-label="Your Accessibility Need"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
      >
        {ACCESSIBILITY_NEEDS.map((need) => {
          const selected = value === need.id
          return (
            <button
              key={need.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(selected ? null : need.id)}
              className={`hc-surface rounded-xl2 border-2 px-3 py-4 text-center text-sm font-semibold transition-colors ${
                selected
                  ? 'border-teal-700 bg-teal-50 text-teal-900'
                  : 'border-ink-100 bg-white text-ink-700 hover:border-teal-600'
              }`}
            >
              {need.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}