import React, { useRef, useState } from 'react'
import { HABITS, PHASES, ROADMAP_EUREKAS } from '../../data/koreanRoadmap.js'
import { dayKey } from './useRoadmapStore.js'

// The practice ledger — Instrument III of the roadmap folio.
// The behavior side of the road: seven habits, each with a fortnight
// of dots you light by hand, and the weekly reckoning — a one-line
// check-in that says where on the trail you stand.

const FORTNIGHT = 14

function lastDays(n) {
  const days = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    days.push(dayKey(d))
  }
  return days
}

// Consecutive lit days counting back from today (today itself optional —
// an unlit today shouldn't break last night's run).
function streak(days, today) {
  let n = 0
  const d = new Date()
  if (!days[today]) d.setDate(d.getDate() - 1)
  while (days[dayKey(d)]) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

const phaseGlyph = (id) => (PHASES.find(p => p.id === id) || {}).glyph || id

export default function PracticeLedger({
  habits, onToggleDay, checkins, onCheckin, showReadings,
}) {
  const [eureka, setEureka] = useState(null)
  const [ckPhase, setCkPhase] = useState(
    checkins.length ? checkins[checkins.length - 1].phase : 'p1'
  )
  const [ckNote, setCkNote] = useState('')
  const sevenSeen = useRef(false)

  const today = dayKey()
  const days = lastDays(FORTNIGHT)

  const tapDay = (habit, day) => {
    const lit = (habits[habit.id] || {})[day]
    onToggleDay(habit.id, day)
    if (!lit && habit.cadence === 'daily' && !sevenSeen.current) {
      // would this tap complete a 7-day run?
      const after = { ...(habits[habit.id] || {}), [day]: true }
      if (streak(after, today) >= 7) {
        sevenSeen.current = true
        setEureka(ROADMAP_EUREKAS.sevenNights)
      }
    }
  }

  const logCheckin = () => {
    onCheckin(ckPhase, ckNote.trim())
    setCkNote('')
  }

  const recent = [...checkins].reverse().slice(0, 6)

  return (
    <div className="ledger-stage practice-stage" data-screen-label="Practice ledger">
      <div className="loom-prompt" style={{ marginTop: 0 }}>
        Levels are reached by behaviors, not intentions — this page tracks the behaviors.
        Tap today’s dot when the habit happened (yesterday’s too, if you forgot); once a week,
        log a reckoning. Honest dots, honest road.
      </div>

      <div className="habit-list">
        {HABITS.map(h => {
          const hDays = habits[h.id] || {}
          const run = h.cadence === 'daily' ? streak(hDays, today) : 0
          return (
            <div key={h.id} className="habit">
              <div className="h-name">
                <div className="h-title">
                  <span className="h-kr kr">{h.kr}</span>
                  {showReadings && <span className="h-rr">{h.rr}</span>}
                  <span className="h-en">{h.en}</span>
                </div>
                <div className="h-meta">
                  {h.cadence} · {h.mins} · from <span className="kr">{phaseGlyph(h.from)}</span>
                </div>
                <div className="h-why">{h.why}</div>
              </div>
              <div className="h-track">
                <div className="h-dots">
                  {days.map(d => (
                    <button
                      key={d}
                      className={'h-dot' + (hDays[d] ? ' lit' : '') + (d === today ? ' today' : '')}
                      title={d}
                      aria-label={`${h.en} — ${d}${hDays[d] ? ' · done' : ''}`}
                      onClick={() => tapDay(h, d)}
                    ></button>
                  ))}
                </div>
                {run >= 2 && <div className="h-streak">{run} nights alight</div>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="checkin-panel">
        <div className="ck-head">
          <h3>
            <span className="kr">점검</span>
            {showReadings && <i> jeomgeom</i>} · the weekly reckoning
          </h3>
          <div className="ck-sub">once a week: where on the trail do you stand, and what did the week show?</div>
        </div>
        <div className="ck-form">
          <div className="ck-phases">
            {PHASES.map(p => (
              <button
                key={p.id}
                className={'specimen-chip' + (p.id === ckPhase ? ' active' : '')}
                onClick={() => setCkPhase(p.id)}
              >
                <span className="kr">{p.glyph}</span>
              </button>
            ))}
          </div>
          <input
            className="ck-note"
            type="text"
            value={ckNote}
            placeholder="one honest line — what moved, what stalled…"
            maxLength={160}
            onChange={e => setCkNote(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') logCheckin() }}
          />
          <button className="text-btn ck-log" onClick={logCheckin}>log it</button>
        </div>
        {recent.length > 0 && (
          <div className="ck-entries">
            {recent.map((c, i) => (
              <div key={checkins.length - i} className="ck-entry">
                <span className="ck-date">{c.date}</span>
                <span className="ck-phase kr">{phaseGlyph(c.phase)}</span>
                <span className="ck-text">{c.note || '—'}</span>
              </div>
            ))}
            {checkins.length > recent.length && (
              <div className="ck-more">… and {checkins.length - recent.length} earlier reckonings, kept.</div>
            )}
          </div>
        )}
      </div>

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
