import React from 'react'
import JapaneseAdjectiveForge from '../components/japanese/JapaneseAdjectiveForge.jsx'

function AdjColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 形容詞 ⟡</div>
      The Polyglot's Atlas · Japanese folio · the adjective forge<br />
      drawn in the Aburaya hand · two types, one bench — and Korean, one verb
    </div>
  )
}

export default function JapaneseAdjectives({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Japanese — Adjectives">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">形</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph">形容詞</span>
            The adjective forge
          </h1>
          <div className="latin">
            officina adiectivorum · the two kinds, conjugated side by side —
            形容詞 <span style={{ fontStyle: 'normal' }}>(keiyōshi)</span> &amp;
            形容動詞 <span style={{ fontStyle: 'normal' }}>(keiyōdōshi)</span>
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            pull · compare · cross
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Japanese describing-words come in two kinds, and the split is real grammar, not spelling. An{' '}
        <span className="accent">い-adjective</span> conjugates like a verb — it carries its own tense
        (高い → 高かった). A <span className="accent">な-adjective</span> is a noun in disguise — it never
        moves, and leans on the copula だ to do everything (静か → 静かだった). Learn which is which and
        the endings fall out.
      </p>
      <p className="gram-sub">
        The bench below conjugates one of each, in lockstep, so the difference is something you{' '}
        <i>see</i> rather than memorize. Then turn on the{' '}
        <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>한국어 bridge</b>:
        Korean draws neither line. Its adjectives <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>are
        verbs</b> — they walk straight into the verb forge, no copula, no second class.
      </p>

      {/* INSTRUMENT I — the adjective forge */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The bench</h2>
        <div className="latin">活用 · two conjugations in parallel — い inflects, な leans</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pull a form — watch where each type changes; pick いい and きれい for the two traps
      </div>
      <JapaneseAdjectiveForge showReadings={showReadings} showJp={showJp} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>One forge, after all</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              The whole burden of Japanese adjectives is the sorting: い or な, and the two false-friend
              families (きれい-types that hide な, いい that hides an irregular stem). Once a word is filed,
              the conjugation is mechanical — the い-class carries tense itself, the な-class hands it to
              the copula.
            </p>
            <p>
              Cross the bridge and that whole apparatus simply isn’t there. Korean never separated
              adjectives from verbs: 비싸다 (expensive), 조용하다 (quiet), 좋다 (good) all conjugate on the
              same machine as 가다 and 먹다 — present 비싸요, past 비쌌어요, negative 안 비싸요. The one thing
              to carry across is that Korean adjective-verbs can’t take the present-progressive and a few
              other strictly-verbal endings — but their <em>tense</em>, their <em>negation</em>, their
              <em> politeness</em> are the verb forge, unchanged. Two classes here collapse to none there.
            </p>
            <blockquote>
              Japanese asks “is this adjective a verb or a noun?” Korean answered the question once, for
              good: it’s a verb. Send it to the 동사 forge and stop sorting.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">です makes it polite</span>
              高い → 高いです, 静かだ → 静かです. The plain forms here gain です/でした for the polite
              register — the same one-layer politeness as the verb’s ます.
            </div>
            <div className="note">
              <span className="date">adjective → noun phrase</span>
              Both types modify nouns directly: 高い本, 静かな部屋 (the な that names the class). Where
              Korean uses the adnominal -ㄴ/-은: 비싼 책, 조용한 방.
            </div>
            <div className="note">
              <span className="date">comparison</span>
              より / ほど / 一番 on these adjectives — and Korean’s 보다 / 만큼 / 제일, already filed in
              the <b>조사 · particle cabinet</b> (and its Japanese twin, the new 助詞 folio).
            </div>
          </aside>
        </div>
      </section>

      <AdjColophon />
    </div>
  )
}
