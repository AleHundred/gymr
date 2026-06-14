import { useRef } from 'react'

// The localStorage safety net: one tap backs up the whole logbook to a file,
// one tap restores it. Cheap insurance against a dead phone / cleared storage.
export default function ImportExport({ app }) {
  const { state, dispatch } = app
  const fileRef = useRef()

  function exportJson() {
    const data = { ...state }
    delete data.draft // never export an in-progress session
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gymr-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importJson(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!Array.isArray(data.exercises) || !Array.isArray(data.sessions)) {
          throw new Error('missing fields')
        }
        if (confirm('Replace ALL current data with this backup? This cannot be undone.')) {
          dispatch({ type: 'IMPORT', state: data })
        }
      } catch (err) {
        alert('Invalid backup file.')
      } finally {
        e.target.value = ''
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="io-block">
      <div className="io-row">
        <button className="ghost-btn" onClick={exportJson}>Export backup</button>
        <button className="ghost-btn" onClick={() => fileRef.current.click()}>Import backup</button>
      </div>
      <input ref={fileRef} type="file" accept="application/json" hidden onChange={importJson} />
      <button
        className="ghost-btn danger"
        onClick={() => { if (confirm('Reset everything to the seed template? All sessions lost.')) dispatch({ type: 'RESET' }) }}
      >
        Reset all data
      </button>
    </div>
  )
}
