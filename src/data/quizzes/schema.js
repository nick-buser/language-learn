// =====================================================================
// The Polyglot's Atlas — the proving ground (단련 / 鍛錬) · deck schema
//
// Every instrument in the atlas is a SELECTOR → ANSWER machine: pick a
// verb + a tense and the forge hands you 갔어요; pick a pointer + a
// category and the grid hands you 이것; pick a noun + a role and the gate
// hands you 책은. The proving ground runs those machines BACKWARDS — it
// shows the answer-slot and asks you to choose what fills it — and pools
// them into a swappable rack of decks driving one gamified cycle.
//
// A deck is DATA, not a component: it reshapes an already-hand-checked
// data module (koreanData.js, japaneseVerbs.js, …) into a flat list of
// cards. The engine (components/quiz/QuizStage.jsx) is language-blind and
// fed nothing but a deck + a store, exactly as the script drill is fed
// glyphs + a store. Adding a quiz is a data edit; the mechanics never move.
//
//   QuizDeck = {
//     id, glyph, label,            // rack identity (folio-style sino glyph)
//     blurb,                       // one line on the rack card
//     promptLabel,                 // the question over the options ("which form?")
//     hint,                        // the asking-state footer hint
//     groups?: ScopeGroup[],       // optional scope chips (filter the pool)
//     cards: QuizCard[],
//   }
//
//   QuizCard = {
//     id,                          // STABLE skill id — the mastery key (the lamp)
//     group?,                      // which ScopeGroup this card belongs to
//     near?,                       // distractor-cohort id: the engine prefers
//                                  // siblings sharing `near` as wrong answers,
//                                  // so confusions are the useful, near-miss kind
//                                  // (other tenses of the SAME verb, other
//                                  //  pointers in the SAME category)
//     prompt: QuizFace,            // what the challenge shows
//     answer: QuizFace,            // the correct option's face; the three
//                                  // distractors are other cards' `answer`
//   }
//
//   QuizFace = {
//     main,                        // the big line (a glyph/word, or a gloss)
//     sub?,                        // the reading (RR / romaji) — gated by showReadings
//     gloss?,                      // an always-shown English line (prompts)
//     tag?,                        // a small caps slot-label ("past · 해요체")
//     jp?,                         // a bridge cue (the twin form) — gated by showJp
//     lang?,                       // 'kr' | 'jp' → render `main` in that script font
//   }
//
//   ScopeGroup = { id, label, ids: [cardId…] }
//
// Conventions inherited from the rest of the atlas: Korean carries hangul
// + Revised Romanization (pronunciation-reflecting); the bridge form rides
// the showJp toggle; readings ride showReadings. Because decks only ever
// reshape verified modules, correctness lives at the source — a deck must
// never author a new surface form by hand.
// =====================================================================

/** Flatten a Revised-Romanization value: the gate stores liaison as a
 *  [before, carried-consonant, after] triple; everything else is a plain
 *  string. Join the triple into the spoken syllable (책이 → chaegi). */
export function joinRr(rr) {
  return Array.isArray(rr) ? rr.join('') : rr
}

/** Build a ScopeGroup from a list of cards by reading each card's field.
 *  `defs` is [{ id, label, match }] where match(card) → boolean. */
export function groupsBy(cards, defs) {
  return defs
    .map(d => ({ id: d.id, label: d.label, ids: cards.filter(d.match).map(c => c.id) }))
    .filter(g => g.ids.length > 0)
}
