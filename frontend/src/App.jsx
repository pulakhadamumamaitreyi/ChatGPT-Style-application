import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import ThemeToggle from './components/ThemeToggle'
import API from './api'

export default function App(){
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => { fetchSessions() }, [])
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark') }, [theme])

  async function fetchSessions(){
    try {
      const res = await API.get('/sessions')
      setSessions(res.data.sessions)
      if(res.data.sessions.length && !activeSession) setActiveSession(res.data.sessions[0])
    } catch (err) { console.error(err) }
  }

  async function startNewChat(){
    try {
      const res = await API.post('/new-session', { title: `Session ${sessions.length + 1}` })
      await fetchSessions()
      setActiveSession(res.data.session)
      window.history.pushState({}, '', `/session/${res.data.session.id}`)
    } catch (err) { console.error(err) }
  }

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        sessions={sessions}
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        onStartNew={startNewChat}
        onSelectSession={s => { setActiveSession(s); window.history.pushState({}, '', `/session/${s.id}`) }}
      />
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Mini Chat (Mock)</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
        <ChatPanel key={activeSession?.id || 'no-session'} session={activeSession} onSessionsChange={fetchSessions} />
      </div>
    </div>
  )
}
