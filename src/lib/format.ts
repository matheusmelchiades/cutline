export function formatPoints(pts: number): string {
  return pts.toLocaleString('en-US')
}

export function formatDate(iso: string): string {
  const date = new Date(iso + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatPlacement(p: number): string {
  if (p === 1) return '1st'
  if (p === 2) return '2nd'
  if (p === 3) return 'Equal 3rd'
  return `Equal ${p}th`
}

export function formatDelta(n: number): string {
  if (n > 0) return `▲${n}`
  if (n < 0) return `▼${Math.abs(n)}`
  return '—'
}
