/**
 * InsightAILogo — reusable branded logo component.
 * Combines a stylized eye/lens (Insight) with AI sparkle dots.
 * Each instance gets a unique gradient id to avoid SVG defs conflicts.
 */
let _logoCount = 0

export default function InsightAILogo({ size = 36 }) {
  /* Unique gradient id per instance — SVG defs are global in the DOM */
  const id = `logoGrad-${++_logoCount}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="InsightAI logo"
    >
      {/* Background rounded square */}
      <rect width="36" height="36" rx="10" fill={`url(#${id})`} />

      {/* Eye / lens shape — "Insight" */}
      <path
        d="M8 18C8 18 13 11 18 11C23 11 28 18 28 18C28 18 23 25 18 25C13 25 8 18 8 18Z"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />

      {/* Pupil / data point */}
      <circle cx="18" cy="18" r="3.5" fill="white" />

      {/* AI sparkle nodes */}
      <circle cx="18" cy="8"  r="1.2" fill="rgba(255,255,255,0.75)" />
      <circle cx="26" cy="12" r="1.0" fill="rgba(255,255,255,0.55)" />
      <circle cx="10" cy="12" r="1.0" fill="rgba(255,255,255,0.55)" />

      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#2563eb" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  )
}
