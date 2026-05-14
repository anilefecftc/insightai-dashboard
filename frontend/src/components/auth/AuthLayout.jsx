/**
 * AuthLayout — gradient page shared by Login & Register.
 *
 * Desktop flex layout (left → right):
 *   [BrandSide]  [FormCard]  [FloatingRight]
 *
 * FloatingRight holds all dashboard illustration cards + 3 extra decorative
 * elements. It is a stretch-height flex child with absolute children so
 * every element floats within the right column, z-index < form card (10).
 */
import { BarChart2, Zap, Bot, TrendingUp } from 'lucide-react'
import InsightAILogo from '../common/InsightAILogo'

const FEATURES = [
  { icon: BarChart2, text: 'Real-time KPI tracking'   },
  { icon: Zap,       text: 'AI-powered insights'      },
  { icon: Bot,       text: 'Funnel & cohort analysis' },
]

/* ── Background drifting blobs ─────────────────────────────────────────────── */
function Blobs() {
  const blobs = [
    { top: '-80px',  right: '-60px',  size: 320, anim: 'blobDrift1 8s ease-in-out 0s infinite'   },
    { bottom: '-20px', left: '-80px', size: 360, anim: 'blobDrift2 11s ease-in-out -4s infinite' },
    { top: '35%',    left: '18%',     size: 150, anim: 'blobDrift1 13s ease-in-out -7s infinite' },
    { bottom: '20%', right: '12%',    size: 110, anim: 'blobDrift2 9s ease-in-out -2s infinite'  },
  ]
  return (
    <>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: b.top, bottom: b.bottom, left: b.left, right: b.right,
          width: b.size, height: b.size, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          animation: b.anim,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}
    </>
  )
}

/* ── Right column: illustrations + decorative elements ─────────────────────── */
function FloatingRight() {
  /* 1.3× scaled card SVGs scattered in a relative container */
  const S = 1.3  // scale factor

  return (
    /* stretch-height container so children can use % positions */
    <div className="auth-floating-right" style={{
      flex: '0 0 320px',
      alignSelf: 'stretch',
      position: 'relative',
      minHeight: 520,
      pointerEvents: 'none',
      zIndex: 2,
    }}>

      {/* ── Card 1 — metric + sparkline (top-left of column) ──── */}
      <div style={{
        position: 'absolute', top: '4%', left: '0%',
        animation: 'float1 6s ease-in-out 0s infinite',
        transform: `scale(${S})`, transformOrigin: 'top left',
        opacity: 0.75,
      }}>
        <svg width="180" height="100" viewBox="0 0 180 100" fill="none"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))' }}>
          <rect width="180" height="100" rx="14" fill="rgba(255,255,255,0.18)"
            stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <rect x="14" y="14" width="52" height="7" rx="3.5" fill="rgba(255,255,255,0.45)" />
          <rect x="14" y="28" width="105" height="22" rx="5" fill="rgba(255,255,255,0.75)" />
          <rect x="14" y="58" width="42" height="8" rx="4" fill="rgba(134,239,172,0.9)" />
          <polyline points="96,82 112,66 126,72 144,54 160,60 176,44"
            stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── Card 2 — area chart (top-right of column) ─────────── */}
      <div style={{
        position: 'absolute', top: '2%', right: '0%',
        animation: 'float2 8s ease-in-out -2s infinite',
        transform: `scale(${S})`, transformOrigin: 'top right',
        opacity: 0.65,
      }}>
        <svg width="196" height="110" viewBox="0 0 196 110" fill="none"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))' }}>
          <rect width="196" height="110" rx="14" fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <rect x="14" y="14" width="48" height="7" rx="3.5" fill="rgba(255,255,255,0.4)" />
          <polyline points="14,88 38,68 62,76 86,52 110,60 134,40 158,48 182,28"
            stroke="rgba(255,255,255,0.85)" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <polygon points="14,88 38,68 62,76 86,52 110,60 134,40 158,48 182,28 182,96 14,96"
            fill="rgba(255,255,255,0.1)" />
        </svg>
      </div>

      {/* ── Card 3 — bar chart (mid-left) ─────────────────────── */}
      <div style={{
        position: 'absolute', top: '40%', left: '2%',
        animation: 'float3 7s ease-in-out -3s infinite',
        transform: `scale(${S})`, transformOrigin: 'top left',
        opacity: 0.65,
      }}>
        <svg width="158" height="120" viewBox="0 0 158 120" fill="none"
          style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))' }}>
          <rect width="158" height="120" rx="14" fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <rect x="14" y="14" width="42" height="7" rx="3.5" fill="rgba(255,255,255,0.4)" />
          {[0,1,2,3,4].map((i) => {
            const hs = [44, 60, 36, 68, 50]
            return <rect key={i} x={14 + i*26} y={98 - hs[i]} width="17" height={hs[i]}
              rx="4" fill={`rgba(255,255,255,${0.38 + i*0.09})`} />
          })}
        </svg>
      </div>

      {/* ── Card 4 — funnel (bottom-right) ────────────────────── */}
      <div style={{
        position: 'absolute', bottom: '6%', right: '0%',
        animation: 'float4 9s ease-in-out -5s infinite',
        transform: `scale(${S})`, transformOrigin: 'bottom right',
        opacity: 0.65,
      }}>
        <svg width="168" height="128" viewBox="0 0 168 128" fill="none"
          style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))' }}>
          <rect width="168" height="128" rx="14" fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <rect x="14" y="14" width="42" height="7" rx="3.5" fill="rgba(255,255,255,0.4)" />
          {[0,1,2,3].map((i) => {
            const ws = [134, 106, 78, 48]
            return <rect key={i} x={(168 - ws[i]) / 2} y={32 + i*22}
              width={ws[i]} height="14" rx="5"
              fill={`rgba(255,255,255,${0.6 - i*0.1})`} />
          })}
        </svg>
      </div>

      {/* ── Extra 1 — mini pie / donut chart circle ────────────── */}
      <div style={{
        position: 'absolute', top: '30%', right: '8%',
        animation: 'float2 7s ease-in-out -1s infinite',
        opacity: 0.72,
      }}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
          style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.2))' }}>
          <rect width="80" height="80" rx="20" fill="rgba(255,255,255,0.18)"
            stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          {/* Donut */}
          <circle cx="40" cy="44" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="10" fill="none" />
          <circle cx="40" cy="44" r="18"
            stroke="rgba(255,255,255,0.85)" strokeWidth="10" fill="none"
            strokeDasharray="70 43" strokeDashoffset="14" strokeLinecap="round" />
          {/* Label */}
          <text x="40" y="19" textAnchor="middle" fill="rgba(255,255,255,0.75)"
            fontSize="8" fontWeight="600">CVR</text>
        </svg>
      </div>

      {/* ── Extra 2 — notification badge ──────────────────────── */}
      <div style={{
        position: 'absolute', top: '58%', left: '10%',
        animation: 'float3 8s ease-in-out -4s infinite',
        opacity: 0.80,
      }}>
        <svg width="108" height="44" viewBox="0 0 108 44" fill="none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>
          <rect width="108" height="44" rx="22" fill="rgba(255,255,255,0.18)"
            stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          {/* Bell dot */}
          <circle cx="22" cy="22" r="8" fill="rgba(255,255,255,0.25)" />
          <text x="22" y="27" textAnchor="middle" fill="white"
            fontSize="10" fontWeight="700">3</text>
          <text x="62" y="26" textAnchor="middle" fill="rgba(255,255,255,0.85)"
            fontSize="11" fontWeight="500">New alerts</text>
        </svg>
      </div>

      {/* ── Extra 3 — growth chip ↑ 12.5% ─────────────────────── */}
      <div style={{
        position: 'absolute', bottom: '28%', left: '4%',
        animation: 'float1 6s ease-in-out -3s infinite',
        opacity: 0.85,
      }}>
        <svg width="130" height="42" viewBox="0 0 130 42" fill="none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>
          <rect width="130" height="42" rx="21" fill="rgba(134,239,172,0.25)"
            stroke="rgba(134,239,172,0.5)" strokeWidth="1" />
          {/* Arrow up */}
          <path d="M18 28 L18 18 M14 22 L18 18 L22 22"
            stroke="rgba(134,239,172,1)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="66" y="26" textAnchor="middle" fill="rgba(255,255,255,0.95)"
            fontSize="13" fontWeight="700">+12.5% MoM</text>
        </svg>
      </div>

    </div>
  )
}

