import React from 'react'
import * as DEIXIS from '../data/koreanDeixis.js'
import DeixisGrid from '../components/deixis/DeixisGrid.jsx'
import QuestionWords from '../components/deixis/QuestionWords.jsx'
import PronounLadder from '../components/deixis/PronounLadder.jsx'

function DeixisColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 이 · 그 · 저 ⟡</div>
      The Polyglot's Atlas · Korean folio · this · that · what<br />
      drawn in the Aburaya hand · point · ask · name — your こそあど instinct, redeployed
    </div>
  )
}

export default function KoreanDeixis({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Korean — 이·그·저">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">이</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">이·그·저</span>
            this · that · what
          </h1>
          <div className="latin">
            verba demonstrativa · the pointing words — your こそあど grid, rebuilt in hangul
          </div>
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
        If you have met Japanese こそあど, this folio is a <span className="accent">homecoming</span>. Korean
        points with the same three fingers: 이 near me, 그 by you, 저 off yonder — and 이것 / 그것 / 저것
        line up against これ / それ / あれ almost square for square. The one rule to carry across is the
        <i> middle</i> term: 그 is そ, the listener’s word, not あ.
      </p>
      <p className="gram-sub">
        What’s new is the surface. Where Japanese keeps the machine perfectly regular — even the question
        row is just こ→ど — Korean tightens the bolts unevenly: the place row <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>fuses</b> (여기·거기,
        not ✗이기), and the 어-question row (어디·어떤·어떻게, 무엇) shares no clean suffix at all. Same gesture,
        looser joints — and that contrast is exactly what these instruments make felt.
      </p>

      {/* INSTRUMENT I — the grid */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The 이·그·저 grid</h2>
        <div className="latin">지시 표현 · the same machine, looser bolts</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap any square — and watch これ / それ / あれ slot in beside it
      </div>
      <DeixisGrid data={DEIXIS} showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT II — question words */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>Question words</h2>
        <div className="latin">의문사 · the 어-row, spun out — and bent into some / any / none</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick an interrogative — hear it in a real question
      </div>
      <QuestionWords data={DEIXIS} showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT III — personal pronouns */}
      <div className="instr-head">
        <div className="no">III</div>
        <h2>Personal pronouns</h2>
        <div className="latin">인칭대명사 · humility, not gender — and the 당신 trap</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> slide the rail — 저 humbles, 나 levels, 당신 bites
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
              The grammar you already own does most of the work: <em>pro-forms — words that point instead of
              name</em> — and Korean’s three closets sit right on top of Japanese’s. The transfer is almost
              total; the tax is phonological, not structural.
            </p>
            <p>
              Where Japanese splits its “I” by gender (僕 / 俺) and bluntness, Korean splits its by
              <em> humility</em> — 저 down, 나 level — and hides a pun in the wiring: that 저 is the same
              syllable as the 저 of the grid, “that, over there.” Pointer and pronoun, one shape. And like
              Japanese, Korean would rather you dropped the pronoun entirely; the danger word is 당신, which is
              not a safe “you” but a distant, spousal, or quarrelsome one. Use a name and a title instead.
            </p>
            <blockquote>
              You are not learning new pointing words. You are learning what your fingers sound like in hangul.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">이거 / 뭐</span>
              the spoken contractions — 이것→이거, 무엇→뭐, 그 사람→걔. The grid as it’s actually said, not spelled.
            </div>
            <div className="note">
              <span className="date">그 as memory</span>
              그 goes abstract just as そ does — 그 사람, “that person (we both know).” Deixis pointing back at talk.
            </div>
            <div className="note">
              <span className="date">counters</span>
              몇 opens it — 하나 / 한 개 / 한 명, native numbers against Sino 일·이·삼. The week-two investment.
            </div>
          </aside>
        </div>
      </section>

      <DeixisColophon />
    </div>
  )
}
