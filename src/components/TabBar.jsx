const TABS = [
  { id: 'session', label: 'Session' },
  { id: 'rules', label: 'Rules' },
  { id: 'history', label: 'History' }
]

export default function TabBar({ tab, onChange }) {
  return (
    <div className="tabs">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={'tab' + (tab === t.id ? ' active' : '')}
          onClick={() => {
            onChange(t.id)
            window.scrollTo(0, 0)
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