/* ── Left brand text block ─────────────────────────────────────────────────── */
function BrandSide() {
  return (
    <div className="auth-brand-side" style={{
      flex: '0 0 auto', maxWidth: 340,
      display: 'flex', flexDirection: 'column', gap: 28,
      zIndex: 2,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <InsightAILogo size={36} />
        <span style={{ color: '#ffffff', fontWeight: 700, fontSize: 22, fontFamily: 'DM Sans' }}>InsightAI</span>
      </div>

      <div>
        <h2 style={{
          color: '#ffffff', fontSize: 42, fontWeight: 800,
          lineHeight: 1.15, margin: '0 0 14px', fontFamily: 'DM Sans',
        }}>
          Turn raw metrics<br />into decisions.<br />
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Powered by AI.</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 19, margin: 0, lineHeight: 1.6 }}>
          Track KPIs, analyze funnels, run A/B tests, and get AI-powered insights — all in one dashboard.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FEATURES.map(({ icon: Icon, text }) => (
          <div key={text} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '12px 22px', borderRadius: 100,
            background: 'rgba(255,255,255,0.13)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.22)',
            width: 'fit-content',
          }}>
            <Icon size={15} color="#ffffff" />
            <span style={{ color: '#ffffff', fontSize: 16, fontWeight: 500 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main layout ────────────────────────────────────────────────────────────── */
export default function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #6B8DD6 50%, #8E37D7 75%, #764ba2 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 15s ease infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 48px',
      position: 'relative',
      overflow: 'hidden',
      gap: 52,
    }}>
      {/* Drifting blobs — deepest layer */}
      <Blobs />

      {/* Left: brand text */}
      <BrandSide />

      {/* Center: form card */}
      <div style={{
        background: 'var(--auth-card-bg, #ffffff)',
        borderRadius: 24,
        padding: '48px 44px',
        width: '100%',
        maxWidth: 460,
        boxShadow: '0 25px 60px rgba(0,0,0,0.22)',
        position: 'relative',
        zIndex: 10,
        flexShrink: 0,
      }}>
        {children}
      </div>

      {/* Right: floating dashboard illustrations */}
      <FloatingRight />
    </div>
  )
}
