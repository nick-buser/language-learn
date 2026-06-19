import React, { useState } from 'react'

// =====================================================================
// The import surface — paste a block of Korean, give it a title, analyze. The
// passage joins the shelf and opens in the reading room.
// =====================================================================

export default function ReadingImport({ onImport, busy }) {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const submit = () => {
    if (!text.trim() || busy) return
    onImport(title.trim(), text.trim())
    setTitle('')
    setText('')
  }

  return (
    <div className="rv-import">
      <input
        className="rv-title"
        type="text"
        placeholder="title (optional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        aria-label="Reading title"
      />
      <textarea
        className="rv-textarea kr"
        placeholder="paste Korean text to read…"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={5}
        aria-label="Korean text to import"
      />
      <button className="rv-analyze" disabled={!text.trim() || busy} onClick={submit}>
        {busy ? 'analyzing…' : 'analyze ↓'}
      </button>
    </div>
  )
}
