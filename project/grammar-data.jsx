/* ===========================================================
   grammar-data.jsx — content for the Japanese grammar instruments.
   Roles are the load-bearing idea: every phrase wears a particle
   that names its role, so the ENGINE reads meaning from roles,
   never from order. That is the eureka the Loom is built to deliver.
   =========================================================== */

// role → display + colour token (kept restrained, Aburaya pigments)
window.GRAM_ROLES = {
  topic:     { tag: "theme · は",   color: "var(--accent)" },
  subject:   { tag: "doer · が",    color: "var(--signal-lit)" },
  object:    { tag: "done-to · を", color: "var(--st-active)" },
  recipient: { tag: "goal · に",    color: "var(--st-travel)" },
  place:     { tag: "place · で",   color: "var(--ink-soft)" },
  source:    { tag: "from · から",  color: "var(--ink-soft)" },
};

// — LOOM SPECIMENS —————————————————————————————————————————————
// Each tile: { id, jp, reading, gloss, particle, particleReading, role,
//              swap?: [ {particle, particleReading, role} ] }
// glossEngine(tiles) reads the CURRENT roles (order-independent) → English.
window.LOOM_SPECIMENS = [
  {
    id: "letter",
    label: "A letter in the park",
    jp: "手紙",
    kind: "free-order",
    prompt:
      "Four phrases, each wearing its particle, all leaning toward the verb at the end. " +
      "Drag them into any order you like — then read the meaning back.",
    tiles: [
      { id: "i",      jp: "私",   reading: "watashi",  gloss: "I",          particle: "は", particleReading: "wa", role: "topic" },
      { id: "park",   jp: "公園", reading: "kōen",     gloss: "the park",   particle: "で", particleReading: "de", role: "place" },
      { id: "friend", jp: "友達", reading: "tomodachi",gloss: "my friend",  particle: "に", particleReading: "ni", role: "recipient" },
      { id: "letter", jp: "手紙", reading: "tegami",   gloss: "a letter",   particle: "を", particleReading: "o",  role: "object" },
    ],
    predicate: { jp: "書いた", reading: "kaita", gloss: "wrote" },
    // order-independent meaning
    glossEngine: function (tiles) {
      return {
        html: 'I wrote <span class="done">a letter</span> to my friend in the park.',
        valid: true,
      };
    },
    nuance: function (orderedTiles) {
      const first = orderedTiles[0];
      const map = {
        i: "the writer — <b>私</b> (I)",
        park: "the setting — <b>公園で</b> (in the park)",
        friend: "the recipient — <b>友達に</b> (to my friend)",
        letter: "the thing written — <b>手紙を</b> (a letter)",
      };
      return "Same facts — but what comes first is foregrounded. Right now the sentence opens on " + map[first.id] + ".";
    },
    eurekaReorder: {
      head: "助詞 — the particles do the work",
      body: "You moved the words and the meaning <b>held</b>. English leans on word order to show who did what; Japanese pins the role to each phrase with a particle, so the order is free to carry emphasis instead.",
    },
  },
  {
    id: "eat",
    label: "Who eats whom",
    jp: "猫と魚",
    kind: "swap",
    coupledSwap: true,
    prompt:
      "Two creatures, one verb. The particles — not the order — decide who is eating. " +
      "Click a particle (が ⇅ を) and watch the meal change hands.",
    tiles: [
      {
        id: "cat", jp: "猫", reading: "neko", gloss: "the cat",
        particle: "が", particleReading: "ga", role: "subject",
        swap: [
          { particle: "が", particleReading: "ga", role: "subject" },
          { particle: "を", particleReading: "o",  role: "object" },
        ],
      },
      {
        id: "fish", jp: "魚", reading: "sakana", gloss: "the fish",
        particle: "を", particleReading: "o", role: "object",
        swap: [
          { particle: "を", particleReading: "o",  role: "object" },
          { particle: "が", particleReading: "ga", role: "subject" },
        ],
      },
    ],
    predicate: { jp: "食べた", reading: "tabeta", gloss: "ate" },
    glossEngine: function (tiles) {
      const doer = tiles.find(t => t.role === "subject");
      const done = tiles.find(t => t.role === "object");
      if (!doer || !done) {
        return {
          html: "— needs exactly one doer (が) and one done-to (を).",
          valid: false,
        };
      }
      return {
        html: 'The <span class="doer">' + doer.gloss.replace("the ", "") +
              '</span> ate the <span class="done">' + done.gloss.replace("the ", "") + "</span>.",
        valid: true,
      };
    },
    nuance: function () {
      return "Word order is still free — <b>猫が魚を</b> and <b>魚を猫が</b> mean the same. Only the が / を assignment moves the meaning.";
    },
    eurekaSwap: {
      head: "the roles changed hands",
      body: "Nothing moved — you only re-marked who is <b>が</b> (the doer) and who is <b>を</b> (the done-to). In English you would have to rebuild the whole sentence to say this. Here, the particles alone flip the entire event.",
    },
  },
];

