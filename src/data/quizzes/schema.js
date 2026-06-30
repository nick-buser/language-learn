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
//     grid?: GridSpec,             // optional: also runnable on a 2-axis board
//     cards: QuizCard[],
//   }
//
//   GridSpec = {                   // a deck whose cards form a row × col table
//     script, imeScript,           // render font + free-entry IME engine
//     modes?: ['choose'|'type'|'locate'],  // which modes to offer (default all)
//     pick?: {                     // optional THIRD dial, as a selector not an
//       label,                     // axis: the board redraws per pick (the verb
//       options: [{ id, glyph, gloss, sub?, jp?, note? }],  // table picks a verb)
//     },
//     rows: [{ id, glyph, role }],         // row axis (prefix / register)
//     cols: [{ id, label, latin?, suffix }],  // col axis (category / tense)
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
//     row?, col?,                  // grid coordinates (when the deck has a grid)
//     pick?,                       // which grid.pick option this card belongs to
//     prompt: QuizFace,            // what the challenge shows
//     answer: QuizFace,            // the correct option's face; the three
//                                  // distractors are other cards' `answer`
//   }
//
//   QuizFace = {
//     main,                        // the big line (a glyph/word, or a gloss)
//     cloze?,                      // string[] — text segments AROUND a blank, in
//                                  // place of `main`: the cloze prompt renders a
//                                  // styled gap between each pair (['커피',' 마시지만
//                                  // 차',' …'] → 커피▢ 마시지만 차▢ …). Carries `lang`.
//     sub?,                        // the reading (RR / romaji) — gated by showReadings
//     gloss?,                      // an always-shown English line (prompts)
//     tag?,                        // a small caps slot-label ("past · 해요체")
//     jp?,                         // a bridge cue (the twin form) — gated by showJp
//     lang?,                       // 'kr' | 'jp' → render `main`/`cloze` in that font
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

/** Split a cabinet specimen (hangul with the particle wrapped in <m>…</m>)
 *  into the text segments AROUND the particle — the cloze prompt's gaps.
 *  '커피<m>는</m> 마시지만 차<m>는</m> 안 마셔요.'
 *    → ['커피', ' 마시지만 차', ' 안 마셔요.']  (two gaps, both the same particle).
 *  PromptFace renders a styled blank between each pair of segments. */
export function clozeSegments(kr) {
  return kr.split(/<m>.*?<\/m>/g)
}

/** Build a ScopeGroup from a list of cards by reading each card's field.
 *  `defs` is [{ id, label, match }] where match(card) → boolean. */
export function groupsBy(cards, defs) {
  return defs
    .map(d => ({ id: d.id, label: d.label, ids: cards.filter(d.match).map(c => c.id) }))
    .filter(g => g.ids.length > 0)
}
