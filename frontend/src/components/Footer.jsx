import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white mt-16">
      <div className="max-w-content mx-auto px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-teal-900">
          <span aria-hidden="true" className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white text-xs font-bold">
            AG
          </span>
          AccessGo
        </div>
        <p className="text-sm text-ink-500 max-w-md">
          Frontend views read from the FastAPI backend. User coordinates come from the browser Geolocation API and are resolved by the backend location route.
        </p>
      </div>
    </footer>
  )
}