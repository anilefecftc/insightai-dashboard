import { CheckCircle, Clock } from 'lucide-react'

export default function SignificanceBadge({ isSignificant, confidenceLevel }) {
  if (isSignificant) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 18px',
          borderRadius: 12,
          background: 'var(--success-bg)',
          border: '1px solid rgba(34,197,94,0.3)',
          animation: 'fadeInUp 0.4s ease forwards',
        }}
      >
        <CheckCircle size={16} style={{ color: 'var(--success)' }} />
        <div>
          <p style={{ margin: 0, color: 'var(--success)', fontWeight: 700, fontSize: 14 }}>
            Statistically Significant
          </p>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>
            {confidenceLevel} Confidence
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        borderRadius: 12,
        background: 'var(--warning-bg)',
        border: '1px solid rgba(234,179,8,0.3)',
      }}
    >
      <Clock size={16} style={{ color: 'var(--warning)' }} />
      <div>
        <p style={{ margin: 0, color: 'var(--warning)', fontWeight: 700, fontSize: 14 }}>
          Not Yet Significant
        </p>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>
          Collect more data
        </p>
      </div>
    </div>
  )
}
