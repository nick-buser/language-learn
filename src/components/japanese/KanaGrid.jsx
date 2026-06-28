import React, { useState } from 'react'
import { GOJUON, DAKUTEN, YOON, VOWEL_HEADS, YOON_HEADS } from '../../data/japaneseKana.js'
import { speak, speechSupported, hasVoice } from '../scripts/speech.js'

// =====================================================================
// The gojūon grid — the 五十音 as the machine it is: five vowels across,
// the consonant series down, every kana sitting at a (consonant × vowel)
// crossing. Toggle ひらがな/カタカナ to see the two scripts share one
// skeleton; open the 濁音 and 拗音 drawers for the rest; click any cell to
// hear it and read its twin. The point isn't 100 shapes to memorize — it's
// one grid with a tiny set of rules.
// =====================================================================
export default function KanaGrid({ lang = 'ja-JP', rate = 0.85 }) {
  const voice = speechSupported() && hasVoice('ja')
  const [script, setScript] = useState('hiragana')
  const [showDakuten, setShowDakuten] = useState(false)
  const [showYoon, setShowYoon] = useState(false)
  const [sel, setSel] = useState(null)

  const key = script === 'hiragana' ? 'h' : 'k'
  const twinKey = script === 'hiragana' ? 'k' : 'h'
  const baseRows = GOJUON.slice(0, -1)
  const nCell = GOJUON[GOJUON.length - 1].cells[0]

  const pick = (cell) => { if (!cell) return; setSel(cell); speak(cell[key], { lang, rate }) }

  const Cell = ({ cell }) => {
    if (!cell) return <td className="kg-cell empty" aria-hidden="true" />
    return (
      <td className={'kg-cell' + (cell.rare ? ' rare' : '') + (sel?.id === cell.id ? ' sel' : '')}>
        <button className="kg-btn" onClick={() => pick(cell)} lang={lang} title={cell.rr}>
          <span className="kgc-glyph">{cell[key]}</span>
          <span className="kgc-rr">{cell.rr}</span>
        </button>
      </td>
    )
  }

  const Table = ({ rows, heads }) => (
    <table className="kg-table">
      <thead>
        <tr><th className="kg-corner" /> {heads.map(v => <th key={v} className="kg-vh">{v}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            <th className="kg-ch">{row.cons || '∅'}</th>
            {row.cells.map((cell, j) => <Cell key={j} cell={cell} />)}
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="kana-grid" data-screen-label="gojūon grid">
      <div className="kg-controls">
        <div className="kg-seg" role="tablist" aria-label="script">
          <button role="tab" aria-selected={script === 'hiragana'} className={'kg-segbtn' + (script === 'hiragana' ? ' active' : '')} onClick={() => setScript('hiragana')} lang={lang}>ひらがな</button>
          <button role="tab" aria-selected={script === 'katakana'} className={'kg-segbtn' + (script === 'katakana' ? ' active' : '')} onClick={() => setScript('katakana')} lang={lang}>カタカナ</button>
        </div>
        <div className="kg-toggles">
          <button className={'kg-toggle' + (showDakuten ? ' on' : '')} onClick={() => setShowDakuten(v => !v)} aria-pressed={showDakuten}>濁音 dakuten</button>
          <button className={'kg-toggle' + (showYoon ? ' on' : '')} onClick={() => setShowYoon(v => !v)} aria-pressed={showYoon}>拗音 yōon</button>
        </div>
      </div>

      <div className="kg-tablewrap">
        <Table rows={baseRows} heads={VOWEL_HEADS} />
        <button className={'kg-ncell' + (sel?.id === 'n' ? ' sel' : '')} onClick={() => pick(nCell)} lang={lang}>
          <span className="kgc-glyph">{nCell[key]}</span>
          <span className="kgc-rr">n · the moraic ん — a syllable on its own</span>
        </button>
      </div>

      {showDakuten && (
        <div className="kg-drawer">
          <div className="kg-drawer-head">濁音 · 半濁音 — the ten-ten ( ゛) voices a series, the maru ( ゜) turns は into ぱ. <span className="kg-rare-note">ぢ/づ are kept faint — modern Japanese almost never needs them.</span></div>
          <Table rows={DAKUTEN} heads={VOWEL_HEADS} />
        </div>
      )}
      {showYoon && (
        <div className="kg-drawer">
          <div className="kg-drawer-head">拗音 — an i-row kana ( き・し・ち… ) plus a small ゃ/ゅ/ょ glides into one mora.</div>
          <Table rows={YOON} heads={YOON_HEADS} />
        </div>
      )}

      <div className={'kg-detail' + (sel ? ' has' : '')} aria-live="polite">
        {sel ? (
          <>
            <button className="kgd-main" onClick={() => pick(sel)} lang={lang} title="play">
              <span className="kgd-glyph">{sel[key]}</span>
            </button>
            <div className="kgd-info">
              <div className="kgd-rr">{sel.rr}</div>
              <div className="kgd-twin">
                <span className="kgd-twin-lbl">{script === 'hiragana' ? 'カタカナ' : 'ひらがな'}</span>
                <span className="kgd-twin-glyph" lang={lang}>{sel[twinKey]}</span>
              </div>
              {voice && <button className="kgd-play" onClick={() => speak(sel[key], { lang, rate })}>♪ play</button>}
            </div>
          </>
        ) : (
          <div className="kgd-empty">tap a kana — hear it, and see its {script === 'hiragana' ? 'katakana' : 'hiragana'} twin</div>
        )}
      </div>
    </div>
  )
}
