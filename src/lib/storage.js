// Thin localStorage wrapper. Single namespaced key, versioned JSON for migration safety.
const KEY = 'tt_state_v1'
export const STORAGE_VERSION = 1

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

// No-op migrator today. The seam exists so future schema bumps have a home.
function migrate(data) {
  if (!data || typeof data !== 'object') return null
  if (!data.version || data.version < STORAGE_VERSION) {
    data.version = STORAGE_VERSION
  }
  // Defensive defaults for fields a future import/older blob might lack.
  if (!data.draft) data.draft = { entries: {} }
  if (!data.measurements) data.measurements = []
  return data
}
