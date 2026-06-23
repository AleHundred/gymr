import { num } from './ids.js'

// Volume = sum of weight*reps across working sets. Used for beat/regression checks.
export function volume(sets) {
  return sets.reduce((a, s) => a + num(s.weight) * num(s.reps), 0)
}

// A set counts as "logged" once it has a weight. Reps may be 0 (warmup) or filled.
function logged(sets) {
  return (sets || []).filter((s) => num(s.weight) > 0)
}

// Sessions are newest-first. Returns each committed entry for this exercise,
// newest-first, that actually carries logged sets.
export function entriesForExercise(exerciseId, sessions) {
  const out = []
  for (const s of sessions) {
    const e = s.entries.find((en) => en.exerciseId === exerciseId)
    const sets = e && logged(e.sets)
    if (sets && sets.length) out.push({ date: s.date, sets })
  }
  return out
}

export function lastEntry(exerciseId, sessions) {
  return entriesForExercise(exerciseId, sessions)[0] || null
}

// Stack progression: hold weight until all sets hit the rep ceiling, then earn a
// full-stack jump and rebuild reps from a lower number. Machine stacks have no
// microplates, so jumps are big (default 5kg) and reps reset further (default 8).
export function computeTarget(exercise, sessions) {
  if (exercise.isWarmup) return null

  const repHigh = exercise.repHigh ?? 12
  const repReset = exercise.repReset ?? 8
  const repStart = exercise.repStart ?? 10
  const inc = exercise.stackIncrement ?? 5

  const history = entriesForExercise(exercise.id, sessions)
  if (history.length === 0) {
    // Brand-new exercise finds its baseline; repReset is a post-jump number, not this.
    return { weight: exercise.startWeight, reps: repStart, label: 'First session, start here' }
  }

  const last = history[0].sets
  const topWeight = Math.max(...last.map((s) => num(s.weight)))
  const allHitHigh = last.every((s) => num(s.reps) >= repHigh)

  // Earned the jump: every set hit the ceiling last time. Add a stack, rebuild from repReset.
  if (allHitHigh) {
    return {
      weight: topWeight + inc,
      reps: repReset,
      label: `Earned +${inc}kg, rebuild from ${repReset}`
    }
  }

  // Bad day: last session regressed vs the one before. Don't punish; repeat the better one.
  const prev = history[1] && history[1].sets
  if (prev && prev.length && volume(last) < volume(prev)) {
    return {
      weight: Math.max(...prev.map((s) => num(s.weight))),
      reps: Math.min(...prev.map((s) => num(s.reps))),
      label: 'Match last session'
    }
  }

  // Climb: same weight, add a rep to the lowest set (capped at repHigh).
  const minReps = Math.min(...last.map((s) => num(s.reps)))
  const aim = Math.min(minReps + 1, repHigh)
  return { weight: topWeight, reps: aim, label: `Aim for ${aim} reps` }
}

// Volume-progression signal: flat for 4+ logged sessions (same top weight, no net
// rep gain across the span = no jump earned). Surfaced as a gentle "add a 4th set" nudge.
export function stallFlag(exercise, sessions) {
  if (exercise.isWarmup) return false

  const history = entriesForExercise(exercise.id, sessions)
  if (history.length < 4) return false

  const span = history.slice(0, 4) // newest-first
  const topW = (e) => Math.max(...e.sets.map((s) => num(s.weight)))
  const totalReps = (e) => e.sets.reduce((a, s) => a + num(s.reps), 0)

  const flatWeight = span.every((e) => topW(e) === topW(span[0]))
  // span[0] = newest, span[3] = oldest in the window: no net rep gain over the span.
  return flatWeight && totalReps(span[0]) <= totalReps(span[3])
}

// Did today's sets beat the last committed session? More weight OR more reps OR more volume.
export function beatLogbook(exercise, todaySets, sessions) {
  const prev = lastEntry(exercise.id, sessions)
  const today = logged(todaySets)
  if (today.length === 0) return { beat: false, reason: 'empty' }
  if (!prev) return { beat: true, reason: 'first' }

  const todayTopW = Math.max(...today.map((s) => num(s.weight)))
  const prevTopW = Math.max(...prev.sets.map((s) => num(s.weight)))
  const todayReps = today.reduce((a, s) => a + num(s.reps), 0)
  const prevReps = prev.sets.reduce((a, s) => a + num(s.reps), 0)

  if (todayTopW > prevTopW) return { beat: true, reason: 'weight' }
  if (todayReps > prevReps) return { beat: true, reason: 'reps' }
  if (volume(today) > volume(prev.sets)) return { beat: true, reason: 'volume' }
  return { beat: false, reason: 'matched' }
}
