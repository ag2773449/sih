import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import BarrierForm from '../components/BarrierForm.jsx'
import { useJourney } from '../context/JourneyContext.jsx'

export default function ReportBarrier() {
  const { addReport, lastReportId } = useJourney()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(report) {
    setSubmitting(true)
    try {
      await addReport(report)
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit barrier report:', error)
      alert('Failed to submit report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-content mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 flex items-center gap-2">
          <span aria-hidden="true">🚧</span> Report an Accessibility Barrier
        </h1>
        <p className="text-ink-500 mt-2 mb-8">
          Help other travellers by reporting temporary accessibility problems.
        </p>

        {submitted ? (
          <div className="hc-surface bg-white rounded-xl2 border border-teal-100 shadow-soft p-8 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-moss-100 text-moss-700 flex items-center justify-center text-2xl mb-4">
              <span aria-hidden="true">✓</span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink-900 mb-2">Report Submitted</h2>
            <p className="text-ink-500 mb-6">
              Thank you. Your report will be verified before affecting route recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/barrier-status"
                className="rounded-lg bg-teal-700 text-white font-semibold px-5 py-3 hover:bg-teal-900 transition-colors"
              >
                Track its status
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="rounded-lg border-2 border-ink-100 font-semibold px-5 py-3 text-ink-700 hover:border-teal-600"
              >
                Report another barrier
              </button>
            </div>
          </div>
        ) : (
          <div className="hc-surface bg-white rounded-xl2 border border-ink-100 shadow-soft p-5 sm:p-8">
            <BarrierForm onSubmit={handleSubmit} submitting={submitting} />
          </div>
        )}
      </div>
    </div>
  )
}
