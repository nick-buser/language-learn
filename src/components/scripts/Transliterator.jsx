import React, { useEffect, useMemo, useRef, useState } from 'react'
import RomajiInput from './RomajiInput.jsx'
import { engineFor } from './ime.js'
import { speak, hasVoice, speechSupported } from './speech.js'

// =====================================================================
// The transliteration bench — the fun half. English loanwords cross into
// the script and back, and the *reason they bend the way they do* (the long
// vowel, the dropped/echoed consonant, the missing sound) is the payoff
// revealed when you land it. Language-blind; the per-folio data supplies the
// words and the script id.
//
//   Word = { id, en, script, romaji, rule, note }
//     en      'coffee'            the English source
//     script  'コーヒー' / '커피'   the target
//     romaji  'ko-hi-' / 'keopi'  how to type it (the IME hint)
//     rule    'long vowel ー'      a short tag
//     note    full sentence       why it bends this way
//
// Two directions: BUILD (en → script, typed on the keyboardless IME) and
// READ (script → en, heard and typed back in English).
// =====================================================================

const ROUND = 8
const normalize = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
const shuffle = (a) => {
  const r = a.slice()
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[r[i], r[j]] = [r[j], r[i]] }
  return r
}

export default function Transliterator({ lang, script, words, keyboard, store, padLabel }) {
  const engine = useMemo(() => engineFor(script), [script])
  const voice = speechSupported() && hasVoice(lang.slice(0, 2))

  const [direction, setDirection] = useState('build') // build | read
  const [round, setRound] = useState(() => shuffle(words).slice(0, ROUND))
  const [idx, setIdx] = useState(0)
  const [answer, setAnswer] = useState('')          // IME (build) or text (read)
  const [phase, setPhase] = useState('solving')     // solving | solved | revealed
  const [score, setScore] = useState(0)
  const [solved, setSolved] = useState(0)
  const [showRomaji, setShowRomaji] = useState(false)
  const readRef = useRef(null)

  const word = round[idx]
  const done = idx >= round.length

  const newRound = (dir = direction) => {
    setRound(shuffle(words).slice(0, ROUND))
    setIdx(0); setAnswer(''); setPhase('solving'); setScore(0); setSolved(0); setShowRomaji(false)
    setDirection(dir)
  }

  const land = () => {
    if (phase !== 'solving') return
    speak(word.script, { lang })
    setPhase('solved'); setScore(s => s + 1); setSolved(n => n + 1)
    store.markSolved(word.id); store.recordTranslit(score + 1)
  }

  // BUILD: auto-detect the moment the composed script matches the target.
  useEffect(() => {
    if (direction === 'build' && phase === 'solving' && word && answer && answer === word.script) land()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer])

  // Speak the prompt when a READ card appears.
  useEffect(() => {
    if (direction === 'read' && phase === 'solving' && word) speak(word.script, { lang })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, direction])

  const checkRead = () => {
    if (phase !== 'solving') return
    if (normalize(answer) === normalize(word.en)) land()
  }

  const reveal = () => { setPhase('revealed'); if (voice) speak(word.script, { lang }) }
  const advance = () => {
    setIdx(i => i + 1); setAnswer(''); setPhase('solving'); setShowRomaji(false)
    if (direction === 'read') setTimeout(() => readRef.current?.focus(), 0)
  }

  if (done) {
    return (
      <div className="translit" data-screen-label="transliteration bench">
        <div className="tl-summary">
          <div className="tl-sum-head">round complete</div>
          <div className="tl-sum-score"><span>{solved}</span> / {round.length}</div>
          <div className="tl-sum-sub">best round: {Math.max(store.translit.best || 0, solved)}</div>
          <div className="tl-dir-row">
            <button className="tl-btn primary" onClick={() => newRound('build')}>english → {script === 'hangul' ? '한글' : 'かな'}</button>
            <button className="tl-btn" onClick={() => newRound('read')}>{script === 'hangul' ? '한글' : 'かな'} → english</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="translit" data-screen-label="transliteration bench">
      <div className="tl-head">
        <div className="tl-dir" role="tablist" aria-label="direction">
          <button role="tab" aria-selected={direction === 'build'} className={'tl-dirbtn' + (direction === 'build' ? ' active' : '')} onClick={() => direction !== 'build' && newRound('build')}>
            english → {script === 'hangul' ? '한글' : 'かな'}
          </button>
          <button role="tab" aria-selected={direction === 'read'} className={'tl-dirbtn' + (direction === 'read' ? ' active' : '')} onClick={() => direction !== 'read' && newRound('read')}>
            {script === 'hangul' ? '한글' : 'かな'} → english
          </button>
        </div>
        <div className="tl-progress">
          <span className="tl-count">{idx + 1} / {round.length}</span>
          <span className="tl-score">{solved} landed</span>
        </div>
      </div>
      <div className="tl-bar"><span style={{ width: `${(idx / round.length) * 100}%` }} /></div>

      {direction === 'build' ? (
        <div className="tl-card">
          <div className="tl-source-label">spell it in {script === 'hangul' ? '한글' : 'カタカナ'}</div>
          <div className="tl-source">{word.en}</div>

          <RomajiInput
            key={word.id}
            engine={engine}
            keyboard={keyboard}
            padLabel={padLabel}
            onChange={setAnswer}
            onSubmit={() => { if (answer === word.script) land() }}
            placeholder="type romaji — or tap the pad"
            autoFocus
            disabled={phase !== 'solving'}
          />

          <div className="tl-actions">
            {phase === 'solving' && (
              <>
                <button className="tl-btn ghost" onClick={() => setShowRomaji(v => !v)}>{showRomaji ? 'hide hint' : 'hint'}</button>
                <button className="tl-btn ghost" onClick={reveal}>show answer</button>
              </>
            )}
            {showRomaji && phase === 'solving' && <span className="tl-romaji">type: <code>{word.romaji}</code></span>}
          </div>
        </div>
      ) : (
        <div className="tl-card">
          <div className="tl-source-label">what English word is this?</div>
          <div className="tl-target-row">
            <span className="tl-target" lang={lang}>{word.script}</span>
            {voice && <button className="tl-hear" onClick={() => speak(word.script, { lang })} aria-label="hear it">♪</button>}
          </div>
          <input
            ref={readRef}
            className="tl-read-input"
            value={answer}
            disabled={phase !== 'solving'}
            placeholder="type the english…"
            autoFocus spellCheck={false} autoCapitalize="none"
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') checkRead() }}
          />
          <div className="tl-actions">
            {phase === 'solving' && (
              <>
                <button className="tl-btn primary" onClick={checkRead}>check</button>
                <button className="tl-btn ghost" onClick={reveal}>show answer</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* The reward: the answer + the adaptation rule */}
      {phase !== 'solving' && (
        <div className={'tl-reveal ' + phase}>
          <div className="tl-reveal-pair">
            <span className="tl-r-en">{word.en}</span>
            <span className="tl-r-arrow">→</span>
            <span className="tl-r-script" lang={lang}>{word.script}</span>
            <span className="tl-r-rr">{word.romaji}</span>
          </div>
          <div className="tl-rule"><span className="tl-rule-tag">{word.rule}</span> {word.note}</div>
          <button className="tl-btn primary" onClick={advance}>{idx + 1 >= round.length ? 'finish round →' : 'next →'}</button>
        </div>
      )}
    </div>
  )
}
