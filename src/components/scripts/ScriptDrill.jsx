import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { speak, hasVoice, speechSupported } from './speech.js'
import { MASTERY_MAX, LEARNED_AT } from './useScriptStore.js'

// =====================================================================
// The drill — gamified recognition, language-blind. Fed a pool of glyphs
// and a useScriptStore, it runs a four-option multiple choice in three
// directions and lets mastery (the 0–5 lamp) accumulate across the folio:
// clicks on the grid, answers here, and the transliteration game all feed
// the same store.
//
//   Glyph  = { id, glyph, rr, speak?, group? }   // speak defaults to glyph
//   group  = { id, label, ids: [glyphId…] }       // optional scoping chips
//
// Questions are weighted toward the glyphs you know least, so the drill
// teaches rather than tests at random; distractors prefer the same group
// (harder, more useful confusions). A streak glows; clearing a scope (every
// glyph in it past the learned lamp) or a streak of ten lights a lantern.
// =====================================================================

const MODES = [
  { id: 'recall', label: 'glyph → sound', prompt: 'which sound?' },
  { id: 'produce', label: 'sound → glyph', prompt: 'which glyph?' },
  { id: 'listen', label: 'hear → glyph', prompt: 'which glyph did you hear?', needsVoice: true },
]

const shuffle = (a) => {
  const r = a.slice()
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[r[i], r[j]] = [r[j], r[i]] }
  return r
}

