import { useState } from 'react'
import { useAppState } from './lib/useAppState.js'
import TabBar from './components/TabBar.jsx'
import SessionView from './components/SessionView.jsx'
import RulesView from './components/RulesView.jsx'
import HistoryView from './components/HistoryView.jsx'

export default function App() {
  const app = useAppState()
  const [tab, setTab] = useState('session')

  if (!app.ready) return null

  return (
    <div className="app">
      <TabBar tab={tab} onChange={setTab} />
      {tab === 'session' && <SessionView app={app} />}
      {tab === 'rules' && <RulesView />}
      {tab === 'history' && <HistoryView app={app} />}
    </div>
  )
}
