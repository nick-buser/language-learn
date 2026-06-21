import React from 'react'

// =====================================================================
// The passage, rendered with its content words lit by what you know. Known
// words recede (the eye flows); gaps — target / learning / unseen / not-in-bank
// — wear a colored underline so attention lands where the learning is. Tap any
// lit word to gloss and file it.
//
// Renders the *original* text by char offset (so 예쁜 highlights as written,
// not Kiwi's 예쁘 morpheme form). Function morphemes and whitespace pass through
// as plain text; non-content spans are never separately rendered.
// =====================================================================

const KLASS_COLOR = {
  known: 'var(--st-active)',
  target: 'var(--signal)',
  learning: 'var(--amber)',
  met: 'var(--st-travel)',
  unseen: 'var(--ink-faded)',
  unknown: 'var(--ink-faded)',
}

export default function ReadingView({ text, tokens, onSelect, selectedStart }) {
  const lit = tokens
    .filter(t => t.klass !== 'function')
    .sort((a, b) => a.start - b.start)

  const out = []
  let cursor = 0
  let key = 0
  for (const t of lit) {
    if (t.start < cursor) continue // defensive: skip any overlap
    if (t.start > cursor) out.push(<span key={'p' + key++}>{text.slice(cursor, t.start)}</span>)
    out.push(
      <span
        key={'w' + key++}
        className={'rv-word rv-' + t.klass + (t.start === selectedStart ? ' sel' : '')}
        style={{ '--st': KLASS_COLOR[t.klass] }}
        role="button"
        tabIndex={0}
        title={t.lemma}
        onClick={() => onSelect(t)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(t) } }}
      >
        {text.slice(t.start, t.start + t.length)}
      </span>
    )
    cursor = t.start + t.length
  }
  if (cursor < text.length) out.push(<span key={'p' + key++}>{text.slice(cursor)}</span>)

  return <div className="rv-text kr">{out}</div>
}
