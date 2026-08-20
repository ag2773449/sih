import React from 'react'
import { Link } from 'react-router-dom'
import { useWikiImage } from '../hooks/useWikiImage.js'

export default function FeaturedDestinations({ places }) {
  if (!places.length) return null

  return (
    <section aria-labelledby="featured-heading">
      <h2 id="featured-heading" className="font-display text-2xl font-semibold text-ink-900 mb-1">
        Popular Across India
      </h2>
      <p className="text-ink-500 mb-6">A glimpse of what AccessGo can help you plan for, state to state.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {places.map((place) => (
          <FeaturedCard key={place.id} place={place} />
        ))}
      </div>
    </section>
  )
}

function FeaturedCard({ place }) {
  const image = useWikiImage(place.wikiTitle || place.name, place.id)
  return (
    <Link
      to={`/route/${place.id}`}
      className="hc-surface group relative block rounded-xl2 overflow-hidden border border-ink-100 shadow-soft h-40 sm:h-48"
    >
      <img
        src={image}
        alt={`${place.name}, ${place.location}`}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent"
      />
      <span className="absolute bottom-0 left-0 right-0 p-3">
        <span className="block font-display text-sm sm:text-base font-semibold text-white leading-tight">
          {place.name}
        </span>
        <span className="block text-xs text-white/80">{place.state}</span>
      </span>
    </Link>
  )
}
