import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/HeroSection.jsx'
import DestinationSearch from '../components/DestinationSearch.jsx'
import AccessibilityNeedSelector from '../components/AccessibilityNeedSelector.jsx'
import PreferenceSelector from '../components/PreferenceSelector.jsx'
import FeaturedDestinations from '../components/FeaturedDestinations.jsx'
import { useJourney } from '../context/JourneyContext.jsx'
import { getPlaces } from '../services/api.js'

export default function Home() {
  const navigate = useNavigate()
  const { query, setQuery, need, setNeed, preferences, togglePreference } = useJourney()
  const [featuredPlaces, setFeaturedPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    getPlaces()
      .then((places) => {
        if (!active) return
        setFeaturedPlaces(places.slice(0, 6))
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setFeaturedPlaces([])
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/explore')
  }

  return (
    <div>
      <HeroSection />

      <section className="max-w-content mx-auto px-4 -mt-10 md:-mt-14 pb-16 relative">
        <form
          onSubmit={handleSubmit}
          className="hc-surface bg-white rounded-xl2 border border-ink-100 shadow-lift p-5 sm:p-8 flex flex-col gap-8"
        >
          <DestinationSearch value={query} onChange={setQuery} />
          <AccessibilityNeedSelector value={need} onChange={setNeed} />
          <PreferenceSelector value={preferences} onToggle={togglePreference} />

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2 border-t border-ink-100">
            <p className="text-sm text-ink-500 flex-1">
              We&rsquo;ll match destinations to your needs and preferences, and flag any
              recently reported barriers along the way.
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl2 bg-marigold-600 hover:bg-marigold-700 text-white font-bold text-base px-7 py-4 shadow-soft transition-colors"
            >
              Find Accessible Journey
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>

      <section className="max-w-content mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4" aria-live="polite" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 sm:h-48 rounded-xl2 bg-ink-100/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <FeaturedDestinations places={featuredPlaces} />
        )}
      </section>

      <section className="max-w-content mx-auto px-4 pb-20">
        <h2 className="font-display text-2xl font-semibold text-ink-900 mb-6">Why AccessGo</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          <InfoCard
            icon="🛰️"
            title="Real conditions, not guesses"
            body="Accessibility scores factor in crowd levels, weather and temporary barriers reported by travellers."
          />
          <InfoCard
            icon="🚧"
            title="Community-verified barriers"
            body="Anyone can report a blocked ramp or broken lift. Verified reports update routes for everyone."
          />
          <InfoCard
            icon="🗺️"
            title="Routes explain themselves"
            body="Every recommended route shows exactly why it was chosen and what to watch out for."
          />
        </div>
      </section>
    </div>
  )
}

function InfoCard({ icon, title, body }) {
  return (
    <div className="hc-surface bg-white rounded-xl2 border border-ink-100 shadow-soft p-6">
      <span aria-hidden="true" className="text-2xl">{icon}</span>
      <h3 className="font-display text-lg font-semibold text-ink-900 mt-3 mb-1.5">{title}</h3>
      <p className="text-sm text-ink-500 leading-relaxed">{body}</p>
    </div>
  )
}
