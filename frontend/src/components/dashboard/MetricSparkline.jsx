import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import { fetchSparkline } from '../../services/api'

export default function MetricSparkline({ metric, color = '#2563eb', days = 14 }) {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchSparkline(metric, days)
      .then(setData)
      .catch(() => setData([]))
  }, [metric, days])

  if (data.length === 0) return <div style={{ height: 60 }} />

  const gradientId = `sg-${metric}`

  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        {/* SVG defs must be written as JSX inside the chart */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          isAnimationActive={true}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
