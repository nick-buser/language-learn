import React from 'react'
import ProvingGround from '../components/quiz/ProvingGround.jsx'
import { KO_DECKS } from '../data/quizzes/koreanQuizzes.js'

function QuizColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 단련 ⟡</div>
      The Polyglot's Atlas · Korean folio · the proving ground<br />
      drawn in the Aburaya hand · the same machines, asked instead of answered
    </div>
  )
}

export default function KoreanQuizzes({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Korean — The proving ground">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">試</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">단련</span>
            The proving ground
          </h1>
          <div className="latin">
            palaestra · the training yard — where the folios are put to the proof.
            단련 <span style={{ fontStyle: 'normal' }}>(dallyeon)</span> · tempering, the forge’s word
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            challenge · answer · feedback
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Every instrument in this atlas is a <span className="accent">selector → answer</span> machine.
        Pick a verb and a tense, the forge hands you 갔어요. Point at a meaning, the grid hands you 이것.
        Pick a noun and a role, the gate hands you 책은. The proving ground runs those machines{' '}
        <i>backwards</i> — it shows you the empty slot and asks you to choose what fills it.
      </p>
      <p className="gram-sub">
        Pick a deck from the rack; only one is live at a time. Then it is the same gamified loop the
        script drills run on — a challenge, your pick, the answer lit, and the next one already
        coming. Questions lean toward the cards you know least; the wrong answers are the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>near misses</b> —
        other tenses of the same verb, other pointers in the same row — so a right answer means you
        chose the axis, not just recognized the word. Mastery lamps fill faint → gold and persist.
      </p>

      {/* INSTRUMENT — the proving ground */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The rack</h2>
        <div className="latin">선택 (seontaek) · choose a machine, then run it backwards</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> swap decks on the rack · clear a streak of ten · light a scope gold
      </div>
      <ProvingGround lang="ko" decks={KO_DECKS} showReadings={showReadings} showJp={showJp} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>Recall is the rent grammar pays</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              An instrument you can only <i>read</i> is a diagram; an instrument you can <i>answer</i> is
              a skill. The folios make the grammar felt — the proving ground asks whether it stuck. Same
              data, same hand-checked forms; the arrow of the question simply reverses.
            </p>
            <p>
              Most decks here are <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>four-option</b> machines,
              because that is what the script drill proved joyful. But the deeper game the user named is
              the <i>assemble</i> one — set several dials until they pool into the target form. The{' '}
              <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>활용표</b> deck is
              its first turn: pick a verb, and its whole <i>register × tense</i> table becomes the board —
              every cell a slot, choose the form or locate the named one. The same machine the pointer
              grid runs, with the verb as a third dial on top.
            </p>
            <blockquote>
              The wrong answers are the lesson. When 갔어요 sits beside 가요 and 갈 거예요, choosing it
              means the tense is yours — not the verb, the tense.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">more dials on the table</span>
              the 활용표 board crosses register × tense; the honorific <b style={{ fontStyle: 'normal', fontWeight: 500 }}>-시-</b> and
              the 안/못 negation are the next dials to pool in — and the Japanese 鍛錬 rack gets the same
              table (plain｜polite × tense) as a mirror.
            </div>
            <div className="note">
              <span className="date">more decks for the rack</span>
              the 조사 cabinet just landed as <b style={{ fontStyle: 'normal', fontWeight: 500 }}>서랍</b> —
              its five drawers reused as scope chips, a job + its Japanese twin asking for the particle.
              Still to back-run: 활용 (connectives -고 / -아서), 활용 (the conditional family), the cognate
              sound-bridge — every selector folio has one.
            </div>
            <div className="note">
              <span className="date">listen &amp; produce</span>
              a heard prompt (the speech seam) and a typed answer (the romaja IME) — the drill’s other two
              directions, brought to grammar.
            </div>
            <div className="note">
              <span className="date">spaced return</span>
              the mastery lamps are gamified, not scheduled — the word bank’s SRS is the model for pulling
              due cards back tomorrow.
            </div>
          </aside>
        </div>
      </section>

      <QuizColophon />
    </div>
  )
}
