import React from 'react'

export default function ChatMessage({ msg, onFeedback }){
  if(msg.role === 'user'){
    return (
      <div className="mb-4 text-right">
        <div className="inline-block bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded">{msg.text}</div>
      </div>
    )
  }

  const { description, table, id, feedback = { likes:0, dislikes:0 } } = msg
  return (
    <div className="mb-6">
      <div className="mb-2 font-medium">Assistant</div>
      <div className="mb-3 text-sm opacity-80">{description}</div>

      <div className="overflow-auto rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2">
        <table className="w-full text-sm">
          <thead>
            <tr>{table.columns.map((c, i) => <th className="text-left p-2" key={i}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((r, ri) => (
              <tr key={ri} className="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                {r.map((cell, ci) => <td className="p-2" key={ci}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 flex items-center gap-3 text-sm">
        <button onClick={() => onFeedback(id, 'like')} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">👍 {feedback.likes}</button>
        <button onClick={() => onFeedback(id, 'dislike')} className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">👎 {feedback.dislikes}</button>
      </div>
    </div>
  )
}
