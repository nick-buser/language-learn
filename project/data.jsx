/* ===========================================================
   data.jsx — content for The Polyglot's Atlas
   Rewritten in UI-friendly form from the source roadmaps.
   =========================================================== */

// — Track definitions —
window.TRACKS = [
  {
    id: "settlement", roman: "I", name: "Settlement",
    latin: "habitatio · the territories one is inhabiting",
    relation: "inhabitation",
  },
  {
    id: "travel", roman: "II", name: "Travel",
    latin: "itinerarium · territories one is passing through",
    relation: "visitation",
  },
  {
    id: "cartography", roman: "III", name: "Cartography",
    latin: "chorographia · territories studied from outside",
    relation: "observation",
  },
  {
    id: "geography", roman: "IV", name: "Reference Plates",
    latin: "geographia universalis · the underlying substrate",
    relation: "the discipline itself",
  },
];

// — Territories (languages) —
// status: deep (established residence) | active (active settlement)
//       | maintained (property kept) | vacated (retained, not maintained)
window.TERRITORIES = [
  {
    id: "japanese",
    name: "Japanese",
    glyph: "日",
    latin: "Nihongo",
    track: "settlement",
    status: "deep",
    statusLabel: "Established residence",
    statusNote: "in residence ~10 years · N3 → N2 territory",
    folioNum: "III",
    aim: "Genuine media access — unsubbed anime, Urasawa & Asano in original, then toward Murakami, Abe, Ogawa.",
  },
  {
    id: "korean",
    name: "Korean",
    glyph: "한",
    latin: "Hangugeo",
    track: "settlement",
    status: "active",
    statusLabel: "Active settlement",
    statusNote: "building the dwelling · ~6 months in",
    folioNum: "V",
    aim: "K-drama and webtoons in original, then toward Han Kang and Park Min-gyu.",
  },
  {
    id: "mandarin",
    name: "Mandarin",
    glyph: "中",
    latin: "Zhōngwén",
    track: "settlement",
    status: "active",
    statusLabel: "Active settlement",
    statusNote: "early construction · multi-year ground",
    folioNum: "VII",
    aim: "Liu Cixin in original, then Yu Hua and contemporary Chinese fiction.",
  },
  {
    id: "german",
    name: "German",
    glyph: "D",
    latin: "Deutsch",
    track: "settlement",
    status: "maintained",
    statusLabel: "Maintained property",
    statusNote: "lapsed B1 · the locks still work",
    folioNum: "XI",
    aim: "Babylon Berlin and Dark in German; eventually Kafka, Sebald, Mann.",
  },
  {
    id: "spanish",
    name: "Spanish",
    glyph: "ñ",
    latin: "Español",
    track: "settlement",
    status: "vacated",
    statusLabel: "Vacated, retained",
    statusNote: "passive reading intact · ear untrained",
    folioNum: "XIV",
    aim: "Borges, Cortázar, Bolaño, Schweblin — the literary tradition, not the streaming output.",
  },
  {
    id: "french",
    name: "French",
    glyph: "ç",
    latin: "Français",
    track: "settlement",
    status: "vacated",
    statusLabel: "Vacated, retained",
    statusNote: "high-school foundation · listening gap",
    folioNum: "XVI",
    aim: "French cinema with French subs; eventually Camus, Modiano, Ernaux, theory.",
  },
  // Travel
  {
    id: "italian",
    name: "Italian",
    glyph: "It",
    latin: "Italiano",
    track: "travel",
    status: "travel",
    statusLabel: "Crash course (planned)",
    statusNote: "for the September trip · 8 weeks",
    folioNum: "XIX",
    aim: "Phrasebook fluency, the music of Italian, basic comprehension.",
  },
  {
    id: "thai",
    name: "Thai",
    glyph: "ไ",
    latin: "Phasa Thai",
    track: "travel",
    status: "travel",
    statusLabel: "Sampling (in progress)",
    statusNote: "for cinema access · listening only",
    folioNum: "XX",
    aim: "Parse word boundaries, intonation, sentence endings — enough to follow film without subtitles.",
  },
];

