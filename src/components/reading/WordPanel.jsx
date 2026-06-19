import React from 'react'
import { STATUSES } from '../vocab/useVocabStore.js'
import { BRIDGE_KINDS } from '../../data/koreanVocab.js'

// =====================================================================
// The gloss + file panel for the tapped word. Dictionary back (reading, gloss,
// Japanese bridge — honoring the readings/bridge toggles) plus the same "file
// under" control as the word bank, so reading harvests straight into the vocab
// state. Words with no dictionary entry can't be filed (state is anchored to
// dictionary slugs) — said plainly rather than faked.
// =====================================================================

export default function WordPanel({ token, statusOf, onMark, showReadings, showJp }) {
  if (!token) {
    return (
      <div className="rv-panel empty">
        tap a lit word to gloss it and file what you know — known words recede, gaps stay lit
      </div>
    )
  }

  const e = token.entry
  if (!e) {
    return (
      <div className="rv-panel">
        <div className="rv-panel-head">
          <span className="kr lemma">{token.lemma}</span>
          <span className="pos">{token.pos}</span>
        </div>
        <div className="rv-panel-note">
          not in the bank yet — there’s no dictionary entry, so it can’t be filed. As the
          dictionary grows it’ll gloss here.
        </div>
      </div>
    )
  }

  const status = statusOf(e.id)
  return (
    <div className="rv-panel">
      <div className="rv-panel-head">
        <span className="kr head">{e.head}</span>
        {showReadings && <span className="rr">{e.reading.rr}</span>}
        <span className="pos">{e.pos}</span>
        {e.hanja && showJp && <span className="hanja">{e.hanja}</span>}
      </div>
      <div className="rv-gloss">{e.en}</div>
      {showJp && e.bridge && (
        <div className="rv-bridge">
          <span className="jp">{e.bridge.kanji}</span>
          {showReadings && e.bridge.kana && <span className="kana">{e.bridge.kana}</span>}
          <span className={'kind kind-' + e.bridge.kind} title={BRIDGE_KINDS[e.bridge.kind]?.hint}>
            {BRIDGE_KINDS[e.bridge.kind]?.label}
          </span>
        </div>
      )}
      <div className="rv-mark">
        <span className="k">file under</span>
        <div className="opts">
          {STATUSES.map(s => (
            <button
              key={s.id}
              className={'rv-mark-opt' + (status === s.id ? ' active' : '')}
              style={{ '--st': s.color }}
              title={s.hint}
              onClick={() => onMark(e.id, s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
