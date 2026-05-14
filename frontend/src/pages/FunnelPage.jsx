import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { fetchFunnelData } from '../services/api'
import FunnelChart from '../components/funnel/FunnelChart'
import DropOffAlert from '../components/funnel/DropOffAlert'
import Header from '../components/layout/Header'
import { exportToCSV } from '../utils/exportUtils'

function FunnelSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="skeleton" style={{ height: 260, borderRadius: 16 }} />
      <div className="skeleton" style={{ height: 100, borderRadius: 12 }} />
      <div className="skeleton" style={{ height: 160, borderRadius: 16 }} />
    </div>
  )
}

export default function FunnelPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFunnelData()
      setData(result)
    } catch (err) {
      setError(err?.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Header
        title="Funnel Analysis"
        subtitle="Signup → Activation → Retention → Payment"
        onRefresh={load}
        loading={loading}
      >
        <button
          onClick={() => data && exportToCSV([
            ...data.stages.map(s => ({ type: 'stage', ...s })),
            ...data.drop_offs.map(d => ({ type: 'dropoff', ...d })),
          ], 'funnel_analysis')}
          disabled={!data}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 13px', borderRadius: 8,
            border: '1px solid var(--border-default)', background: 'var(--bg-card)',
            color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600,
            cursor: data ? 'pointer' : 'not-allowed', fontFamily: 'DM Sans',
            opacity: data ? 1 : 0.4, transition: 'all 0.15s ease',
          }}
        >
          <Download size={13} /> Export CSV
        </button>
      </Header>

      {error && (
        <div
          style={{
            background: 'var(--danger-bg)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            color: '#fca5a5',
            fontSize: 13,
            marginBottom: 8,
          }}
        >
          {error}
        </div>
      )}

      {loading && !data ? (
        <FunnelSkeleton />
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
          <FunnelChart stages={data.stages} dropOffs={data.drop_offs} />
          <DropOffAlert worstDropOff={data.worst_drop_off} />

          {/* Drop-off breakdown bar chart */}
          <div className="card">
            <p
              style={{
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 20px',
              }}
            >
              Stage-by-Stage Drop-off Breakdown
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {data.drop_offs.map((d, idx) => (
                <div key={`${d.from_stage}-${d.to_stage}`}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {d.from_stage} → {d.to_stage}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {d.lost.toLocaleString('en-US')} users lost
                      </span>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono',
                          color: 'var(--danger)',
                          fontWeight: 700,
                          fontSize: 14,
                          minWidth: 60,
                          textAlign: 'right',
                        }}
                      >
                        -{d.drop_rate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div
                    style={{
                      width: '100%',
                      height: 6,
                      background: 'var(--border-subtle)',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(d.drop_rate, 100)}%`,
                        height: '100%',
                        borderRadius: 3,
                        background: `linear-gradient(90deg, var(--danger), rgba(239,68,68,0.5))`,
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
