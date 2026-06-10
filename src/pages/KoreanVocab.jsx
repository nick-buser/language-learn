import React from 'react'
import WordLedger from '../components/vocab/WordLedger.jsx'
import ReviewDrawer from '../components/vocab/ReviewDrawer.jsx'
import useVocabStore from '../components/vocab/useVocabStore.js'
import { KO_VOCAB, KO_VOCAB_LANG } from '../data/koreanVocab.js'

function VocabColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 어휘 ⟡</div>
      The Polyglot's Atlas · Korean folio · the word bank<br />
      drawn in the Aburaya hand · browse · file · review — the bank remembers for you
    </div>
  )
}

export default function KoreanVocab({ showReadings, showJp }) {
  // One store for the folio — the ledger and the drawer share the ink.
  const store = useVocabStore('ko')

  return (
    <div className="page" data-screen-label="Korean — Word bank">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">庫</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">어휘</span>
            The word bank
          </h1>
          <div className="latin">
            aerarium verborum · the treasury — what you hold, and what you’re holding onto
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            browse · file · review
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Grammar is a machine you assemble once; vocabulary is <span className="accent">an
        account you keep</span>. This folio is the atlas’s first bank: every word filed by its
        stratum — <span className="accent">한자어</span> at the bridge discount,{' '}
        <span className="accent">고유어</span> at full price, <span className="accent">외래어</span>{' '}
        usually shared — and joined to the one fact no dictionary prints: whether <i>you</i> hold
        it yet.
      </p>
      <p className="gram-sub">
        Two instruments on one state. The <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>holdings ledger</b> is
        the bank book — search it, sort it, open the fine print, and file each word as met, learning,
        or known. The <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>review drawer</b> is
        where learning words come due. The pilot bank holds {KO_VOCAB.length} hand-checked words;
        the dictionary behind it arrives later and these instruments won’t notice.
      </p>

      {/* INSTRUMENT I — the holdings ledger */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The holdings ledger</h2>
        <div className="latin">단어장 (daneojang) · the bank book — every word, filed with its state</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> search and sort the bank — open a row for the fine print; file words you already own as known, words worth drilling as learning
      </div>
      <WordLedger
        entries={KO_VOCAB}
        lang={KO_VOCAB_LANG}
        store={store}
        showReadings={showReadings}
        showJp={showJp}
      />

      {/* INSTRUMENT II — the review drawer */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>The review drawer</h2>
        <div className="latin">복습 (bokseup) · review — a plain clock, kept deliberately boring</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> answer in your head before you turn — space turns the card, 1–4 grade it; the buttons print the price
      </div>
      <ReviewDrawer
        entries={KO_VOCAB}
        lang={KO_VOCAB_LANG}
        store={store}
        showReadings={showReadings}
        showJp={showJp}
      />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>The bank is the instrument the others will read</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              Every count on this page is a promise to a later folio. The <b>known</b> column is
              what generated reading passages will be tuned against (~97% coverage — enough
              footing to enjoy the walk, enough gap to grow). The <b>learning</b> column is the
              review drawer’s stock. Even <b>met</b> is load-bearing: words you’ve brushed past
              are the first candidates the harvest will offer back.
            </p>
            <p>
              The machinery is deliberately small — four states, four grades, one ease factor,
              day-granular. What matters is the shape: this folio’s state (per-word status,
              clock, history) is written exactly as the future backend will hold it, in
              <code> localStorage</code> under <code>atlas.ko.vocab.v1</code>, the same pilot
              discipline as the roadmap’s ink. When the dictionary system lands, the bank grows
              from {KO_VOCAB.length} words to thousands and nothing on this page changes but
              the census.
            </p>
            <blockquote>
              A word isn’t learned the day you meet it. It’s learned the day the bank stops
              asking about it.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">the dictionary</span>
              Phase 2 of the vocabulary plan: a real lexicon behind this schema — bulk-seeded,
              frequency-ranked, served by the homelab backend. The ledger becomes a window.
            </div>
            <div className="note">
              <span className="date">extensive reading</span>
              Phase 4: passages generated to your known set at ~97% coverage; unknown words
              glossed inline, one tap from <i>met</i> to <i>learning</i>.
            </div>
            <div className="note">
              <span className="date">the harvest</span>
              Words met while reading should arrive in the drawer with their sentence attached —
              context is the cheapest mnemonic there is.
            </div>
            <div className="note">
              <span className="date">one ink, all devices</span>
              The store graduates from localStorage to the backend with the dictionary, so the
              bank follows you off this machine.
            </div>
          </aside>
        </div>
      </section>

      <VocabColophon />
    </div>
  )
}
