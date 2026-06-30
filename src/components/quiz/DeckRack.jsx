import React from 'react'

// =====================================================================
// The rack — the menu of decks, one salient at a time. Each card names a
// folio run backwards into questions; tapping it swaps the active machine
// below. The active card lifts and gilds (the others recede), and each
// carries its own progress: best streak and how many of its cards are past
// the learned lamp, so the rack doubles as a scoreboard.
// =====================================================================

export default function DeckRack({ decks, activeId, onPick, store, lang }) {
  return (
    <div className="deck-rack" role="tablist" aria-label="quiz decks">
      {decks.map(deck => {
        const active = deck.id === activeId
        const sum = store.summarize(deck.cards.map(c => c.id))
        const best = store.deckBest(deck.id)
        return (
          <button
            key={deck.id}
            role="tab"
            aria-selected={active}
            className={'deck-card' + (active ? ' active' : '')}
            onClick={() => onPick(deck.id)}
          >
            <span className={'deck-glyph ' + lang} lang={lang}>{deck.glyph}</span>
            <span className="deck-body">
              <span className="deck-label">{deck.label}</span>
              <span className="deck-blurb">{deck.blurb}</span>
              <span className="deck-stats">
                <span className="deck-stat"><span className="n">{sum.learned}</span>/{sum.total} learned</span>
                {best > 0 && <span className="deck-stat"><span className="n">{best}</span> best streak</span>}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
