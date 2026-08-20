import React, { useEffect, useRef } from 'react'
import { useAccessibility } from '../context/AccessibilityContext.jsx'

export default function AccessibilitySettingsPanel({ open, onClose }) {
  const { textSize, setTextSize, highContrast, setHighContrast, reducedMotion, setReducedMotion } =
    useAccessibility()
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (open) closeBtnRef.current?.focus()
  }, [open])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const textSizeOptions = [
    { id: 'default', label: 'Default' },
    { id: 'large', label: 'Large' },
    { id: 'xlarge', label: 'Extra Large' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close accessibility settings"
        className="absolute inset-0 bg-ink-900/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-panel-title"
        className="relative h-full w-full max-w-sm bg-white shadow-lift p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="a11y-panel-title" className="font-display text-2xl font-semibold text-ink-900">
            Accessibility Settings
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="h-10 min-w-16 inline-flex items-center justify-center rounded-lg border-2 border-ink-100 px-3 text-sm font-semibold"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <fieldset className="mb-8">
          <legend className="font-semibold text-ink-900 mb-3">Text Size</legend>
          <div className="grid grid-cols-3 gap-2">
            {textSizeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={textSize === option.id}
                onClick={() => setTextSize(option.id)}
                className={`py-3 rounded-lg border-2 font-semibold text-sm transition-colors ${
                  textSize === option.id
                    ? 'border-teal-700 bg-teal-100 text-teal-900'
                    : 'border-ink-100 text-ink-700 hover:border-teal-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <ToggleRow
          label="High Contrast"
          description="Stronger borders and colour contrast across the app."
          checked={highContrast}
          onChange={setHighContrast}
        />
        <ToggleRow
          label="Reduced Motion"
          description="Turns off transitions and animated effects."
          checked={reducedMotion}
          onChange={setReducedMotion}
        />
      </div>
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-t border-ink-100">
      <div>
        <p className="font-semibold text-ink-900">{label}</p>
        <p className="text-sm text-ink-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`shrink-0 relative h-8 w-14 rounded-full border-2 transition-colors ${
          checked ? 'bg-teal-700 border-teal-700' : 'bg-ink-100 border-ink-100'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}