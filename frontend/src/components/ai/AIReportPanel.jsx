import { useState } from 'react'
import { Bot, FileText, ArrowRight, Printer, Download } from 'lucide-react'
import InsightCard from './InsightCard'
import WeeklySummary from './WeeklySummary'
import { generateAIAnalysis, generateWeeklySummary } from '../../services/api'
import { printPage } from '../../utils/exportUtils'

const RISK_STYLES = {
  low:    { color: 'var(--success)', bg: 'var(--success-bg)', border: 'rgba(34,197,94,0.3)',   label: 'Low Risk'    },
  medium: { color: 'var(--warning)', bg: 'var(--warning-bg)', border: 'rgba(234,179,8,0.3)',   label: 'Medium Risk' },
  high:   { color: 'var(--danger)',  bg: 'var(--danger-bg)',  border: 'rgba(239,68,68,0.3)',   label: 'High Risk'   },
}

function SkeletonCard({ lines = 4, height = 16 }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="skeleton" style={{ height: 10, width: '40%', borderRadius: 4 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height, width: i === lines - 1 ? '65%' : '100%', borderRadius: 4, animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  )
}

/* Reusable visible export/action button */
function ActionBtn({ onClick, disabled, children, primary = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={primary ? 'btn-shimmer' : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '11px 20px', borderRadius: 11,
        border: primary ? 'none' : '1px solid var(--border-default)',
        background: primary ? undefined : 'var(--bg-card)',
        color: primary ? '#fff' : (disabled ? 'var(--text-muted)' : 'var(--text-secondary)'),
        fontSize: 14, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        transition: 'all 0.15s ease',
        fontFamily: 'DM Sans',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!disabled && !primary) {
          e.currentTarget.style.borderColor = 'var(--border-strong)'
          e.currentTarget.style.background = 'var(--bg-elevated)'
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !primary) {
          e.currentTarget.style.borderColor = 'var(--border-default)'
          e.currentTarget.style.background = 'var(--bg-card)'
        }
      }}
    >
      {children}
    </button>
  )
}

export default function AIReportPanel() {
  const [analysis, setAnalysis]           = useState(null)
  const [summary, setSummary]             = useState(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingSummary, setLoadingSummary]   = useState(false)
  const [error, setError]                 = useState(null)

  const handleAnalyze = async () => {
    setLoadingAnalysis(true)
    setError(null)
    try {
      setAnalysis(await generateAIAnalysis('last_7_days'))
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to generate analysis')
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const handleWeeklySummary = async () => {
    setLoadingSummary(true)
    setError(null)
    try {
      setSummary(await generateWeeklySummary())
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to generate summary')
    } finally {
      setLoadingSummary(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Action buttons row — Generate buttons + PDF export together */}
      <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <ActionBtn onClick={handleAnalyze} disabled={loadingAnalysis} primary>
          <Bot size={16} />
          {loadingAnalysis ? 'Analyzing…' : 'Generate AI Analysis'}
          {!loadingAnalysis && <ArrowRight size={14} />}
        </ActionBtn>

        <ActionBtn onClick={handleWeeklySummary} disabled={loadingSummary}>
          <FileText size={16} />
          {loadingSummary ? 'Generating…' : 'Generate Weekly Summary'}
        </ActionBtn>

        {/* PDF export — same row, same visual weight */}
        <ActionBtn onClick={printPage}>
          <Printer size={14} />
          Export PDF
        </ActionBtn>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', color: 'var(--danger)', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Analysis skeleton */}
      {loadingAnalysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SkeletonCard lines={5} height={14} />
          <SkeletonCard lines={4} height={14} />
          <SkeletonCard lines={3} height={14} />
        </div>
      )}

      {/* Analysis results */}
      {analysis && !loadingAnalysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
          {/* Overview + Risk */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bot size={14} style={{ color: 'var(--accent-light)' }} />
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: 0 }}>
                  AI Analysis
                </p>
              </div>

              {analysis.risk_level && (() => {
                const s = RISK_STYLES[analysis.risk_level] || RISK_STYLES.medium
                return (
                  <span style={{ padding: '5px 12px', borderRadius: 999, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: 12, fontWeight: 700 }}>
                    {s.label}
                  </span>
                )
              })()}
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {analysis.analysis}
            </p>
          </div>

          <InsightCard insights={analysis.key_insights} />

          {/* Recommendations */}
          {analysis.recommendations?.length > 0 && (
            <div className="card">
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                Recommendations
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)' }} />
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary skeleton */}
      {loadingSummary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SkeletonCard lines={8} height={13} />
        </div>
      )}

      {/* Weekly summary */}
      {summary && !loadingSummary && (
        <div className="animate-fade-in">
          <WeeklySummary data={summary} />
        </div>
      )}
    </div>
  )
}