// — Recent encounters (the activity log) —
window.ENCOUNTERS = [
  {
    id: "e1", day: "20", dayLatin: "Today",
    monthYear: "May 2026",
    territory: "japanese",
    glyph: "日",
    modality: "reading",
    kind: "Manga",
    title: "Pluto, vol. 2 — chs. 9–11",
    source: "Naoki Urasawa",
    gloss: "Three chapters unaided. Mined 18 new words; the war-veteran register on Heracles' dialogue is the part that's still slow.",
  },
  {
    id: "e2", day: "20", dayLatin: null,
    monthYear: null,
    territory: "japanese",
    glyph: "日",
    modality: "script",
    kind: "Kanji",
    title: "WaniKani · level 27",
    source: "review session",
    gloss: "60 reviews, 92% accuracy. The 拘 / 抱 / 抱 confusion finally cleaned up.",
  },
  {
    id: "e3", day: "19", dayLatin: "Yesterday",
    monthYear: null,
    territory: "korean",
    glyph: "한",
    modality: "listening",
    kind: "K-drama",
    title: "My Mister — ep. 4 (re-watch)",
    source: "with Korean subs",
    gloss: "Caught the moment Park Dong-hoon drops banmal for the first time. Marginalia later in the folio.",
  },
  {
    id: "e4", day: "19", dayLatin: null,
    monthYear: null,
    territory: "japanese",
    glyph: "日",
    modality: "listening",
    kind: "Podcast",
    title: "ゆる言語学ラジオ · ep. 374",
    source: "linguistics chat",
    gloss: "Listened on a walk. No subs. ~80% comprehension; lost the thread when they got into 古文 examples.",
  },
  {
    id: "e5", day: "18", dayLatin: "Tuesday",
    monthYear: null,
    territory: "geography",
    glyph: "𝐈",
    modality: "Track IV",
    kind: "Reference",
    title: "Phonotactics — Korean consonant assimilation",
    source: "from the reference plates",
    gloss: "Linked into the Korean folio under Listening. The rules for ㄴ before ㄹ now feel mechanical.",
  },
  {
    id: "e6", day: "17", dayLatin: "Monday",
    monthYear: null,
    territory: "german",
    glyph: "D",
    modality: "reading",
    kind: "Newspaper",
    title: "Süddeutsche Zeitung — Feuilleton",
    source: "morning ritual",
    gloss: "First proper SZ article in two years. Recognised more than expected; vocab is rusty but the structure is intact.",
  },
  {
    id: "e7", day: "17", dayLatin: null,
    monthYear: null,
    territory: "japanese",
    glyph: "日",
    modality: "speaking",
    kind: "Conversation",
    title: "Tutor session · 田中先生",
    source: "iTalki, 50 min",
    gloss: "Discussed the new Asano. Got tangled on causative-passive but recovered. He notes my pitch on -だろう is drifting again.",
  },
  {
    id: "e8", day: "16", dayLatin: "Sunday",
    monthYear: null,
    territory: "japanese",
    glyph: "日",
    modality: "reading",
    kind: "Manga",
    title: "おやすみプンプン · vol. 4",
    source: "Inio Asano",
    gloss: "The internal-monologue panels remain the hardest thing I read regularly. Furigana mostly absent from vol. 4 onward.",
  },
  {
    id: "e9", day: "15", dayLatin: "Saturday",
    monthYear: null,
    territory: "spanish",
    glyph: "ñ",
    modality: "reading",
    kind: "Short story",
    title: "Cortázar — Continuidad de los parques",
    source: "in original",
    gloss: "Three pages, three readings. The imperfect subjunctive is everywhere; the trick at the end still lands harder in Spanish.",
  },
  {
    id: "e10", day: "14", dayLatin: "Friday",
    monthYear: null,
    territory: "japanese",
    glyph: "日",
    modality: "writing",
    kind: "Journal",
    title: "Notebook entry — 日記",
    source: "evening journal",
    gloss: "Three short paragraphs. Tried out 〜たまえ; will look up whether that reads as condescending or paternal.",
  },
];

