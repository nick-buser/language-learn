import React, { useEffect, useMemo, useRef, useState } from 'react'
import { GRADES, dayKey, previewInterval, fmtInterval } from './srs.js'
import { BRIDGE_KINDS } from '../../data/koreanVocab.js'

// =====================================================================
// The review drawer — the quiet SRS (docs/vocabulary-plan.md, phase 5).
//
// A plain interval scheduler over the learning set, kept deliberately
// boring: front shows the bare headword, the back shows everything the
// dictionary holds, four grades whose buttons print what each costs.
// Space turns the card; 1–4 grade it. Cards graded 'again' (or 'hard'
// while new) stay in today's queue and resurface after the rest.
//
// No gamification chrome — the only ornaments are the due forecast
// (which is information) and the session tally (which is a receipt).
// =====================================================================

const GRADE_COLOR = {
  again: 'var(--signal-lit)',
  hard: 'var(--amber)',
  good: 'var(--accent)',
  easy: 'var(--st-active)',
}

// KRDICT-backed entries carry real definitions but no specimen sentence;
// show the senses on the back so the card still teaches something.
const hasSenses = (e) => Array.isArray(e.senses) && e.senses.some(s => s.def)

const EUREKAS = {
  graduated: {
    head: 'a word crossed the counter',
    body: 'Three weeks held without a lapse — <b>known</b>. It leaves the queue and joins your ' +
          'holdings in the ledger above. If it ever goes soft, file it back under learning; ' +
          'its clock resumes where it left off.',
  },
  lapsed: {
    head: 'forgetting is the mechanism',
    body: 'An <b>again</b> doesn’t undo the work — it is the work. The interval falls back to ' +
          'today and the climb restarts a shade gentler. The cards you lapse on are exactly ' +
          'the ones the drawer exists for.',
  },
}

