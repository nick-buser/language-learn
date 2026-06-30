import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MASTERY_MAX, LEARNED_AT } from './useQuizStore.js'

// =====================================================================
// The proving ground's cycle — one active deck, run as a gamified
// challenge → result → feedback loop. The exact machine the script drill
// is, generalized from (glyph, reading) pairs to arbitrary prompt/answer
// faces: a deck hands it cards, this hands back questions.
//
// Questions are weighted toward the cards you know least (teach, don't
// test at random). The three distractors are drawn FIRST from the target's
// `near` cohort — other tenses of the same verb, other pointers in the same
// category — so wrong answers are the useful, near-miss kind. A streak
// glows; clearing a scope (every card past the learned lamp) or a streak of
// ten lights a lantern. Mastery accrues per card across deck switches.
// =====================================================================

const shuffle = (a) => {
  const r = a.slice()
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[r[i], r[j]] = [r[j], r[i]] }
  return r
}

// Render a card face: a slot tag, the main line (in script font when the
// face names one), the reading (gated), an English gloss, and a bridge cue.
function PromptFace({ face, showReadings, showJp }) {
  const sameAsMain = face.gloss && face.gloss === face.main
  return (
    <div className="quiz-prompt-face">
      {face.tag && <div className="qp-tag">{face.tag}</div>}
      <div className={'qp-main' + (face.lang ? ' ' + face.lang : '')} lang={face.lang}>{face.main}</div>
      <div className="qp-meta">
        {face.gloss && !sameAsMain && <span className="qp-gloss">{face.gloss}</span>}
        {showReadings && face.sub && <span className="qp-rr">{face.sub}</span>}
      </div>
      {showJp && face.jp && <div className="qp-bridge">{face.jp}</div>}
    </div>
  )
}