// — Marginalia (the editor's notes column on home) —
window.MARGINALIA = [
  {
    date: "20 May 2026",
    text: "The Pluto comprehension feels qualitatively different from where it was at the start of the year. Reading without dictionary support for a whole chapter now happens by default, not as an event.",
  },
  {
    date: "18 May 2026",
    text: "Korean listening is the wall. Comprehension on second viewing of subbed scenes is fine; first-pass without subs collapses entirely. The bottleneck is consonant assimilation, not vocabulary.",
  },
  {
    date: "14 May 2026",
    text: "Should the German folio re-open as active? Two weeks of SZ in the morning has been easier than expected. The atlas resists this — vacated to active is meant to be deliberate. Sit with it another month.",
  },
  {
    date: "10 May 2026",
    text: "A question for the cartographer: what is the relationship between pitch accent in Japanese and tone in Mandarin, mechanically? Filed under Track IV.",
  },
];

// — Editor's standing notes (small list, top-right of home) —
window.STANDING_NOTES = [
  { label: "Currently attending to", items: [
    { glyph: "日", text: "Pluto vol. 2 unaided" },
    { glyph: "日", text: "WaniKani: pushing to level 30" },
    { glyph: "한", text: "Banmal recognition in dialogue" },
  ]},
  { label: "Held in pause", items: [
    { glyph: "中", text: "Tone-pair drilling — return June" },
    { glyph: "Es", text: "Cortázar re-reads, light touch" },
  ]},
];

