import React, { useEffect, useState } from 'react'
import API from '../api'
import ChatMessage from './ChatMessage'

export default function ChatPanel({ session, onSessionsChange }){
  const [history, setHistory] = useState(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if(session) loadHistory(session.id) }, [session])

  async function loadHistory(id){
    try {
      const res = await API.get(`/session/${id}/history`)
      setHistory(res.data.session)
    } catch (err) { console.error(err) }
  }

  async function ask(){
    if(!input.trim() || !session) return
    setLoading(true)
    try{
      await API.post(`/session/${session.id}/ask`, { question: input })
      setInput('')
      await loadHistory(session.id)
      onSessionsChange?.()
    }catch(err){console.error(err)}
    setLoading(false)
  }

  async function sendFeedback(answerId, type){
    try{
      await API.post(`/session/${session.id}/feedback`, { answerId, type })
      await loadHistory(session.id)
    }catch(err){console.error(err)}
  }

  if(!session) return <div className="flex-1 flex items-center justify-center">Start a new chat</div>

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto p-3 border rounded bg-white dark:bg-gray-800 dark:border-gray-700">
        {history?.messages?.length ? (
          history.messages.map((m, i) => (
            <ChatMessage key={m.id || i} msg={m} onFeedback={sendFeedback} />
          ))
        ) : (
          <div className="opacity-60">No messages yet. Ask something!</div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask a question..." className="flex-1 p-2 rounded border dark:bg-gray-900 dark:border-gray-700" />
        <button onClick={ask} disabled={loading} className="px-4 py-2 rounded bg-green-600 text-white">{loading ? '...' : 'Ask'}</button>
      </div>
    </div>
  )
}
