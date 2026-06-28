import React, { useRef, useState } from 'react'
import { INITIALS, MEDIALS, FINALS } from '../../data/koreanHangul.js'
import { BUILDER_PRESETS } from '../../data/koreanHangul.js'
import { composeBlock } from '../scripts/ime.js'
import { romanizeSyllable } from '../song/romanize.js'
import { speak, speechSupported, hasVoice } from '../scripts/speech.js'

// =====================================================================
// The block builder — hangul's whole genius made into an instrument. A
// syllable isn't an opaque shape; it's a 초성 (initial) + 중성 (medial)
// (+ 받침 final) you stack yourself. Pick the three parts, watch the block
// assemble (real Unicode composition, the inverse of romanize.js), hear it,
// read its RR. The 받침 panel is where the seven-sounds rule gets *felt*:
// pick ㅅ or ㅈ or ㅌ as a final and the block still sounds like [t].
// =====================================================================
const NEUTRALIZED = { 'ㅅ': 'ㄷ', 'ㅈ': 'ㄷ', 'ㅊ': 'ㄷ', 'ㅌ': 'ㄷ', 'ㅎ': 'ㄷ', 'ㅆ': 'ㄷ', 'ㅋ': 'ㄱ', 'ㄲ': 'ㄱ', 'ㅍ': 'ㅂ' }

export default function HangulBuilder({ lang = 'ko-KR', rate = 0.85 }) {
  const voice = speechSupported() && hasVoice('ko')
  const [L, setL] = useState('ㅎ')
  const [V, setV] = useState('ㅏ')
  const [T, setT] = useState('ㄴ')
  const [lantern, setLantern] = useState(null)
  const lanternFired = useRef(false)

  const block = composeBlock(L, V, T)
  const rr = romanizeSyllable(block)
  const say = () => speak(block, { lang, rate })

  const ini = INITIALS.find(i => i.jamo === L)
  const med = MEDIALS.find(m => m.jamo === V)
  const fin = FINALS.find(f => f.jamo === T)

  const pickL = (j) => { setL(j); speak(composeBlock(j, V, T), { lang, rate }) }
  const pickV = (j) => { setV(j); speak(composeBlock(L, j, T), { lang, rate }) }
  const pickT = (j) => {
    setT(j); speak(composeBlock(L, V, j), { lang, rate })
    if (j && NEUTRALIZED[j] && !lanternFired.current) {
      lanternFired.current = true
      setLantern({
        head: 'the seven-sounds rule',
        body: `A 받침 doesn’t keep its full sound — ${j} at the bottom of a block is pronounced like ${NEUTRALIZED[j]} [${FINALS.find(f => f.jamo === j)?.rr}]. Every possible final collapses to just seven sounds (ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ). It’s the same neutralization Japanese has none of — and the root of Korean’s liaison and assimilation downstream.`,
      })
    }
  }
  const loadPreset = (p) => { setL(p.L); setV(p.V); setT(p.T); speak(p.block, { lang, rate }) }

  const Col = ({ label, sub, items, value, onPick }) => (
    <div className="hb-col">
      <div className="hb-col-head"><span className="hb-col-glyph" lang={lang}>{label}</span> {sub}</div>
      <div className="hb-jamo-grid">
        {items.map((it, i) => (
          <button
            key={i}
            className={'hb-jamo' + (value === it.jamo ? ' sel' : '') + (it.jamo === '' ? ' none' : '')}
            data-kind={it.kind}
            onClick={() => onPick(it.jamo)}
            lang={lang}
          >
            <span className="hb-jamo-glyph">{it.jamo || '∅'}</span>
            <span className="hb-jamo-rr">{it.rr}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="hangul-builder" data-screen-label="hangul block builder">
      <div className="hb-presets">
        <span className="hb-presets-lbl">load:</span>
        {BUILDER_PRESETS.map(p => (
          <button key={p.block} className="hb-preset" onClick={() => loadPreset(p)} lang={lang}>{p.block}</button>
        ))}
      </div>

      <div className="hb-stage">
        <div className="hb-cols">
          <Col label="초성" sub="initial" items={INITIALS} value={L} onPick={pickL} />
          <Col label="중성" sub="medial" items={MEDIALS} value={V} onPick={pickV} />
          <Col label="받침" sub="final" items={FINALS} value={T} onPick={pickT} />
        </div>

        <div className="hb-result">
          <div className="hb-eq">
            <span className="hb-piece" lang={lang}>{L}</span>
            <span className="hb-op">+</span>
            <span className="hb-piece" lang={lang}>{V}</span>
            {T && <><span className="hb-op">+</span><span className="hb-piece" lang={lang}>{T}</span></>}
            <span className="hb-op">=</span>
            <button className="hb-block" onClick={say} title="play" lang={lang}>{block}</button>
          </div>
          <div className="hb-eq-rr">
            {ini?.rr}<span className="hb-op-rr">+</span>{med?.rr}{T && <>{' '}<span className="hb-op-rr">+</span>{fin?.rr}</>}
            <span className="hb-arrow-rr">→</span><span className="hb-rr">{rr}</span>
          </div>
          {T && (
            <div className="hb-batchim">
              <span className="hb-batchim-tag">받침</span>
              <span lang={lang}>{T}</span> sounds like
              <span lang={lang} className="hb-batchim-sound">{NEUTRALIZED[T] || T}</span>
              <span className="hb-batchim-rr">[{fin?.rr}]</span>
            </div>
          )}
          {voice && <button className="hb-play" onClick={say}>♪ play 「<span lang={lang}>{block}</span>」</button>}
        </div>
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{lantern.head}</div><div className="body">{lantern.body}</div></>)}
      </div>
    </div>
  )
}
