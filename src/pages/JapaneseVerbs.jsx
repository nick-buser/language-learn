import React from 'react'
import JapaneseVerbForge from '../components/japanese/JapaneseVerbForge.jsx'

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
        <div className="latin">活用 (katsuyō) · conjugation — the class decides the shift</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a verb, pull a form — watch the stem shift, and the bridge cross
      </div>
      <JapaneseVerbForge showReadings={showReadings} showJp={showJp} />

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
              <span className="date">politeness, as a dial</span>
              ます / です against plain だ — and the Korean register dial it faces (해요체 / 합쇼체 /
              반말). Two levels here, four there: the gap subtitles flatten.
            </div>
            <div className="note">
              <span className="date">the て-form economy</span>
              て + いる / ある / おく / しまう / みる — what an action leaves behind, and where Korean’s
              -고 있다 / -아 있다 agree and where they split.
            </div>
            <div className="note">
              <span className="date">voice — delivered</span>
              passive, causative, the causative-passive knot: already a working dial on the{' '}
              <b>文法 · grammar engine</b> folio. The verb dial that tracks 私.
            </div>
            <div className="note">
              <span className="date">adjectives conjugate too</span>
              い-adjectives carry their own tense like quasi-verbs (高かった); see the new{' '}
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
