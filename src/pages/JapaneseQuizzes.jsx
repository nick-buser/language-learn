import React from 'react'
import ProvingGround from '../components/quiz/ProvingGround.jsx'
import { JA_DECKS } from '../data/quizzes/japaneseQuizzes.js'

function QuizColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 鍛錬 ⟡</div>
      The Polyglot's Atlas · Japanese folio · the proving ground<br />
      drawn in the Aburaya hand · the same machines, asked instead of answered
    </div>
  )
}

export default function JapaneseQuizzes({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Japanese — The proving ground">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">試</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph jp">鍛錬</span>
            The proving ground
          </h1>
          <div className="latin">
            palaestra · the training yard — where the folios are put to the proof.
            鍛錬 <span style={{ fontStyle: 'normal' }}>(tanren)</span> · tempering, the forge’s word
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
        Pick a verb and a form, the forge hands you 飲みました. Point at a meaning, the grid hands you
        これ. Pick an adjective and a tense, the bench hands you 高かった. The proving ground runs those
        machines <i>backwards</i> — it shows the empty slot and asks you to choose what fills it.
      </p>
      <p className="gram-sub">
        Pick a deck from the rack; only one is live at a time. Then it is the same gamified loop the
        kana drill runs on — a challenge, your pick, the answer lit, the next already coming. Questions
        lean toward the cards you know least; the wrong answers are the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>near misses</b> —
        the same verb’s other forms, the same column’s other pointers — so a right answer means you
        chose the axis, not just recognized the word. The 한국어 twin rides the bridge toggle as a cue.
      </p>

      {/* INSTRUMENT — the proving ground */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The rack</h2>
        <div className="latin">選択 (sentaku) · choose a machine, then run it backwards</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> swap decks on the rack · clear a streak of ten · light a scope gold
      </div>
      <ProvingGround lang="ja" decks={JA_DECKS} showReadings={showReadings} showJp={showJp} />

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
              The decks here are all <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>four-option</b> machines,
              because that is what the kana drill proved joyful. The deeper game is the <i>assemble</i>
              one — set several dials (verb + class + form) until they pool into the target — and it
              drops into this same rack next, no new page required.
            </p>
            <blockquote>
              The wrong answers are the lesson. When 飲んだ sits beside 飲みます and 飲める, choosing it
              means the form is yours — the 音便 and all.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">the assemble mode</span>
              dials that pool: verb + plain/polite + tense, turned until the form appears. The forge’s
              tense-lanes, run as a question.
            </div>
            <div className="note">
              <span className="date">more decks for the rack</span>
              活用 (the て-form compounds), the four conditionals, the particle cabinet, 終助詞 — every
              selector folio has a back-run.
            </div>
            <div className="note">
              <span className="date">listen &amp; produce</span>
              a heard prompt (the speech seam) and a typed answer — the drill’s other two directions,
              brought to grammar.
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
