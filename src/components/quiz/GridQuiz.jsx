import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MASTERY_MAX, LEARNED_AT } from './useQuizStore.js'
import { makeQuestion, weightedTarget } from './quizEngine.js'
import RomajiInput from '../scripts/RomajiInput.jsx'
import { engineFor } from '../scripts/ime.js'

// =====================================================================
// The grid cycle — the こそあど / 이·그·저 deck run on its native 4×6 machine
// instead of flashcards. The grid (prefix rows × category columns) is the
// whole interface; the quiz runs it in three modes:
//
//   choose  — cell → word, multiple choice: a cell lights, pick its word
//   type    — cell → word, free entry: a cell lights, TYPE its word on the
//             keyboardless IME (romaja → 한글 · romaji → かな). Korean readings
//             are pronunciation-RR, so the typed answer is graded against the
//             WORD the IME composes (whitespace-stripped), never the reading.
//   locate  — word → cell: a word is named, click the square it sits in
//
// Cells stay blank in every mode (showing the words would hand over the
// answer); the row prefixes and column suffixes are the coordinates you
// read. Mastery is the SAME per-card lamp the flashcards feed — a cell
// learned here is learned everywhere.
// =====================================================================

const MODES = [
  { id: 'choose', label: 'choose', sub: 'cell → word' },
  { id: 'type',   label: 'type',   sub: 'cell → word' },
  { id: 'locate', label: 'locate', sub: 'word → cell' },
]

const norm = (s) => s.replace(/\s+/g, '')

