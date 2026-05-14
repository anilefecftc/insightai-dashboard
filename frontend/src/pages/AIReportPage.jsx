import { useEffect, useState } from 'react'
import { Key, CheckCircle2 } from 'lucide-react'
import AIReportPanel from '../components/ai/AIReportPanel'
import Header from '../components/layout/Header'
import { fetchAIStatus } from '../services/api'

export default function AIReportPage() {
  const [aiStatus, setAiStatus] = useState(null)

  useEffect(() => {
    fetchAIStatus()
      .then(setAiStatus)
      .catch(() => setAiStatus({ mode: 'mock', model: null }))
  }, [])

  const isLive = aiStatus?.mode === 'live'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Print-only document header */}
      <div className="print-header">
        SaaS Analytics — AI Report &middot; {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>

      <Header
        title="AI Reports"
        subtitle="GPT-4.1-mini powered KPI analysis & executive summaries"
      />

      {/* Setup / status banner */}
      <div
        className="no-print"
        style={{
          display: 'flex', alignItems: 'flex-start', gap: 14,
          padding: '14px 18px', borderRadius: 12, marginBottom: 4,
          background: isLive ? 'var(--success-bg)' : 'var(--accent-glow)',
          border: `1px solid ${isLive ? 'rgba(34,197,94,0.25)' : 'rgba(37,99,235,0.2)'}`,
        }}
      >
        <Key size={15} style={{ color: isLive ? 'var(--success)' : 'var(--accent-light)', marginTop: 2, flexShrink: 0 }} />

        <div style={{ flex: 1 }}>
          {/* Title + status dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: isLive ? 'var(--success)' : 'var(--accent-light)' }}>
              AI-Powered Analysis — {isLive ? 'GPT-4.1-mini Connected' : 'Setup Required'}
            </p>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: isLive ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: isLive ? 'var(--success)' : 'var(--warning)', boxShadow: isLive ? '0 0 6px var(--success)' : '0 0 6px var(--warning)', display: 'inline-block' }} />
              {isLive ? 'Live' : 'Mock Mode'}
            </span>
          </div>

          {isLive ? (
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>
              GPT-4.1-mini is active. Analyses and summaries are AI-generated.
            </p>
          ) : (
            <>
              <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)', fontSize: 12 }}>
                To enable real GPT-4.1-mini powered analysis, add your OpenAI API key to{' '}
                <code style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent-light)', background: 'rgba(37,99,235,0.1)', padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>
                  backend/.env
                </code>
              </p>
              {/* Copyable snippet */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--text-secondary)', userSelect: 'all' }}>
                OPENAI_API_KEY=sk-your-key-here
              </div>
              <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: 11 }}>
                Currently using <strong style={{ color: 'var(--text-secondary)' }}>smart mock analysis</strong> based on your live database metrics.
              </p>
            </>
          )}
        </div>
      </div>

      <AIReportPanel />
    </div>
  )
}
