/**
 * Formatting utilities for numbers, percentages, currency, and dates.
 * All locale-sensitive calls explicitly use 'en-US' to guarantee comma
 * thousands separators regardless of the user's system locale.
 */

export const formatNumber = (value) => {
  if (value == null) return '—'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return Number(value).toLocaleString('en-US')
  return Number(value).toLocaleString('en-US')
}

export const formatRevenue = (value) => {
  if (value == null) return '—'
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toFixed(2)}`
}

export const formatPercent = (value, decimals = 1) => {
  if (value == null) return '—'
  return `${Number(value).toFixed(decimals)}%`
}

export const formatChange = (value) => {
  if (value === null || value === undefined) return 'N/A'
  const num = Number(value)
  if (isNaN(num)) return 'N/A'
  // Cap extreme values — anything above ±200% is almost certainly a data artifact
  if (num > 200)  return '>200%'
  if (num < -200) return '<-200%'
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(1)}%`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const formatDateTime = (isoStr) => {
  if (!isoStr) return ''
  const date = new Date(isoStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const isPositiveMetric = (metric) => {
  return !['churn_rate', 'churn_rate_change'].includes(metric)
}

export const getChangeColor = (change, metric) => {
  if (change === 0) return 'text-zinc-500'
  const positive = change > 0
  const good = isPositiveMetric(metric) ? positive : !positive
  return good ? 'text-green-400' : 'text-red-400'
}

/**
 * Render a markdown string to HTML (bold, italic, line breaks, lists).
 * Lightweight — no external library required.
 */
export const renderMarkdown = (text) => {
  if (!text) return ''
  return text
    // Bold: **text** → <strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* → <em>
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    // Code: `text` → <code>
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Unordered list items: lines starting with "- "
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive <li> items in <ul>
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    // Double newline → paragraph break
    .replace(/\n\n/g, '</p><p>')
    // Single newline → line break
    .replace(/\n/g, '<br />')
    // Wrap whole thing in a paragraph
    .replace(/^(.+)$/, '<p>$1</p>')
}
