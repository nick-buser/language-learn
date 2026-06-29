import React, { useRef, useState } from 'react'
import SagittalMouth from '../phonetics/SagittalMouth.jsx'
import { CONSONANTS, PLACES, VOICE_LADDER, CONSONANT_BRIDGE, MOUTH_LANTERN } from '../../data/japanesePhonetics.js'
import { speak, primeSpeech, speechSupported, hasVoice } from '../scripts/speech.js'

// INSTRUMENT I — 子音 the gojūon as a mouth-map.
// Kana shape is arbitrary, so this reads the SYSTEM instead: rows are the
// consonant series ordered by place of articulation, columns are the voicing
// ladder (清音 plain → 濁音 ゛voiced → 半濁音 ゜the p-series). Sonorants take
// no diacritic — they are already voiced. Tap any kana: its place lights on
// the shared side-view mouth, and the readout tells what the glyph won't —
// the IPA, the dakuten relation, and the allophones (し ち つ ふ ひ に) the
// row quietly hides.

const byId = Object.fromEntries(CONSONANTS.map(c => [c.id, c]))
const PLACE = Object.fromEntries(PLACES.map(p => [p.id, p]))

const MANNER_LABEL = {
  stop: 'stop', fricative: 'fricative', affricate: 'affricate',
  nasal: 'nasal', tap: 'tap (flap)', approximant: 'glide',
}
const REG_LABEL = {
  sei: 'plain · 清音', daku: 'voiced · 濁音 ゛', handaku: 'p-series · 半濁音 ゜',
  son: 'sonorant (voiced)', allo: 'allophone — the row bends',
}

function bridgeFor(c) {
  if (c.id === 'r') return CONSONANT_BRIDGE.tap
  if (c.id === 'N') return CONSONANT_BRIDGE.moraic
  if (c.reg === 'son') return CONSONANT_BRIDGE.sonorant
  return CONSONANT_BRIDGE.voicing
}

function Glyph({ c, sel, onPick }) {
  if (!c) return <span className="cn-dash">·</span>
  const on = sel === c.id
  return (
    <button className={'cn-glyph' + (on ? ' active' : '') + (c.reg === 'allo' ? ' flagged' : '')}
            onClick={() => onPick(c.id)} aria-pressed={on}
            title={c.reg === 'allo' ? 'allophone — the kana hides a place/manner shift' : undefined}>
      <span className="cn-jamo jp">{c.kana}</span>
      <span className="cn-ipa">/{c.ipa}/</span>
      {c.reg === 'allo' && <span className="cn-flag" aria-hidden="true">✦</span>}
    </button>
  )
}