// — Japanese folio: the four plates —
window.JAPANESE_FOLIO = {
  aim:
    "Move from comfortable-but-bounded N3/N2 territory into genuine media access: unsubbed anime, light novels, literary manga (Urasawa, Asano, Matsumoto), and toward Murakami, Abe, Ogawa, Yokomizo in the original. Visual novels and JRPGs as a bonus payoff.",
  bottleneck: {
    label: "The bottleneck, said plainly",
    text:
      "A spoken-strong, written-weak profile — the kind that comes from immersion-heavy or audio-heavy study. Grammar is the hardest part of Japanese to acquire and it is done. What remains is vocabulary and kanji at scale, plus reading-speed — and these compound on each other: vocab gaps slow reading, slow reading slows vocab acquisition. Past the wall most people quit at. The compounding from here is favourable, but the work is discipline, not insight.",
  },
  carryings: [
    "Grammar intuition strong enough to parse complex sentences once vocabulary is known",
    "Sound-system fluency — audiobooks and podcasts are viable for vocab acquisition (most learners at this stage cannot use audio)",
    "Speaking practice that has hardwired sentence rhythm — leverageable for retention via reading aloud",
  ],
  // Per-modality status, qualitative bands:
  // bands ordered: untrained · nascent · developing · established · deep
  modalities: [
    {
      id: "listening",
      name: "Listening",
      latin: "auditus",
      bandIndex: 4,
      band: "Deep",
      shortNote: "Dialogue-heavy anime accessible. Slang and regional registers still slip past.",
      detail: {
        attending: [
          { p: "Drift", text: "Pitch on -だろう and -じゃない drifting again — tutor flagged it twice this month." },
          { p: "Push", text: "Watch Monster with JP subs (started ep. 7); move to Mushishi for the regional registers." },
          { p: "Push", text: "Add ゆる言語学ラジオ to the regular podcast rotation — already comfortable with the linguistics register." },
        ],
        resources: [
          { title: "Animelon", meta: "JP subs · dictionary lookup", gloss: "Primary access route for anime with toggleable subs." },
          { title: "ゆる言語学ラジオ", meta: "podcast · linguistics", gloss: "Two hosts, slow-ish pace, dense linguistic content." },
          { title: "Monster", meta: "anime · dialogue-heavy", gloss: "In progress, ep. 7. The medical register is the stretch." },
        ],
        signposts: [
          { at: "now", text: "Episode of slice-of-life with JP subs without exhaustion", state: "reached" },
          { at: "6mo", text: "Mushishi unaided, no subs, on first listen", state: "current" },
          { at: "1y+", text: "Untrained ear for unsubbed dialogue-heavy anime", state: "pending" },
        ],
      },
    },
    {
      id: "speaking",
      name: "Speaking",
      latin: "loquela",
      bandIndex: 3,
      band: "Established",
      shortNote: "Casual conversation natural. Keigo production halts; advanced grammar in production lags reading.",
      detail: {
        attending: [
          { p: "Maintain", text: "Weekly tutor session — declared low-priority for the aim (reception), but holds the rhythm." },
          { p: "Note", text: "Causative-passive still triggers translation-from-English midway through a sentence; only fix is more reps in the wild." },
          { p: "Note", text: "Pitch perfectionism explicitly deferred. Recognition matters; production drift is acceptable." },
        ],
        resources: [
          { title: "iTalki: 田中先生", meta: "weekly · 50 min", gloss: "Stable for two years. Will not push for new tutors." },
          { title: "Shadowing: NHK morning drama", meta: "occasional", gloss: "Used when the ear needs sharpening, not on schedule." },
        ],
        signposts: [
          { at: "—", text: "Casual conversation natural across daily topics", state: "reached" },
          { at: "—", text: "Holding the pitch on common particles under load", state: "current" },
          { at: "deferred", text: "Keigo production at speed", state: "deferred" },
        ],
      },
    },
    {
      id: "reading",
      name: "Reading",
      latin: "lectio",
      bandIndex: 2,
      band: "Developing",
      shortNote: "Manga in the taste-range now accessible. Light novels next. Literary prose still a year off.",
      detail: {
        attending: [
          { p: "Push", text: "Finish Pluto vol. 2 unaided. Then 20th Century Boys — the same author, easier still on first volumes." },
          { p: "Push", text: "Open Konbini Ningen (Murata Sayaka) — explicitly the short, contemporary, accessible literary onramp." },
          { p: "Tactic", text: "Yomitan on every digital reading session. Stop being precious about lookups." },
        ],
        resources: [
          { title: "Pluto", meta: "manga · Naoki Urasawa", gloss: "Slightly easier than 20CB. Currently vol. 2, ch. 11." },
          { title: "Konbini Ningen", meta: "novel · Murata Sayaka", gloss: "Queued. Short, contemporary, accessible." },
          { title: "Satori Reader", meta: "graded · intermediate", gloss: "Used in between manga sessions." },
          { title: "Yomitan", meta: "browser extension", gloss: "Game-changing for digital reading. Was formerly Yomichan." },
        ],
        signposts: [
          { at: "month 3", text: "Read Yotsubato unaided in one sitting", state: "reached" },
          { at: "month 12", text: "Finish a full volume of Pluto", state: "current" },
          { at: "month 18", text: "Murakami short story with light dictionary support", state: "pending" },
          { at: "month 24", text: "Start a Murakami novel without dread", state: "pending" },
        ],
      },
    },
    {
      id: "writing",
      name: "Writing",
      latin: "scriptio",
      bandIndex: 1,
      band: "Nascent",
      shortNote: "Short journal entries only. Not on the critical path for the aim; held intentionally minimal.",
      detail: {
        attending: [
          { p: "Hold", text: "Writing is deferred relative to the aim. Three short paragraphs a week as retention scaffolding, no more." },
          { p: "Note", text: "Pencil-and-paper kanji writing explicitly skipped — production-only, reading-focused learners can skip it." },
        ],
        resources: [
          { title: "Notebook 日記", meta: "personal journal · weekly", gloss: "Plain prose. Used to surface grammar patterns I'm avoiding in conversation." },
        ],
        signposts: [
          { at: "—", text: "Three paragraphs a week, sustained", state: "current" },
          { at: "deferred", text: "Anything beyond this", state: "deferred" },
        ],
      },
    },
    {
      id: "script",
      name: "Script",
      latin: "scriptura · kanji",
      bandIndex: 2,
      band: "Developing",
      shortNote: "~1,000 kanji recognized; ~600 with confidence. Closing the gap to ~2,000 is the highest-ROI work available.",
      detail: {
        attending: [
          { p: "Push", text: "WaniKani is the chosen system — committed. Pushing to level 30 (≈1,500 kanji) by autumn." },
          { p: "Note", text: "Furigana / ateji literacy: noticing intentional non-standard readings in Asano and Fujimoto is happening more often. Worth tracking." },
          { p: "Tactic", text: "Stop swapping between systems. Discipline matters more than the choice; the choice is made." },
        ],
        resources: [
          { title: "WaniKani", meta: "SRS · paid", gloss: "Currently level 27. ~3 hours/week, distributed." },
          { title: "Yomitan furigana", meta: "browser", gloss: "Quietly normalises uncommon readings without breaking flow." },
        ],
        signposts: [
          { at: "month 6", text: "1,500 kanji + N2 vocab consolidated", state: "current" },
          { at: "year 1", text: "Threshold for adult reading (~2,000)", state: "pending" },
          { at: "year 2+", text: "Comfortable with literary furigana / ateji play", state: "pending" },
        ],
      },
    },
  ],
  // The signposts plate — overall phase ladder
  phases: [
    { at: "Phase I", strong: "0–6 mo", text: "Vocabulary & kanji acceleration. Bridge manga (Yotsubato → Tsuki ga Kirei → Yokohama Kaidashi Kikō). Anime in JP subs only.", state: "reached" },
    { at: "Phase II", strong: "6–14 mo", text: "Reading push. N1 grammar (Shin Kanzen Master). First full manga unaided — Pluto, then 20th Century Boys, Dorohedoro, Goodnight Punpun.", state: "current" },
    { at: "Phase III", strong: "14–24 mo", text: "Literary entry. Konbini Ningen, then Murakami short stories. Light novels in range; visual novels (Steins;Gate).", state: "pending" },
    { at: "Phase IV", strong: "24 mo +", text: "Deep literary. Murakami novels, Kōbō Abe, Yōko Ogawa, Yokomizo Seishi, Edogawa Ranpo. 13 Sentinels in original.", state: "pending" },
  ],
  // What to skip, per the roadmap
  skipping: [
    "JLPT as an end in itself — N1 is useful as a forcing function for reading; the test format is not.",
    "Speaking practice beyond what already exists — diminishing returns for reception-focused goals.",
    "Bungo (historical Japanese) — unless pre-1900 literature becomes the target.",
    "Pitch accent perfectionism — useful for speakers, irrelevant for readers.",
    "Pencil-and-paper kanji writing — production-only.",
  ],
  bibliography: {
    reading: [
      { title: "Pluto", meta: "manga · Naoki Urasawa", gloss: "In progress, vol. 2. The accessible Urasawa." },
      { title: "20th Century Boys", meta: "manga · Naoki Urasawa", gloss: "Queued after Pluto." },
      { title: "Goodnight Punpun", meta: "manga · Inio Asano", gloss: "Vol. 4 in progress. Devastating." },
      { title: "Konbini Ningen", meta: "novel · Murata Sayaka", gloss: "Queued — the short, accessible literary onramp." },
      { title: "Satori Reader", meta: "graded · paid", gloss: "Between sessions, intermediate." },
    ],
    tools: [
      { title: "WaniKani", meta: "SRS · level 27", gloss: "Kanji + vocab. Committed." },
      { title: "BunPro", meta: "grammar SRS · N2 path", gloss: "N1 grammar items being added piecemeal." },
      { title: "Yomitan", meta: "browser extension", gloss: "Lookup-without-friction. Game-changing for digital reading." },
      { title: "Anki", meta: "mining deck", gloss: "From Pluto and Punpun sessions." },
      { title: "Animelon", meta: "anime · JP subs", gloss: "Toggleable subs and dictionary lookup." },
    ],
  },
};

