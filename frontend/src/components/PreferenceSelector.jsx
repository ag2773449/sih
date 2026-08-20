import React from 'react'
import { PREFERENCES } from '../config/accessibility.js'

export default function PreferenceSelector({ value, onToggle }) {
  return (
    <fieldset>
      <legend className="font-semibold text-ink-900 mb-3">Preferences</legend>
      <div className="flex flex-wrap gap-2">
        {PREFERENCES.map((preference) => {
          const checked = Boolean(value[preference.id])
          return (
            <label
              key={preference.id}
              className={`hc-surface inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 cursor-pointer select-none transition-colors ${
                checked
                  ? 'border-teal-700 bg-teal-100 text-teal-900'
                  : 'border-ink-100 bg-white text-ink-700 hover:border-teal-600'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(preference.id)}
                className="h-4 w-4 accent-teal-700"
              />
              <span className="text-sm font-semibold">{preference.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}