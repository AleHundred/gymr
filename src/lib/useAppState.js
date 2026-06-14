import { useEffect, useReducer, useRef } from 'react'
import { load, save } from './storage.js'
import { initialState } from '../data/seed.js'
import { reducer } from './reducer.js'

// Single source of truth: useReducer over AppState, hydrated from localStorage on
// mount, written back (debounced ~300ms) on every mutation.
export function useAppState() {
  const [state, dispatch] = useReducer(reducer, null, () => load() || initialState())
  const timer = useRef()

  useEffect(() => {
    if (!state) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => save(state), 300)
    return () => clearTimeout(timer.current)
  }, [state])

  return { ready: state != null, state, dispatch }
}
