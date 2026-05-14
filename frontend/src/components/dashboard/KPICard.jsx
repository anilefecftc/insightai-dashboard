import { useNavigate } from 'react-router-dom'
import { ChevronRight, DollarSign, Users, UserPlus, Zap, RefreshCw, CreditCard, TrendingDown, BarChart2 } from 'lucide-react'
import { useCountUp } from '../../hooks/useCountUp'
import MetricSparkline from './MetricSparkline'
import { formatChange } from '../../utils/formatters'

/**
 * All metric configuration. `icon` is a Lucide component reference —
 * no emojis anywhere. Icons are rendered at size 16 with color var(--text-muted)
 * so they are subtle and don't compete with the value.
 */
const METRIC_CONFIG = {
  dau:             { label: 'Daily Active Users', icon: Users,        color: '#2563eb', format: (v) => Math.round(v).toLocaleString('en-US'), positive: true },
  signups:         { label: 'Daily Signups',      icon: UserPlus,     color: '#22c55e', format: (v) => Math.round(v).toLocaleString('en-US'), positive: true },
  activation_rate: { label: 'Activation Rate',   icon: Zap,          color: '#2563eb', format: (v) => `${v.toFixed(1)}%`,                    positive: true },
  retention_rate:  { label: 'Retention Rate',    icon: RefreshCw,    color: '#22c55e', format: (v) => `${v.toFixed(1)}%`,                    positive: true },
  revenue:         { label: 'Daily Revenue',     icon: DollarSign,   color: '#22c55e', format: (v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v.toFixed(0)}`, positive: true },
  conversion_rate: { label: 'Conversion Rate',   icon: CreditCard,   color: '#a855f7', format: (v) => `${v.toFixed(1)}%`,                    positive: true },
  churn_rate:      { label: 'Churn Rate',        icon: TrendingDown, color: '#ef4444', format: (v) => `${v.toFixed(2)}%`,                    positive: false },
}

export default function KPICard({ metric, value, change, large = false }) {
  const navigate = useNavigate()
  const config = METRIC_CONFIG[metric] || {
    label: metric, icon: BarChart2, color: '#2563eb',
    format: (v) => v, positive: true,
  }

  const animated = useCountUp(value ?? 0, 800)
  const displayValue = config.format(animated)

  // ── Change badge — Fix 2 & 3: uses formatChange() with ±999% cap ──────────
  // change === null means no prior period data (e.g. 90d edge-case) → show N/A
  const hasChange = change !== null && change !== undefined

  // formatChange handles: null → 'N/A', >200 → '>200%', <-200 → '<-200%'
  const changeLabel = formatChange(change)

  const isGood = hasChange
    ? (config.positive ? change >= 0 : change <= 0)
    : null

  const changeColor = !hasChange || change === 0
    ? 'var(--text-muted)'
    : isGood ? 'var(--success)' : 'var(--danger)'
  const changeBg = !hasChange || change === 0
    ? 'transparent'
    : isGood ? 'var(--success-bg)' : 'var(--danger-bg)'

  const Icon = config.icon

  return (
    <div
      className="card card-glow animate-fade-in-up"
      onClick={() => navigate(`/dashboard/${metric}`)}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: large ? 16 : 12, cursor: 'pointer' }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            {config.label}
          </span>
        </div>

        {/* Change badge — always uses formatChange (cap + N/A logic) */}
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: '3px 9px', borderRadius: 999,
          fontSize: 12, fontWeight: 600,
          color: changeColor, background: changeBg,
          fontFamily: 'JetBrains Mono',
        }}>
          {changeLabel}
        </span>
      </div>

      {/* Big number */}
      <div>
        <p style={{
          margin: 0,
          fontSize: large ? 42 : 36,
          fontWeight: 700,
          fontFamily: 'JetBrains Mono',
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          {displayValue}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
          vs previous period
        </p>
      </div>

      {/* Sparkline */}
      <div style={{ marginTop: 'auto' }}>
        <MetricSparkline metric={metric} color={config.color} />
      </div>

      {/* View details hint */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}>
          View details <ChevronRight size={11} />
        </span>
      </div>
    </div>
  )
}
