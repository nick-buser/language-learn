import React, { useRef } from 'react'
import SoundBridge from '../components/korean/SoundBridge.jsx'
import CognateLedger from '../components/korean/CognateLedger.jsx'

function CognateColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 한자어 ⟡</div>
      The Polyglot's Atlas · Korean folio · the cognate bridge<br />
      drawn in the Aburaya hand · pick · cross · collect — the old words answer back
    </div>
  )
}

export default function KoreanCognates({ showReadings, showJp }) {
  const bridgeRef = useRef(null)
  const ruleFromLedger = (id) => bridgeRef.current?.selectRule(id)

  return (
    <div className="page" data-screen-label="Korean — Cognate bridge">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">漢</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">한자어</span>
            The cognate bridge
          </h1>
          <div className="latin">
            pons verborum · the vocabulary you already own —
            한자어 <span style={{ fontStyle: 'normal' }}>(hanjaeo)</span> is 漢字語 itself
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            pick · cross · collect
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Roughly six in ten Korean words are <span className="accent">한자어</span> — Middle Chinese
        loans, the very lexicon your on’yomi came from. がっこう and 학교, やくそく and 약속,
        しんぶん and 신문 are not look-alikes; they are <span className="accent">the same word,
        borrowed twice</span>, and the differences between them are regular enough to learn as
        rules rather than as words.
      </p>
      <p className="gram-sub">
        Two instruments. The bridge fits <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>the sound laws</b> —
        six finals that decide nearly every crossing. The ledger is <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>the first page of a dictionary</b> —
        real words filed with their derivations, their badges, and the occasional warning. This is
        the cheapest vocabulary you will ever acquire; mind only the trolls.
      </p>

      {/* INSTRUMENT I — the sound bridge */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The sound bridge</h2>
        <div className="latin">음운 대응 (eumun daeeung) · sound correspondence — six finals, six fates</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a final — watch four characters cross; find the one rule that swaps its consonant
      </div>
      <SoundBridge ref={bridgeRef} showReadings={showReadings} />

      {/* INSTRUMENT II — the ledger */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>The cognate ledger</h2>
        <div className="latin">어휘장 (eohwijang) · the dictionary pilot — entries with toll receipts</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> browse the page — tap a rule chip to reopen it on the bridge; filter for the false friends
      </div>
      <CognateLedger onRulePick={ruleFromLedger} showReadings={showReadings} showJp={showJp} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>You don’t learn these words — you re-key them</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              A beginner from English buys Korean vocabulary at full price, one word at a time. A
              beginner from Japanese inherits the Sino half of the lexicon and pays only a sound
              toll — six finals, a few initial habits, and the occasional false friend held at
              arm’s length.
            </p>
            <p>
              The ledger above is deliberately small: sixteen entries, hand-checked, shaped exactly
              like the payload a real dictionary backend will someday return. The interface is the
              point — when the dictionary system lands (see <code>docs/vocabulary-plan.md</code>),
              these cards become a window onto thousands of entries, joined by what you’ve read,
              what you know, and what is due for review. The bridge stays; the ledger grows.
            </p>
            <blockquote>
              Hear the Japanese word, swap the finals, and listen for what comes back. Most of the
              time, what comes back is Korean.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">numbers &amp; counters</span>
              일/이/삼 are cognates too (いち/に/さん, toll paid) — but they share the floor with
              native 하나/둘/셋, split by counter exactly like on/kun. One table, two number lines.
            </div>
            <div className="note">
              <span className="date">the dictionary</span>
              Phase 2 of the vocabulary plan: a backend lexicon serving this ledger’s schema in
              bulk, seeded from open sources, hand-checked where surfaced.
            </div>
            <div className="note">
              <span className="date">known words</span>
              Phase 3: per-word state — unseen, met, learning, known — persisted, so the atlas
              remembers which planks of the bridge you’ve already crossed.
            </div>
            <div className="note">
              <span className="date">reading &amp; review</span>
              Phases 4–5: generated extensive-reading passages at ~97% known coverage, and a
              quiet SRS drawer over the words harvested from them.
            </div>
          </aside>
        </div>
      </section>

      <CognateColophon />
    </div>
  )
}
