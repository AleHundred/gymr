import { num } from '../lib/ids.js'
import ImportExport from './ImportExport.jsx'

export default function HistoryView({ app }) {
  const { state, dispatch } = app
  const sessions = state.sessions
  const byId = Object.fromEntries(state.exercises.map((e) => [e.id, e]))

  return (
    <>
      <header className="header">
        <div className="eyebrow">
          <span><span className="dot" />The evidence</span>
          <span>{sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}</span>
        </div>
        <h1>My <em>logbook</em></h1>
        <div className="meta"><span>My counter-argument to "stuck"</span></div>
      </header>

      {sessions.length === 0 ? (
        <div className="history-empty">
          No sessions logged yet.<br /><br />
          Each session I finish lands here. The proof that I progress, not stall. Back after session 1.
        </div>
      ) : (
        sessions.map((s) => (
          <div className="history-session" key={s.id}>
            <div className="history-date">{formatDate(s.date)}</div>
            {s.entries.map((entry) => {
              const ex = byId[entry.exerciseId]
              if (!ex) return null
              const val = ex.isWarmup
                ? `${num(entry.sets[0].weight)} min`
                : entry.sets.map((st) => `${num(st.weight)}kg×${num(st.reps)}`).join(' · ')
              return (
                <div className="history-line" key={entry.exerciseId}>
                  <span className="ex-name">{ex.name}</span>
                  <span className="ex-val">{val}</span>
                </div>
              )
            })}
            <button
              className="line-del"
              onClick={() => { if (confirm('Delete this session?')) dispatch({ type: 'DELETE_SESSION', id: s.id }) }}
            >
              Delete
            </button>
          </div>
        ))
      )}

      <ImportExport app={app} />
    </>
  )
}

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}
