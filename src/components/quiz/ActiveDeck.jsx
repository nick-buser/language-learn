import React, { useState } from 'react'
import QuizStage from './QuizStage.jsx'
import GridQuiz from './GridQuiz.jsx'

// =====================================================================
// The active deck — the runner between the rack and the cycle. Most decks
// have one format (flashcards), so this is a passthrough to QuizStage. A
// deck that declares a `grid` (the こそあど / 이·그·저 decks) also offers the
// grid format, and this hands a format toggle over the top of the two.
// =====================================================================

export default function ActiveDeck({ deck, store, showReadings, showJp }) {
  const [format, setFormat] = useState('cards')

  if (!deck.grid) {
    return <QuizStage deck={deck} store={store} showReadings={showReadings} showJp={showJp} />
  }

  return (
    <div className="active-deck">
      <div className="deck-format" role="tablist" aria-label="quiz format">
        <button role="tab" aria-selected={format === 'cards'}
          className={'format-tab' + (format === 'cards' ? ' active' : '')} onClick={() => setFormat('cards')}>
          flashcards
        </button>
        <button role="tab" aria-selected={format === 'grid'}
          className={'format-tab' + (format === 'grid' ? ' active' : '')} onClick={() => setFormat('grid')}>
          the grid
        </button>
      </div>
      {format === 'cards'
        ? <QuizStage deck={deck} store={store} showReadings={showReadings} showJp={showJp} />
        : <GridQuiz deck={deck} store={store} showReadings={showReadings} showJp={showJp} />}
    </div>
  )
}
