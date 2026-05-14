/**
 * Utility helpers for exporting data as CSV or triggering the browser's
 * print dialog for PDF output.
 */

/**
 * Build a CSV string from an array of objects and trigger a file download.
 * Values containing commas are wrapped in double-quotes.
 */
export const exportToCSV = (data, filename) => {
  if (!data?.length) return

  const escape = (v) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }

  const headers = Object.keys(data[0]).join(',')
  const rows = data.map((row) => Object.values(row).map(escape).join(','))
  const csv = [headers, ...rows].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Open the browser print dialog (used for "Export as PDF" on the AI Reports page).
 * Pair with @media print CSS rules to control what gets printed.
 */
export const printPage = () => {
  window.print()
}
