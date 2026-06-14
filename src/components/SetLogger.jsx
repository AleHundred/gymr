// Renders the weight/reps inputs for one exercise's draft. Warmup = single minutes box.
export default function SetLogger({ exercise, setsCount, entry, target, onLog }) {
  if (exercise.isWarmup) {
    const v = entry?.[0]?.weight ?? ''
    return (
      <div className="log-row">
        <div className="log-input">
          <label>Minutes</label>
          <input
            type="number"
            inputMode="numeric"
            value={v}
            placeholder="5"
            onChange={(e) => onLog(0, 'weight', e.target.value)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="sets">
      {Array.from({ length: setsCount }).map((_, i) => {
        const s = entry?.[i] || { weight: '', reps: '' }
        return (
          <div className="set-row" key={i}>
            <span className="set-num">SET {i + 1}</span>
            <div className="log-input">
              <label>Weight kg</label>
              <input
                type="number"
                inputMode="decimal"
                value={s.weight}
                placeholder={target ? String(target.weight) : ''}
                onChange={(e) => onLog(i, 'weight', e.target.value)}
              />
            </div>
            <div className="log-input">
              <label>Reps</label>
              <input
                type="number"
                inputMode="numeric"
                value={s.reps}
                placeholder={target ? String(target.reps) : ''}
                onChange={(e) => onLog(i, 'reps', e.target.value)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