// — Track IV: Reference plates content —
window.TRACK4 = {
  intro: {
    title: "Reference Plates",
    latin: "geographia universalis · the substrate beneath every folio",
    blurb:
      "These plates do not belong to any one territory. They are the geological layer: the IPA chart that every phonology rests on, the family trees and sprachbunds that situate languages relative to each other, the universals that recur across territories. A plate is owned here but can be linked into any folio that needs it.",
  },
  sections: [
    {
      id: "phonetics",
      title: "Phonetics & phonology",
      latin: "the universal score",
      meta: "8 plates · 4 linked into folios",
      plates: [
        {
          id: "ipa-consonants",
          plateNo: "IV·a·01",
          title: "IPA — pulmonic consonants",
          latin: "consonantes pulmonicae",
          gloss: "Place × manner table for the pulmonic consonants. Cells highlight when a phoneme appears in a territory you've settled.",
          linkedTo: ["japanese", "korean", "mandarin", "spanish"],
          links: "linked into Japanese · Korean · Mandarin · Spanish",
        },
        {
          id: "ipa-vowels",
          plateNo: "IV·a·02",
          title: "IPA — vowel quadrilateral",
          latin: "spatium vocalium",
          gloss: "The cardinal vowel space. Tongue-position geometry, rounding overlaid. Where each settled language sits within it.",
          linkedTo: ["japanese", "korean", "german", "spanish", "french"],
          links: "linked into 5 folios",
        },
        {
          id: "tone",
          plateNo: "IV·a·03",
          title: "Tone systems",
          latin: "modi tonorum",
          gloss: "Lexical vs grammatical tone, contour vs register, the four tones of Mandarin against the pitch accent of Japanese.",
          linkedTo: ["japanese", "mandarin"],
          links: "linked into Japanese · Mandarin",
        },
        {
          id: "sandhi",
          plateNo: "IV·a·04",
          title: "Tone sandhi & consonant assimilation",
          latin: "mutationes contactus",
          gloss: "The rules by which adjacent sounds change each other. Mandarin's 3rd-tone reduction; Korean's ㄴ/ㄹ/ㅎ rules; French liaison.",
          linkedTo: ["korean", "mandarin", "french"],
          links: "linked into Korean · Mandarin · French",
        },
      ],
    },
    {
      id: "families",
      title: "Families & contact",
      latin: "consanguinitates et confinia",
      meta: "6 plates · the geology of relatedness",
      plates: [
        {
          id: "ie-tree",
          plateNo: "IV·b·01",
          title: "Indo-European family",
          latin: "stirps Indoeuropaea",
          gloss: "The continental kinship. Germanic, Romance, Slavic, Indo-Iranian, Hellenic, Celtic. German, Spanish, French sit here; English borrows.",
          linkedTo: ["german", "spanish", "french"],
          links: "linked into German · Spanish · French",
        },
        {
          id: "cjk",
          plateNo: "IV·b·02",
          title: "Sinosphere & the CJK character system",
          latin: "infrastructura Sinica",
          gloss: "A non-family relationship. Japanese, Korean, Mandarin are not kin, but share infrastructure — the same characters with locally divergent readings.",
          linkedTo: ["japanese", "korean", "mandarin"],
          links: "shared infrastructure across J · K · M",
        },
        {
          id: "sprachbund",
          plateNo: "IV·b·03",
          title: "Sprachbunds — climate convergence",
          latin: "areae linguisticae",
          gloss: "Languages in contact that develop similar features without genetic relation. The Balkan sprachbund. Mainland Southeast Asia.",
          linkedTo: [],
          links: "no current folio links",
        },
        {
          id: "sound-change",
          plateNo: "IV·b·04",
          title: "Sound change — erosion patterns",
          latin: "lapsus phoneticus",
          gloss: "Lawful, slow, traceable. Grimm's Law for Germanic. The Latin → Romance cascade. Japanese rendaku.",
          linkedTo: ["german", "spanish", "french", "japanese"],
          links: "linked into German · Romance · Japanese",
        },
      ],
    },
    {
      id: "morphosyntax",
      title: "Morphosyntax & typology",
      latin: "structurae sententiae",
      meta: "5 plates",
      plates: [
        {
          id: "word-order",
          plateNo: "IV·c·01",
          title: "Word order typology",
          latin: "ordo verborum",
          gloss: "SOV, SVO, VSO and what they correlate with. Japanese & Korean SOV — head-final — and the cascade of consequences (verb-last, postpositions).",
          linkedTo: ["japanese", "korean"],
          links: "linked into Japanese · Korean",
        },
        {
          id: "aspect",
          plateNo: "IV·c·02",
          title: "Aspect, tense, mood",
          latin: "tempus et modus",
          gloss: "Why Mandarin has aspect markers (了, 过, 着) where English wants tense. Why Spanish preterite vs imperfect is mood as much as time.",
          linkedTo: ["mandarin", "spanish", "french"],
          links: "linked into Mandarin · Spanish · French",
        },
        {
          id: "honorifics",
          plateNo: "IV·c·03",
          title: "Honorification as grammar",
          latin: "registrum honorificum",
          gloss: "When social register is encoded into the verb, not the lexicon. Japanese keigo. Korean speech levels.",
          linkedTo: ["japanese", "korean"],
          links: "linked into Japanese · Korean",
        },
      ],
    },
  ],
};

