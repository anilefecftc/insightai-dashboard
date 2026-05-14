import { useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { formatDate } from '../../utils/formatters'

const LINES = [
  { key: 'dau',             label: 'DAU',          color: '#2563eb' },
  { key: 'signups',         label: 'Signups',      color: '#22c55e' },
  { key: 'activation_rate', label: 'Activation %', color: '#eab308' },
  { key: 'revenue',         label: 'Revenue $',    color: '#a855f7' },
  { key: 'churn_rate',      label: 'Churn %',      color: '#ef4444' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        fontFamily: 'DM Sans',
      }}
    >
      <p style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, margin: '0 0 8px' }}>
        {formatDate(label)}
      </p>
      {payload.map((p) => (
        <p
          key={p.dataKey}
          style={{
            color: p.color,
            fontSize: 13,
            fontWeight: 600,
            margin: '2px 0',
            fontFamily: 'JetBrains Mono',
          }}
        >
          {p.name}: {typeof p.value === 'number'
            ? p.value.toLocaleString('en-US', { maximumFractionDigits: 2 })
            : p.value}
        </p>
      ))}
    </div>
  )
}

export default function TrendChart({ data }) {
  const [activeLines, setActiveLines] = useState(['dau', 'signups', 'revenue'])

  const toggle = (key) =>
    setActiveLines((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )

  return (
    <div className="card" style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            margin: 0,
          }}
        >
          Metric Trends
        </p>

        {/* Toggle buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {LINES.map(({ key, label, color }) => {
            const active = activeLines.includes(key)
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 999,
                  border: `1px solid ${active ? color + '66' : 'var(--border-subtle)'}`,
                  background: active ? color + '1a' : 'transparent',
                  color: active ? color : 'var(--text-muted)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'DM Sans',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
          {LINES.filter((l) => activeLines.includes(l.key)).map(({ key, label, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={label}
              stroke={color}
              strokeWidth={2.5}
              strokeLinecap="round"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0, fill: color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
