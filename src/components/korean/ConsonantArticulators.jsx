import React, { useRef, useState } from 'react'
import SagittalMouth from '../phonetics/SagittalMouth.jsx'
import { PLACES, CONSONANTS, CONSONANT_LADDER, CONSONANT_LANTERN } from '../../data/koreanPhonetics.js'
import { speak, primeSpeech, speechSupported, hasVoice } from '../scripts/speech.js'

// INSTRUMENT I — 자음 the articulators.
// The consonant grid read as what it is: a map of the mouth. Rows are the
// five organs (오음); columns are the stroke-ladder — base pictograph →
// +stroke (plosive/affricate) → +stroke (aspirate) → doubled (tense), with
// the off-ladder variant (ㄹ) in its own bin. Pick any letter and the
// readout shows its IPA, lights the place on a side-view mouth, and tells
// the shape story — or flags where the shape↔sound rule bends.

const byId = Object.fromEntries(CONSONANTS.map(c => [c.id, c]))
const PLACE = Object.fromEntries(PLACES.map(p => [p.id, p]))

const PHON_LABEL = {
  plain: 'plain · 평음', aspirate: 'aspirated · 격음', tense: 'tense · 경음',
  sonorant: 'sonorant (nasal/liquid)', silent: 'silent seat / [ŋ] final',
}
const MANNER_LABEL = {
  plosive: 'stop', nasal: 'nasal', fricative: 'fricative', affricate: 'affricate', liquid: 'liquid',
}

function GlyphButton({ c, sel, onPick }) {
  const on = sel === c.id
  return (
    <button className={'cn-glyph' + (on ? ' active' : '') + (c.exception ? ' flagged' : '')}
            onClick={() => onPick(c.id)} aria-pressed={on}
            title={c.exception ? 'shape↔sound exception' : undefined}>
      <span className="cn-jamo kr">{c.jamo}</span>
      <span className="cn-ipa">/{c.ipa}/</span>
      {c.exception && <span className="cn-flag" aria-hidden="true">✦</span>}
    </button>
  )
}

function Cell({ c, sel, onPick }) {
  if (!c) return <td className="cn-cell empty"><span className="cn-dash">·</span></td>
  return (
    <td className={'cn-cell' + (sel === c.id ? ' active' : '')}>
      <GlyphButton c={c} sel={sel} onPick={onPick} />
    </td>
  )
}

export default function ConsonantArticulators({ showReadings = true }) {
  const [sel, setSel] = useState('g')
  const [lantern, setLantern] = useState(false)
  const fired = useRef(false)
  const primed = useRef(false)
  const noVoice = !(speechSupported() && hasVoice('ko'))

  const c = byId[sel]
  const place = PLACE[c.place]

  const pick = (id) => {
    setSel(id)
    if (!primed.current) { primed.current = true; primeSpeech() }
    if (!fired.current) { fired.current = true; setLantern(true) }
    const cc = byId[id]
    if (cc && cc.speak) speak(cc.speak, { lang: 'ko-KR' })
  }

  return (
    <div className="cn-stage" data-screen-label="consonant articulators">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Read a <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>row</b> as one organ of the mouth, a{' '}
        <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>column</b> as one step of breath. Tap a letter —
        its place lights on the mouth, and the shape tells you how it is made.
      </div>

      <div className="cn-grid-wrap">
        <table className="cn-grid">
          <thead>
            <tr>
              <th className="cn-corner" scope="col">organ · 오음</th>
              <th scope="col"><span className="cn-col-k kr">기본</span><span className="cn-col-l">base — the picture</span></th>
              <th scope="col"><span className="cn-col-k">＋획</span><span className="cn-col-l">＋stroke — a stop</span></th>
              <th scope="col"><span className="cn-col-k">＋획</span><span className="cn-col-l">＋stroke — aspirated</span></th>
              <th scope="col"><span className="cn-col-k kr">된소리</span><span className="cn-col-l">doubled — tense</span></th>
              <th scope="col"><span className="cn-col-k kr">이체</span><span className="cn-col-l">off-ladder</span></th>
            </tr>
          </thead>
          <tbody>
            {CONSONANT_LADDER.map(row => {
              const p = PLACE[row.place]
              const rowActive = c.place === row.place
              return (
                <tr key={row.place} className={rowActive ? 'active-row' : ''}>
                  <th scope="row" className={'cn-rowhead' + (rowActive ? ' active' : '')}>
                    <span className="cn-hanja">{p.hanja}</span>
                    <span className="cn-place-en">{p.en}</span>
                    <span className="cn-place-ko">{p.ko}</span>
                  </th>
                  <Cell c={row.base} sel={sel} onPick={pick} />
                  <Cell c={row.plosive} sel={sel} onPick={pick} />
                  <Cell c={row.aspirate} sel={sel} onPick={pick} />
                  <td className="cn-cell tense-bin">
                    {row.tense.length
                      ? row.tense.map(t => <GlyphButton key={t.id} c={t} sel={sel} onPick={pick} />)
                      : <span className="cn-dash">·</span>}
                  </td>
                  <Cell c={row.variant[0]} sel={sel} onPick={pick} />
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
            <span className="cn-big kr">{c.jamo}</span>
            <div className="cn-headmeta">
              <span className="cn-big-ipa">/{c.ipa}/</span>
              {showReadings && <span className="cn-rr">{c.rr}</span>}
              <button className="cn-hear" onClick={() => pick(c.id)} aria-label={`hear ${c.jamo}`}>
                ♪ hear <span className="kr">{c.speak}</span>
              </button>
            </div>
          </div>
          <div className="cn-tags">
            <span className="cn-tag">{place.hanja} · {place.en}</span>
            <span className="cn-tag">{MANNER_LABEL[c.manner]}</span>
            <span className={'cn-tag phon-' + c.phon}>{PHON_LABEL[c.phon]}</span>
          </div>
          {c.ipaNote && <div className="cn-ipa-note">{c.ipaNote}</div>}

          <div className="cn-shape">
            <div className="cn-shape-head">how the shape is built</div>
            <p>{c.origin || c.deriv}</p>
            {c.base !== c.jamo && c.build === 'stroke' && (
              <div className="cn-ladder-trace">
                <span className="kr">{c.base}</span>
                <span className="cn-arrow">→ ＋획 →</span>
                <span className="kr lit">{c.jamo}</span>
              </div>
            )}
            {c.build === 'doubling' && (
              <div className="cn-ladder-trace">
                <span className="kr">{c.base}</span><span className="cn-arrow">→ 나란히 →</span>
                <span className="kr lit">{c.jamo}</span>
              </div>
            )}
          </div>

          {c.exception && (
            <div className="cn-exception">
              <span className="cn-exception-mark">✦ exception</span>
              {c.exception}
            </div>
          )}
        </div>

        <div className="cn-readout-right">
          <SagittalMouth region={place.region} />
          <div className="cn-diagram-cap">
            made at <b>{place.en.split(' — ')[0]}</b> — <i>{place.organ}</i>
          </div>
        </div>
      </div>

      {noVoice && (
        <div className="cn-novoice">No Korean system voice detected — the shapes and IPA work; sound stays quiet until a 한국어 voice is installed.</div>
      )}

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{CONSONANT_LANTERN.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: CONSONANT_LANTERN.body }} /></>)}
      </div>
    </div>
  )
}
