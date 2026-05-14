/**
 * Custom hook for fetching KPI summary and trend data.
 *
 * Supports both rolling `days` periods and custom `startDate`/`endDate` ranges.
 * Exposes `lastUpdated` so the Dashboard header can show "Last updated: HH:MM AM/PM".
 */

import { useState, useEffect, useCallback } from 'react'
import { fetchKPISummary, fetchKPITrends } from '../services/api'

export function useKPIData(days = 7, startDate = null, endDate = null) {
  const [summary, setSummary]         = useState(null)
  const [trends, setTrends]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, t] = await Promise.all([
        fetchKPISummary(days, startDate, endDate),
        fetchKPITrends(days, startDate, endDate),
      ])
      setSummary(s)
      setTrends(t)
      setLastUpdated(new Date())
    } catch (err) {
      setError(
        err?.response?.data?.detail || err.message || 'Failed to load KPI data'
      )
    } finally {
      setLoading(false)
    }
  }, [days, startDate, endDate])

  useEffect(() => {
    load()
  }, [load])

  return { summary, trends, loading, error, refresh: load, lastUpdated }
}
