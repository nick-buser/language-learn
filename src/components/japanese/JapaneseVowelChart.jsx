import React, { useRef, useState } from 'react'
import {
  VOWELS, VOWEL_NOTES, VOWEL_LANTERN,
  VOWEL_COMBOS, COMBO_GROUPS, VOWEL_COMBO_LANTERN,
  SPANISH_VOWELS, SPANISH_COMPARE,
  VOICE_CALIBRATION, VOICE_LANTERN,
} from '../../data/japanesePhonetics.js'
import { speak, primeSpeech, speechSupported, hasVoice } from '../scripts/speech.js'
import { useVoiceCompass } from '../scripts/useVoiceCompass.js'
import VoiceReadout from '../phonetics/VoiceReadout.jsx'

// INSTRUMENT II — 母音 the vowel compass.
// One trapezoid, three views the learner switches between:
//   • the five — Japanese's five pure monophthongs on the real IPA trapezoid
//     (う is [ɯ], close-back but UNROUNDED), with a comparison overlay that
//     ghosts in either Korean's TEN (the 5→10 split: ㅡ/ㅜ, ㅗ/ㅓ) or Spanish's
//     near-identical five (the one gap being the rounded u).
//   • combinations — what two vowels DO when they meet: hold one quality long
//     (長音: えい→[eː], おう→[oː], the doubled spellings) or stay two separate
//     morae (連母音: あい is a·i, no glide — Japanese has no true diphthongs).
//   • your voice (発声) — the learner's own vowels, measured off the mic and
//     dropped onto the SAME trapezoid beside the ideal five. Because formants
//     are speaker-relative, the dot is anchored to your voice first: say the
//     three corner vowels (the calibration walk) and the compass fits your
//     vowel space. The formant engine + affine fit live in the formants seam.

const byId = Object.fromEntries(VOWELS.map(v => [v.id, v]))
const comboById = Object.fromEntries(VOWEL_COMBOS.map(c => [c.id, c]))
const esByJp = Object.fromEntries(SPANISH_VOWELS.map(s => [s.jp, s]))
const MACRON = { a: 'ā', i: 'ī', u: 'ū', e: 'ē', o: 'ō' }

// v3: the engine was replaced — real LPC/Burg formants in Hz, where v2 read
// mel-bin spectral peaks. A calibration saved against the old units is
// meaningless against Hz, so bumping the key retires it and prompts a fresh
// calibration instead of mapping through stale coefficients.
const CAL_KEY = 'atlas.formant.cal.v3'
const CALQ_KEY = 'atlas.formant.calq.v3'

// IPA quadrilateral corners (SVG units) — shared geometry with the Korean compass.
const TL = [52, 32], TR = [270, 32], BR = [250, 200], BL = [122, 200]
function plot(vx, vy) {
  const topX = TL[0] + (TR[0] - TL[0]) * vx, topY = TL[1] + (TR[1] - TL[1]) * vx
  const botX = BL[0] + (BR[0] - BL[0]) * vx, botY = BL[1] + (BR[1] - BL[1]) * vx
  return [topX + (botX - topX) * vy, topY + (botY - topY) * vy]
}

function Mono({ v, sel, onPick }) {
  const [cx, cy] = plot(v.x, v.y)
  const on = sel === v.id
  return (
    <g className={'vc-node' + (on ? ' lit' : '') + (v.round ? ' round' : '')}
       onClick={() => onPick(v.id)} role="button" aria-label={v.kana} tabIndex={0}
       onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(v.id) } }}>
      {on && <circle className="vc-halo" cx={cx} cy={cy} r="17" />}
      {v.round && <circle className="vc-round-ring" cx={cx} cy={cy} r="13" />}
      <circle className="vc-dot" cx={cx} cy={cy} r={on ? 12 : 10} />
      <text className="vc-node-glyph jp" x={cx} y={cy} dominantBaseline="central" textAnchor="middle">{v.kana}</text>
    </g>
  )
}

