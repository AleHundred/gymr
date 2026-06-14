export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

// Parse a possibly-empty input value to a number; '' / NaN -> 0.
export function num(v) {
  if (v === '' || v == null) return 0
  const n = parseFloat(v)
  return Number.isNaN(n) ? 0 : n
}
