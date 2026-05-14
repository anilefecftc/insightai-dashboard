/* Vertical funnel — each stage is a full-width bar that gets progressively
   narrower, creating a natural top-to-bottom funnel shape.
   All text inside bars is hardcoded #ffffff so it works in both themes. */

const STAGE_COLORS = ['#2563eb', '#7c3aed', '#ea580c', '#e11d48']

export default function FunnelChart({ stages, dropOffs }) {
  if (!stages?.length) return null
  const maxCount = stages[0].count

  return (
    <div className="card">
      <p style={{
        fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 28px',
      }}>
        Conversion Funnel
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {stages.map((stage, idx) => {
          const widthPct = (stage.count / maxCount) * 100
          const color    = STAGE_COLORS[idx]
          const dropOff  = dropOffs?.[idx]
          const isLast   = idx === stages.length - 1

          return (
            <div key={stage.name}>
              {/* ── Stage bar row ─────────────────────────────── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Bar — width proportional to count */}
                <div
                  style={{
                    width: `${widthPct}%`,
                    minWidth: 140,
                    backgroundColor: color,
                    borderRadius: 8,
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    /* Width entrance animation */
                    animation: `barGrow 0.7s cubic-bezier(0.4,0,0.2,1) ${idx * 150}ms both`,
                    transition: 'box-shadow 0.2s ease',
                    boxShadow: `0 2px 10px ${color}44`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 4px 20px ${color}77`)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 2px 10px ${color}44`)}
                >
                  {/* Count — left side */}
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#ffffff',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}>
                    {stage.count.toLocaleString('en-US')}
                  </span>

                  {/* Stage name — right side */}
                  <span style={{
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    flexShrink: 0,
                    opacity: 0.92,
                  }}>
                    {stage.name}
                  </span>
                </div>

                {/* Percentage — outside bar, uses theme color */}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  minWidth: 52,
                  flexShrink: 0,
                }}>
                  {stage.percentage.toFixed(1)}%
                </span>
              </div>

              {/* ── Drop-off indicator between stages ─────────── */}
              {!isLast && dropOff && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 0 10px 18px',
                }}>
                  {/* Down-arrow SVG */}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 2v12M3 9l5 5 5-5" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--danger)',
                    fontSize: 13,
                    fontWeight: 700,
                  }}>
                    {dropOff.drop_rate.toFixed(1)}% drop-off
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                    — {dropOff.lost.toLocaleString('en-US')} users lost
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Summary row ─────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${stages.length}, 1fr)`,
        gap: 12, marginTop: 28, paddingTop: 20,
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {stages.map((stage, idx) => (
          <div key={`sum-${stage.name}`} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
              {stage.name}
            </p>
            <p style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', margin: '0 0 2px' }}>
              {stage.count.toLocaleString('en-US')}
            </p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: STAGE_COLORS[idx], margin: 0, fontWeight: 600 }}>
              {stage.percentage.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