// A faint anchor — the five vowels as backdrop in the combinations / voice views.
function Anchor({ v }) {
  const [cx, cy] = plot(v.x, v.y)
  return (
    <g className="vc-anchor" aria-hidden="true">
      <circle className="vc-anchor-dot" cx={cx} cy={cy} r="7" />
      <text className="vc-anchor-glyph jp" x={cx} y={cy} dominantBaseline="central" textAnchor="middle">{v.kana}</text>
    </g>
  )
}

// A lit combination endpoint — held (gold), faint (the silent-stretch letter), or plain.
function ComboNode({ v, variant }) {
  const [cx, cy] = plot(v.x, v.y)
  return (
    <g className={'vc-cnode' + (variant ? ' ' + variant : '')} aria-hidden="true">
      <circle className="vc-cdot" cx={cx} cy={cy} r="11" />
      <text className="vc-cglyph jp" x={cx} y={cy} dominantBaseline="central" textAnchor="middle">{v.kana}</text>
    </g>
  )
}

// The selected combination drawn on the trapezoid: a held double-ring for a
// long vowel (with a dashed "lie" arrow toward the silent second letter), or a
// solid two-beat arrow for a true sequence.
function ComboOverlay({ combo }) {
  const from = byId[combo.from], to = byId[combo.to]
  const [fx, fy] = plot(from.x, from.y)
  const [tx, ty] = plot(to.x, to.y)

  if (combo.kind === 'seq') {
    return (
      <>
        <g className="vc-arrow seq">
          <line x1={fx} y1={fy} x2={tx} y2={ty} markerEnd="url(#jvc-head)" />
        </g>
        <ComboNode v={from} />
        <ComboNode v={to} />
      </>
    )
  }

  const held = byId[combo.held]
  const [hx, hy] = plot(held.x, held.y)
  return (
    <>
      {combo.lie && (
        <g className="vc-arrow lie">
          <line x1={fx} y1={fy} x2={tx} y2={ty} markerEnd="url(#jvc-head-lie)" />
        </g>
      )}
      <circle className="vc-hold outer" cx={hx} cy={hy} r="16" />
      <circle className="vc-hold inner" cx={hx} cy={hy} r="11" />
      <ComboNode v={held} variant="held" />
      {combo.lie && from.id !== to.id && <ComboNode v={to} variant="faint" />}
    </>
  )
}

// A Korean twin, ghosted in under the bridge. `split` ones (the vowels a
// Japanese ear must newly carve out) get the signal colour.
function KoGhost({ tw, from }) {
  const [kx, ky] = plot(tw.x, tw.y)
  return (
    <g className={'jvb-ghost' + (tw.split ? ' split' : '')} aria-hidden="true">
      <line className="jvb-link" x1={from[0]} y1={from[1]} x2={kx} y2={ky} />
      <circle className="jvb-dot" cx={kx} cy={ky} r="8.5" />
      <text className="jvb-glyph kr" x={kx} y={ky} dominantBaseline="central" textAnchor="middle">{tw.jamo}</text>
    </g>
  )
}

// A Spanish twin, ghosted as a square. The four that match drop almost on the
// Japanese node (no connector); only u (the gap) sits apart, marked gold.
function EsGhost({ es, lit }) {
  const jp = byId[es.jp]
  const [jx, jy] = plot(jp.x, jp.y)
  const [sx, sy] = plot(es.x, es.y)
  const far = Math.hypot(sx - jx, sy - jy) > 9
  return (
    <g className={'es-ghost' + (es.gap ? ' gap' : '') + (lit ? ' lit' : '')} aria-hidden="true">
      {far && <line className="es-link" x1={jx} y1={jy} x2={sx} y2={sy} />}
      <rect className="es-dot" x={sx - 7.5} y={sy - 7.5} width="15" height="15" rx="2.5" />
      <text className="es-glyph" x={sx} y={sy} dominantBaseline="central" textAnchor="middle">{es.letter}</text>
    </g>
  )
}

