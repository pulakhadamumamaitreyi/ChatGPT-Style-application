import React from 'react'

export default function Sidebar({ sessions = [], collapsed, onToggle, onStartNew, onSelectSession }){
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-72'} transition-all bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-3 flex flex-col`}>
      <div className="flex items-center justify-between mb-4">
        {!collapsed && <div className="font-bold">Chats</div>}
        <button onClick={onToggle} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">{collapsed ? '>>' : '<<'}</button>
      </div>

      <button onClick={onStartNew} className="mb-3 px-3 py-2 rounded bg-blue-500 text-white">New Chat</button>

      <div className="flex-1 overflow-auto">
        {sessions.length === 0 && <div className="text-sm opacity-60">No sessions yet</div>}
        {sessions.map(s => (
          <div key={s.id} onClick={() => onSelectSession(s)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer mb-1">
            <div className="text-sm font-medium truncate">{s.title}</div>
            <div className="text-xs opacity-60">{new Date(s.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs opacity-70">User: demo@example.com</div>
    </aside>
  )
}
