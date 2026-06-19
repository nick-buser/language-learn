import React, { useEffect, useMemo, useState } from 'react'
import useVocabStore from '../components/vocab/useVocabStore.js'
import useReadingsStore from '../components/reading/useReadingsStore.js'
import { loadVocab } from '../data/dictionary/index.js'
import { SAMPLE_READINGS } from '../data/koreanReadings.js'
import { analyzeText } from '../components/reading/analyzeReading.js'
import { analyzeCoverage, indexByHead } from '../components/reading/coverage.js'
import CoverageMeter from '../components/reading/CoverageMeter.jsx'
import ReadingView from '../components/reading/ReadingView.jsx'
import WordPanel from '../components/reading/WordPanel.jsx'
import ReadingImport from '../components/reading/ReadingImport.jsx'

function ReadingColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 多讀 ⟡</div>
      The Polyglot's Atlas · Korean folio · the reading room<br />
      drawn in the Aburaya hand · import · read at coverage · harvest what you meet
    </div>
  )
}

export default function KoreanReading({ showReadings, showJp }) {
  const vocab = useVocabStore('ko')
  const shelf = useReadingsStore()

  // The dictionary slice (entries) through the same seam the word bank uses.
  const [data, setData] = useState(null)
  useEffect(() => {
    let live = true
    loadVocab('ko').then(d => { if (live) setData(d) })
    return () => { live = false }
  }, [])
  const headIndex = useMemo(() => indexByHead(data?.entries || []), [data])

  const [current, setCurrent] = useState(null)    // the open Reading
  const [analysis, setAnalysis] = useState(null)  // null | {ok:true,tokens} | {ok:false,reason}
  const [busy, setBusy] = useState(false)
  const [sel, setSel] = useState(null)            // the tapped token

  // Analyze when a reading opens — cached tokens skip the backend.
  useEffect(() => {
    setSel(null)
    if (!current) { setAnalysis(null); return }
    if (current.tokens) { setAnalysis({ ok: true, tokens: current.tokens }); return }
    let live = true
    setBusy(true)
    analyzeText(current.text).then(res => {
      if (!live) return
      setBusy(false)
      setAnalysis(res)
      if (res.ok) setCurrent(shelf.put({ ...current, tokens: res.tokens }))
    })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, current?.text])

  // The coverage join — recomputes live as words are marked (statusOf changes).
  const cov = useMemo(
    () => (analysis?.ok ? analyzeCoverage(analysis.tokens, headIndex, vocab.statusOf) : null),
    [analysis, headIndex, vocab.statusOf]
  )

  // Keep the panel's token fresh (its class changes as you file it).
  const selToken = useMemo(() => {
    if (!sel || !cov) return sel
    return cov.tokens.find(t => t.start === sel.start && t.lemma === sel.lemma) || sel
  }, [sel, cov])

  const onImport = (title, text) => setCurrent({ title: title || 'untitled', text })
  const onMark = (id, status) => vocab.setStatus(id, status, 'reading')

  // Live coverage badge for a shelf reading that's been analyzed before.
  const shelfPct = (r) => {
    if (!r.tokens) return null
    return Math.round(analyzeCoverage(r.tokens, headIndex, vocab.statusOf).stats.coverage * 100)
  }

  return (
    <div className="page" data-screen-label="Korean — Reading room">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">讀</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">다독</span>
            The reading room
          </h1>
          <div className="latin">
            multa legere · extensive reading — text tuned to what you hold, read for the flow
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            import · read · harvest
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        The word bank is what you hold; this is where you <span className="accent">spend</span> it.
        Paste a passage and the room reads it against your holdings — coloring every word by whether
        you <span className="accent">know</span> it — and reports the one number extensive reading
        turns on: <span className="accent">known-word coverage</span>. Around{' '}
        <span className="accent">98%</span> is the floor where the few unknowns can be guessed from
        context instead of looked up.
      </p>
      <p className="gram-sub">
        Korean is taken apart by a real morphological analyzer on the backend (학교에서 → 학교, 먹어요
        → 먹다), so inflections and particles resolve to the dictionary headwords your bank is keyed
        to. Tap any lit word to gloss it and file it — reading <i>is</i> the harvest, and every word
        you mark here lands in the same bank the review drawer reads.
      </p>

      {/* INSTRUMENT — import + shelf */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The reading room</h2>
        <div className="latin">讀書室 (dokseosil) · paste a passage, or reopen one from the shelf</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> paste any Korean text and press analyze — or open a sample below; then read, and tap the lit words
      </div>

      <ReadingImport onImport={onImport} busy={busy} />

      {/* The shelf — samples + saved readings */}
      <div className="rv-shelf">
        {SAMPLE_READINGS.map(r => (
          <button key={r.id} className="rv-shelf-item sample" onClick={() => setCurrent(r)}>
            <span className="t">{r.title}</span>
            <span className="meta">sample</span>
          </button>
        ))}
        {shelf.list.map(r => {
          const pct = shelfPct(r)
          return (
            <button
              key={r.id}
              className={'rv-shelf-item' + (current?.id === r.id ? ' active' : '')}
              onClick={() => setCurrent(r)}
            >
              <span className="t">{r.title}</span>
              <span className="meta">
                {pct != null && <span className="pct">{pct}%</span>}
                <span className="x" role="button" tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); if (current?.id === r.id) setCurrent(null); shelf.remove(r.id) }}
                  title="remove from the shelf">×</span>
              </span>
            </button>
          )
        })}
      </div>

      {/* The open reading */}
      {current && (
        <>
          <div className="instr-head" style={{ marginTop: 40 }}>
            <div className="no">II</div>
            <h2>{current.title}</h2>
            <div className="latin">tap a lit word to gloss and file it — coverage updates as you go</div>
          </div>

          {busy && <p className="gram-sub">analyzing…</p>}

          {!busy && analysis && !analysis.ok && (
            <div className="rv-notice">
              {analysis.reason === 'offline'
                ? 'Coverage needs the backend (the analyzer runs there). The passage is shown below; connect the backend to light it up.'
                : 'Couldn’t analyze this passage just now. The text is shown below; try again with the backend reachable.'}
              <div className="rv-text kr plain">{current.text}</div>
            </div>
          )}

          {!busy && cov && (
            <>
              <CoverageMeter stats={cov.stats} />
              <div className="rv-reader">
                <ReadingView
                  text={current.text}
                  tokens={cov.tokens}
                  onSelect={setSel}
                  selectedStart={selToken?.start}
                />
                <WordPanel
                  token={selToken}
                  statusOf={vocab.statusOf}
                  onMark={onMark}
                  showReadings={showReadings}
                  showJp={showJp}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>Read a little above where you stand</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              Comprehensible input is text you can <i>almost</i> all read — known enough to carry
              you, unknown enough to teach you. The gauge makes that visible: push a passage toward
              98% known and the gaps become guessable, not stop signs.
            </p>
            <p>
              Right now the unknowns are mostly words the bank hasn’t met — the dictionary is still
              small, so coverage reads low on wild text. That’s honest, and it climbs two ways: file
              words as you read, and the dictionary grows underneath. The words you flag as{' '}
              <b>target</b> here are exactly what the coming generator will aim passages at.
            </p>
            <blockquote>
              You don’t learn a word by looking it up. You learn it by meeting it again, in a
              sentence you can already mostly read.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">the generator</span>
              Phase 4’s engine: passages written to your known set at ~98% coverage, unknowns drawn
              from your targets. It drops into this same room as another source.
            </div>
            <div className="note">
              <span className="date">the harvest, with context</span>
              Words filed while reading should reach the review drawer with the sentence they were
              met in attached — context is the cheapest mnemonic there is.
            </div>
            <div className="note">
              <span className="date">off this machine</span>
              The shelf is localStorage for now, shaped as the future <code>/v1/readings</code> +
              blob store; word state already follows you via the backend.
            </div>
          </aside>
        </div>
      </section>

      <ReadingColophon />
    </div>
  )
}
