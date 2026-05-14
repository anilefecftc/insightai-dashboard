export default function FunnelStage({ name, count, percentage, isLast }) {
  const width = Math.max(percentage, 8)

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/40 transition-all"
        style={{ width: `${width}%`, minWidth: 120, padding: '14px 20px' }}
      >
        <div className="text-center">
          <p className="text-white font-bold text-lg">{count.toLocaleString()}</p>
          <p className="text-blue-300 text-xs font-medium">{name}</p>
        </div>
      </div>
      <p className="text-slate-300 text-sm font-semibold">{percentage.toFixed(1)}%</p>
    </div>
  )
}
