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

Hash-routed: **language → folio (page)**. e.g. `#/ko/hangul`, `#/ko/grammar`, `#/ko/verbs`, `#/ko/forms`, `#/ko/particles`, `#/ja/kana`, `#/ja/grammar`, `#/ja/verbs`, `#/ja/forms`, `#/ja/particles`.
The binding (top bar) selects the language; the sub-strip below it selects the folio.
Default route is `#/ko/grammar` — Korean is the active study.

### 한국어 Korean (active study — beginner, leaning hard on Japanese transfer)

| Folio | Instruments |
|---|---|
| **한글 · the hangul forge** (`#/ko/hangul`) | The script, gamified — the entry folio, persisted to `localStorage` (`atlas.ko.scripts.v1`), spoken by the browser's Web Speech voices (the `speech.js` seam — a recorded/Kokoro engine swaps in later, no instrument change). **The block builder** — hangul's whole idea as a machine: a syllable is a 초성 + 중성 (+ 받침) you *stack*, composed by real Unicode arithmetic (the inverse of `romanize.js`, via `ime.js`'s `composeBlock`), heard and read in RR; the 받침 panel makes the **seven-sounds rule** *felt* — pick ㅅ/ㅈ/ㅌ as a final and the block still sounds [t] — and fires the lantern that ties neutralization to liaison/assimilation. **The drill** — the 40 jamo to reflex: four-option recognition in three directions (jamo→sound · sound→jamo · hear→jamo), weighted toward the least-mastered, a streak + a lamp strip that fills faint→gold, scoped to 자음(plain · aspirate/tense)/모음(basic · y·w). **The transliteration bench** — 18 hand-checked 외래어 (커피, 아이스크림, 맥도날드, 택시, 핑크…) crossing into 한글 — typed on a **keyboardless romaja IME** (an inline composition automaton; g=ㄱ, k=ㅋ, ng=받침 ㅇ) or a 자모 tap pad — and back to English, each landing rewarded with the adaptation rule (no f→ㅍ, the echo ㅡ, the seven-sounds 받침). The **仮名 bridge** frames it: kana is ~100 syllables to *memorize*, hangul ~40 parts to *assemble*. The deliberate mirror of `#/ja/kana`'s bench (ㅡ-padding vs ウ-padding, the same loanwords adapted twice). |
| **문법 · grammar engine** (`#/ko/grammar`) | **The loom** — drag particle-tagged phrases; word order is free, the verb anchors the end. **The gate** — 받침 (batchim) particle allomorphy: pick a noun, watch 은/는·이/가·을/를·과/와·(으)로 re-tailor themselves, with jamo decomposition and liaison romanization. **은/는 & 이/가 spotlight** — topic vs. selection, with the elephant sentence (코끼리는 코가 길어요 / 象は鼻が長い) aligned in both languages. |
| **동사 · verb forge** (`#/ko/verbs`) | **The forge** — vowel-harmony conjugation (6 verbs × present/past/future) showing the bright/dark/하 fork and every fusion. **The register dial** — the four speech levels (합쇼체/해요체/해체/해라체) on one sentence, with a 2×2 formality×politeness map, social-distance scene, K-drama field notes, and an independent **-시-** subject-honor toggle. **안 & 못 spotlight** — the two negations: will vs. ability. |
| **활용 · constructions** (`#/ko/forms`) | The joints the forge can't reach — the deliberate mirror of `#/ja/forms`, run the other way (Korean headword, **日本語 bridge**). Four instruments. **The connective** — the て-form *split*: where Japanese spends one て, Korean forks into the **-고** stem (list/sequence) and the **-아/어** stem (flow/cause), both built live from the forge; a rack of constructions (-고 있다/나서/싶다, -아/어 보다/주다/버리다/도 되다/야 되다), the 만나고-vs-만나서 minimal pair, and the trap (-아/어서 can't carry a command → -(으)니까). **The conditional** — -(으)면 built with the 으-buffer fork, then the small family (-(으)면 · -(ㄴ/는)다면 · -거든 · -자마자) mapped onto the four Japanese "if"s it collapses. **Volitional & imperative** — -자/-(으)ㅂ시다/-(으)ㄹ까요? and the four-rung command ladder -아/어라 → -아/어 → -(으)세요 → -(으)십시오 (+ -지 마(세요)), against Japanese's ~2 levels. **Voice** — the matrix the verb folio doesn't host: the **lexical** layer (피동 이/히/리/기, 사동 이/히/리/기/우/구/추 — gappy, per-verb) vs the **productive** layer (-아/어지다 · -게 하다), five verbs spanning the spectrum (먹다 clean 히/이 · 보다 one form both voices · 듣다 causative gap · 죽다 causative-only 自他 · 만들다 no-lexical), each with an active/passive/causative specimen trio, against Japanese's one 〜られる/〜させる rule. Conjugations derive from `koreanData.js`'s `FORGE_VERBS`; the construction forms are authored in `koreanForms.js` and hand-checked. |
| **조사 · particle cabinet** (`#/ko/particles`) | The particle deep dive — 33 particles in five pigment-coded drawers (skeleton case particles · place/time/direction · pairing & comparing · the focus set · the social set), one uniform card each: forms + 받침 fitting rule, Japanese twin, specimen sentence (hangul/RR/bridge/EN), why-it-matters, and trap footnotes. **The cabinet** — clickable index, chip → scroll-and-flash to card. **에 vs 에서 spotlight** — the に/で border. **The stack** — particle compounding: delimiters 는/도/만 *stack* after adverbial particles (에는 = には) but *replace* case particles (를+는 → 는, mirroring ✗をは), with live JP mirror equations, a ready-made stack catalogue (엔/에선/만이/께서는…), and contraction notes (난/널/전). |
| **한자어 · cognate bridge** (`#/ko/cognates`) | Sino-Japanese ↔ Sino-Korean. **The sound bridge** — the six final-consonant correspondences (-く/-き↔ㄱ, -つ/-ち↔ㄹ, long -う↔ㅂ, long vowel↔ㅇ, ん↔ㄴ *and* ㅁ), each with specimen characters and the Middle-Chinese why, plus an initials drawer (g/k↔h, b↔m, the vanishing 人). **The cognate ledger** — the dictionary pilot: 16 hand-checked entries (hanja, hangul+RR, kana+romaji, per-character rule derivation, specimen sentence), badged *true twin / skewed sense / false friend* (工夫, 愛人, 八方美人); rule chips link back into the bridge. The ledger's schema is the contract for the future dictionary backend — see `docs/vocabulary-plan.md`. |
| **어휘 · word bank** (`#/ko/vocab`) | The vocabulary system's first working face (plan phases 3+5, interface-first). **The holdings ledger** — the bank as a table: census strip (a three-bucket headline — known / not-known / unvisited — over a stacked coverage bar across unseen/met/target/learning/known, each account a click-to-filter chip), full-text search across hangul/RR/gloss/kanji, stratum (한자어·고유어·외래어) and POS filter chips with counts, sortable columns, expandable rows with the specimen sentence, usage note, hanja and SRS facts. Opening an unseen word files it as *met* — browsing builds the record; a word you know you don't know yet you *flag* as a **target** (the deliberate gap the reading generator will sample). **The review drawer** — the quiet SRS: due queue over the learning set, bare-headword card fronts, full dictionary backs (reading, gloss, JP bridge with cognate/loan/equivalent badge, specimen), four grade buttons that print the interval each would buy, space/1–4 keyboard play, seven-day due forecast, session receipt. Words graduate to *known* at a 21-day interval. State is **persisted to the homelab backend** when `VITE_API_URL` is set (`/v1/vocab/{lang}` — hydrate on mount, write-through on every change, first-run migration of the localStorage pilot up), with `localStorage` (`atlas.ko.vocab.v1` / `atlas.ja.vocab.v1`) kept as the offline cache; the bank exports as generator-ready JSON (every word + its known/target/unseen state — `exportVocab.js` / `GET /v1/vocab/{lang}/export`). Words load through the **dictionary seam** (`loadVocab`, async — the one place the homelab backend will land); Korean reads a **KRDICT-backed dictionary** (`src/data/dictionary/ko.json`, ~160 frequency-ranked entries with multi-sense definitions, hanja, and learner grades from the **국립국어원 「한국어기초사전」 (KRDICT) Open API**), merged with the hand-checked core that carries the Japanese bridges + specimen sentences. Built by `tools/seed-dictionary.mjs` (phase 2 — `docs/dictionary.md`). |
| **다독 · the reading room** (`#/ko/reading`) | Extensive reading — the word bank spent on text (plan phase 4). **The reading room** — paste any Korean passage (or open a sample) and it's read against your holdings: known-word **coverage** is reported as the *~98% gauge* (a stacked bar over the passage's content words — known/target/learning/met/unseen/not-in-bank — with the extensive-reading floor marked at 98% and the zone named: extensive ≥98% · comprehensible 95–98% · …), then the passage renders with **known words receding and gaps lit** by a colour-coded underline. Tap a lit word for the dictionary back (reading, gloss, JP bridge — honoring the toggles) and the word bank's *file under* control: reading **is** the harvest, so a tap files straight into vocab state (`setStatus` → backend write-through) and coverage recomputes live. Korean is taken apart by a **real morphological analyzer running in-process in the backend** (`kiwipiepy`/Kiwi via `POST /v1/reading/analyze` — 학교에서 → 학교, 먹어요 → 먹다), so inflections/particles resolve to the dictionary headwords the bank is keyed to; the lemma→dictionary→state join happens client-side off live state. Imported passages live on a `localStorage` shelf (`atlas.ko.readings.v1`, the future `/v1/readings` + Garage contract); offline it shows "coverage needs the backend" and still renders the raw text. The generator (phase 4's engine) drops into this same room later as another source. |
| **노래 · the song** (`#/ko/song`) | Learning a song end-to-end — the first instrument that asks you to make *sound*. A shelf of songs (switch with the picker), each opened by four instruments on **one shared transport** (`useTransport`) — a playhead measured in beats, advanced by `requestAnimationFrame`, that *sounds* the song as it plays via a dependency-free Web Audio synth (`audio.js`). **The lyric band** — transport karaoke: play/restart, three tempo stops, voice/tick/loop toggles and a progress thread; the line under the head lifts, the sung syllable lights, passed ones dim; click a line to seek; a "now" gloss carries the line's translation + JP bridge. **The melody roll** — a piano-roll of the air: beats left→right, the five pentatonic lanes bottom→top, each syllable a note block lit by the *same* playhead; click a block to hear its pitch, hold a tonic drone to hum against, a dashed contour traces the shape. **The diction bench** — written ≠ sung: liaison (넘어→너머), nasalization (십리→심니), tensification (못가→몯까, 발병→발뼝), each tap-to-reveal with the rule and a folio link; reveal all → lantern. **The harvest** — the vocab + grammar the lyric carries (고개·넘다·버리다·못·里; the honorific -시- in a relative clause, plain -ㄴ다, the -고 connective), cross-linked to the folios that teach them. Data: `koreanSongs.js` (the Song schema as a future songs-API payload); the page mounts a `SongStudio` keyed per song so switching gives a fresh clock. Three songs ship: **아리랑** (public-domain, full verse, roams the pentatonic), a **BTS · MIC Drop** hook (near-monotone rap chant in a narrow band), and a **GD&TOP · Knock Out** (뻑이가요) pre-chorus+hook whose whole pun rides liaison (뻑이→뻐기, 손이→소니) and which mixes a sung line over a chant. The two K-pop tracks are copyrighted → short, attributed teaching excerpts only; each line carries a sung/rap/chant `kind`. The lyrics/RR/bridges are hand-checked; the melodies are labeled **study transcriptions** (recognizable contour, not a score). |
| **자작 · custom** (`#/ko/custom`) | A scratch bench: paste any block of text — hangul, English, or a mix — and it's organized line by line into the **lyric band**, reusing the song folio's machinery on text it's never seen. A parser (`parseLyrics.js`) tokenizes each line (a hangul block char = one syllable; a run of Latin letters = one whole word; punctuation rides the preceding token) and emits exactly the `koreanSongs.js` Song shape — a timeline of flat-pitched, equal-duration syllables on a shared clock — so the band can't tell a typed song from an authored one. You get the full transport (slow/easy/tempo, voice/tick/loop, the syllable playhead, click-to-seek) and an **approximate per-syllable romanization** under the readings toggle — `romanize.js` decomposes each hangul block to jamo (pure Unicode arithmetic, no dictionary) and maps each to its Revised-Romanization letter; honest about the gap, it skips cross-syllable sandhi (liaison/assimilation/palatalization). The melody roll / diction / harvest stay dark (they need data the parser can't infer), there's no meaning yet, and timing is uniform (one beat a syllable). Press **format** to rebuild the band from the textarea. |
| **여정 · fluency roadmap** (`#/ko/roadmap`) | The long road — capacity-phased roadmap to fluency, charted deep through B1 and honestly unmapped beyond. **The trail** — five Sino-named waymarks (관문 sound gate · 생존 survival kit · 연결 connected sentence · 자립 independence · 원경 far ranges), each a lantern that fills as its checklist completes, over CEFR/TOPIK reference rails (mileposts beside the road, not the road). **The waymark dossiers** — per-phase deep charts across six strands (어휘·문법·발음·듣기·읽기·말글): can-do goal-posts, explanations with JP-bridge notes, ~95 persisted checkboxes, an effort-mix panel (steady/listener/reader splits) and a pace dial (weeks-of-walking math, JP-transfer discount included). **The practice ledger** — seven habits with 14-day lamp-dot strips + streaks, and the weekly reckoning (check-in journal). First persistent state in the atlas: `localStorage` `atlas.ko.roadmap.v1`, the pilot for per-learner backend state. Content grounded in `project/uploads/files (5)/korean_approach.md`. |

### 日本語 Japanese (maintained — and now a Korean-study mirror via the 한국어 bridge)

The **仮名 foundry** is the script entry — where the language starts. The conjugation and particle
folios run the atlas's bridge **backward**: the learner owns Japanese, so these plates lay the familiar
system out plainly and show the **Korean twin** beside it (toggled by the **한국어 bridge** switch). They
double as Korean reinforcement from the side you already know.

| Folio | Instruments |
|---|---|
| **仮名 · the kana foundry** (`#/ja/kana`) | The script entry — ひらがな + カタカナ, gamified and persisted (`atlas.ja.scripts.v1`), spoken via the browser's Web Speech voices. **The gojūon grid** — the 五十音 as the machine it is (five vowels × the consonant series), a ひらがな/カタカナ toggle over one shared skeleton, 濁音/拗音 drawers, tap-to-hear with the twin script shown (ぢ/づ faint, kept out of the drill). **The drill** — the shared recognition engine, with per-script mastery (か and カ learned separately), scoped 基本/濁音/拗音. **The transliteration bench** — 18 hand-checked 外来語 (コーヒー, ブラック, パーティー, マクドナルド…) into カタカナ and back, each romaji **verified to round-trip** the IME, each teaching its adaptation rule (long ー, the small っ, vowel padding, ティ/フォ). The mirror of `#/ko/hangul`'s bench. |
| **文法 · grammar engine** (`#/ja/grammar`) | **The loom** — particles carry roles, order carries emphasis. **だ・です — the copula** — the copula deep-dive: pick a base (そう / 学生 / きれい), conjugate だ on its own axis (polarity だ/じゃない · tense だ/だった · register だ/です), then cap it with a 終助詞 — ね / よ / よね / か — and the form assembles live (そうだ → そうじゃない → そうだよね → そうじゃないよね), each tail carrying a nuance note (ね seeks agreement, よ asserts, よね both), the plain+か だ-drop called out, and a 한국어 bridge tying the 終助詞 to Korean's verb endings (-지/-네/-거든). **は & が spotlight** — topic vs. selection, plus 象は鼻が長い. (The voice dial moved to 動詞, where it belongs.) |
| **動詞 · verb forge** (`#/ja/verbs`) | The everyday paradigm, in four instruments. **The forge** — the class fork (一段/五段/不規則) drives the stem; tense (non-past · past · progressive) reads down the side, and politeness is pulled out as the **plain \| polite two-lane** across — which surfaces a contrast the old single axis couldn't: the plain past takes 音便 (飲んだ) while the polite past keeps the clean 連用形 (飲みました). Lanterns 活用/音便/不規則; tense-lane cells **derived** from the hand-checked forms. **Negation** — ない/ません as a tense × lane grid + the "can't" row (potential-negative), bridged to Korean's two no's (안 won't / 못 can't — and 못 is exactly where the potential-negative lands). **Politeness** — the lane as its own axis, demonstrating the rule English speakers miss: in a long sentence politeness lands ONCE, on the final verb; every te-form/-고/-아서 clause before it is register-neutral (toggle and only the last word moves). **Voice — the verb dial** — 食べる through plain/passive/causative/causative-passive, tracking 私 (moved here from grammar). |
| **活用 · constructions** (`#/ja/forms`) | The forms that *don't* fall out by rule — each given its own instrument. **The て-form** — the head shows the bare te-form with its 音便 lit (書いて / 飲んで / 待って / 行って the rogue); the compound rack shows what て + an auxiliary does — ている (progressive) · てみる (try) · てしまう (complete/regret) · ておく (prepare) · てください (request) · てもいい (permission) · てはいけない (prohibition) · てから (after) — each bridged to Korean's split stems (-고 vs -아/어). **The conditional** — Japanese's four "if"s (ば general · たら specific-when · と automatic · なら contextual), each owning a situation, against Korean's one all-purpose -(으)면. **Volitional & imperative** — the urging forms: 食べよう/食べましょう (let's) and the command ladder 食べろ → 食べなさい → 食べてください → 食べるな, blunt→polite, each rung faced with its Korean twin (-자/-(으)ㅂ시다, -아라/-(으)세요/-지 마). Data is `japaneseForms.js`, reusing the verb forms; Korean stems authored. Now mirrored by the Korean 활용 folio (`#/ko/forms`). |
| **形容詞 · adjectives** (`#/ja/adjectives`) | **The bench** — one い-adjective and one な-adjective conjugated in lockstep across six forms (present/negative/past/past-neg/te/adverb), so the split is *seen*: the い-type inflects **itself** (高い→高かった), the な-type inflects the **copula** (静か→静かだった). いい fires the irregular lantern, きれい the false-friend lantern; Sino な-adjectives (有名→유명) badge 漢. The thesis is the bridge — **Korean draws neither line**: its adjectives ARE verbs (비싸다 conjugates exactly like 가다), so both classes collapse into the verb forge. |
| **助詞 · particle cabinet** (`#/ja/particles`) | The Korean cabinet inverted — 28 cards in five pigment-coded drawers, Japanese headword + Korean twin (한), one uniform plate each (fitting rule, specimen, why, faces, traps), with a clickable index (chip → scroll-and-flash). Two themes mirror the Korean folio: JP particles **never tailor** (は is は), and where JP spends one particle **Korean spends several** (に→에/에게, で→에서/으로, から→에서/부터/한테서, と→와·과/하고/랑). And a drawer Korean has no single answer for — the **終助詞** (か・ね・よ・な・の・かな) — bridged to Korean verb *endings* (-까, -네, -거든, -지 마, -(으)ㄹ까), not particles. |
| **語彙 · word bank** (`#/ja/vocab`) | The same two vocabulary instruments as `#/ko/vocab` (they're language-blind), maintenance-flavored: 18-entry pilot bank stratified 漢語/和語/外来語 — the mirror of Korean's 한자어/고유어/외래어 — with kana+romaji as the readings layer and no bridge column. State: `atlas.ja.vocab.v1`, backend-persisted like Korean. |

## Content conventions

- **Korean always carries both scripts**: hangul + Revised Romanization, with romanizations
  written to reflect pronunciation (합니다 → *hamnida*, 책이 → *chae-gi* with the liaison
  consonant marked). The **readings** toggle in the binding hides/shows them.
- **Cross-language bridges run both ways.** Korean instruments show the corresponding Japanese form
  wherever the mapping is real (는↔は, 를↔を, -았↔た, 해요체↔です/ます, -시-↔尊敬語…), under the
  **日本語 bridge** toggle. The Japanese conjugation/particle folios show the **reverse** — the Korean
  twin, under a **한국어 bridge** toggle — with hangul + RR, marked "한" the way the Japanese bridges are
  marked "日". Either toggle hides the bridge for self-testing. (The single `showJp` state in `App.jsx`
  drives both, relabelled per language.)
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
    JapaneseKana.jsx       ja folio — kana foundry (gojūon grid, drill, bench)
    JapaneseGrammar.jsx    ja folio — grammar engine
    JapaneseVerbs.jsx      ja folio — verb forge (forge tense-lanes · negation · politeness · voice)
    JapaneseForms.jsx      ja folio — 活用 constructions (te-form · conditional · volitional/imperative)
    JapaneseAdjectives.jsx ja folio — the い/な adjective bench
    JapaneseParticles.jsx  ja folio — particle cabinet (reverse bridge + 終助詞)
    KoreanHangul.jsx       ko folio — hangul forge (block builder, drill, bench)
    KoreanGrammar.jsx      ko folio — grammar engine
    KoreanVerbs.jsx        ko folio — verb forge
    KoreanForms.jsx        ko folio — 활용 constructions (connective · conditional · vol/imp · voice)
    KoreanParticles.jsx    ko folio — particle cabinet
    KoreanCognates.jsx     ko folio — cognate bridge
    KoreanVocab.jsx        ko folio — word bank
    KoreanReading.jsx      ko folio — the reading room (import → coverage → read → harvest)
    KoreanSong.jsx         ko folio — the song (one shared transport, four instruments)
    KoreanCustom.jsx       ko folio — custom bench (paste a block → the lyric band)
    KoreanRoadmap.jsx      ko folio — fluency roadmap
    JapaneseVocab.jsx      ja folio — word bank
  components/
    LoomInstrument.jsx     ja loom
    VerbDial.jsx           ja voice dial
    HagaSpotlight.jsx      ja は/が
    japanese/              ja conjugation + cabinet instruments (한국어 reverse bridge)
      JapaneseVerbForge.jsx       class fork (一段/五段/不規則) + tense × plain|polite lanes
      CopulaDive.jsx              だ・です builder — copula × polarity/tense/register × 終助詞 (ね/よ/よね)
      Negation.jsx                ない/ません tense×lane grid + the "can't" row → 안/못 bridge
      Politeness.jsx              the plain⟷polite lane; "only the final verb carries it" demo
      TeForm.jsx                  the て-form head (音便) + the compound rack (ている/てみる/…)
      Conditional.jsx             the four "if"s — ば/たら/と/なら, each niche + example
      VolitionalImperative.jsx    let's (よう/ましょう) + the imperative ladder (ろ→なさい→てください)
      JapaneseAdjectiveForge.jsx  the い/な bench — two conjugations in parallel
      JapaneseParticleCabinet.jsx ja particle index (drawers + chips → scroll)
      JapaneseParticleCard.jsx    ja one-particle plate (JP head, KO twin)
      KanaGrid.jsx                the 五十音 grid (hira/kata toggle, 濁音/拗音 drawers, tap-to-hear)
    korean/
      KoLoom.jsx           ko loom (with batchim-aware particle swaps)
      BatchimGate.jsx      ko particle allomorphy + jamo decomposition
      NeunGaSpotlight.jsx  ko 은/는 vs 이/가
      VerbForge.jsx        ko vowel-harmony conjugation
      RegisterDial.jsx     ko speech levels × subject honor
      AnMotSpotlight.jsx   ko 안 vs 못
      Connective.jsx       ko the te-form split — -고 (list) vs -아/어 (flow) + the rack
      KoConditional.jsx    ko -(으)면 + the four-"if"s-collapsed family
      KoVolitionalImperative.jsx ko -자/-(으)ㅂ시다 + the 4-rung command ladder
      VoiceDial.jsx        ko voice matrix — lexical (이/히/리/기) vs productive (-아/어지다·-게 하다)
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
      HangulBuilder.jsx    ko block builder (초성+중성+받침 → Unicode compose, 받침 seven-sounds)
    scripts/               language-blind script foundry (fed per-lang data — かな / 한글)
      speech.js            Web Speech wrapper — THE audio seam (recorded/Kokoro engine swaps in here)
      useScriptStore.js    per-glyph mastery (0–5 lamp) + game scores — localStorage atlas.<lang>.scripts.v1
      ime.js               romaji→kana table + romaja→hangul composition automaton; composeBlock + jamo arrays
      RomajiInput.jsx      the keyboardless inline-IME input (romaji field + glyph tap pad)
      ScriptDrill.jsx      gamified recognition — 3 modes, weighted questions, streak + mastery lamps
      Transliterator.jsx   the EN↔script loanword bench (build via IME · read back in English)
    vocab/                 language-blind vocabulary instruments (fed by per-lang data)
      WordLedger.jsx       the holdings ledger — census, search, filters, sortable table
      ReviewDrawer.jsx     the review drawer — due queue, flip cards, four grades
      useVocabStore.js     per-word state: unseen/met/target/learning/known — localStorage
                           cache + write-through to the homelab /v1/vocab API (hydrate,
                           PUT/DELETE, first-run migration up)
      exportVocab.js       the bank as generator-ready JSON (mirrors GET /v1/vocab/{lang}/export)
      srs.js               the SM-2-ish day scheduler (pure functions + interval previews)
    reading/               the reading room (다독 — extensive reading)
      analyzeReading.js    POST /v1/reading/analyze (the one network touch; honest offline)
      coverage.js          pure join: tokens × dictionary × live state → classes + coverage %
      CoverageMeter.jsx    the ~98% gauge — stacked bar + the extensive-reading floor
      ReadingView.jsx      the passage, content words lit by what you know (tap to gloss/file)
      WordPanel.jsx        the gloss + "file under" panel (harvest → setStatus)
      ReadingImport.jsx    paste + title → analyze
      useReadingsStore.js  the localStorage shelf (atlas.ko.readings.v1; future /v1/readings)
    song/                  song-learning instruments (fed by a per-song data module)
      SongStudio.jsx       per-song apparatus — owns the transport, lays out the 4 instruments
      parseLyrics.js       text block → Song (tokenize lines into syllables) — the custom bench
      romanize.js          jamo decomposition → approximate per-syllable Revised Romanization
      useTransport.js      the shared clock — beat playhead (rAF), voice/tick/loop scheduling
      audio.js             dependency-free Web Audio: tones, metronome tick, tonic drone
      LyricBand.jsx        transport karaoke — syllable playhead, tempo, the "now" gloss
      MelodyRoll.jsx       piano-roll of the air — clickable notes, contour, tonic drone
      DictionBench.jsx     written ≠ sung — liaison/nasalization/tensification, reveal cards
      Harvest.jsx          the song's vocab + grammar, cross-linked to the teaching folios
  data/
    grammarData.js         ja grammar content (loom, the だ/です COPULA dive, voice-dial data, は/が)
    japaneseKana.js        ja kana foundry — gojūon + 濁音/拗音, tap-pad layout, 外来語 word list
    japaneseVerbs.js       ja verb forge — 9 verbs × forms, class; tense-lane/negation derivations
                           (tenseCells/negCells) + POLITENESS data + Korean twins
    japaneseForms.js       ja 活用 folio — the te-compounds, the 4 conditionals, volitional+imperative
                           (reuses the verb te-forms; Korean -고/-아 stems authored)
    japaneseAdjectives.js  ja adjective bench — い/な exemplars × 6 forms + Korean twin
    japaneseParticles.js   ja particle cabinet — 28 cards, JP head + KO bridge (inverts koreanParticles.js)
    koreanHangul.js        ko hangul forge — jamo (+RR+voiceable exemplars), builder inventories, 자모 pad, 외래어
    koreanData.js          ko content (hangul + RR + JP bridges, hand-checked)
    koreanForms.js         ko 활용 folio — connective compounds, the conditional family,
                           vol/imp forms, voice (lexical + productive); imports FORGE_VERBS
                           from koreanData.js, authors the constructions + JP twins
                           (mirrors japaneseForms.js, run the other way)
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
                           three songs — 아리랑 (full, public-domain) + MIC Drop +
                           Knock Out (뻑이가요) (hook excerpts)
    koreanReadings.js      ko reading room — the Reading schema (localStorage/future-API
                           payload) + sample passages; text only, coverage is computed
    dictionary/            the dictionary subsystem (phase 2 — docs/dictionary.md)
      schema.js            DictionaryEntry v2 — senses[], freqRank, conjugation, grade, source
      index.js             loadVocab() — THE data-access seam (local now, homelab API later)
      ko.json              the KRDICT-backed Korean dictionary (generated, ~160 entries)
  styles/
    base.css               atlas/codex structure (binding, folios, plates, nav)
    aburaya.css            Aburaya skin — tokens + dark/day themes (canonical: dark)
    grammar.css            shared instrument vocabulary (loom, dial, spotlight, lantern notes)
    korean.css             Korean instruments (gate, forge, register) + .kr type
    japanese.css           Japanese instruments (.jp type, 한국어 bridge readouts, verb + adjective forge)
    particles.css          particle cabinet (index, cards, stack)
    jparticles.css         Japanese particle cabinet — reverse-bridge overrides on particles.css
    cognates.css           cognate bridge (rule panel, specimen crossings, ledger cards)
    roadmap.css            fluency roadmap (trail & lanterns, dossiers, habit ledger)
    vocab.css              word bank (census, ledger table, review drawer & grade bar)
    reading.css            the reading room (import, coverage gauge, lit passage, gloss panel)
    song.css               the song (transport, lyric band, melody roll, diction, harvest)
    scripts.css            the script foundries (keyboardless IME, drill, gojūon grid, hangul builder, bench)
tools/
  seed-dictionary.mjs      frequency list + gloss adapter → DictionaryEntry JSON (the seeder);
                           --adapter=manual (offline, the hand bank) | krdict (key + licensing)
  data/ko-freq.sample.txt  sample frequency seed (one headword per line; line number = rank)
  data/ko-freq.core.txt    the ~160-word core seed that generated ko.json
docs/
  vocabulary-plan.md       the five-phase vocabulary acquisition roadmap
  dictionary.md            phase 2 — schema v2, the data-access seam, the seeding pipeline
```

## Credits & data sources

Korean dictionary data — definitions, readings, **한자 (hanja)**, learner grades, and the
multi-sense glosses behind the word bank — come from the **국립국어원 「한국어기초사전」 (KRDICT)**
Open API, the Basic Korean Dictionary of the **National Institute of Korean Language**
(<https://krdict.korean.go.kr>). Used here for private study with gratitude; the institute and the
dictionary are credited in the app itself (the 어휘 folio) and in the generated `ko.json`. The
Japanese bridges, specimen sentences, and the cognate/grammar/song content are hand-authored.

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
