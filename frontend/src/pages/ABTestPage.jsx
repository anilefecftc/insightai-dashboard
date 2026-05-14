import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { fetchABTestResults } from '../services/api'
import ABTestResults from '../components/abtest/ABTestResults'
import Header from '../components/layout/Header'
import { exportToCSV } from '../utils/exportUtils'

function ABSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 20 }}>
        <div className="skeleton" style={{ flex: 1, height: 280, borderRadius: 16 }} />
        <div className="skeleton" style={{ width: 80, height: 280, borderRadius: 40 }} />
        <div className="skeleton" style={{ flex: 1, height: 280, borderRadius: 16 }} />
      </div>
      <div className="skeleton" style={{ height: 180, borderRadius: 16 }} />
    </div>
  )
}

export default function ABTestPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchABTestResults('new_onboarding')
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
        title="A/B Testing"
        subtitle="New onboarding flow experiment — chi-square analysis"
        onRefresh={load}
        loading={loading}
      >
        <button
          onClick={() => {
            if (!data) return
            exportToCSV([
              { group: 'control', ...data.control },
              { group: 'variant', ...data.variant },
              { group: 'summary', uplift: data.uplift, p_value: data.statistical_test.p_value, significant: data.statistical_test.is_significant },
            ], 'abtest_results')
          }}
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

      {loading && !data ? <ABSkeleton /> : data ? <ABTestResults data={data} /> : null}
    </div>
  )
}