// — THE VERB DIAL ————————————————————————————————————————————
// One verb (食べる), one subject (私), morphing through voice.
// 私 stays the grammatical subject; its ROLE is what shifts —
// that is exactly what makes causative-passive feel slippery.
window.VERB_DIAL = {
  verb: "食べる",
  verbReading: "taberu",
  verbGloss: "to eat",
  states: [
    {
      id: "plain",
      labelJp: "食べる",
      labelEn: "plain",
      formJp: [ { t: "食べ", c: "stem" }, { t: "る", c: "infl" } ],
      reading: "taberu",
      sentenceJp: "私が ケーキを 食べる。",
      sentenceEn: "I eat the cake.",
      // actors
      left:  { who: "私",  role: "the eater", subject: true },
      right: { who: "ケーキ", role: "the food", subject: false },
      verbTag: "食べる",
      dir: "rightward",          // 私 → ケーキ : I act on the food
      note: "Base line. <b>私</b> is the doer; the action runs outward, onto the cake.",
    },
    {
      id: "passive",
      labelJp: "食べられる",
      labelEn: "passive · 受身",
      formJp: [ { t: "食べ", c: "stem" }, { t: "られる", c: "infl" } ],
      reading: "taberareru",
      sentenceJp: "私が 弟に ケーキを 食べられた。",
      sentenceEn: "My little brother ate my cake (on me).",
      left:  { who: "私",  role: "the affected", subject: true },
      right: { who: "弟",  role: "the actual eater", subject: false },
      verbTag: "← 食べられた",
      dir: "leftward",           // 弟 → 私 : the action lands on 私
      note: "The Japanese <b>passive of misfortune</b>. <b>私</b> is still the subject — but now the one the action happens <i>to</i>. The eating was done by 弟, and 私 suffers it.",
    },
    {
      id: "causative",
      labelJp: "食べさせる",
      labelEn: "causative · 使役",
      formJp: [ { t: "食べ", c: "stem" }, { t: "させる", c: "infl" } ],
      reading: "tabesaseru",
      sentenceJp: "私が 弟に ケーキを 食べさせた。",
      sentenceEn: "I made my little brother eat the cake.",
      left:  { who: "私",  role: "the causer", subject: true },
      right: { who: "弟",  role: "made to eat", subject: false },
      verbTag: "make → 食べさせた",
      dir: "rightward",          // 私 → 弟 : I cause 弟 to act
      note: "<b>私</b> doesn't eat at all now. <b>私</b> is the <b>causer</b>, pushing the action onto 弟, who does the eating.",
    },
    {
      id: "caus-pass",
      labelJp: "食べさせられる",
      labelEn: "caus-passive · 使役受身",
      formJp: [ { t: "食べ", c: "stem" }, { t: "させられる", c: "infl" } ],
      reading: "tabesaserareru",
      sentenceJp: "私が 母に ケーキを 食べさせられた。",
      sentenceEn: "I was made to eat the cake by my mother.",
      left:  { who: "私",  role: "the forced doer", subject: true },
      right: { who: "母",  role: "the one who forced", subject: false },
      verbTag: "母 forces → 私 eats",
      dir: "leftward",           // 母 → 私 : 母 causes, force lands on 私
      note: "The knot, untied. Stack <b>causative</b> (someone makes…) and <b>passive</b> (…happens to me): <b>私</b> is made by 母 to do the eating. 私 both <i>eats</i> and is <i>forced</i>.",
    },
  ],
};

// — は / が SPOTLIGHT ————————————————————————————————————————
window.HAGA_SPOTLIGHT = {
  wa: {
    particle: "は",
    name: "wa · the topic",
    sentenceHtml: '私<span class="mark">は</span>学生です',
    reading: "watashi wa gakusei desu",
    question: "answers: “tell me about you.”",
    enHtml: 'It sets the stage — <b>as for me</b>, (the matter is) a student. は lifts something up and says “here is what we’re talking about.”',
  },
  ga: {
    particle: "が",
    name: "ga · the subject",
    sentenceHtml: '私<span class="mark">が</span>学生です',
    reading: "watashi ga gakusei desu",
    question: "answers: “which one is the student?”",
    enHtml: 'It selects — <b>I’m the one</b> who is the student. が points and picks out exactly which one, often as new or contrastive information.',
  },
  rule: "は presents what we are talking <b>about</b>; が selects <b>which one</b> it is. Most は/が confusion dissolves once you ask: am I introducing a topic, or answering “which one?”",
  doubleSubject: {
    jpHtml: '<span class="topic">象は</span> <span class="subj">鼻が</span> 長い。',
    reading: "zō wa hana ga nagai",
    noteHtml: 'Both at once, and it finally makes sense: <span class="topic">象は</span> sets the topic — <i>as for elephants</i> — while <span class="subj">鼻が</span> is the subject of 長い — <i>the noses are long</i>. Not “the elephant is a long nose,” but “as for elephants, (their) noses are long.”',
  },
};
