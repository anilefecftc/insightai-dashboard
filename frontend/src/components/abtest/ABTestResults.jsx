import ABTestCard from './ABTestCard'
import SignificanceBadge from './SignificanceBadge'
import { useCountUp } from '../../hooks/useCountUp'

export default function ABTestResults({ data }) {
  if (!data) return null

  const { control, variant, uplift, statistical_test: stat, test_name } = data
  const animatedUplift = useCountUp(Math.abs(uplift ?? 0), 900)
  const isPositiveUplift = uplift >= 0
  const isVariantWinner = variant.conversion_rate > control.conversion_rate

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'DM Sans',
              fontWeight: 700,
              fontSize: 20,
              color: 'var(--text-primary)',
              textTransform: 'capitalize',
            }}
          >
            {test_name.replace(/_/g, ' ')}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            Onboarding conversion experiment
          </p>
        </div>
        <SignificanceBadge
          isSignificant={stat.is_significant}
          confidenceLevel={stat.confidence_level}
        />
      </div>

      {/* Cards + VS divider */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'stretch', flexWrap: 'wrap' }}>
        <ABTestCard
          label="Control Onboarding"
          data={control}
          isVariant={false}
          isWinner={!isVariantWinner && stat.is_significant}
        />

        {/* Central uplift circle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexShrink: 0,
            padding: '0 8px',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: `2px solid ${isPositiveUplift ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
              background: isPositiveUplift ? 'var(--success-bg)' : 'var(--danger-bg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${isPositiveUplift ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono',
                fontWeight: 700,
                fontSize: 16,
                color: isPositiveUplift ? 'var(--success)' : 'var(--danger)',
                lineHeight: 1,
              }}
            >
              {isPositiveUplift ? '+' : '-'}{animatedUplift.toFixed(1)}%
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>uplift</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>VS</span>
        </div>

        <ABTestCard
          label="New Onboarding"
          data={variant}
          isVariant={true}
          isWinner={isVariantWinner && stat.is_significant}
        />
      </div>

      {/* Statistical analysis */}
      <div className="card">
        <p
          style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 20px',
          }}
        >
          Statistical Analysis
        </p>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            marginBottom: 20,
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {[
            { label: 'Method', value: 'Chi-Square' },
            { label: 'χ² Statistic', value: stat.chi2_statistic.toFixed(4) },
            { label: 'p-value', value: stat.p_value < 0.001 ? '< 0.001' : stat.p_value.toFixed(5) },
            { label: 'Confidence', value: stat.confidence_level, highlight: true },
          ].map(({ label, value, highlight }, i) => (
            <div
              key={label}
              style={{
                padding: '16px 20px',
                borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none',
                background: highlight ? 'var(--accent-glow)' : 'transparent',
              }}
            >
              <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 700,
                  fontSize: 15,
                  color: highlight ? 'var(--accent-light)' : 'var(--text-primary)',
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Interpretation blockquote */}
        <div
          style={{
            borderLeft: '3px solid var(--accent)',
            paddingLeft: 16,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7 }}>
            {stat.interpretation}
          </p>
        </div>
      </div>
    </div>
  )
}