// The learner's voice on the trapezoid — a fading trail of recent readings and
// a lit, haloed dot for the latest. (Mapped (x,y) already in trapezoid space.)
function VoiceTrail({ dots, listening }) {
  if (!dots.length) return null
  const last = dots[dots.length - 1]
  const [lx, ly] = plot(last.x, last.y)
  return (
    <g className="vc-voice-layer" aria-hidden="true">
      {dots.map((d, i) => {
        if (i === dots.length - 1) return null
        const [cx, cy] = plot(d.x, d.y)
        const t = dots.length > 1 ? i / (dots.length - 1) : 1
        return <circle key={i} className="vc-voicedot trail" cx={cx} cy={cy} r="5" style={{ opacity: 0.1 + 0.4 * t }} />
      })}
      <g className={'vc-voicedot-live' + (listening ? ' listening' : '')}>
        <circle className="vc-voicehalo" cx={lx} cy={ly} r="16" />
        <circle className="vc-voicedot live" cx={lx} cy={ly} r="9" />
      </g>
    </g>
  )
}

export default function JapaneseVowelChart({ showReadings = true, showJp = true }) {
  const [mode, setMode] = useState('pure')          // 'pure' | 'combo' | 'voice'
  const [compare, setCompare] = useState('ko')       // 'ko' | 'es' (pure view only)
  const [sel, setSel] = useState('u')                // pure: a vowel id
  const [selCombo, setSelCombo] = useState('ei')     // combo: a combination id
  const [litPure, setLitPure] = useState(false)
  const [litCombo, setLitCombo] = useState(false)
  const primed = useRef(false)
  const noVoice = !(speechSupported() && hasVoice('ja'))

  // ── voice (発声) — the live-mic vowel mode, behind the shared seam ──
  const voice = useVoiceCompass({
    vowels: VOWELS,
    anchors: VOICE_CALIBRATION.anchors,
    glyphOf: vw => vw.kana,
    noMic: VOICE_CALIBRATION.noMic,
    calKey: CAL_KEY, calqKey: CALQ_KEY,
    active: mode === 'voice',
  })

  const v = byId[sel]
  const combo = comboById[selCombo]
  const es = esByJp[sel]
  const showKo = mode === 'pure' && compare === 'ko' && showJp
  const showEs = mode === 'pure' && compare === 'es'

  const prime = () => { if (!primed.current) { primed.current = true; primeSpeech() } }

  const pick = (id) => {
    setSel(id)
    prime()
    if (!litPure) setLitPure(true)
    const vv = byId[id]
    if (vv && vv.speak) speak(vv.speak, { lang: 'ja-JP' })
  }
  const pickCombo = (id) => {
    setSelCombo(id)
    prime()
    if (!litCombo) setLitCombo(true)
    const cc = comboById[id]
    if (cc) speak(cc.kana, { lang: 'ja-JP' })
  }
  const hearWord = (ex) => { prime(); speak(ex.kana, { lang: 'ja-JP' }) }

  const comboResult = (c) => (c.kind === 'long' ? MACRON[c.held] : byId[c.from].rr + '·' + byId[c.to].rr)

  const lit = mode === 'pure' ? litPure : mode === 'combo' ? litCombo : voice.lit
  const lantern = mode === 'pure' ? VOWEL_LANTERN : mode === 'combo' ? VOWEL_COMBO_LANTERN : VOICE_LANTERN

  return (
    <div className="vc-stage" data-screen-label="japanese vowel compass">
      {/* mode switch + (in the five) the comparison overlay picker */}
      <div className="vc-modebar">
        <div className="vc-seg" role="tablist" aria-label="vowel view">
          <button className={'vc-seg-btn' + (mode === 'pure' ? ' on' : '')} role="tab" aria-selected={mode === 'pure'}
                  onClick={() => setMode('pure')}>
            <span className="jp">五母音</span>the five
          </button>
          <button className={'vc-seg-btn' + (mode === 'combo' ? ' on' : '')} role="tab" aria-selected={mode === 'combo'}
                  onClick={() => setMode('combo')}>
            <span className="jp">組合せ</span>combinations
          </button>
          <button className={'vc-seg-btn' + (mode === 'voice' ? ' on' : '')} role="tab" aria-selected={mode === 'voice'}
                  onClick={() => setMode('voice')}>
            <span className="jp">発声</span>your voice
          </button>
        </div>
        {mode === 'pure' && (
          <div className="vc-seg compare" role="tablist" aria-label="compare against">
            <span className="vc-seg-label">compare</span>
            <button className={'vc-seg-btn' + (compare === 'ko' ? ' on' : '')} role="tab" aria-selected={compare === 'ko'}
                    onClick={() => setCompare('ko')}>
              <span className="kr">한국어</span>
            </button>
            <button className={'vc-seg-btn' + (compare === 'es' ? ' on' : '')} role="tab" aria-selected={compare === 'es'}
                    onClick={() => setCompare('es')}>
              Español
            </button>
          </div>
        )}
      </div>

      <div className="loom-prompt" style={{ marginTop: 0 }}>
        {mode === 'pure' ? (
          <>
            The frame is the real mouth — <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>front</b> at left,
            <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}> back</b> at right, high at top, open at the floor.
            Five clean vowels.{' '}
            {showEs
              ? 'The faint squares are Spanish’s five — see how four drop on top, and which one sits apart.'
              : showKo
                ? 'The faint hangul are Korean’s ten, ghosted underneath — see where one Japanese vowel splits into two.'
                : 'Tap one to hear it.'}
          </>
        ) : mode === 'combo' ? (
          <>Two vowels meet — does Japanese <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>hold one longer</b> (長音),
            or give <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>each its own beat</b> (連母音)? The kana won’t
            tell you. Pick a pair and read which.</>
        ) : (
          <>Now the trapezoid goes live: speak, and your own vowel drops as a{' '}
            <b style={{ color: 'var(--st-travel)', fontStyle: 'normal' }}>dot</b> among the ideal five. Because a low voice and
            a high one place the same vowel differently, anchor it to your voice first — then aim your{' '}
            <b style={{ color: 'var(--accent)', fontStyle: 'normal' }}>う</b> at the back corner and watch it land.</>
        )}
      </div>

      {mode === 'voice' && (
        <div className="vc-voice-wip" role="note">
          <span className="vc-voice-wip-tag jp">試作</span>
          <span className="vc-voice-wip-tag">experimental</span>
          {VOICE_CALIBRATION.disclaimer}
        </div>
      )}

      <div className="vc-main">
        <div className="vc-chart">
          <svg viewBox="0 0 312 224" className="vc-trapezoid" role="img" aria-label="IPA vowel trapezoid with the Japanese vowels plotted">
            <defs>
              <marker id="jvc-head" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                <path className="jvc-mk" d="M0,0 L6,3 L0,6 Z" />
              </marker>
              <marker id="jvc-head-lie" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                <path className="jvc-mk-lie" d="M0,0 L6,3 L0,6 Z" />
              </marker>
            </defs>
            <text className="vc-axis" x={(TL[0] + TR[0]) / 2} y="18" textAnchor="middle">tongue: front ← → back</text>
            <text className="vc-axis vert" x="20" y={(TL[1] + BL[1]) / 2} textAnchor="middle"
                  transform={`rotate(-90 20 ${(TL[1] + BL[1]) / 2})`}>close (high) ← → open (low)</text>
            <polygon className="vc-quad" points={`${TL} ${TR} ${BR} ${BL}`} />
            <line className="vc-grid" x1={plot(0, 0.5)[0]} y1={plot(0, 0.5)[1]} x2={plot(1, 0.5)[0]} y2={plot(1, 0.5)[1]} />

            {mode === 'pure' ? (
              <>
                {/* comparison ghosts, drawn under the Japanese nodes */}
                {showKo && v.bridge?.ko.map((tw, i) => <KoGhost key={i} tw={tw} from={plot(v.x, v.y)} />)}
                {showEs && SPANISH_VOWELS.map(s => <EsGhost key={s.id} es={s} lit={s.jp === sel} />)}
                {VOWELS.map(m => <Mono key={m.id} v={m} sel={sel} onPick={pick} />)}
              </>
            ) : mode === 'combo' ? (
              <>
                {VOWELS.map(m => <Anchor key={m.id} v={m} />)}
                <ComboOverlay combo={combo} />
              </>
            ) : (
              <>
                {VOWELS.map(m => <Anchor key={m.id} v={m} />)}
                <VoiceTrail dots={voice.dots} listening={voice.listening} />
              </>
            )}
          </svg>
          <div className="vc-chart-cap">
            {mode === 'combo' ? (
              <>The five sit faint as anchors. <b className="jvb-splitword">Gold</b> ring = a held long vowel (一つの母音、二拍);
                the arrow = a true two-beat sequence. A dashed arrow on えい/おう points at the letter you <em>don’t</em> pronounce.</>
            ) : mode === 'voice' ? (
              <>The five sit faint as targets; your <b style={{ color: 'var(--st-travel)' }}>dot</b> is the latest reading, with a
                short trail behind it. It’s segment-based — say a vowel, pause, and it lands (a beat later). The plot is your own
                vowel space, fitted to the frame.</>
            ) : showEs ? (
              <>Faint squares = Spanish <i>a e i o u</i>; four land on the Japanese vowels, only <b className="jvb-splitword">u</b> sits
                apart — Spanish rounds it, Japanese doesn’t. The plot is schematic.</>
            ) : (
              <>● the ring marks the one rounded vowel (お). The plot is schematic — broad Tokyo values.
                {showKo && <> Faint <span className="kr">하늘</span> hangul = the Korean vowel(s) this one maps to; <b className="jvb-splitword">gold</b> = a vowel Korean splits off that Japanese doesn’t have.</>}
                {compare === 'ko' && !showJp && <> <span style={{ color: 'var(--ink-faded)' }}>(turn on the 한국어 bridge above to ghost Korean’s ten underneath.)</span></>}
              </>
            )}
          </div>
        </div>

        {/* readout — the five */}
        {mode === 'pure' && (
          <div className="vc-readout" key={'v-' + sel}>
            <div className="vc-headline">
              <span className="vc-big jp">{v.kana}</span>
              <div className="vc-headmeta">
                <span className="vc-big-ipa">[{v.ipa}]</span>
                {showReadings && <span className="vc-rr">{v.rr}</span>}
                <button className="vc-hear" onClick={() => pick(v.id)} aria-label={`hear ${v.kana}`}>
                  ♪ hear <span className="jp">{v.kana}</span>
                </button>
              </div>
            </div>

            <div className="vc-tags">
              <span className="vc-tag">{v.x < 0.4 ? 'front' : v.x > 0.6 ? 'back' : 'central'}</span>
              <span className="vc-tag">{v.y < 0.3 ? 'close (high)' : v.y > 0.7 ? 'open (low)' : 'mid'}</span>
              <span className={'vc-tag ' + (v.round ? 'voi-voiced' : '')}>{v.round ? 'rounded lips' : 'unrounded'}</span>
            </div>

            <div className="vc-build">
              <p className="vc-build-prose">{v.note}</p>
            </div>

            {showKo && v.bridge && (
              <div className="jbridge">
                <span className="jbridge-mark">한국어</span>
                <span className="jvb-twins">
                  {v.bridge.ko.map((tw, i) => (
                    <span key={i} className={'jvb-twin kr' + (tw.split ? ' split' : '')}>{tw.jamo}{showReadings && <em> {tw.rr}</em>}</span>
                  ))}
                </span>
                {v.bridge.note}
              </div>
            )}

            {showEs && es && (
              <div className="jbridge esbridge">
                <span className="jbridge-mark es">{SPANISH_COMPARE.mark}</span>
                <span className="jvb-twins">
                  <span className={'jvb-twin' + (es.gap ? ' split' : '')}>{es.letter}{showReadings && <em> [{es.ipa}]</em>}</span>
                </span>
                {es.note}{es.gap && <> {SPANISH_COMPARE.gap}</>}
              </div>
            )}
          </div>
        )}

        {/* readout — combinations */}
        {mode === 'combo' && (
          <div className="vc-readout" key={'c-' + selCombo}>
            <div className="vc-headline">
              <span className="vc-big jp combo">{combo.kana}</span>
              <div className="vc-headmeta">
                <span className="vc-big-ipa">[{combo.ipa}]</span>
                {showReadings && <span className="vc-rr">{combo.rr}</span>}
                <button className="vc-hear" onClick={() => pickCombo(combo.id)} aria-label={`hear ${combo.kana}`}>
                  ♪ hear <span className="jp">{combo.kana}</span>
                </button>
              </div>
            </div>

            <div className="vc-tags">
              <span className={'vc-tag ' + (combo.kind === 'long' ? 'voi-voiced' : '')}>
                {combo.kind === 'long' ? '長音 · held' : '連母音 · sequence'}
              </span>
              <span className="vc-tag">2 morae · 2 beats</span>
              <span className="vc-tag">{combo.kind === 'long' ? 'one vowel, held' : 'no glide'}</span>
              {combo.lie && <span className="vc-tag reg-allo">spelling ≠ sound</span>}
            </div>

            <div className="vc-build">
              <div className="vc-build-parts">
                <span className="vc-part jp">{byId[combo.from].kana}</span>
                <span className="vc-plus">+</span>
                <span className="vc-part jp">{byId[combo.to].kana}</span>
                <span className="vc-eq">→</span>
                <span className="vc-part result">{comboResult(combo)}</span>
              </div>
              <p className="vc-build-prose">{combo.note}</p>
            </div>

            {combo.lie && (
              <div className="vc-lie-note">
                <span className="vc-lie-mark">the spelling lies</span>
                Two letters on the page, one held vowel in the mouth — the {byId[combo.to].kana} is silent length, not a second sound.
              </div>
            )}

            <div className="vco-ex">
              {combo.examples.map((ex, i) => (
                <button key={i} className="vco-ex-chip" onClick={() => hearWord(ex)} aria-label={`hear ${ex.kana}`}>
                  <span className="vco-ex-w jp">{ex.kanji || ex.kana}</span>
                  {showReadings && <span className="vco-ex-rr">{ex.rr}</span>}
                  <span className="vco-ex-en">{ex.en}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* readout — your voice (発声) — the shared voice panel */}
        {mode === 'voice' && (
          <VoiceReadout
            {...voice}
            copy={VOICE_CALIBRATION}
            vowels={VOWELS}
            glyphOf={vw => vw.kana}
            glyphClass="jp"
          />
        )}
      </div>

      {/* the combination chip racks, grouped by what the pair does */}
      {mode === 'combo' && (
        <div className="vc-racks">
          {COMBO_GROUPS.map(g => (
            <div className="vc-rack" key={g.id}>
              <div className="vc-rack-head"><span className="jp">{g.ja}</span><span className="vc-rack-l">{g.l}</span></div>
              <div className="vc-rack-row">
                {g.ids.map(id => {
                  const c = comboById[id]
                  return (
                    <button key={id} className={'vc-chip' + (selCombo === id ? ' active' : '') + (c.lie ? ' lie' : '')}
                            onClick={() => pickCombo(id)} aria-pressed={selCombo === id}>
                      <span className="jp">{c.kana}</span>
                      {showReadings && <span className="vc-chip-rr">{c.rr.replace(' → ', '→')}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* footnotes the kana don't show — length & devoicing (the five only) */}
      {mode === 'pure' && (
        <div className="jvc-notes">
          <div className="jvc-note"><span className="jvc-note-h jp">長音</span>{VOWEL_NOTES.length}</div>
          <div className="jvc-note"><span className="jvc-note-h jp">無声化</span>{VOWEL_NOTES.devoice}</div>
        </div>
      )}

      {noVoice && mode !== 'voice' && (
        <div className="cn-novoice">No Japanese system voice detected — the chart and IPA work; sound stays quiet until a 日本語 voice is installed.</div>
      )}

      <div className={'lantern-note' + (lit ? ' lit' : '')} aria-live="polite">
        {lit && (<><div className="head">{lantern.head}</div>
          <div className="body" dangerouslySetInnerHTML={{ __html: lantern.body }} /></>)}
      </div>
    </div>
  )
}
