import React from 'react'
import LoomInstrument from '../components/LoomInstrument.jsx'
import VerbDial from '../components/VerbDial.jsx'
import HagaSpotlight from '../components/HagaSpotlight.jsx'

function GrammarColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 文法 ⟡</div>
      The Polyglot's Atlas · Japanese folio · the grammar engine<br />
      drawn in the Aburaya hand · drag · turn · tap — the grammar answers back
    </div>
  )
}

export default function JapaneseGrammar({ showReadings }) {
  return (
    <div className="page" data-screen-label="Japanese — Grammar engine">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">文</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph">文法</span>
            The grammar engine
          </h1>
          <div className="latin">machina grammatica · how a Japanese sentence holds together</div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            drag · turn · tap
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Japanese grammar is the part of this language that is already <span className="accent">done</span> —
        built deep enough to parse complex prose once the vocabulary is known. This plate is not a
        grammar to <i>learn</i>; it is one to <i>play with</i>, until three patterns stop being rules
        and start being obvious.
      </p>
      <p className="gram-sub">
        The whole of it rests on one move that English never makes: a Japanese sentence marks each
        phrase with a <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>particle</b> —
        a tiny role-tag — so word order is freed to do other work, and the verb is left to close the sentence.
      </p>

      {/* INSTRUMENT I — the loom */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The loom</h2>
        <div className="latin">助詞 · roles, not order</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> grab a tile and move it — watch the meaning stay put
      </div>
      <LoomInstrument showReadings={showReadings} />

      {/* INSTRUMENT II — the dial */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>The verb dial</h2>
        <div className="latin">態 · the same 私, four roles</div>
      </div>
      <p className="gram-sub" style={{ marginBottom: 0 }}>
        The causative-passive — 〜させられる — is the form that tangles fluent speakers mid-sentence.
        It untangles the moment you stop translating and watch where{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>私</b> stands.
      </p>
      <div className="try-strip">
        <span className="dot"></span> turn the dial left to right — follow 私
      </div>
      <VerbDial />

      {/* INSTRUMENT III — は / が */}
      <div className="instr-head">
        <div className="no">III</div>
        <h2>は &amp; が — the spotlight</h2>
        <div className="latin">主題と主語 · topic vs. selection</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap each side — one particle apart
      </div>
      <HagaSpotlight />

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
              Three toys, one idea. Japanese hands meaning to <em>particles</em>, and in return it
              gives away the things English clings to — fixed word order, and an early verb.
            </p>
            <p>
              Once that trade is felt rather than memorised, the rest of the grammar reads as
              consequence. Free order is why a writer can hold a subject in suspense for a whole
              paragraph. Head-final is why a Japanese sentence can keep you waiting — and why the
              last syllable can overturn everything before it. And は against が is simply the
              question of whether you are naming the topic or choosing the one.
            </p>
            <blockquote>
              Grammar stops being the wall and becomes the floor — the thing you stand on to reach
              the vocabulary above it.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">conditionals</span>
              ば / たら / と / なら — four ways to say "if," each failing in its own situation. A loom
              of its own.
            </div>
            <div className="note">
              <span className="date">aspect</span>
              ている / てある / ておく / てしまう — what an action <i>leaves behind</i>. Best shown as a
              single sentence morphing through each.
            </div>
            <div className="note">
              <span className="date">keigo</span>
              尊敬語 / 謙譲語 / 丁寧語 — register as grammar, not vocabulary. A dial that raises and
              lowers the whole sentence by social distance.
            </div>
          </aside>
        </div>
      </section>

      <GrammarColophon />
    </div>
  )
}
