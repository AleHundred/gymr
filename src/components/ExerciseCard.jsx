import SetLogger from './SetLogger.jsx'
import { SVGS } from '../data/svgs.js'
import { num } from '../lib/ids.js'

// One exercise card: computed target banner, last-time line, set inputs, form note.
export default function ExerciseCard({ exercise, number, total, setsCount, entry, skipped, target, stalled, last, beat, onLog, onToggleSkip }) {
  const ex = exercise
  const filled = (entry || []).filter((s) => s.weight !== '' && s.weight != null)
  const done = !skipped && (ex.isWarmup ? filled.length > 0 : filled.length === setsCount)
  const lastLine = describeLast(ex, last)

  return (
    <div className={'exercise' + (done ? ' done' : '') + (skipped ? ' skipped' : '')} id={`ex-${ex.id}`}>
      <div className="top-row">
        <div className="title-block">
          <span className="number">{String(number).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <h2 className="name">{ex.name}</h2>
          <p className="german">{ex.german}</p>
        </div>
        <div className="illustration" dangerouslySetInnerHTML={{ __html: SVGS[ex.id] || '' }} />
      </div>

      {!ex.isWarmup && target && (
        <>
          <div className="target-row">
            <div className="target-item">
              <div className="target-label">Today's target</div>
              <div className="target-value">{target.weight}kg × {target.reps}</div>
            </div>
            <div className="target-item">
              <div className="target-label">Week 8</div>
              <div className="target-value">{ex.week8Target}</div>
            </div>
          </div>
          <div className="ladder-note">{target.label}</div>
        </>
      )}

      <div className="last-time">{lastLine.lead}<b>{lastLine.value}</b>{lastLine.trail}</div>

      {skipped ? (
        <div className="skip-note">Skipped this session</div>
      ) : (
        <SetLogger exercise={ex} setsCount={setsCount} entry={entry} target={target} onLog={onLog} />
      )}

      {done && !ex.isWarmup && (
        <div className={'beat-pill' + (beat?.beat ? ' yes' : ' no')}>
          {beat?.beat ? 'I beat it' : 'Matched last time'}
        </div>
      )}

      {stalled && !skipped && (
        <p className="stall-note">Flat 4 sessions, consider a 4th set</p>
      )}

      <label className="skip-toggle">
        <input type="checkbox" checked={!!skipped} onChange={onToggleSkip} />
        <span>{skipped ? 'Skipped' : 'Skip this exercise'}</span>
      </label>

      <p className="form-note">{ex.note}</p>

      {ex.videoUrl && (
        <a href={ex.videoUrl} className="video-link" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 16 16"><path d="M4 2l10 6-10 6V2z" /></svg>
          Watch form
        </a>
      )}
    </div>
  )
}

// The "last time" line as {lead, value, trail} so the value renders bold in JSX.
function describeLast(ex, last) {
  if (ex.isWarmup) {
    return last
      ? { lead: 'Last time: ', value: `${num(last.sets[0].weight)} min`, trail: '' }
      : { lead: 'First time. ', value: '~5 min easy.', trail: '' }
  }
  if (!last) {
    return { lead: 'First time. Start at ', value: `${ex.startWeight}kg`, trail: '.' }
  }
  const sets = last.sets.map((s) => `${num(s.weight)}kg×${num(s.reps)}`).join(' · ')
  return { lead: 'Last time: ', value: sets, trail: ', beat it' }
}
