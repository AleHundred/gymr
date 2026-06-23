// Thin localStorage wrapper. Single namespaced key, versioned JSON for migration safety.
const KEY = 'tt_state_v1'
export const STORAGE_VERSION = 2

export function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return migrate(JSON.parse(raw))
  } catch (e) {
    console.error('[storage] load failed', e)
    return null
  }
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    console.error('[storage] save failed', e)
  }
}

// Migrations are idempotent and never touch logged sessions, only backfill new
// schema fields onto existing saved state.
function migrate(data) {
  if (!data || typeof data !== 'object') return null

  // v2: stack progression. Backfill per-exercise fields so existing installs adopt
  // the new model without losing history. Drop the dead double-progression fields.
  for (const ex of data.exercises || []) {
    if (ex.isWarmup) continue
    ex.repStart ??= 10
    ex.repHigh ??= 12
    ex.repReset ??= 8
    ex.stackIncrement ??= 5
    delete ex.repLow
    delete ex.increment
  }

  if (!data.version || data.version < STORAGE_VERSION) {
    data.version = STORAGE_VERSION
  }
  // Defensive defaults for fields an older blob might lack.
  if (!data.draft) data.draft = { entries: {}, skipped: {} }
  if (!data.draft.skipped) data.draft.skipped = {}
  if (!data.measurements) data.measurements = []
  return data
}
