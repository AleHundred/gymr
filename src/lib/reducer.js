import { uid, num } from './ids.js'
import { initialState } from '../data/seed.js'

// Build an empty draft row set for an exercise (count = setsPerExercise, or 1 for warmup).
function blankSets(count) {
  return Array.from({ length: count }, () => ({ weight: '', reps: '' }))
}

export function reducer(state, action) {
  switch (action.type) {
    // Update one field of one set in the in-progress draft. Persisted like everything
    // else, so a mid-session reload (gym backgrounds the app) loses nothing.
    case 'LOG_SET': {
      const { exerciseId, index, field, value, count } = action
      const entries = { ...state.draft.entries }
      const arr = (entries[exerciseId] ? entries[exerciseId].map((s) => ({ ...s })) : blankSets(count))
      arr[index] = { ...arr[index], [field]: value }
      entries[exerciseId] = arr
      return { ...state, draft: { ...state.draft, entries } }
    }

    // Mark an exercise skipped for this session (or un-skip). Skipping drops any typed
    // sets; on finish it produces no entry, so progression falls back to the last
    // session that actually included it.
    case 'TOGGLE_SKIP': {
      const skipped = { ...state.draft.skipped }
      const entries = { ...state.draft.entries }
      if (skipped[action.exerciseId]) {
        delete skipped[action.exerciseId]
      } else {
        skipped[action.exerciseId] = true
        delete entries[action.exerciseId]
      }
      return { ...state, draft: { ...state.draft, entries, skipped } }
    }

    // Commit the draft to history. Drops empty sets/exercises, stamps date + id.
    case 'FINISH_SESSION': {
      const sessionEntries = []
      for (const ex of state.exercises) {
        const arr = state.draft.entries[ex.id]
        if (!arr) continue
        const sets = arr
          .filter((s) => s.weight !== '' && s.weight != null)
          .map((s) => ({ weight: num(s.weight), reps: num(s.reps) }))
        if (sets.length) sessionEntries.push({ exerciseId: ex.id, sets })
      }
      if (sessionEntries.length === 0) return state
      const session = {
        id: uid(),
        date: action.date || new Date().toISOString(),
        entries: sessionEntries
      }
      return { ...state, sessions: [session, ...state.sessions], draft: { entries: {}, skipped: {} } }
    }

    case 'DELETE_SESSION':
      return { ...state, sessions: state.sessions.filter((s) => s.id !== action.id) }

    // Replace whole state from an imported backup; never carry a stale draft.
    case 'IMPORT':
      return { ...action.state, version: state.version, draft: { entries: {}, skipped: {} } }

    case 'RESET':
      return initialState()

    default:
      return state
  }
}
