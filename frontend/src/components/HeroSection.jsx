import React from 'react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-teal-900 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #ffffff 0 3px, transparent 3px 26px)'
        }}
      />
      <div className="relative max-w-content mx-auto px-4 pt-14 pb-18 md:pt-20 md:pb-24">
        <p className="font-mono text-sm font-semibold tracking-wide text-marigold-500 mb-4">
          Live API
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] max-w-3xl">
          Accessible Journey Planner
        </h1>
        <p className="mt-5 text-lg md:text-xl text-teal-100 max-w-2xl">
          Search places, rank them by accessibility needs, and route from your real location.
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-teal-100">
          <li>Live API data</li>
          <li>Real-time location</li>
          <li>Barrier reporting</li>
        </ul>
      </div>
    </section>
  )
}