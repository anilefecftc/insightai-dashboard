import { AlertTriangle, Lightbulb } from 'lucide-react'

export default function DropOffAlert({ worstDropOff }) {
  if (!worstDropOff) return null

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderLeft: '3px solid var(--danger)',
        borderRadius: '0 12px 12px 0',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <AlertTriangle size={15} style={{ color: 'var(--danger)', flexShrink: 0 }} />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--danger)',
          }}
        >
          Critical Drop-off Detected
        </span>
      </div>

      <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: 14, fontWeight: 500 }}>
        {worstDropOff.from_stage} → {worstDropOff.to_stage}:{' '}
        <span
          style={{
            fontFamily: 'JetBrains Mono',
            color: 'var(--danger)',
            fontWeight: 700,
          }}
        >
          {worstDropOff.drop_rate.toFixed(1)}% drop-off
        </span>
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Lightbulb size={14} style={{ color: 'var(--warning)', marginTop: 2, flexShrink: 0 }} />
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
          {worstDropOff.recommendation}
        </p>
      </div>
    </div>
  )
}
