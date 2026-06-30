import React, { useState } from 'react'
import useQuizStore from './useQuizStore.js'
import DeckRack from './DeckRack.jsx'
import QuizStage from './QuizStage.jsx'

// =====================================================================
// The proving ground — the language-blind apparatus the quiz folios mount.
// It owns the per-language ledger (so best streaks and mastery survive
// every deck switch), keeps exactly one deck salient on the rack, and runs
// that deck's challenge cycle below. Fed nothing but a language id and a
// list of decks; the page around it is masthead → lede → this → coda.
// =====================================================================

export default function ProvingGround({ lang, decks, showReadings, showJp }) {
  const store = useQuizStore(lang)
  const [activeId, setActiveId] = useState(decks[0].id)
  const deck = decks.find(d => d.id === activeId) || decks[0]

  return (
    <div className="proving-ground" data-screen-label="proving ground">
      <DeckRack decks={decks} activeId={activeId} onPick={setActiveId} store={store} lang={lang} />
      <QuizStage
        key={deck.id}
        deck={deck}
        store={store}
        showReadings={showReadings}
        showJp={showJp}
      />
    </div>
  )
}
