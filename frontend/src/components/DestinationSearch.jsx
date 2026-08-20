import React from 'react'

export default function DestinationSearch({ value, onChange }) {
  return (
    <div>
      <label htmlFor="destination-search" className="block font-semibold text-ink-900 mb-2">
        Where do you want to go?
      </label>
      <input
        id="destination-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search a place or city"
        className="hc-surface w-full rounded-xl2 border-2 border-ink-100 bg-white px-4 py-4 text-base text-ink-900 placeholder:text-ink-500/70 focus:border-teal-700 outline-none transition-colors"
      />
    </div>
  )
}