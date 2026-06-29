import React from 'react'
import * as DEIXIS from '../data/japaneseDeixis.js'
import DeixisGrid from '../components/deixis/DeixisGrid.jsx'
import QuestionWords from '../components/deixis/QuestionWords.jsx'
import PronounLadder from '../components/deixis/PronounLadder.jsx'

function DeixisColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ こそあど ⟡</div>
      The Polyglot's Atlas · Japanese folio · this · that · what<br />
      drawn in the Aburaya hand · point · ask · name — the pro-forms answer back
    </div>
  )
}

export default function JapaneseDeixis({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Japanese — こそあど">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">此</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph">こそあど</span>
            this · that · what
          </h1>
          <div className="latin">verba demonstrativa · the words that point instead of name</div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            point · ask · name
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Three little closets of words do a job English scatters across dozens: they fill a noun slot by
        <span className="accent"> pointing</span> rather than naming. Point into the room — <i>this, that,
        over there</i>. Point at the unknown — <i>what, who, when</i>. Point at a person — <i>I, you, she</i>.
        Linguists call them <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>pro-forms</b>;
        Japanese builds them with unusual regularity.
      </p>
      <p className="gram-sub">
        The centerpiece is the こそあど grid — a genuine machine. Every demonstrative is a prefix that points
        (こ near me · そ near you · あ off yonder · ど the unknown) bolted to a suffix that names a category.
        Learn four prefixes and six suffixes and two dozen words assemble themselves — and the whole ど-row
        turns out to be your question words.
      </p>

      {/* INSTRUMENT I — the grid */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The こそあど grid</h2>
        <div className="latin">指示詞 · prefix points, suffix names — one machine</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap any square — the word splits into the two parts that built it
      </div>
      <DeixisGrid data={DEIXIS} showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT II — question words */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>Question words</h2>
        <div className="latin">疑問詞 · the ど-row, spun out — and bent into some / any / none</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick an interrogative — hear it in a real question
      </div>
      <QuestionWords data={DEIXIS} showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT III — personal pronouns */}
      <div className="instr-head">
        <div className="no">III</div>
        <h2>Personal pronouns</h2>
        <div className="latin">人称代名詞 · the “I” you’d rather not say</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> slide the rail — every pronoun is dressed for an occasion
      </div>
      <PronounLadder data={DEIXIS} showReadings={showReadings} showJp={showJp} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>What the instruments are really showing</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              One idea wearing three coats: a <em>pro-form</em> stands in for a noun by pointing at it.
              The grid points into space, the question words point at a gap, the pronouns point at people —
              and all three would rather you said as little as possible.
            </p>
            <p>
              That last part is the quiet lesson. Japanese is a <em>pro-drop</em> language: the subject is
              usually felt, not spoken, so 私 and あなた mostly vanish. What survives is the <em>choice</em> —
              僕 versus 俺, この versus その — and every choice is information. Korean, you’ll find on its own
              こそあど page, runs the very same closets: 이 / 그 / 저 against こ / そ / あ, almost square for square.
            </p>
            <blockquote>
              A demonstrative isn’t vocabulary; it’s a finger. Once you feel the prefix doing the pointing,
              the whole grid is one gesture, learned once.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">そ vs. あ in talk</span>
              the deixis goes abstract: そ points back at what we just <i>said</i>, あ at what we both already
              <i>know</i>. The grid, redrawn for memory instead of space.
            </div>
            <div className="note">
              <span className="date">the bare の</span>
              赤いの, 大きいの — の as a stand-in noun (“the red one”). Another pro-form, hiding in plain sight.
            </div>
            <div className="note">
              <span className="date">counters</span>
              いくつ opens the door — 一つ / 一個 / 一枚 / 一人. Number + counter, the other place Japanese
              makes you choose a category.
            </div>
          </aside>
        </div>
      </section>

      <DeixisColophon />
    </div>
  )
}
