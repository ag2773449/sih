import React, { useState } from 'react'
import { BARRIER_TYPES } from '../config/accessibility.js'

const CONFIDENCE_LEVELS = ['Low', 'Medium', 'High']

export default function BarrierForm({ onSubmit, submitting }) {
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [confidence, setConfidence] = useState('High')
  const [photoName, setPhotoName] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const next = {}
    if (!location.trim()) next.location = 'Please enter or search a location.'
    if (!type) next.type = 'Please select a barrier type.'
    if (!description.trim()) next.description = 'Please describe the problem.'
    else if (description.trim().length < 10) next.description = 'Please add a little more detail (10+ characters).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      place_id: null,
      destination_name: location,
      location,
      barrier_type: type,
      description,
      confidence,
      photo_name: photoName || null
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <Field label="Location" htmlFor="barrier-location" error={errors.location}>
        <input
          id="barrier-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search or enter location..."
          className={inputClass(errors.location)}
          aria-invalid={Boolean(errors.location)}
          aria-describedby={errors.location ? 'barrier-location-error' : undefined}
        />
      </Field>

      <Field label="Barrier Type" htmlFor="barrier-type" error={errors.type}>
        <select
          id="barrier-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass(errors.type)}
          aria-invalid={Boolean(errors.type)}
          aria-describedby={errors.type ? 'barrier-type-error' : undefined}
        >
          <option value="">Select a barrier type&hellip;</option>
          {BARRIER_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label="Description" htmlFor="barrier-description" error={errors.description}>
        <textarea
          id="barrier-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the problem..."
          rows={4}
          className={inputClass(errors.description)}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'barrier-description-error' : undefined}
        />
      </Field>

      <fieldset>
        <legend className="font-semibold text-ink-900 mb-2">Confidence</legend>
        <div className="flex flex-wrap gap-4">
          {CONFIDENCE_LEVELS.map((level) => (
            <label key={level} className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="confidence"
                value={level}
                checked={confidence === level}
                onChange={() => setConfidence(level)}
                className="h-4 w-4 accent-teal-700"
              />
              <span className="text-sm font-semibold text-ink-700">{level}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Upload Photo (optional)" htmlFor="barrier-photo">
        <input
          id="barrier-photo"
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoName(e.target.files?.[0]?.name || '')}
          className="block w-full text-sm text-ink-700 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-100 file:px-4 file:py-2.5 file:font-semibold file:text-teal-900 hover:file:bg-teal-200"
        />
        {photoName && <p className="text-xs text-ink-500 mt-1.5">Selected: {photoName}</p>}
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl2 bg-marigold-600 hover:bg-marigold-700 disabled:opacity-60 text-white font-bold text-base px-7 py-4 shadow-soft transition-colors"
      >
        {submitting ? 'Submitting…' : 'Submit Report'}
      </button>
    </form>
  )
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-semibold text-ink-900 mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-clay-600 flex items-center gap-1.5">
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}
    </div>
  )
}

function inputClass(error) {
  return `hc-surface w-full rounded-lg border-2 bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-500/70 outline-none transition-colors ${
    error ? 'border-clay-600 focus:border-clay-600' : 'border-ink-100 focus:border-teal-700'
  }`
}
