import { useState } from 'react'
import ExerciseCard from './ExerciseCard.jsx'
import { computeTarget, beatLogbook, lastEntry, stallFlag } from '../lib/progression.js'

export default function SessionView({ app }) {
  const { state, dispatch } = app
  const [summary, setSummary] = useState(null)

  const active = state.exercises.filter((e) => e.active).sort((a, b) => a.order - b.order)
  const setsCount = state.settings.setsPerExercise
  const draft = state.draft.entries
  const skipped = state.draft.skipped || {}

  const isLogged = (e) => (draft[e.id] || []).some((s) => s.weight !== '' && s.weight != null)
  const loggedCount = active.filter(isLogged).length
  // Progress = exercises dealt with, whether logged or deliberately skipped.
  const handled = active.filter((e) => skipped[e.id] || isLogged(e)).length
  const pct = active.length ? Math.round((handled / active.length) * 100) : 0

  function onLog(exerciseId, index, field, value) {
    const ex = active.find((e) => e.id === exerciseId)
    const count = ex.isWarmup ? 1 : setsCount
    dispatch({ type: 'LOG_SET', exerciseId, index, field, value, count })
  }

  function finish() {
    if (loggedCount === 0) {
      alert('Log at least one exercise first.')
      return
    }
    // Tally beats against committed history before we mutate it.
    let beat = 0
    let total = 0
    for (const ex of active) {
      if (ex.isWarmup) continue
      const arr = draft[ex.id]
      if (!arr || !arr.some((s) => s.weight !== '')) continue
      total++
      if (beatLogbook(ex, arr, state.sessions).beat) beat++
    }
    dispatch({ type: 'FINISH_SESSION' })
    setSummary({ beat, total })
    window.scrollTo(0, 0)
  }

  // Render with section dividers, matching the prototype grouping.
  const cards = []
  let lastSec = ''
  active.forEach((ex, i) => {
    if (ex.section !== lastSec) {
      cards.push(<div className="section-label" key={'sec-' + ex.section}>{ex.section}</div>)
      lastSec = ex.section
    }
    cards.push(
      <ExerciseCard
        key={ex.id}
        exercise={ex}
        number={i + 1}
        total={active.length}
        setsCount={ex.isWarmup ? 1 : setsCount}
        entry={draft[ex.id]}
        skipped={!!skipped[ex.id]}
        target={computeTarget(ex, state.sessions)}
        stalled={stallFlag(ex, state.sessions)}
        last={lastEntry(ex.id, state.sessions)}
        beat={beatLogbook(ex, draft[ex.id] || [], state.sessions)}
        onLog={(index, field, value) => onLog(ex.id, index, field, value)}
        onToggleSkip={() => dispatch({ type: 'TOGGLE_SKIP', exerciseId: ex.id })}
      />
    )
  })

  return (
    <>
      <div className="progress-bar"><div className="progress-fill" style={{ width: pct + '%' }} /></div>

      <header className="header">
        <div className="eyebrow">
          <span><span className="dot" />{state.settings.gymName}</span>
          <span>Full body</span>
        </div>
        <h1>Today's <em>session</em></h1>
        <div className="meta">
          <span>{active.length} movements</span>
          <span>{setsCount} sets · 10–12</span>
          <span>Beat the logbook</span>
        </div>
      </header>

      {summary ? (
        <div className="notice summary">
          <strong>Session saved</strong>
          I beat the logbook on <em>{summary.beat} of {summary.total}</em> exercises. It's in my logbook now. Next
          session reads these as the numbers to beat.
        </div>
      ) : (
        <div className="notice">
          <strong>The rule that matters</strong>
          I hold the weight and climb reps to 12 on all sets. Once every set hits 12, I <em>earn +5kg and rebuild from about 8</em>. Stacks are big, so reps drop after a jump. I beat something every session, and I log it so next time has a target.
        </div>
      )}

      {cards}

      <button className="finish-btn" onClick={finish}>Finish &amp; save session</button>
      <footer className="footer"><p className="big">Beat the logbook.</p></footer>
    </>
  )
}
