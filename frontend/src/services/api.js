/**
 * Centralized Axios instance and API helper functions.
 * All backend calls go through this module.
 */

import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── KPI ─────────────────────────────────────────────────────────────────────

/**
 * Fetch KPI summary.
 * Pass `days` for a rolling window, or `startDate`/`endDate` for a custom range.
 */
export const fetchKPISummary = (days = 7, startDate = null, endDate = null) => {
  const params = startDate && endDate
    ? { start_date: startDate, end_date: endDate }
    : { days }
  return api.get('/api/kpi/summary', { params }).then((r) => r.data)
}

export const fetchKPITrends = (days = 30, startDate = null, endDate = null) => {
  const params = startDate && endDate
    ? { start_date: startDate, end_date: endDate }
    : { days }
  return api.get('/api/kpi/trends', { params }).then((r) => r.data)
}

export const fetchSparkline = (metric, days = 14) =>
  api.get('/api/kpi/sparkline', { params: { metric, days } }).then((r) => r.data)

/** Fetch detailed stats for a single metric (used by MetricDetailPage). */
export const fetchMetricDetail = (metric, days = 90) =>
  api.get('/api/kpi/detail', { params: { metric, days } }).then((r) => r.data)

// ─── Funnel ──────────────────────────────────────────────────────────────────

export const fetchFunnelData = (startDate, endDate) => {
  const params = {}
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate
  return api.get('/api/funnel/data', { params }).then((r) => r.data)
}

// ─── A/B Test ─────────────────────────────────────────────────────────────────

export const fetchABTestResults = (testName = 'new_onboarding') =>
  api.get('/api/abtest/results', { params: { test_name: testName } }).then((r) => r.data)

// ─── AI Report ───────────────────────────────────────────────────────────────

export const fetchAIStatus = () =>
  api.get('/api/ai/status').then((r) => r.data)

export const generateAIAnalysis = (period = 'last_7_days') =>
  api.post('/api/ai/analyze', { period }).then((r) => r.data)

export const generateWeeklySummary = () =>
  api.post('/api/ai/weekly-summary').then((r) => r.data)

export default api