export default function ScriptDrill({ lang, glyphs, groups = [], store, rate = 0.8, title = 'The drill' }) {
  const voice = speechSupported() && hasVoice(lang.slice(0, 2))
  const modes = useMemo(() => MODES.filter(m => !m.needsVoice || voice), [voice])

  const [mode, setMode] = useState('recall')
  const [scope, setScope] = useState('all')
  const [q, setQ] = useState(null)
  const [picked, setPicked] = useState(null)
  const [status, setStatus] = useState('asking') // asking | right | wrong
  const [streak, setStreak] = useState(0)
  const [seen, setSeen] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [lantern, setLantern] = useState(null)
  const clearedRef = useRef({})
  const advanceRef = useRef(null)

  const pool = useMemo(() => {
    if (scope === 'all') return glyphs
    const g = groups.find(x => x.id === scope)
    if (!g) return glyphs
    const set = new Set(g.ids)
    return glyphs.filter(x => set.has(x.id))
  }, [glyphs, groups, scope])

  const scopeIds = useMemo(() => pool.map(g => g.id), [pool])

  const makeQuestion = useCallback((from) => {
    const list = from.length >= 4 ? from : glyphs
    // weight toward the least-mastered glyphs (MASTERY_MAX − level + 1)
    const weights = list.map(g => MASTERY_MAX - store.levelOf(g.id) + 1)
    const total = weights.reduce((a, b) => a + b, 0)
    let roll = Math.random() * total
    let target = list[0]
    for (let i = 0; i < list.length; i++) { roll -= weights[i]; if (roll <= 0) { target = list[i]; break } }
    const others = shuffle(list.filter(g => g.id !== target.id)).slice(0, 3)
    return { target, options: shuffle([target, ...others]) }
  }, [glyphs, store])

  const next = useCallback(() => {
    setPicked(null); setStatus('asking'); setQ(makeQuestion(pool))
  }, [makeQuestion, pool])

  // Fresh question on mode/scope change; reset the session tallies.
  useEffect(() => {
    setQ(makeQuestion(pool)); setPicked(null); setStatus('asking')
    setStreak(0); setSeen(0); setCorrect(0); setLantern(null)
    clearedRef.current = {}
    return () => { if (advanceRef.current) clearTimeout(advanceRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, scope])

  // Speak the prompt at the start of a listen question.
  useEffect(() => {
    if (q && mode === 'listen' && status === 'asking') {
      speak(q.target.speak || q.target.glyph, { lang, rate })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, mode, status])

  const pick = (opt, idx) => {
    if (status !== 'asking' || !q) return
    const isRight = opt.id === q.target.id
    store.record(q.target.id, isRight)
    speak(q.target.speak || q.target.glyph, { lang, rate })
    setPicked(idx); setStatus(isRight ? 'right' : 'wrong')
    setSeen(s => s + 1)
    const ns = isRight ? streak + 1 : 0
    setStreak(ns)
    if (isRight) setCorrect(c => c + 1)
    store.recordDrill(mode, ns)

    if (isRight && ns > 0 && ns % 10 === 0) {
      setLantern({ head: `${ns} in a row`, body: 'The shapes are becoming sound without the detour through romaji — that’s the whole goal. Keep the chain alive.' })
    } else if (isRight) {
      const sum = store.summarize(scopeIds)
      const key = scope
      if (sum.total >= 4 && sum.learned === sum.total && !clearedRef.current[key]) {
        clearedRef.current[key] = true
        const name = scope === 'all' ? 'the whole set' : (groups.find(g => g.id === scope)?.label || 'this set')
        setLantern({ head: `${name} — lit`, body: 'Every glyph in this scope is past the learned mark. Switch scope, raise the bar to the dakuten / combos, or move to the transliteration bench and spend it on real words.' })
      }
    }

    if (isRight) { advanceRef.current = setTimeout(next, 760) }
  }

  if (!q) return null
  const m = MODES.find(x => x.id === mode)
  const acc = seen ? Math.round((correct / seen) * 100) : 0
  const best = store.drillBest(mode)
  const summary = store.summarize(scopeIds)

  const promptIsGlyph = mode === 'recall'
  const optionIsGlyph = mode !== 'recall'

  return (
    <div className="drill" data-screen-label="script drill">
      <div className="drill-head">
        <div className="drill-modes" role="tablist" aria-label="drill mode">
          {modes.map(md => (
            <button key={md.id} role="tab" aria-selected={md.id === mode}
              className={'drill-mode' + (md.id === mode ? ' active' : '')}
              onClick={() => setMode(md.id)}>{md.label}</button>
          ))}
        </div>
        <div className="drill-score" aria-live="off">
          <span className="ds-item"><span className="ds-n">{streak}</span> streak</span>
          <span className="ds-item"><span className="ds-n">{best}</span> best</span>
          <span className="ds-item"><span className="ds-n">{acc}%</span> this run</span>
          <span className="ds-item"><span className="ds-n">{summary.learned}/{summary.total}</span> learned</span>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="drill-scope">
          <button className={'scope-chip' + (scope === 'all' ? ' active' : '')} onClick={() => setScope('all')}>all</button>
          {groups.map(g => (
            <button key={g.id} className={'scope-chip' + (scope === g.id ? ' active' : '')} onClick={() => setScope(g.id)}>{g.label}</button>
          ))}
        </div>
      )}

      <div className={'drill-stage ' + status}>
        <div className="drill-prompt-label">{m.prompt}</div>
        <div className="drill-prompt">
          {mode === 'listen'
            ? <button className="drill-hear" onClick={() => speak(q.target.speak || q.target.glyph, { lang, rate })} aria-label="play sound again">♪ play again</button>
            : <span className={promptIsGlyph ? 'dp-glyph' : 'dp-rr'} lang={promptIsGlyph ? lang : undefined}>{promptIsGlyph ? q.target.glyph : q.target.rr}</span>}
        </div>

        <div className="drill-options">
          {q.options.map((opt, i) => {
            const reveal = status !== 'asking'
            const isTarget = opt.id === q.target.id
            const cls = 'drill-opt'
              + (picked === i ? ' picked' : '')
              + (reveal && isTarget ? ' is-answer' : '')
              + (reveal && picked === i && !isTarget ? ' is-wrong' : '')
            return (
              <button key={opt.id} className={cls} disabled={reveal} onClick={() => pick(opt, i)}>
                <span className={optionIsGlyph ? 'do-glyph' : 'do-rr'} lang={optionIsGlyph ? lang : undefined}>
                  {optionIsGlyph ? opt.glyph : opt.rr}
                </span>
                {reveal && isTarget && <span className="do-tag">{opt.rr}</span>}
              </button>
            )
          })}
        </div>

        <div className="drill-foot">
          {status === 'asking'
            ? <span className="drill-hint">{mode === 'produce' ? 'tap the matching glyph' : mode === 'recall' ? 'tap the matching sound' : 'listen, then tap'}</span>
            : status === 'wrong'
              ? <button className="drill-next" onClick={next}>next →</button>
              : <span className="drill-ok">✓</span>}
        </div>
      </div>

      {/* Mastery strip — the scope's glyphs, each lamp filling as it's learned */}
      <div className="mastery-strip" aria-label="mastery">
        {pool.map(g => {
          const lv = store.levelOf(g.id)
          return (
            <button key={g.id} className={'lamp lvl-' + lv + (lv >= LEARNED_AT ? ' learned' : '')}
              title={`${g.rr} · ${lv}/${MASTERY_MAX}`} lang={lang}
              onClick={() => speak(g.speak || g.glyph, { lang, rate })}>{g.glyph}</button>
          )
        })}
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{lantern.head}</div><div className="body">{lantern.body}</div></>)}
      </div>
    </div>
  )
}
