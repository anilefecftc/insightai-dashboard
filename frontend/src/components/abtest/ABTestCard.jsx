import { Users, Target, Percent } from 'lucide-react'
import { useCountUp } from '../../hooks/useCountUp'

export default function ABTestCard({ label, data, isVariant, isWinner }) {
  if (!data) return null

  const animatedRate = useCountUp(data.conversion_rate ?? 0, 900)
  const animatedUsers = useCountUp(data.users ?? 0, 700)
  const animatedConversions = useCountUp(data.conversions ?? 0, 700)

  const borderStyle = isWinner
    ? '1px solid rgba(34,197,94,0.4)'
    : '1px solid var(--border-subtle)'
  const shadowStyle = isWinner
    ? '0 0 24px rgba(34,197,94,0.1)'
    : 'none'

  return (
    <div
      className="card"
      style={{
        flex: 1,
        border: borderStyle,
        boxShadow: shadowStyle,
        position: 'relative',
      }}
    >
      {isWinner && (
        <div
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            padding: '3px 10px',
            borderRadius: 999,
            background: 'var(--success-bg)',
            border: '1px solid rgba(34,197,94,0.3)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--success)',
          }}
        >
          WINNER
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 4px',
          }}
        >
          {isVariant ? 'Variant B' : 'Control A'}
        </p>
        <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 600, fontSize: 16 }}>
          {label}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StatRow icon={<Users size={14} />} label="Sample Size" value={Math.round(animatedUsers).toLocaleString('en-US')} />
        <StatRow icon={<Target size={14} />} label="Conversions" value={Math.round(animatedConversions).toLocaleString('en-US')} />

        {/* Big conversion rate */}
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px' }}>Conversion Rate</p>
          <p
            style={{
              fontFamily: 'JetBrains Mono',
              fontWeight: 700,
              fontSize: 42,
              color: isVariant ? 'var(--success)' : 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {animatedRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          marginTop: 20,
          width: '100%',
          height: 4,
          background: 'var(--border-subtle)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(data.conversion_rate * 3, 100)}%`,
            height: '100%',
            borderRadius: 2,
            background: isVariant
              ? 'linear-gradient(90deg, #22c55e, #86efac)'
              : 'linear-gradient(90deg, #52525b, #71717a)',
            transition: 'width 1s ease',
          }}
        />
      </div>
    </div>
  )
}

function StatRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{label}</p>
        <p
          style={{
            margin: 0,
            fontFamily: 'JetBrains Mono',
            fontWeight: 600,
            fontSize: 15,
            color: 'var(--text-primary)',
          }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
