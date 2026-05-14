import { useState, useEffect, useRef } from 'react'
import { GripVertical, RotateCcw } from 'lucide-react'
import KPICard from './KPICard'

const CHANGE_KEY = {
  dau:             'dau_change',
  signups:         'signups_change',
  activation_rate: 'activation_rate_change',
  retention_rate:  'retention_rate_change',
  revenue:         'revenue_change',
  conversion_rate: 'conversion_rate_change',
  churn_rate:      'churn_rate_change',
}

const DEFAULT_ORDER = ['revenue', 'dau', 'signups', 'activation_rate', 'retention_rate', 'conversion_rate', 'churn_rate']
const LS_KEY = 'kpi-card-order'

function useGridCols() {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768)  setCols(1)
      else if (window.innerWidth < 1280) setCols(2)
      else setCols(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return cols
}

/* Bento span rules — position 0 = large (span 2), 5 = large (span 2), rest = normal */
function getSpan(pos, cols) {
  if (cols < 3) return 1
  if (pos === 0 || pos === 5) return 2
  return 1
}

export default function KPIGrid({ summary }) {
  const cols = useGridCols()

  const [order, setOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        /* Validate saved order — must contain exactly all default keys */
        if (Array.isArray(parsed) && parsed.length === DEFAULT_ORDER.length &&
            DEFAULT_ORDER.every((k) => parsed.includes(k))) {
          return parsed
        }
      }
    } catch { /* ignore */ }
    return DEFAULT_ORDER
  })

  /* Drag state — use refs so event handlers always see latest values */
  const dragIdx  = useRef(null)
  const [overIdx, setOverIdx] = useState(null)
  const isMobile = cols === 1

  if (!summary) return null
  const c = summary.changes || {}

  const handleReset = () => {
    setOrder(DEFAULT_ORDER)
    localStorage.removeItem(LS_KEY)
  }

  /* ── Mobile: single column, no drag ──────────────────────────────── */
  if (isMobile) {
    return (
      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {order.map((metric) => (
          <KPICard
            key={metric}
            metric={metric}
            value={summary[metric]}
            change={c[CHANGE_KEY[metric]]}
          />
        ))}
      </div>
    )
  }

  /* ── Tablet: 2-col, no bento ──────────────────────────────────────── */
  if (cols === 2) {
    return (
      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {order.map((metric, pos) => (
          <div key={metric} style={{ gridColumn: pos === 0 ? 'span 2' : 'span 1' }}>
            <KPICard
              metric={metric}
              value={summary[metric]}
              change={c[CHANGE_KEY[metric]]}
              large={pos === 0}
            />
          </div>
        ))}
      </div>
    )
  }

  /* ── Desktop: bento 3-col with drag & drop ───────────────────────── */
  return (
    <div>
      <div
        className="stagger-children"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
      >
        {order.map((metric, pos) => {
          const span     = getSpan(pos, cols)
          const isDragging = dragIdx.current === pos
          const isOver     = overIdx === pos

          return (
            <div
              key={metric}
              draggable
              style={{
                gridColumn: `span ${span}`,
                cursor: 'grab',
                opacity: isDragging ? 0.35 : 1,
                transform: isOver && !isDragging ? 'scale(1.02)' : 'scale(1)',
                outline: isOver && !isDragging ? '2px solid var(--accent)' : '2px solid transparent',
                outlineOffset: 3,
                borderRadius: 14,
                transition: 'transform 0.15s ease, outline 0.15s ease, opacity 0.15s ease',
                position: 'relative',
              }}
              onDragStart={(e) => {
                dragIdx.current = pos
                e.dataTransfer.effectAllowed = 'move'
                /* Ghost: use the card itself but slightly faded */
                setTimeout(() => {
                  if (e.target) e.target.style.opacity = '0.35'
                }, 0)
              }}
              onDragEnd={(e) => {
                if (e.target) e.target.style.opacity = '1'
                dragIdx.current = null
                setOverIdx(null)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                if (overIdx !== pos) setOverIdx(pos)
              }}
              onDragLeave={(e) => {
                /* Only clear if leaving the card container entirely */
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setOverIdx(null)
                }
              }}
              onDrop={(e) => {
                e.preventDefault()
                const from = dragIdx.current
                if (from === null || from === pos) return
                const next = [...order]
                const [moved] = next.splice(from, 1)
                next.splice(pos, 0, moved)
                setOrder(next)
                localStorage.setItem(LS_KEY, JSON.stringify(next))
                dragIdx.current = null
                setOverIdx(null)
              }}
            >
              {/* Drag handle — top-right, subtle, visible on hover */}
              <div
                style={{
                  position: 'absolute', top: 12, right: 12, zIndex: 5,
                  color: 'var(--text-muted)', opacity: 0,
                  transition: 'opacity 0.15s ease',
                  pointerEvents: 'none',
                }}
                className="drag-handle"
              >
                <GripVertical size={14} />
              </div>

              <style>{`
                div[draggable]:hover .drag-handle { opacity: 0.6 !important; }
              `}</style>

              <KPICard
                metric={metric}
                value={summary[metric]}
                change={c[CHANGE_KEY[metric]]}
                large={pos === 0}
              />
            </div>
          )
        })}
      </div>

      {/* Reset layout button */}
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleReset}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: 'none',
            color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer',
            fontFamily: 'DM Sans', padding: '4px 8px', borderRadius: 6,
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          title="Reset card order to default"
        >
          <RotateCcw size={11} />
          Reset layout
        </button>
      </div>
    </div>
  )
}
