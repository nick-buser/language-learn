import React from 'react'
import KoLoom from '../components/korean/KoLoom.jsx'
import BatchimGate from '../components/korean/BatchimGate.jsx'
import NeunGaSpotlight from '../components/korean/NeunGaSpotlight.jsx'

function GrammarColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 문법 ⟡</div>
      The Polyglot's Atlas · Korean folio · the grammar engine<br />
      drawn in the Aburaya hand · drag · listen · tap — the grammar answers back
    </div>
  )
}

export default function KoreanGrammar({ showReadings, showJp }) {
  return (
    <div className="page" data-screen-label="Korean — Grammar engine">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">글</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">문법</span>
            The grammar engine
          </h1>
          <div className="latin">
            machina grammatica · the Japanese machine, rebuilt in Korean sound —
            문법 <span style={{ fontStyle: 'normal' }}>(munbeop)</span> is 文法 itself
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            drag · listen · tap
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Korean grammar is the closest thing to a <span className="accent">free lunch</span> a
        Japanese speaker will ever be served: SOV, topic-prominent, particle-marked, verb-final,
        agglutinative — the same floor plan, room for room. These instruments are not here to teach
        you that machine; you own it already. They are here to convince your hands of it.
      </p>
      <p className="gram-sub">
        What is genuinely new is not the grammar but the <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>sound</b>.
        A Japanese particle is a rubber stamp — は is は after anything. A Korean particle is a
        fitted garment: it changes shape for the noun’s final consonant, and the voice ties the
        seam shut. Learn that one fitting rule and it repays you everywhere — particles, copulas,
        verb endings alike.
      </p>

      {/* INSTRUMENT I — the loom */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The loom</h2>
        <div className="latin">조사 (josa) · 助詞 under a new name — roles, not order</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> grab a tile and move it — the meaning stays put, just like home
      </div>
      <KoLoom showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT II — the gate */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>The gate</h2>
        <div className="latin">받침 (batchim) · the particle listens to the noun</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> change the noun — watch five particles re-tailor themselves
      </div>
      <BatchimGate showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT III — 은/는 vs 이/가 */}
      <div className="instr-head">
        <div className="no">III</div>
        <h2>은/는 &amp; 이/가 — the spotlight</h2>
        <div className="latin">주제와 주어 (主題와 主語) · topic vs. selection</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap each side — your は/が instinct, redeployed
      </div>
      <NeunGaSpotlight showReadings={showReadings} showJp={showJp} />

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
              One idea, three angles: <em>Japanese taught you the grammar; Korean adds the
              phonology.</em> The loom shows the machine unchanged — particles carry the roles,
              order carries the emphasis, the verb keeps the end. The gate and the spotlight show
              the one thing the machine now does differently: every joint bends to sound.
            </p>
            <p>
              받침 decides the particle’s shape. Liaison ties written syllables into spoken ones —
              책이 on the page, <i>chae-gi</i> in the air. The same door swings in the copula
              (이에요/예요) and, as the verb folio shows, in the endings. This is why Korean
              listening takes longer than Korean reading: the seams are real, and the spelling
              refuses to show them. Treat every instrument here as ear training in disguise.
            </p>
            <blockquote>
              You are not learning a new grammar. You are learning what your grammar sounds like
              in a language that tailors its clothes.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">numbers &amp; counters</span>
              하나/둘/셋 against 일/이/삼 — native vs Sino, the exact kun/on split, each with its own
              counters. The week-two investment that saves months.
            </div>
            <div className="note">
              <span className="date">the sound bridge</span>
              学校 → がっこう → 학교. The on’yomi-to-Sino-Korean shift table (k↔g, ts↔ch, final ん↔ㄴ/ㅁ)
              — an afternoon of patterns that unlocks thousands of words you already own.
            </div>
            <div className="note">
              <span className="date">existence</span>
              있다/없다 — where いる and ある collapse into one verb, and “not existing” gets a verb
              of its own. Possession, location, and 있잖아 all fall out of it.
            </div>
            <div className="note">
              <span className="date">connectives</span>
              -아서 / -니까 / -지만 / -고 — the clause-chain that replaces て-form, each with its own
              temperament.
            </div>
          </aside>
        </div>
      </section>

      <GrammarColophon />
    </div>
  )
}
