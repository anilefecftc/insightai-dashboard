import { RefreshCw, Clock } from 'lucide-react'

function formatTime(date) {
  if (!date) return null
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export default function Header({ title, subtitle, onRefresh, loading, lastUpdated, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            fontFamily: 'DM Sans',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {children}

        {/* Last updated timestamp */}
        {lastUpdated && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: 'var(--text-muted)', fontSize: 12, fontFamily: 'DM Sans',
          }}>
            <Clock size={12} />
            <span>{loading ? 'Updating…' : `Last updated: ${formatTime(lastUpdated)}`}</span>
          </div>
        )}

        {onRefresh && (
          <button
            className="no-print"
            onClick={onRefresh}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 9,
              border: '1px solid var(--border-default)',
              background: 'var(--bg-card)',
              color: loading ? 'var(--text-muted)' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease', fontFamily: 'DM Sans',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.borderColor = 'var(--border-strong)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.borderColor = 'var(--border-default)')}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        )}
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
