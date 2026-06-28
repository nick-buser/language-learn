import React from 'react'
import JapaneseVerbForge from '../components/japanese/JapaneseVerbForge.jsx'
import VerbDial from '../components/VerbDial.jsx'

function VerbColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 動詞 ⟡</div>
      The Polyglot's Atlas · Japanese folio · the verb forge<br />
      drawn in the Aburaya hand · pick · turn · listen — the endings answer back
    </div>
  )
}

export default function JapaneseVerbs({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Japanese — Verb forge">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">用</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph">動詞</span>
            The verb forge
          </h1>
          <div className="latin">
            officina verborum · where endings are fitted to stems —
            動詞 <span style={{ fontStyle: 'normal' }}>(dōshi)</span> is 동사’s twin
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            pick · turn · compare
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        A Japanese verb is the part of the grammar you already <span className="accent">own</span> —
        食べる, 行く, する fold into ます, て, ない, た without you thinking. This plate is not here to
        teach you that. It is here to lay the machine out plainly and set it{' '}
        <span className="accent">beside Korean</span>, so the next conjugation you learn is the one you
        are reaching for.
      </p>
      <p className="gram-sub">
        One fork drives all of it: the verb’s <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>class</b>.
        A ru-verb (一段) just sheds る; an u-verb (五段) shifts its last sound to meet the ending; and
        there are exactly two outlaws. Turn on the <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>한국어 bridge</b> and
        watch Korean answer the same need with no classes at all — only a question about one vowel.
      </p>

      {/* INSTRUMENT I — the forge */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The forge</h2>
        <div className="latin">活用 (katsuyō) · tense by class — and politeness pulled out as a lane</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a verb, pull a tense — read plain and polite side by side, and watch the past split into 音便 vs 連用形
      </div>
      <JapaneseVerbForge showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT II — voice (the verb dial, moved here from grammar) */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">II</div>
        <h2>Voice — the verb dial</h2>
        <div className="latin">態 (tai) · the same 私, four roles — passive, causative, the knot</div>
      </div>
      <p className="gram-sub" style={{ marginBottom: 0 }}>
        Voice is a verb’s business, so the dial lives here now. The causative-passive — 〜させられる — is
        the form that tangles fluent speakers mid-sentence; it untangles the moment you stop translating
        and watch where{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>私</b> stands.
      </p>
      <div className="try-strip">
        <span className="dot"></span> turn the dial left to right — follow 私
      </div>
      <VerbDial />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>Two ways to be regular</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              Japanese front-loads the difficulty into <em>sorting</em>: once you know a verb’s class,
              every form falls out, and the only real friction is the 音便 corner of the past and
              te-forms. Korean front-loads it into <em>listening</em>: there are no classes to memorize,
              but every conjugation asks you to hear the stem’s last vowel first.
            </p>
            <p>
              Set the two side by side and the trade is clear. Japanese pays once, up front, to file
              each verb; Korean pays a little each time, in attention to sound. Neither is harder — they
              bury the same complexity in different places. The one genuine gift is する↔하다: the
              Sino-noun verb-factory works identically in both, so a whole stratum of vocabulary
              conjugates the moment you learn it as a noun.
            </p>
            <blockquote>
              Conjugation is where two agglutinating languages show their hands. Japanese sorts the
              verbs; Korean sorts the endings. Learn to feel which, and the rest is bookkeeping.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">negation, on its own</span>
              ない / ません across tense, in both lanes — and the Korean 안 / -지 않다 it faces, with the
              “can’t” that maps to 못. Joining this folio next.
            </div>
            <div className="note">
              <span className="date">politeness, explained</span>
              plain ⟷ polite as its own instrument — and the rule that startles English speakers: in a
              long sentence, only the <i>final</i> verb carries politeness; every clause before it stays
              plain. Faces the Korean register dial (해요체 / 합쇼체 / 반말).
            </div>
            <div className="note">
              <span className="date">the constructions — a folio of their own</span>
              the て-form economy (ている / ておく / てしまう…), the four “if”s (ば / たら / と / なら), and
              volitional + imperative (ましょう / 食べろ) move to the new <b>活用 · constructions</b> folio,
              where each gets the room to make its one point clear.
            </div>
            <div className="note">
              <span className="date">adjectives conjugate too</span>
              い-adjectives carry their own tense like quasi-verbs (高かった); see the{' '}
              <b>形容詞 · adjectives</b> folio — where Korean stops splitting and merges them back into
              verbs entirely.
            </div>
          </aside>
        </div>
      </section>

      <VerbColophon />
    </div>
  )
}