export default function QuizStage({ deck, store, showReadings, showJp }) {
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

  const groups = deck.groups || []

  const pool = useMemo(() => {
    if (scope === 'all') return deck.cards
    const g = groups.find(x => x.id === scope)
    if (!g) return deck.cards
    const set = new Set(g.ids)
    return deck.cards.filter(c => set.has(c.id))
  }, [deck, groups, scope])

  const scopeIds = useMemo(() => pool.map(c => c.id), [pool])

  const makeQuestion = useCallback((from) => {
    const list = from.length >= 4 ? from : deck.cards
    // weight toward the least-mastered cards (MASTERY_MAX − level + 1)
    const weights = list.map(c => MASTERY_MAX - store.levelOf(c.id) + 1)
    const total = weights.reduce((a, b) => a + b, 0)
    let roll = Math.random() * total
    let target = list[0]
    for (let i = 0; i < list.length; i++) { roll -= weights[i]; if (roll <= 0) { target = list[i]; break } }

    // distractors: prefer the same `near` cohort, then the rest of the scope,
    // then the whole deck; dedupe by the answer's surface form.
    const used = new Set([target.answer.main])
    const take = (cands) => {
      for (const c of cands) {
        if (out.length >= 3) break
        if (used.has(c.answer.main)) continue
        used.add(c.answer.main); out.push(c)
      }
    }
    const out = []
    const others = list.filter(c => c.id !== target.id)
    const isNear = (c) => target.near != null && c.near === target.near
    take(shuffle(others.filter(isNear)))
    take(shuffle(others.filter(c => !isNear(c))))
    take(shuffle(deck.cards.filter(c => c.id !== target.id)))

    return { target, options: shuffle([target, ...out]) }
  }, [deck, store])

  const next = useCallback(() => {
    setPicked(null); setStatus('asking'); setQ(makeQuestion(pool))
  }, [makeQuestion, pool])

  // Fresh question + reset tallies whenever the deck or scope changes.
  useEffect(() => {
    setQ(makeQuestion(pool)); setPicked(null); setStatus('asking')
    setStreak(0); setSeen(0); setCorrect(0); setLantern(null)
    clearedRef.current = {}
    return () => { if (advanceRef.current) clearTimeout(advanceRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.id, scope])

  const pick = (opt, idx) => {
    if (status !== 'asking' || !q) return
    const isRight = opt.id === q.target.id
    store.record(q.target.id, isRight)
    setPicked(idx); setStatus(isRight ? 'right' : 'wrong')
    setSeen(s => s + 1)
    const ns = isRight ? streak + 1 : 0
    setStreak(ns)
    if (isRight) setCorrect(c => c + 1)
    store.recordDeck(deck.id, ns)

    if (isRight && ns > 0 && ns % 10 === 0) {
      setLantern({ head: `${ns} in a row`, body: 'The form is arriving before you can spell it out — that is the whole point of running the machine backwards. Keep the chain alive.' })
    } else if (isRight) {
      const sum = store.summarize(scopeIds)
      if (sum.total >= 4 && sum.learned === sum.total && !clearedRef.current[scope]) {
        clearedRef.current[scope] = true
        const name = scope === 'all' ? 'the whole deck' : (groups.find(g => g.id === scope)?.label || 'this set')
        setLantern({ head: `${name} — lit`, body: 'Every card in this scope is past the learned mark. Switch scope, change decks on the rack above, or come back tomorrow and prove it stuck.' })
      }
    }

    if (isRight) { advanceRef.current = setTimeout(next, 820) }
  }

  if (!q) return null
  const acc = seen ? Math.round((correct / seen) * 100) : 0
  const best = store.deckBest(deck.id)
  const summary = store.summarize(scopeIds)

  return (
    <div className="quiz-stage-wrap" data-screen-label="proving ground">
      <div className="quiz-head">
        <div className="quiz-prompt-label">{deck.promptLabel}</div>
        <div className="quiz-score" aria-live="off">
          <span className="qs-item"><span className="qs-n">{streak}</span> streak</span>
          <span className="qs-item"><span className="qs-n">{best}</span> best</span>
          <span className="qs-item"><span className="qs-n">{acc}%</span> this run</span>
          <span className="qs-item"><span className="qs-n">{summary.learned}/{summary.total}</span> learned</span>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="quiz-scope">
          <button className={'scope-chip' + (scope === 'all' ? ' active' : '')} onClick={() => setScope('all')}>all</button>
          {groups.map(g => (
            <button key={g.id} className={'scope-chip' + (scope === g.id ? ' active' : '')} onClick={() => setScope(g.id)}>{g.label}</button>
          ))}
        </div>
      )}

      <div className={'quiz-stage ' + status}>
        <PromptFace face={q.target.prompt} showReadings={showReadings} showJp={showJp} />

        <div className="quiz-options">
          {q.options.map((opt, i) => {
            const reveal = status !== 'asking'
            const isTarget = opt.id === q.target.id
            const cls = 'quiz-opt'
              + (picked === i ? ' picked' : '')
              + (reveal && isTarget ? ' is-answer' : '')
              + (reveal && picked === i && !isTarget ? ' is-wrong' : '')
            const showRr = reveal && showReadings && opt.answer.sub && (isTarget || picked === i)
            return (
              <button key={opt.id} className={cls} disabled={reveal} onClick={() => pick(opt, i)}>
                <span className={'qo-main' + (opt.answer.lang ? ' ' + opt.answer.lang : '')} lang={opt.answer.lang}>
                  {opt.answer.main}
                </span>
                {showRr && <span className="qo-rr">{opt.answer.sub}</span>}
              </button>
            )
          })}
        </div>

        <div className="quiz-foot">
          {status === 'asking'
            ? <span className="quiz-hint">{deck.hint}</span>
            : status === 'wrong'
              ? <button className="quiz-next" onClick={next}>next →</button>
              : <span className="quiz-ok">✓</span>}
        </div>
      </div>

      {/* Mastery strip — the scope's cards, each lamp filling faint→gold */}
      <div className="quiz-mastery" aria-label="mastery">
        {pool.map(c => {
          const lv = store.levelOf(c.id)
          return (
            <span key={c.id} className={'qlamp lvl-' + lv + (lv >= LEARNED_AT ? ' learned' : '')}
              title={`${c.answer.main} · ${lv}/${MASTERY_MAX}`} lang={c.answer.lang}>
              {c.answer.main}
            </span>
          )
        })}
      </div>

      <div className={'lantern-note' + (lantern ? ' lit' : '')} aria-live="polite">
        {lantern && (<><div className="head">{lantern.head}</div><div className="body">{lantern.body}</div></>)}
      </div>
    </div>
  )
}
