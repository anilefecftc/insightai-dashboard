/**
 * AuthPanel — decorative right panel shared by Login and Register pages.
 * Gradient background, animated blobs, isometric dashboard mockup,
 * new InsightAI slogan, and frosted-glass feature chips.
 */
import { BarChart2, Zap, Bot } from 'lucide-react'
import InsightAILogo from '../common/InsightAILogo'

const FEATURES = [
  { icon: BarChart2, text: 'Real-time KPI tracking'   },
  { icon: Zap,       text: 'AI-powered insights'      },
  { icon: Bot,       text: 'Funnel & cohort analysis' },
]

/* Isometric-style floating dashboard cards — SVG illustration */
function IsoDashboard() {
  return (
    <svg viewBox="0 0 360 240" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 360 }}>

      {/* Card 1 — large metric card (top left, slightly rotated) */}
      <g style={{ animation: 'float1 6s ease-in-out infinite' }}>
        <rect x="10" y="20" width="160" height="90" rx="14"
          fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <rect x="26" y="36" width="55" height="7" rx="3.5" fill="rgba(255,255,255,0.35)" />
        <rect x="26" y="51" width="100" height="22" rx="5" fill="rgba(255,255,255,0.7)" />
        <rect x="26" y="82" width="40" height="7" rx="3.5" fill="rgba(99,255,160,0.75)" />
        {/* Sparkline */}
        <polyline points="100,95 112,80 124,86 136,72 148,76 158,65"
          stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      </g>

      {/* Card 2 — smaller metric card (top right) */}
      <g style={{ animation: 'float2 8s ease-in-out infinite' }}>
        <rect x="186" y="10" width="160" height="82" rx="14"
          fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="200" y="26" width="40" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
        <rect x="200" y="39" width="80" height="20" rx="4" fill="rgba(255,255,255,0.65)" />
        <rect x="200" y="67" width="30" height="6" rx="3" fill="rgba(239,100,100,0.75)" />
      </g>

      {/* Card 3 — bar chart card (bottom left) */}
      <g style={{ animation: 'float1 7s ease-in-out infinite reverse' }}>
        <rect x="10" y="128" width="152" height="100" rx="14"
          fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="24" y="142" width="40" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
        {/* Bars */}
        {[0,1,2,3,4].map((i) => {
          const heights = [40,55,35,62,48]
          return (
            <rect key={i}
              x={24 + i * 24} y={142 + 70 - heights[i]} width="16" height={heights[i]}
              rx="4" fill={`rgba(255,255,255,${0.35 + i * 0.07})`} />
          )
        })}
      </g>

      {/* Card 4 — funnel card (bottom right, animated differently) */}
      <g style={{ animation: 'float2 5s ease-in-out infinite' }}>
        <rect x="178" y="108" width="170" height="120" rx="14"
          fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <rect x="192" y="122" width="40" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
        {/* Funnel bars */}
        {[0,1,2,3].map((i) => {
          const widths = [130, 100, 74, 44]
          return (
            <rect key={i}
              x={192 + (130 - widths[i]) / 2} y={136 + i * 22}
              width={widths[i]} height="14" rx="5"
              fill={`rgba(255,255,255,${0.55 - i * 0.1})`} />
          )
        })}
      </g>
    </svg>
  )
}

export default function AuthPanel() {
  return (
    <div style={{
      flex: '0 0 45%',
      /* Multi-layer gradient for depth */
      background: `
        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.09) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 40%),
        linear-gradient(135deg, #1d4ed8 0%, #7c3aed 60%, #a21caf 100%)
      `,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated floating blobs */}
      {[
        { top: '-80px',  right: '-60px', size: 280, dur: '7s',  delay: '0s'   },
        { bottom: '30px', left: '-90px', size: 320, dur: '10s', delay: '-3s'  },
        { top: '35%',    left: '8%',     size: 130, dur: '12s', delay: '-6s'  },
        { bottom: '20%', right: '5%',    size: 100, dur: '9s',  delay: '-2s'  },
      ].map((b, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: b.top, bottom: b.bottom, left: b.left, right: b.right,
          width: b.size, height: b.size,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          animation: `${i % 2 === 0 ? 'float1' : 'float2'} ${b.dur} ease-in-out ${b.delay} infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 360 }}>
        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <InsightAILogo size={32} />
          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: 18 }}>InsightAI</span>
        </div>

        {/* Illustration */}
        <div style={{ marginBottom: 32 }}>
          <IsoDashboard />
        </div>

        {/* Slogan */}
        <h2 style={{ color: '#ffffff', fontSize: 26, fontWeight: 700, lineHeight: 1.3, margin: '0 0 12px', fontFamily: 'DM Sans' }}>
          Turn raw metrics into decisions.<br />
          <span style={{ color: 'rgba(255,255,255,0.75)' }}>Powered by AI.</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: '0 0 32px', lineHeight: 1.7 }}>
          Track KPIs, analyze funnels, run A/B tests, and get AI-powered insights — all in one dashboard.
        </p>

        {/* Feature pills — frosted glass */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FEATURES.map(({ icon: Icon, text }) => (
            <div key={text} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '8px 16px', borderRadius: 100,
              background: 'rgba(255,255,255,0.13)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              width: 'fit-content',
            }}>
              <Icon size={15} color="#ffffff" />
              <span style={{ color: '#ffffff', fontSize: 13, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
