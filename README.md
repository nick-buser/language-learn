# The Polyglot's Atlas — Grammar Instruments

Interactive grammar "instruments" for language study, built as a Vite + React app in the
**Aburaya** design language (lantern-lit bath-house: matte gouache, gilt keylines, dark-is-home).
Not lessons — working machines: drag a sentence apart, turn a register dial, swap a particle,
and the grammar answers back.

The aspiration is Tufte-grade didactics: every pixel and interaction should earn its place by
making a grammatical idea *felt* rather than stated. Discovery is rewarded with "lantern notes"
(eureka panels) that light up the first time you trip over the insight.

## Running it

```sh
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## The atlas — two-level navigation

Hash-routed: **language → folio (page)**. e.g. `#/ko/grammar`, `#/ko/verbs`, `#/ko/particles`, `#/ja/grammar`.
The binding (top bar) selects the language; the sub-strip below it selects the folio.
Default route is `#/ko/grammar` — Korean is the active study.

### 한국어 Korean (active study — beginner, leaning hard on Japanese transfer)

| Folio | Instruments |
|---|---|
| **문법 · grammar engine** (`#/ko/grammar`) | **The loom** — drag particle-tagged phrases; word order is free, the verb anchors the end. **The gate** — 받침 (batchim) particle allomorphy: pick a noun, watch 은/는·이/가·을/를·과/와·(으)로 re-tailor themselves, with jamo decomposition and liaison romanization. **은/는 & 이/가 spotlight** — topic vs. selection, with the elephant sentence (코끼리는 코가 길어요 / 象は鼻が長い) aligned in both languages. |
| **동사 · verb forge** (`#/ko/verbs`) | **The forge** — vowel-harmony conjugation (6 verbs × present/past/future) showing the bright/dark/하 fork and every fusion. **The register dial** — the four speech levels (합쇼체/해요체/해체/해라체) on one sentence, with a 2×2 formality×politeness map, social-distance scene, K-drama field notes, and an independent **-시-** subject-honor toggle. **안 & 못 spotlight** — the two negations: will vs. ability. |
| **조사 · particle cabinet** (`#/ko/particles`) | The particle deep dive — 33 particles in five pigment-coded drawers (skeleton case particles · place/time/direction · pairing & comparing · the focus set · the social set), one uniform card each: forms + 받침 fitting rule, Japanese twin, specimen sentence (hangul/RR/bridge/EN), why-it-matters, and trap footnotes. **The cabinet** — clickable index, chip → scroll-and-flash to card. **에 vs 에서 spotlight** — the に/で border. **The stack** — particle compounding: delimiters 는/도/만 *stack* after adverbial particles (에는 = には) but *replace* case particles (를+는 → 는, mirroring ✗をは), with live JP mirror equations, a ready-made stack catalogue (엔/에선/만이/께서는…), and contraction notes (난/널/전). |
| **한자어 · cognate bridge** (`#/ko/cognates`) | Sino-Japanese ↔ Sino-Korean. **The sound bridge** — the six final-consonant correspondences (-く/-き↔ㄱ, -つ/-ち↔ㄹ, long -う↔ㅂ, long vowel↔ㅇ, ん↔ㄴ *and* ㅁ), each with specimen characters and the Middle-Chinese why, plus an initials drawer (g/k↔h, b↔m, the vanishing 人). **The cognate ledger** — the dictionary pilot: 16 hand-checked entries (hanja, hangul+RR, kana+romaji, per-character rule derivation, specimen sentence), badged *true twin / skewed sense / false friend* (工夫, 愛人, 八方美人); rule chips link back into the bridge. The ledger's schema is the contract for the future dictionary backend — see `docs/vocabulary-plan.md`. |
| **어휘 · word bank** (`#/ko/vocab`) | The vocabulary system's first working face (plan phases 3+5, interface-first). **The holdings ledger** — the bank as a table: census strip (stacked coverage bar over unseen/met/learning/known, each account a click-to-filter chip), full-text search across hangul/RR/gloss/kanji, stratum (한자어·고유어·외래어) and POS filter chips with counts, sortable columns, expandable rows with the specimen sentence, usage note, hanja and SRS facts. Opening an unseen word files it as *met* — browsing builds the record. **The review drawer** — the quiet SRS: due queue over the learning set, bare-headword card fronts, full dictionary backs (reading, gloss, JP bridge with cognate/loan/equivalent badge, specimen), four grade buttons that print the interval each would buy, space/1–4 keyboard play, seven-day due forecast, session receipt. Words graduate to *known* at a 21-day interval. State: `localStorage` `atlas.ko.vocab.v1` (and `atlas.ja.vocab.v1`), shaped as the future backend payload. Data: `koreanVocab.js`, 38 hand-checked entries across the three strata. |
| **노래 · the song** (`#/ko/song`) | Learning a song end-to-end — the first instrument that asks you to make *sound*. A shelf of songs (switch with the picker), each opened by four instruments on **one shared transport** (`useTransport`) — a playhead measured in beats, advanced by `requestAnimationFrame`, that *sounds* the song as it plays via a dependency-free Web Audio synth (`audio.js`). **The lyric band** — transport karaoke: play/restart, three tempo stops, voice/tick/loop toggles and a progress thread; the line under the head lifts, the sung syllable lights, passed ones dim; click a line to seek; a "now" gloss carries the line's translation + JP bridge. **The melody roll** — a piano-roll of the air: beats left→right, the five pentatonic lanes bottom→top, each syllable a note block lit by the *same* playhead; click a block to hear its pitch, hold a tonic drone to hum against, a dashed contour traces the shape. **The diction bench** — written ≠ sung: liaison (넘어→너머), nasalization (십리→심니), tensification (못가→몯까, 발병→발뼝), each tap-to-reveal with the rule and a folio link; reveal all → lantern. **The harvest** — the vocab + grammar the lyric carries (고개·넘다·버리다·못·里; the honorific -시- in a relative clause, plain -ㄴ다, the -고 connective), cross-linked to the folios that teach them. Data: `koreanSongs.js` (the Song schema as a future songs-API payload); the page mounts a `SongStudio` keyed per song so switching gives a fresh clock. Two songs ship: **아리랑** (public-domain, full verse, roams the pentatonic) and a **BTS · MIC Drop** hook (copyrighted → a short, attributed teaching excerpt; near-monotone rap chant in a narrow band — a deliberate contrast, with each line carrying a sung/rap/chant `kind`). The lyrics/RR/bridges are hand-checked; the melodies are labeled **study transcriptions** (recognizable contour, not a score). |
| **여정 · fluency roadmap** (`#/ko/roadmap`) | The long road — capacity-phased roadmap to fluency, charted deep through B1 and honestly unmapped beyond. **The trail** — five Sino-named waymarks (관문 sound gate · 생존 survival kit · 연결 connected sentence · 자립 independence · 원경 far ranges), each a lantern that fills as its checklist completes, over CEFR/TOPIK reference rails (mileposts beside the road, not the road). **The waymark dossiers** — per-phase deep charts across six strands (어휘·문법·발음·듣기·읽기·말글): can-do goal-posts, explanations with JP-bridge notes, ~95 persisted checkboxes, an effort-mix panel (steady/listener/reader splits) and a pace dial (weeks-of-walking math, JP-transfer discount included). **The practice ledger** — seven habits with 14-day lamp-dot strips + streaks, and the weekly reckoning (check-in journal). First persistent state in the atlas: `localStorage` `atlas.ko.roadmap.v1`, the pilot for per-learner backend state. Content grounded in `project/uploads/files (5)/korean_approach.md`. |