// IPA consonants subset, for the detail view
window.IPA_CONSONANTS = {
  manners: ["plosive", "nasal", "fricative", "approximant"],
  places: ["bilabial", "alveolar", "post-alveolar", "palatal", "velar"],
  cells: {
    // [manner][place] = [voiceless, voiced]
    "plosive": {
      "bilabial": ["p", "b"], "alveolar": ["t", "d"], "post-alveolar": ["", ""],
      "palatal": ["c", "ɟ"], "velar": ["k", "ɡ"],
    },
    "nasal": {
      "bilabial": ["", "m"], "alveolar": ["", "n"], "post-alveolar": ["", ""],
      "palatal": ["", "ɲ"], "velar": ["", "ŋ"],
    },
    "fricative": {
      "bilabial": ["ɸ", "β"], "alveolar": ["s", "z"], "post-alveolar": ["ʃ", "ʒ"],
      "palatal": ["ç", "ʝ"], "velar": ["x", "ɣ"],
    },
    "approximant": {
      "bilabial": ["", ""], "alveolar": ["", "ɹ"], "post-alveolar": ["", ""],
      "palatal": ["", "j"], "velar": ["", "ɰ"],
    },
  },
  // which phonemes appear in which settled language
  presence: {
    "japanese":  ["p", "b", "t", "d", "k", "ɡ", "m", "n", "ŋ", "ɸ", "s", "z", "ç", "j"],
    "korean":    ["p", "t", "k", "m", "n", "ŋ", "s", "j", "ɹ"],
    "mandarin":  ["p", "t", "k", "m", "n", "ŋ", "s", "ʃ", "ç", "x", "j"],
    "spanish":   ["p", "b", "t", "d", "k", "ɡ", "m", "n", "ɲ", "ʝ", "j", "β", "ɣ", "s"],
    "german":    ["p", "b", "t", "d", "k", "ɡ", "m", "n", "ŋ", "s", "z", "ʃ", "ʒ", "ç", "x", "j"],
    "french":    ["p", "b", "t", "d", "k", "ɡ", "m", "n", "ɲ", "s", "z", "ʃ", "ʒ", "j"],
  },
};

