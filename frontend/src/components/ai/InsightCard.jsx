import { Sparkles } from 'lucide-react'

export default function InsightCard({ insights }) {
  if (!insights?.length) return null

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        <Sparkles size={14} style={{ color: 'var(--accent-light)' }} />
        <p
          style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.05em', color: 'var(--text-muted)', margin: 0,
          }}
        >
          Key Insights
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {insights.map((insight, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontWeight: 700,
                fontSize: 13,
                color: 'var(--accent-light)',
                flexShrink: 0,
                minWidth: 20,
                lineHeight: 1.5,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
              {insight}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
