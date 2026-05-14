/**
 * Centralized Axios instance and API helper functions.
 * All backend calls go through this module.
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.PROD
  ? 'https://insightai-backend-gxny.onrender.com/api'
  : 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
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
  return api.get('/kpi/summary', { params }).then((r) => r.data)
}

export const fetchKPITrends = (days = 30, startDate = null, endDate = null) => {
  const params = startDate && endDate
    ? { start_date: startDate, end_date: endDate }
    : { days }
  return api.get('/kpi/trends', { params }).then((r) => r.data)
}

export const fetchSparkline = (metric, days = 14) =>
  api.get('/kpi/sparkline', { params: { metric, days } }).then((r) => r.data)

/** Fetch detailed stats for a single metric (used by MetricDetailPage). */
export const fetchMetricDetail = (metric, days = 90) =>
  api.get('/kpi/detail', { params: { metric, days } }).then((r) => r.data)

// ─── Funnel ──────────────────────────────────────────────────────────────────

export const fetchFunnelData = (startDate, endDate) => {
  const params = {}
  if (startDate) params.start_date = startDate
  if (endDate) params.end_date = endDate
  return api.get('/funnel/data', { params }).then((r) => r.data)
}

// ─── A/B Test ─────────────────────────────────────────────────────────────────

export const fetchABTestResults = (testName = 'new_onboarding') =>
  api.get('/abtest/results', { params: { test_name: testName } }).then((r) => r.data)

// ─── AI Report ───────────────────────────────────────────────────────────────

export const fetchAIStatus = () =>
  api.get('/ai/status').then((r) => r.data)

export const generateAIAnalysis = (period = 'last_7_days') =>
  api.post('/ai/analyze', { period }).then((r) => r.data)

export const generateWeeklySummary = () =>
  api.post('/ai/weekly-summary').then((r) => r.data)

export default api
