import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import AccessibilitySettingsPanel from './AccessibilitySettingsPanel.jsx'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/report-barrier', label: 'Report Barrier' },
  { to: '/barrier-status', label: 'Barrier Status' }
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-[15px] font-semibold transition-colors ${
      isActive ? 'bg-teal-100 text-teal-900' : 'text-ink-700 hover:bg-teal-50 hover:text-teal-900'
    }`

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ink-100">
      <div className="max-w-content mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-teal-900">
            <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white text-sm font-bold">
              AG
            </span>
            AccessGo
          </NavLink>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="px-4 py-2 rounded-lg border-2 border-ink-100 hc-strong-border font-semibold text-sm text-ink-700 hover:border-teal-600 hover:text-teal-900 transition-colors"
            >
              Accessibility Settings
            </button>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-11 min-w-20 rounded-lg border-2 border-ink-100 hc-strong-border px-3 text-sm font-semibold"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Mobile" className="md:hidden border-t border-ink-100 bg-white">
          <div className="max-w-content mx-auto px-4 py-3 flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                setSettingsOpen(true)
                setMenuOpen(false)
              }}
              className="mt-1 px-3 py-2 rounded-lg border-2 border-ink-100 font-semibold text-sm text-ink-700 text-left"
            >
              Accessibility Settings
            </button>
          </div>
        </nav>
      )}

      <AccessibilitySettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  )
}