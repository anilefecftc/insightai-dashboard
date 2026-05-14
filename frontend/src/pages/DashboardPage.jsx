import { useState, useRef, useEffect } from 'react'
import { Calendar, Download } from 'lucide-react'
import { useKPIData } from '../hooks/useKPIData'
import KPIGrid from '../components/dashboard/KPIGrid'
import TrendChart from '../components/dashboard/TrendChart'
import Header from '../components/layout/Header'
import { exportToCSV } from '../utils/exportUtils'
import { formatDate } from '../utils/formatters'

const DAY_OPTIONS = [7, 14, 30, 60, 90]

function isoDate(d) {
  return d.toISOString().split('T')[0]
}

function KPISkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <div className="skeleton" style={{ gridColumn: 'span 2', height: 200, borderRadius: 16 }} />
      <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
      ))}
      <div className="skeleton" style={{ gridColumn: 'span 2', height: 160, borderRadius: 16 }} />
      <div className="skeleton" style={{ height: 160, borderRadius: 16 }} />
    </div>
  )
}

export default function DashboardPage() {
  const [days, setDays]           = useState(7)
  const [customMode, setCustomMode] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [fromDate, setFromDate]   = useState(isoDate(new Date(Date.now() - 29 * 86400000)))
  const [toDate, setToDate]       = useState(isoDate(new Date()))
  const [appliedFrom, setAppliedFrom] = useState(null)
  const [appliedTo, setAppliedTo]     = useState(null)
  const pickerRef = useRef(null)

  const { summary, trends, loading, error, refresh, lastUpdated } = useKPIData(
    days,
    customMode ? appliedFrom : null,
    customMode ? appliedTo : null,
  )

  // Close picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function applyCustomRange() {
    setAppliedFrom(fromDate)
    setAppliedTo(toDate)
    setCustomMode(true)
    setShowPicker(false)
  }

  function selectPreset(d) {
    setDays(d)
    setCustomMode(false)
    setShowPicker(false)
  }

  function handleExport() {
    if (!trends.length) return
    exportToCSV(trends, `kpi_dashboard_${customMode ? `${appliedFrom}_${appliedTo}` : `${days}d`}`)
  }

  const customLabel = customMode && appliedFrom && appliedTo
    ? `${formatDate(appliedFrom)} — ${formatDate(appliedTo)}`
    : 'Custom'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Header
        title="KPI Dashboard"
        subtitle="Real-time SaaS metrics overview"
        onRefresh={refresh}
        loading={loading}
        lastUpdated={lastUpdated}
      >
        {/* Period selector */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {DAY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => selectPreset(d)}
              style={{
                padding: '6px 12px', borderRadius: 8,
                border: `1px solid ${!customMode && days === d ? 'var(--accent)' : 'var(--border-subtle)'}`,
                background: !customMode && days === d ? 'var(--accent-glow)' : 'transparent',
                color: !customMode && days === d ? 'var(--accent-light)' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s ease', fontFamily: 'JetBrains Mono',
              }}
            >
              {d}d
            </button>
          ))}

          {/* Custom date range picker */}
          <div ref={pickerRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowPicker((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 8,
                border: `1px solid ${customMode ? 'var(--accent)' : 'var(--border-subtle)'}`,
                background: customMode ? 'var(--accent-glow)' : 'transparent',
                color: customMode ? 'var(--accent-light)' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s ease', fontFamily: 'DM Sans',
                whiteSpace: 'nowrap',
              }}
            >
              <Calendar size={12} />
              {customLabel}
            </button>

            {showPicker && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                borderRadius: 12, padding: 16, minWidth: 260,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <p style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Custom Range
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'From', value: fromDate, onChange: setFromDate, max: toDate },
                    { label: 'To',   value: toDate,   onChange: setToDate,   min: fromDate, max: isoDate(new Date()) },
                  ].map(({ label, value, onChange, min, max }) => (
                    <label key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
                      <input
                        type="date"
                        value={value}
                        min={min}
                        max={max}
                        onChange={(e) => onChange(e.target.value)}
                        style={{
                          padding: '7px 10px', borderRadius: 8,
                          border: '1px solid var(--border-default)',
                          background: 'var(--bg-elevated)',
                          color: 'var(--text-primary)',
                          fontSize: 13, fontFamily: 'JetBrains Mono',
                          outline: 'none', width: '100%',
                        }}
                      />
                    </label>
                  ))}
                </div>
                <button
                  onClick={applyCustomRange}
                  disabled={!fromDate || !toDate || fromDate > toDate}
                  style={{
                    marginTop: 14, width: '100%',
                    padding: '8px 0', borderRadius: 8,
                    border: 'none', background: 'var(--accent)',
                    color: '#fff', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'DM Sans',
                    opacity: (!fromDate || !toDate || fromDate > toDate) ? 0.5 : 1,
                  }}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* CSV Export */}
          <button
            onClick={handleExport}
            disabled={!trends.length}
            title="Export CSV"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 13px', borderRadius: 8,
              border: '1px solid var(--border-default)',
              background: 'var(--bg-card)', color: 'var(--text-secondary)',
              fontSize: 12, fontWeight: 600, cursor: trends.length ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease', fontFamily: 'DM Sans',
              opacity: trends.length ? 1 : 0.4,
            }}
            onMouseEnter={(e) => trends.length && (e.currentTarget.style.background = 'var(--bg-elevated)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </Header>

      {error && (
        <div style={{
          background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12, padding: '12px 16px', color: '#fca5a5',
          fontSize: 13, marginBottom: 8,
        }}>
          <strong>Connection Error:</strong> {error}. Make sure the backend is running at{' '}
          <code style={{ fontFamily: 'JetBrains Mono', color: '#fca5a5' }}>http://localhost:8000</code>
        </div>
      )}

      {loading && !summary ? <KPISkeleton /> : <KPIGrid summary={summary} />}

      {trends.length > 0 && <TrendChart data={trends} />}
    </div>
  )
}