export default function ReviewDrawer({ entries, lang, store, showReadings, showJp }) {
  const today = dayKey()
  const [face, setFace] = useState('front')
  const [tally, setTally] = useState({ total: 0, again: 0, hard: 0, good: 0, easy: 0, graduated: 0 })
  const [eureka, setEureka] = useState(null)
  const fired = useRef({})
  // Session ordering: cards keep today's due date when graded 'again', so
  // we rotate them behind the not-yet-seen rest instead of re-surfacing
  // them immediately.
  const ratedAt = useRef(new Map())
  const seq = useRef(0)

  const learning = useMemo(
    () => entries.filter(e => store.words[e.id]?.status === 'learning' && store.words[e.id]?.srs),
    [entries, store.words]
  )

  const queue = useMemo(() =>
    learning
      .filter(e => store.words[e.id].srs.due <= today)
      .sort((a, b) =>
        (ratedAt.current.get(a.id) || 0) - (ratedAt.current.get(b.id) || 0) ||
        store.words[a.id].srs.due.localeCompare(store.words[b.id].srs.due) ||
        a.id.localeCompare(b.id)
      ),
    [learning, store.words, today]
  )

  const current = queue[0]
  const srs = current && store.words[current.id].srs
  const isNew = srs && srs.reps === 0 && srs.lapses === 0

  useEffect(() => { setFace('front') }, [current?.id])

  // Due forecast — today and the six days after it (information, not chrome).
  const forecast = useMemo(() => {
    const days = Array(7).fill(0)
    learning.forEach(e => {
      const due = store.words[e.id].srs.due
      const [y, m, d] = due.split('-').map(Number)
      const [ty, tm, td] = today.split('-').map(Number)
      const diff = Math.round((new Date(y, m - 1, d) - new Date(ty, tm - 1, td)) / 86400000)
      days[Math.min(6, Math.max(0, diff))] += 1
    })
    return days
  }, [learning, store.words, today])
  const forecastMax = Math.max(1, ...forecast)

  const fire = (id) => {
    if (!fired.current[id]) {
      fired.current[id] = true
      setEureka(EUREKAS[id])
    }
  }

  const grade = (g) => {
    if (!current) return
    const outcome = store.rate(current.id, g)
    ratedAt.current.set(current.id, ++seq.current)
    setTally(t => ({
      ...t,
      total: t.total + 1,
      [g]: t[g] + 1,
      graduated: t.graduated + (outcome.graduated ? 1 : 0),
    }))
    if (outcome.graduated) fire('graduated')
    else if (outcome.lapsed) fire('lapsed')
    setFace('front')
  }

  // Space turns, 1–4 grade — but never while typing in the ledger's search.
  useEffect(() => {
    const onKey = (e) => {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return
      if (!current) return
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        if (face === 'front') setFace('back')
        return
      }
      if (face === 'back') {
        const g = GRADES.find(x => x.key === e.key)
        if (g) grade(g.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const newCount = queue.filter(e => {
    const s = store.words[e.id].srs
    return s.reps === 0 && s.lapses === 0
  }).length

  const nextDue = useMemo(() => {
    const future = learning.map(e => store.words[e.id].srs.due).filter(d => d > today).sort()
    return future[0] || null
  }, [learning, store.words, today])

  return (
    <div className="rv-stage" data-screen-label="Review drawer">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        The queue holds every <b>learning</b> word whose day has come. Read the front, answer in
        your head <i>before</i> you turn — reading, meaning, and (where there is one) the
        Japanese under it — then grade yourself honestly. The buttons print the price of each
        answer. <span className="kbd-hint">space turns · 1–4 grade</span>
      </div>

      {/* the counter — due line + forecast */}
      <div className="rv-top">
        <div className="rv-counts">
          <span className="big">{queue.length}</span> due today
          {newCount > 0 && <> · <span className="new">{newCount} new</span></>}
          <span className="dim"> · {learning.length} in the queue · {tally.total} turned this sitting</span>
        </div>
        <div className="rv-forecast" role="img"
          aria-label={'due forecast, next seven days: ' + forecast.join(', ')}>
          {forecast.map((n, i) => (
            <span key={i} className="col" title={(i === 0 ? 'today' : '+' + i + ' d') + ' · ' + n}>
              <span className="bar" style={{ height: 4 + (n / forecastMax) * 26 + 'px', opacity: n ? 0.85 : 0.2 }} />
              <span className="lbl">{i === 0 ? '今' : i}</span>
            </span>
          ))}
        </div>
      </div>

      {/* the drawer itself */}
      {!current && learning.length === 0 && (
        <div className="rv-idle">
          The drawer is empty — it has no cards yet. File words as <b>learning</b> in the
          ledger above and they appear here, today.
        </div>
      )}

      {!current && learning.length > 0 && tally.total === 0 && (
        <div className="rv-idle">
          Nothing due — the clock is doing the remembering for you.
          {nextDue && <> Next card surfaces <b>{nextDue}</b>.</>}
        </div>
      )}

      {!current && tally.total > 0 && (
        <div className="rv-done">
          <div className="head">The drawer is shut for today.</div>
          <div className="receipt">
            {tally.total} turned · {tally.again} again · {tally.hard} hard · {tally.good} good · {tally.easy} easy
            {tally.graduated > 0 && <> · <b>{tally.graduated} graduated</b></>}
          </div>
          {nextDue && <div className="next">next card surfaces {nextDue}</div>}
        </div>
      )}

      {current && (
        <div className="rv-deck">
          <div
            className={'rv-card ' + face}
            onClick={() => face === 'front' && setFace('back')}
            role="button"
            tabIndex={0}
            aria-label={face === 'front' ? 'card front — click to turn' : 'card back'}
          >
            <div className="rv-meta">
              <span>{queue.length} left today</span>
              {isNew && <span className="new">new</span>}
              {srs.lapses > 0 && <span className="lapses">{srs.lapses}× lapsed</span>}
            </div>

            {face === 'front' ? (
              <>
                <div className={'rv-head ' + lang.scriptClass} style={{ fontFamily: lang.font }}>
                  {current.head}
                </div>
                <div className="rv-pos">{current.pos}</div>
                <div className="rv-turn">turn the card —</div>
              </>
            ) : (
              <>
                <div className={'rv-head small ' + lang.scriptClass} style={{ fontFamily: lang.font }}>
                  {current.head}
                </div>
                <div className="rv-reading">
                  {current.reading.kana && <span className="kana" style={{ fontFamily: lang.font }}>{current.reading.kana} · </span>}
                  {current.reading.rr}
                  {current.hanja && lang.hasBridge && <span className="hanja jp"> · {current.hanja}</span>}
                </div>
                <div className="rv-gloss">{current.en}</div>
                {lang.hasBridge && showJp && current.bridge && (
                  <div className="rv-bridge">
                    <span className="jp">{current.bridge.kanji}</span>
                    {current.bridge.kana && <span className="kana">{current.bridge.kana}</span>}
                    <span className="rr">{current.bridge.rr}</span>
                    <span className="kind" title={BRIDGE_KINDS[current.bridge.kind].hint}>
                      {BRIDGE_KINDS[current.bridge.kind].label}
                    </span>
                  </div>
                )}
                {current.ex && (
                  <div className="wb-ex rv-ex">
                    <div className={'ex-text ' + lang.scriptClass} style={{ fontFamily: lang.font }}
                      dangerouslySetInnerHTML={{ __html: current.ex.text }} />
                    {showReadings && <div className="ex-rr">{current.ex.rr}</div>}
                    {showJp && current.ex.jp && (
                      <div className="ex-jp">
                        <span className="jp">{current.ex.jp}</span>
                        {showReadings && <span className="jp-rr">{current.ex.jpRr}</span>}
                      </div>
                    )}
                    <div className="ex-en">{current.ex.en}</div>
                  </div>
                )}
                {!current.ex && hasSenses(current) && (
                  <ol className="wb-senses rv-senses">
                    {current.senses.slice(0, 4).map((s, i) => (
                      <li key={i}>
                        <span className="s-gloss">{s.gloss}</span>
                        {s.def && <span className={'s-def ' + lang.scriptClass}>{s.def}</span>}
                      </li>
                    ))}
                  </ol>
                )}
                {current.note && (
                  <div className="rv-note">
                    <span className="fn-head">{current.note.head}</span>
                    <span className="fn-body" dangerouslySetInnerHTML={{ __html: current.note.html }} />
                  </div>
                )}
              </>
            )}
          </div>

          {face === 'back' && (
            <div className="rv-grades">
              {GRADES.map(g => (
                <button
                  key={g.id}
                  className="rv-grade"
                  style={{ '--gr': GRADE_COLOR[g.id] }}
                  title={g.hint}
                  onClick={() => grade(g.id)}
                >
                  <span className="key">{g.key}</span>
                  <span className="lab">{g.label}</span>
                  <span className="when">{fmtInterval(previewInterval(srs, g.id))}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={'lantern-note' + (eureka ? ' lit' : '')} aria-live="polite">
        {eureka && (
          <>
            <div className="head">{eureka.head}</div>
            <div className="body" dangerouslySetInnerHTML={{ __html: eureka.body }} />
          </>
        )}
      </div>
    </div>
  )
}
