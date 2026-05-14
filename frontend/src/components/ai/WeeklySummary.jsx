import { FileText } from 'lucide-react'
import { formatDateTime, renderMarkdown } from '../../utils/formatters'

export default function WeeklySummary({ data }) {
  if (!data) return null

  const html = renderMarkdown(data.summary)

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={14} style={{ color: 'var(--warning)' }} />
          <p
            style={{
              fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.05em', color: 'var(--text-muted)', margin: 0,
            }}
          >
            Weekly Executive Summary
          </p>
        </div>
        {data.generated_at && (
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
            Generated {formatDateTime(data.generated_at)}
          </p>
        )}
      </div>

      {/* Document-style content with rendered markdown */}
      <div
        style={{
          padding: '20px 24px',
          background: 'var(--bg-elevated)',
          borderRadius: 12,
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div
          className="markdown-body"
          style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