### 日本語 Japanese (maintained)

| Folio | Instruments |
|---|---|
| **文法 · grammar engine** (`#/ja/grammar`) | **The loom** — particles carry roles, order carries emphasis. **The verb dial** — 食べる through plain/passive/causative/causative-passive, tracking 私. **は & が spotlight** — topic vs. selection, plus 象は鼻が長い. |
| **語彙 · word bank** (`#/ja/vocab`) | The same two vocabulary instruments as `#/ko/vocab` (they're language-blind), maintenance-flavored: 18-entry pilot bank stratified 漢語/和語/外来語 — the mirror of Korean's 한자어/고유어/외래어 — with kana+romaji as the readings layer and no bridge column. State: `atlas.ja.vocab.v1`. |

## Content conventions

- **Korean always carries both scripts**: hangul + Revised Romanization, with romanizations
  written to reflect pronunciation (합니다 → *hamnida*, 책이 → *chae-gi* with the liaison
  consonant marked). The **readings** toggle in the binding hides/shows them.
- **Japanese bridges**: Korean instruments show the corresponding Japanese form wherever the
  mapping is real (는↔は, 를↔を, -았↔た, 해요체↔です/ます, -시-↔尊敬語…). The **日本語 bridge**
  toggle (Korean pages only) hides them for self-testing.
- Eureka notes fire once per discovery per visit; "for the next plate" marginalia at the bottom
  of each folio is the roadmap of planned instruments (numbers & counters, 있다/없다, connectives,
  the irregular drawer, full sentence-type paradigms, the vocabulary system of
  `docs/vocabulary-plan.md`…).
- Linguistic content lives in data modules (`src/data/`), separate from the instrument mechanics
  (`src/components/`), so new specimens/verbs/nouns are data edits, not component surgery.

## Project structure

```
src/
  main.jsx                 entry
  App.jsx                  shell: binding, two-level nav, hash router, global toggles
  pages/
    JapaneseGrammar.jsx    ja folio — grammar engine
    KoreanGrammar.jsx      ko folio — grammar engine
    KoreanVerbs.jsx        ko folio — verb forge
    KoreanParticles.jsx    ko folio — particle cabinet
    KoreanCognates.jsx     ko folio — cognate bridge
    KoreanVocab.jsx        ko folio — word bank
    KoreanSong.jsx         ko folio — the song (one shared transport, four instruments)
    KoreanRoadmap.jsx      ko folio — fluency roadmap
    JapaneseVocab.jsx      ja folio — word bank
  components/
    LoomInstrument.jsx     ja loom
    VerbDial.jsx           ja voice dial
    HagaSpotlight.jsx      ja は/が
    korean/
      KoLoom.jsx           ko loom (with batchim-aware particle swaps)
      BatchimGate.jsx      ko particle allomorphy + jamo decomposition
      NeunGaSpotlight.jsx  ko 은/는 vs 이/가
      VerbForge.jsx        ko vowel-harmony conjugation
      RegisterDial.jsx     ko speech levels × subject honor
      AnMotSpotlight.jsx   ko 안 vs 못
      ParticleCabinet.jsx  ko particle index (drawers + chips → scroll)
      ParticleCard.jsx     ko one-particle plate (uniform anatomy)
      EEseoSpotlight.jsx   ko 에 vs 에서
      ParticleStack.jsx    ko particle compounding (holds vs yields)
      SoundBridge.jsx      ko on'yomi ↔ Sino-Korean finals (rule table as instrument)
      CognateLedger.jsx    ko cognate browser (filters + eureka — the dictionary pilot)
      CognateCard.jsx      ko one-cognate plate (uniform anatomy, rule-chip links)
      RoadTrail.jsx        ko waymark lanterns over CEFR/TOPIK rails
      WaymarkDossier.jsx   ko per-phase deep chart (strands, checklists, effort mix)
      PracticeLedger.jsx   ko habit dots + weekly check-in journal
      useRoadmapStore.js   ko progress persistence (localStorage; backend-shaped)
    vocab/                 language-blind vocabulary instruments (fed by per-lang data)
      WordLedger.jsx       the holdings ledger — census, search, filters, sortable table
      ReviewDrawer.jsx     the review drawer — due queue, flip cards, four grades
      useVocabStore.js     per-word state: unseen/met/learning/known (localStorage per lang)
      srs.js               the SM-2-ish day scheduler (pure functions + interval previews)
    song/                  song-learning instruments (fed by a per-song data module)
      SongStudio.jsx       per-song apparatus — owns the transport, lays out the 4 instruments
      useTransport.js      the shared clock — beat playhead (rAF), voice/tick/loop scheduling
      audio.js             dependency-free Web Audio: tones, metronome tick, tonic drone
      LyricBand.jsx        transport karaoke — syllable playhead, tempo, the "now" gloss
      MelodyRoll.jsx       piano-roll of the air — clickable notes, contour, tonic drone
      DictionBench.jsx     written ≠ sung — liaison/nasalization/tensification, reveal cards
      Harvest.jsx          the song's vocab + grammar, cross-linked to the teaching folios
  data/
    grammarData.js         ja content
    koreanData.js          ko content (hangul + RR + JP bridges, hand-checked)
    koreanParticles.js     ko particle cabinet content (33 cards + stack data)
    koreanCognates.js      ko cognate bridge content — schema piloted for the future
                           dictionary API (docs/vocabulary-plan.md)
    koreanRoadmap.js       ko fluency roadmap — waymarks, strands, checklists, mixes,
                           habits (built against korean_approach.md)
    koreanVocab.js         ko word bank — 38 entries across 한자어/고유어/외래어, the
                           generalized dictionary schema (VocabEntry) + lang config
    japaneseVocab.js       ja word bank — 18 entries across 漢語/和語/外来語, same schema
    koreanSongs.js         ko song folio — the Song schema (timeline of pitched syllables,
                           diction table, harvest), piloted as a future songs-API payload;
                           two songs — 아리랑 (full, public-domain) + MIC Drop (hook excerpt)
  styles/
    base.css               atlas/codex structure (binding, folios, plates, nav)
    aburaya.css            Aburaya skin — tokens + dark/day themes (canonical: dark)
    grammar.css            shared instrument vocabulary (loom, dial, spotlight, lantern notes)
    korean.css             Korean instruments (gate, forge, register) + .kr type
    particles.css          particle cabinet (index, cards, stack)
    cognates.css           cognate bridge (rule panel, specimen crossings, ledger cards)
    roadmap.css            fluency roadmap (trail & lanterns, dossiers, habit ledger)
    vocab.css              word bank (census, ledger table, review drawer & grade bar)
    song.css               the song (transport, lyric band, melody roll, diction, harvest)
docs/
  vocabulary-plan.md       the five-phase vocabulary acquisition roadmap
```

## Design system

The canonical Aburaya design system lives in **`design_system.zip`**
(`aburaya-design-system/project/colors_and_type.css` is the token source of truth; the README
inside covers philosophy, motion, and the kitsch guardrails). The tokens consumed by this app
are codified in `src/styles/aburaya.css`. Headline rules: dark mode is home; gold is matte and
rationed; red is surface/signal, never body text; elevation at night is glow, not shadow; motion
drifts and settles, never bounces; no emoji — meaningful glyphs are real CJK/hangul characters.

Korean type is **Noto Serif KR** (`--font-kr-serif`, `.kr` class), the brush-DNA sibling of the
Japanese Noto Serif JP.

## Provenance

`project/` and `chats/` are the original Claude Design handoff bundle (prototypes + transcripts)
that seeded the Japanese grammar engine, kept for reference — including
`project/uploads/files (5)/korean_approach.md`, the Korean study roadmap these folios are built
against. The HTML files in `project/` are design prototypes, not the app.