export default function GridQuiz({ deck, store, showReadings, showJp }) {
  const { grid } = deck
  const [mode, setMode] = useState('choose')
  const [q, setQ] = useState(null)
  const [nonce, setNonce] = useState(0)
  const [status, setStatus] = useState('asking') // asking | right | wrong
  const [picked, setPicked] = useState(null)      // option idx (choose) | cellId (locate)
  const [typed, setTyped] = useState('')
  const [streak, setStreak] = useState(0)
  const [seen, setSeen] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [lantern, setLantern] = useState(null)
  const clearedRef = useRef(false)
  const advanceRef = useRef(null)

  const cardByCell = useMemo(() => {
    const m = new Map()
    for (const c of deck.cards) m.set(`${c.row}.${c.col}`, c)
    return m
  }, [deck])

  const next = useCallback(() => {
    setPicked(null); setTyped(''); setStatus('asking')
    setQ(mode === 'choose' ? makeQuestion(deck, deck.cards, store) : { target: weightedTarget(deck, deck.cards, store) })
    setNonce(n => n + 1)
  }, [deck, store, mode])

  // Fresh question + reset tallies on mode change.
  useEffect(() => {
    setPicked(null); setTyped(''); setStatus('asking')
    setStreak(0); setSeen(0); setCorrect(0); setLantern(null); clearedRef.current = false
    setQ(mode === 'choose' ? makeQuestion(deck, deck.cards, store) : { target: weightedTarget(deck, deck.cards, store) })
    setNonce(n => n + 1)
    return () => { if (advanceRef.current) clearTimeout(advanceRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck.id, mode])

  const settle = (isRight) => {
    store.record(q.target.id, isRight)
    setStatus(isRight ? 'right' : 'wrong')
    setSeen(s => s + 1)
    const ns = isRight ? streak + 1 : 0
    setStreak(ns)
    if (isRight) setCorrect(c => c + 1)
    store.recordDeck(deck.id, ns)

    if (isRight && ns > 0 && ns % 10 === 0) {
      setLantern({ head: `${ns} in a row`, body: 'The grid is becoming a reflex — prefix × suffix, exceptions and all. That muscle is the whole point of the machine.' })
    } else if (isRight) {
      const sum = store.summarize(deck.cards.map(c => c.id))
      if (sum.learned === sum.total && !clearedRef.current) {
        clearedRef.current = true
        setLantern({ head: 'the whole grid — lit', body: 'Every square is past the learned mark, in every direction. Try the harder mode (type is the real test), or come back tomorrow and prove it stuck.' })
      }
    }
    if (isRight) { advanceRef.current = setTimeout(next, 900) }
  }

  const pickOption = (opt, idx) => {
    if (status !== 'asking') return
    setPicked(idx); settle(opt.id === q.target.id)
  }
  const pickCell = (cellId) => {
    if (status !== 'asking' || mode !== 'locate') return
    setPicked(cellId); settle(cellId === `${q.target.row}.${q.target.col}`)
  }
  const submitTyped = (value) => {
    if (status !== 'asking') return
    settle(norm(value) === norm(q.target.answer.main))
  }

  if (!q) return null
  const acc = seen ? Math.round((correct / seen) * 100) : 0
  const best = store.deckBest(deck.id)
  const summary = store.summarize(deck.cards.map(c => c.id))
  const targetCellId = `${q.target.row}.${q.target.col}`
  const reveal = status !== 'asking'

  return (
    <div className="grid-quiz" data-screen-label="grid quiz">
      <div className="gq-head">
        <div className="gq-modes" role="tablist" aria-label="grid quiz mode">
          {MODES.map(m => (
            <button key={m.id} role="tab" aria-selected={m.id === mode}
              className={'gq-mode' + (m.id === mode ? ' active' : '')} onClick={() => setMode(m.id)}>
              <span className="gq-mode-label">{m.label}</span>
              <span className="gq-mode-sub">{m.sub}</span>
            </button>
          ))}
        </div>
        <div className="quiz-score" aria-live="off">
          <span className="qs-item"><span className="qs-n">{streak}</span> streak</span>
          <span className="qs-item"><span className="qs-n">{best}</span> best</span>
          <span className="qs-item"><span className="qs-n">{acc}%</span> this run</span>
          <span className="qs-item"><span className="qs-n">{summary.learned}/{summary.total}</span> learned</span>
        </div>
      </div>

      {/* prompt — the named word (locate) or an instruction (choose/type) */}
      <div className="gq-prompt">
        {mode === 'locate' ? (
          <div className="gq-word">
            <span className={'gq-word-main ' + grid.script} lang={grid.script}>{q.target.answer.main}</span>
            <span className="gq-word-meta">
              <span className="gq-word-gloss">{q.target.prompt.main}</span>
              {showReadings && <span className="gq-word-rr">{q.target.answer.sub}</span>}
            </span>
            {showJp && q.target.prompt.jp && <span className="gq-word-bridge">{q.target.prompt.jp}</span>}
          </div>
        ) : (
          <div className="gq-instruction">
            {mode === 'choose' ? 'which word sits in the lit square?' : 'type the word in the lit square'}
            <span className="gq-coord">{grid.rows.find(r => r.id === q.target.row)?.role} × {grid.cols.find(c => c.id === q.target.col)?.label}</span>
          </div>
        )}
      </div>

      {/* the machine */}
      <div className="qgrid-wrap">
        <table className={'qgrid ' + status}>
          <thead>
            <tr>
              <th className="qg-corner" scope="col"><span className={grid.script} lang={grid.script}>？</span></th>
              {grid.cols.map(c => (
                <th key={c.id} scope="col" className={'qg-colhead' + (c.id === q.target.col && mode !== 'locate' ? ' lit' : '')}>
                  <span className={'qg-suffix ' + grid.script} lang={grid.script}>{c.suffix === '—' || c.suffix === '' ? '∅' : c.suffix}</span>
                  <span className="qg-collabel">{c.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.rows.map(r => (
              <tr key={r.id}>
                <th scope="row" className={'qg-rowhead' + (r.id === q.target.row && mode !== 'locate' ? ' lit' : '')}>
                  <span className={'qg-prefix ' + grid.script} lang={grid.script}>{r.glyph}</span>
                  <span className="qg-role">{r.role}</span>
                </th>
                {grid.cols.map(c => {
                  const cellId = `${r.id}.${c.id}`
                  const card = cardByCell.get(cellId)
                  const isTarget = cellId === targetCellId
                  const isPicked = picked === cellId
                  const litTarget = isTarget && mode !== 'locate'
                  // reveal the word: the answer cell always, and the wrongly-picked cell (locate)
                  const showWord = reveal && (isTarget || (mode === 'locate' && isPicked))
                  const cls = 'qg-cell'
                    + (litTarget && !reveal ? ' target' : '')
                    + (reveal && isTarget ? ' is-answer' : '')
                    + (reveal && isPicked && !isTarget ? ' is-wrong' : '')
                  const clickable = mode === 'locate' && !reveal
                  const content = showWord
                    ? <>
                        <span className={'qg-cell-word ' + grid.script} lang={grid.script}>{card.answer.main}</span>
                        {showReadings && <span className="qg-cell-rr">{card.answer.sub}</span>}
                      </>
                    : litTarget && !reveal
                      ? <span className="qg-mark">?</span>
                      : <span className="qg-dot" aria-hidden="true">·</span>
                  return (
                    <td key={c.id} className={cls}>
                      {clickable
                        ? <button className="qg-btn" onClick={() => pickCell(cellId)} aria-label={`${r.role} ${c.label}`}>{content}</button>
                        : <span className="qg-static">{content}</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* answer zone — options (choose) or the IME (type); locate answers on the grid */}
      {mode === 'choose' && (
        <div className="quiz-options gq-options">
          {q.options.map((opt, i) => {
            const isTarget = opt.id === q.target.id
            const cls = 'quiz-opt'
              + (picked === i ? ' picked' : '')
              + (reveal && isTarget ? ' is-answer' : '')
              + (reveal && picked === i && !isTarget ? ' is-wrong' : '')
            const showRr = reveal && showReadings && opt.answer.sub && (isTarget || picked === i)
            return (
              <button key={opt.id} className={cls} disabled={reveal} onClick={() => pickOption(opt, i)}>
                <span className={'qo-main ' + opt.answer.lang} lang={opt.answer.lang}>{opt.answer.main}</span>
                {showRr && <span className="qo-rr">{opt.answer.sub}</span>}
              </button>
            )
          })}
        </div>
      )}

      {mode === 'type' && (
        <div className="gq-type">
          <RomajiInput
            key={nonce}
            engine={engineFor(grid.imeScript)}
            onChange={setTyped}
            onSubmit={submitTyped}
            disabled={reveal}
            autoFocus
            placeholder={grid.imeScript === 'hangul' ? 'type romaja…' : 'type romaji…'}
          />
          {!reveal && (
            <button className="gq-check" disabled={!typed} onClick={() => submitTyped(typed)}>check ↵</button>
          )}
          {reveal && !(status === 'right') && (
            <div className="gq-answer-reveal">
              answer — <span className={grid.script} lang={grid.script}>{q.target.answer.main}</span>
              {showReadings && <span className="gq-answer-rr">{q.target.answer.sub}</span>}
            </div>
          )}
        </div>
      )}

      <div className="quiz-foot">
        {status === 'asking'
          ? <span className="quiz-hint">{mode === 'locate' ? 'tap the square it sits in' : mode === 'choose' ? 'tap its word' : 'type it, then ↵'}</span>
          : status === 'wrong'
            ? <button className="quiz-next" onClick={next}>next →</button>
            : <span className="quiz-ok">✓</span>}
      </div>

      <div className="quiz-mastery" aria-label="mastery">
        {deck.cards.map(c => {
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