export default function JapaneseMouthMap({ showReadings = true, showJp = true }) {
  const [sel, setSel] = useState('k')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)
  const primed = useRef(false)
  const noVoice = !(speechSupported() && hasVoice('ja'))

  const c = byId[sel]
  const place = PLACE[c.place]
  const base = c.base && c.base !== c.kana ? c.base : null

  const pick = (id) => {
    setSel(id)
    if (!primed.current) { primed.current = true; primeSpeech() }
    if (!fired.current) { fired.current = true; setLantern(true) }
    const cc = byId[id]
    if (cc && cc.speak) speak(cc.speak, { lang: 'ja-JP' })
  }

  return (
    <div className="cn-stage" data-screen-label="japanese mouth-map">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Read a <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>row</b> as one place in the mouth, a{' '}
        <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>column</b> as the voicing ladder — plain, then ゛
        (voiced), then ゜(the p-series). The ✦ cells are where the row’s sound secretly changes.
      </div>

      <div className="cn-grid-wrap">
        <table className="cn-grid mm-grid">
          <thead>
            <tr>
              <th className="cn-corner" scope="col">series · place</th>
              <th scope="col"><span className="cn-col-k jp">清音</span><span className="cn-col-l">plain</span></th>
              <th scope="col"><span className="cn-col-k">゛</span><span className="cn-col-l">濁音 — voiced</span></th>
              <th scope="col"><span className="cn-col-k">゜</span><span className="cn-col-l">半濁音 — p</span></th>
              <th scope="col"><span className="cn-col-k jp">隠れ音</span><span className="cn-col-l">hidden in the row</span></th>
            </tr>
          </thead>
          <tbody>
            {VOICE_LADDER.map(row => {
              const p = PLACE[row.place]
              const rowActive = c.series === row.series
              return (
                <tr key={row.series} className={(rowActive ? 'active-row ' : '') + (row.obstruent ? '' : 'mm-sonorant')}>
                  <th scope="row" className={'cn-rowhead' + (rowActive ? ' active' : '')}>
                    <span className="cn-hanja jp">{row.label.ja}</span>
                    <span className="cn-place-en">{p.en}</span>
                    <span className="cn-place-ko">{row.label.en}</span>
                  </th>
                  <td className={'cn-cell' + (sel === row.sei?.id ? ' active' : '')}><Glyph c={row.sei} sel={sel} onPick={pick} /></td>
                  <td className={'cn-cell' + (sel === row.daku?.id ? ' active' : '')}><Glyph c={row.daku} sel={sel} onPick={pick} /></td>
                  <td className={'cn-cell' + (sel === row.handaku?.id ? ' active' : '')}><Glyph c={row.handaku} sel={sel} onPick={pick} /></td>
                  <td className="cn-cell mm-allo-bin">
                    {row.allos.length
                      ? row.allos.map(a => <Glyph key={a.id} c={a} sel={sel} onPick={pick} />)
                      : <span className="cn-dash">·</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* the readout */}
      <div className="cn-readout" key={sel}>
        <div className="cn-readout-left">
          <div className="cn-headline">
            <span className="cn-big jp">{c.kana}</span>
            <div className="cn-headmeta">
              <span className="cn-big-ipa">/{c.ipa}/</span>
              {showReadings && <span className="cn-rr">{c.rr}</span>}
              <button className="cn-hear" onClick={() => pick(c.id)} aria-label={`hear ${c.kana}`}>
                ♪ hear <span className="jp">{c.speak}</span>
              </button>
            </div>
          </div>
          <div className="cn-tags">
            <span className="cn-tag">{place.ja} · {place.en.split(' — ')[0]}</span>
            <span className="cn-tag">{MANNER_LABEL[c.manner]}</span>
            <span className={'cn-tag voi-' + c.voicing}>{c.voicing}</span>
            <span className={'cn-tag reg-' + c.reg}>{REG_LABEL[c.reg]}</span>
          </div>
          {c.ipaNote && <div className="cn-ipa-note">{c.ipaNote}</div>}

          <div className="cn-shape">
            <div className="cn-shape-head">what the kana won’t tell you</div>
            <p>{c.note || `A plain ${MANNER_LABEL[c.manner]} at ${place.en.split(' — ')[0]} — the row stays put across all five vowels.`}</p>
            {(c.reg === 'daku' || c.reg === 'handaku') && base && (
              <div className="cn-ladder-trace">
                <span className="jp">{base}</span>
                <span className="cn-arrow">→ {c.reg === 'daku' ? '＋゛' : '＋゜'} →</span>
                <span className="jp lit">{c.kana}</span>
              </div>
            )}
            {c.reg === 'allo' && base && (
              <div className="cn-ladder-trace">
                <span className="jp">{base}</span>
                <span className="cn-arrow">行 → before {c.id === 'fu' || c.id === 'tsu' ? '/u/' : '/i/'} →</span>
                <span className="jp lit">{c.kana}</span>
              </div>
            )}
          </div>

          {showJp && (
            <div className="jbridge">
              <span className="jbridge-mark">한국어</span>
              {bridgeFor(c)}
            </div>
          )}
        </div>

        <div className="cn-readout-right">
          <SagittalMouth region={place.region} />
          <div className="cn-diagram-cap">
            made at <b>{place.en.split(' — ')[0]}</b> — <i>{place.organ}</i>
            {c.id === 'N' && <><br />…but ん moves: it copies the next sound’s place.</>}
          </div>
        </div>
      </div>

      {noVoice && (
        <div className="cn-novoice">No Japanese system voice detected — the grid, IPA, and diagrams work; sound stays quiet until a 日本語 voice is installed.</div>
      )}

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{MOUTH_LANTERN.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: MOUTH_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
