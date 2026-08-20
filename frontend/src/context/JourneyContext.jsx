import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getBarrierReports, submitBarrierReport as apiSubmitBarrierReport } from '../services/api.js'

const JourneyContext = createContext(null)

const DEFAULT_PREFERENCES = {
  wheelchair: false,
  toilet: false,
  lowStairs: false,
  lessCrowded: false,
  lift: false,
  assistance: false
}

export function JourneyProvider({ children }) {
  const [query, setQuery] = useState('')
  const [need, setNeed] = useState(null)
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [lastReportId, setLastReportId] = useState(null)
  const [reports, setReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportsError, setReportsError] = useState(null)

  const refreshReports = useCallback(async () => {
    setReportsLoading(true)
    setReportsError(null)
    try {
      const latest = await getBarrierReports()
      setReports(latest)
    } catch (error) {
      setReportsError(error.message || 'Unable to load barrier reports')
    } finally {
      setReportsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshReports()
  }, [refreshReports])

  const togglePreference = useCallback((id) => {
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const addReport = useCallback(async (report) => {
    try {
      const saved = await apiSubmitBarrierReport(report)
      setReports((prev) => [saved, ...prev.filter((item) => item.id !== saved.id)])
      setLastReportId(saved.id)
      return saved
    } catch (error) {
      console.error('Failed to add report:', error)
      throw error
    }
  }, [])

  const value = useMemo(
    () => ({
      query,
      setQuery,
      need,
      setNeed,
      preferences,
      togglePreference,
      setPreferences,
      reports,
      reportsLoading,
      reportsError,
      refreshReports,
      addReport,
      lastReportId
    }),
    [query, need, preferences, reports, reportsLoading, reportsError, refreshReports, addReport, lastReportId]
  )

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider')
  return ctx
}