// IE tree, simplified for the family-tree plate
window.IE_TREE = {
  name: "Proto-Indo-European",
  branch: true,
  children: [
    { name: "Germanic", branch: true, children: [
      { name: "West Germanic", branch: true, children: [
        { name: "German", studied: true, gloss: "Folio XI · maintained" },
        { name: "English", gloss: "the lingua franca" },
        { name: "Dutch" },
      ]},
      { name: "North Germanic", branch: true, children: [
        { name: "Swedish" }, { name: "Norwegian" }, { name: "Icelandic" },
      ]},
    ]},
    { name: "Italic / Romance", branch: true, children: [
      { name: "Spanish", studied: true, gloss: "Folio XIV · vacated" },
      { name: "French", studied: true, gloss: "Folio XVI · vacated" },
      { name: "Italian", studied: true, gloss: "Folio XIX · travel" },
      { name: "Portuguese" }, { name: "Romanian" }, { name: "Catalan" },
    ]},
    { name: "Hellenic", branch: true, children: [
      { name: "Greek" },
    ]},
    { name: "Balto-Slavic", branch: true, children: [
      { name: "Russian" }, { name: "Polish" }, { name: "Czech" }, { name: "Serbo-Croatian" },
    ]},
    { name: "Indo-Iranian", branch: true, children: [
      { name: "Hindi-Urdu" }, { name: "Bengali" }, { name: "Persian" }, { name: "Sanskrit", gloss: "ancestral" },
    ]},
    { name: "Celtic", branch: true, children: [
      { name: "Irish" }, { name: "Welsh" },
    ]},
  ],
};
