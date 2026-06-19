import React, { useEffect, useState } from 'react'
import WordLedger from '../components/vocab/WordLedger.jsx'
import ReviewDrawer from '../components/vocab/ReviewDrawer.jsx'
import useVocabStore from '../components/vocab/useVocabStore.js'
import { downloadExport } from '../components/vocab/exportVocab.js'
import { loadVocab } from '../data/dictionary/index.js'

function VocabColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 語彙 ⟡</div>
      The Polyglot's Atlas · Japanese folio · the word bank<br />
      drawn in the Aburaya hand · browse · file · review — the bank remembers for you
    </div>
  )
}

export default function JapaneseVocab({ showReadings }) {
  // One store for the folio — the ledger and the drawer share the ink.
  const store = useVocabStore('ja')
  // Words come through the dictionary seam (local now, the homelab API later).
  const [data, setData] = useState(null)
  useEffect(() => {
    let live = true
    loadVocab('ja').then(d => { if (live) setData(d) })
    return () => { live = false }
  }, [])

  return (
    <div className="page" data-screen-label="Japanese — Word bank">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">庫</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph" style={{ fontFamily: 'var(--font-cjk-serif)' }}>語彙</span>
            The word bank
          </h1>
          <div className="latin">
            aerarium verborum · the maintained treasury — keeping the held words held
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            browse · file · review
          </div>
          {data && (
            <button
              className="wb-export"
              onClick={() => downloadExport('ja', data.entries, store.words)}
              title="every word + its known/target/unseen state, as JSON — the reading generator's input"
            >
              export · JSON ↓
            </button>
          )}
        </div>
      </header>

      {!data ? (
        <p className="gram-sub" style={{ marginTop: 24 }}>Loading the bank…</p>
      ) : (
        <>
      {/* Lede */}
      <p className="gram-lede">
        Japanese is the <span className="accent">maintained</span> language of this atlas — the
        bank here is less about acquisition than upkeep. The same three strata file the lexicon:{' '}
        <span className="accent">漢語</span>, <span className="accent">和語</span>,{' '}
        <span className="accent">外来語</span> — the exact mirror of Korean’s
        한자어 · 고유어 · 외래어, which is no accident; it’s the same lexicon history, twice.
      </p>
      <p className="gram-sub">
        The instruments are identical to the Korean folio’s — one ledger, one drawer, one
        state — because the machinery was built language-blind. The pilot bank holds{' '}
        {data.entries.length} words; readings sit one toggle away for honest self-testing.
      </p>

      {/* INSTRUMENT I — the holdings ledger */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The holdings ledger</h2>
        <div className="latin">単語帳 (tangochō) · the bank book — every word, filed with its state</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> search and sort the bank — open a row for the fine print; file what you hold as known
      </div>
      <WordLedger
        entries={data.entries}
        lang={data.lang}
        store={store}
        showReadings={showReadings}
        showJp={false}
      />

      {/* INSTRUMENT II — the review drawer */}
      <div className="instr-head">
        <div className="no">II</div>
        <h2>The review drawer</h2>
        <div className="latin">復習 (fukushū) · review — a plain clock, kept deliberately boring</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> answer before you turn — space turns the card, 1–4 grade it
      </div>
      <ReviewDrawer
        entries={data.entries}
        lang={data.lang}
        store={store}
        showReadings={showReadings}
        showJp={false}
      />
        </>
      )}

      <VocabColophon />
    </div>
  )
}
