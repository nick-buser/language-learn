import React, { useState } from 'react'
import RoadTrail from '../components/korean/RoadTrail.jsx'
import WaymarkDossier from '../components/korean/WaymarkDossier.jsx'
import PracticeLedger from '../components/korean/PracticeLedger.jsx'
import useRoadmapStore from '../components/korean/useRoadmapStore.js'
import { PHASES } from '../data/koreanRoadmap.js'

function RoadmapColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 여정 ⟡</div>
      The Polyglot's Atlas · Korean folio · the long road<br />
      drawn in the Aburaya hand · walk · mark · return — the road remembers
    </div>
  )
}

export default function KoreanRoadmap({ showReadings, showJp }) {
  const store = useRoadmapStore()

  // Open on the waymark of the latest reckoning, or the trailhead.
  const [selected, setSelected] = useState(() => {
    const last = store.checkins[store.checkins.length - 1]
    return last && PHASES.some(p => p.id === last.phase) ? last.phase : 'p1'
  })

  // Lantern fill for the trail: ticked / total marks per waymark.
  const progress = {}
  for (const p of PHASES) {
    const items = p.strands.flatMap(s => s.items)
    progress[p.id] = {
      done: items.filter(it => store.checks[it.id]).length,
      total: items.length,
    }
  }

  return (
    <div className="page" data-screen-label="Korean — Fluency roadmap">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">道</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">여정</span>
            The long road
          </h1>
          <div className="latin">
            iter longum · the fluency roadmap —
            여정 <span style={{ fontStyle: 'normal' }}>(yeojeong)</span> is 旅程, the journey itself
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Field Chart</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            walk · mark · return
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Fluency is not a point; it is a road, and roads are walked in stages. This folio cuts the
        road into <span className="accent">five waymarks</span>, each named for a capacity — what
        you can <i>do</i> standing there — with CEFR bands and TOPIK levels running beside the
        path as reference rails, mileposts rather than destinations. The first four waymarks are
        charted deep; the fifth is left honestly unmapped.
      </p>
      <p className="gram-sub">
        Three instruments. <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>The trail</b> places
        the waymarks and their lanterns. <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>The dossiers</b> chart
        each waymark across six strands — vocabulary, grammar, sound, listening, reading,
        production — with goal-posts, checkboxes, and an effort mix you can re-cut to your week.
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}> The practice ledger</b> tracks
        the habits that actually move you. Everything you mark is remembered in this browser —
        the atlas's first memory, ahead of the backend to come.
      </p>

      {/* INSTRUMENT I — the trail */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The trail</h2>
        <div className="latin">등산로 (deungsanno) · five lanterns between zero and the far ranges</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a waymark — its dossier opens below; the lamps fill as you make marks there
      </div>
      <RoadTrail
        selected={selected}
        onSelect={setSelected}
        progress={progress}
        showReadings={showReadings}
      />

      {/* INSTRUMENT II — the dossiers */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>The waymark dossiers</h2>
        <div className="latin">여섯 가닥 (yeoseot gadak) · six strands to every waymark — what each capacity is made of</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> read the goal-posts, tick what is already true — honestly; then choose a mix and set your pace
      </div>
      <WaymarkDossier
        selected={selected}
        checks={store.checks}
        onToggle={store.toggleCheck}
        profiles={store.profiles}
        onProfile={store.setProfile}
        pace={store.pace}
        onPace={store.setPace}
        showReadings={showReadings}
        showJp={showJp}
      />

      {/* INSTRUMENT III — the practice ledger */}
      <div className="instr-head">
        <div className="no">III</div>
        <h2>The practice ledger</h2>
        <div className="latin">습관 (seupgwan = 習慣) · habits, and the weekly reckoning</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap today's dot when a habit happened; once a week, say where you stand
      </div>
      <PracticeLedger
        habits={store.habits}
        onToggleDay={store.toggleHabitDay}
        checkins={store.checkins}
        onCheckin={store.addCheckin}
        showReadings={showReadings}
      />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>The exam measures the road from outside</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              TOPIK levels and CEFR bands are useful the way mileposts are useful: they tell you
              roughly how far you've come, in units other people recognize. But capacity is felt
              from inside — the evening a drama scene plays clean without subtitles, the panel
              where you get the joke before the translation. The waymarks are named for those
              evenings, and the checkboxes are a contract with yourself about them.
            </p>
            <p>
              The Japanese discount compresses this road — the memo estimates 25–35% off a cold
              start, and the hour ranges in the dossiers already include it — but it compresses
              every phase rather than skipping any. The one strand it cannot shorten much is
              listening: the ear needs its hours regardless of what the eyes already know.
              That is why the house lean is <i>the listener</i>, and why the 귀 lamp in the
              ledger asks for its twenty minutes every single day.
            </p>
            <blockquote>
              Walk, mark, return. The lamps are honest, the rails are reference, and the road
              remembers what you tell it.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">a spine for the memory</span>
              Progress lives in localStorage today (atlas.ko.roadmap.v1). With the backend
              (vocabulary plan, phases 2–3) it graduates to the same store as known vocabulary —
              one learner record behind every folio.
            </div>
            <div className="note">
              <span className="date">honest word counts</span>
              When the dictionary lands, the dossiers' vocabulary benchmarks stop being
              self-assessment: the trail can read your known-word count directly and fill the
              어휘 strand on evidence.
            </div>
            <div className="note">
              <span className="date">deep links</span>
              Each checklist item should eventually open the instrument that drills it —
              p1's particle reflexes onto the gate, p3's 관형형 onto a modifier loom yet unbuilt.
            </div>
            <div className="note">
              <span className="date">the placement walk</span>
              A self-test instrument that suggests which waymark you stand at — specimen
              sentences to parse, clips to catch — instead of asking you to guess.
            </div>
          </aside>
        </div>
      </section>

      <RoadmapColophon />
    </div>
  )
}
