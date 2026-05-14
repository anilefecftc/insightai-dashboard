import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ArrowLeft, DollarSign, Users, UserPlus, Zap, RefreshCw, CreditCard, TrendingDown, BarChart2 } from 'lucide-react'
import { fetchMetricDetail } from '../services/api'
import { formatDate } from '../utils/formatters'

const METRIC_META = {
  dau:             { label: 'Daily Active Users', icon: Users,        unit: '',  format: (v) => Math.round(v).toLocaleString('en-US'), color: '#2563eb' },
  signups:         { label: 'Daily Signups',      icon: UserPlus,     unit: '',  format: (v) => Math.round(v).toLocaleString('en-US'), color: '#22c55e' },
  activation_rate: { label: 'Activation Rate',   icon: Zap,          unit: '%', format: (v) => `${(+v).toFixed(2)}%`,                 color: '#3b82f6' },
  retention_rate:  { label: 'Retention Rate',    icon: RefreshCw,    unit: '%', format: (v) => `${(+v).toFixed(2)}%`,                 color: '#22c55e' },
  revenue:         { label: 'Daily Revenue',     icon: DollarSign,   unit: '$', format: (v) => `$${(+v).toFixed(2)}`,                 color: '#a855f7' },
  conversion_rate: { label: 'Conversion Rate',   icon: CreditCard,   unit: '%', format: (v) => `${(+v).toFixed(2)}%`,                 color: '#a855f7' },
  churn_rate:      { label: 'Churn Rate',        icon: TrendingDown, unit: '%', format: (v) => `${(+v).toFixed(3)}%`,                 color: '#ef4444' },
}

function StatCell({ label, value }) {
  return (
    <div style={{
      padding: '16px 20px',
      borderRight: '1px solid var(--border-subtle)',
      flex: 1,
    }}>
      <p style={{ margin: '0 0 6px', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  )
}

function CustomTooltip({ active, payload, label, fmt }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
      borderRadius: 10, padding: '10px 14px',
    }}>
      <p style={{ margin: '0 0 4px', fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(label)}</p>
      <p style={{ margin: 0, fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
        {fmt(payload[0].value)}
      </p>
    </div>
  )
}

export default function MetricDetailPage() {
  const { metric } = useParams()
  const navigate   = useNavigate()
  const meta       = METRIC_META[metric]

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchMetricDetail(metric, 90)
      .then((d) => { setData(d); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [metric])

  if (!meta) {
    return (
      <div style={{ padding: 32, color: 'var(--text-muted)' }}>
        Unknown metric: <code>{metric}</code>.{' '}
        <button onClick={() => navigate('/')} style={{ color: 'var(--accent-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Back button + header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 9,
            border: '1px solid var(--border-default)', background: 'var(--bg-card)',
            color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'DM Sans', flexShrink: 0,
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {(() => { const MetricIcon = meta.icon; return <MetricIcon size={22} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> })()}
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'DM Sans' }}>
              {meta.label}
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            Last 90 days — daily breakdown
          </p>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton" style={{ height: 60, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 320, borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 80, borderRadius: 12 }} />
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', color: '#fca5a5', fontSize: 13 }}>
          Error loading metric data: {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Current value */}
          <div className="card">
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Current Value
            </p>
            <p style={{ margin: 0, fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 52, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {meta.format(data.current_value)}
            </p>
          </div>

          {/* Full 90-day chart */}
          <div className="card">
            <p style={{ margin: '0 0 20px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              90-Day History
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.values} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => formatDate(d)}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Sans' }}
                  interval={Math.floor(data.values.length / 8)}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                  tickFormatter={(v) => meta.unit === '$' ? `$${(+v).toFixed(0)}` : (meta.unit === '%' ? `${(+v).toFixed(1)}%` : Math.round(+v).toLocaleString('en-US'))}
                />
                <Tooltip content={<CustomTooltip fmt={meta.format} />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={meta.color}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: meta.color, stroke: 'var(--bg-card)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats summary */}
          <div className="card" style={{ padding: 0 }}>
            <p style={{ margin: 0, padding: '16px 20px 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Summary Statistics
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', marginTop: 12 }}>
              <StatCell label="7-Day Avg"  value={meta.format(data.stats.avg_7d)} />
              <StatCell label="30-Day Avg" value={meta.format(data.stats.avg_30d)} />
              <StatCell label="90-Day Avg" value={meta.format(data.stats.avg_90d)} />
              <StatCell label="Std Dev"    value={meta.format(data.stats.std_dev)} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)' }}>
              <StatCell label={`Min (${formatDate(data.stats.min.date)})`} value={meta.format(data.stats.min.value)} />
              <StatCell label={`Max (${formatDate(data.stats.max.date)})`} value={meta.format(data.stats.max.value)} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
