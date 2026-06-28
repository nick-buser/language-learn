// =====================================================================
// The Polyglot's Atlas — Japanese · the verb forge (動詞)
// The mirror of the Korean verb forge, run the other way: here the
// learner already owns Japanese, and the bridge points to Korean.
// Conventions:
//   jp      — the Japanese form (kanji/kana)
//   reading — romaji (Hepburn-ish, long vowels macroned elsewhere)
//   ko      — the register-matched Korean twin (the bridge)
//   koRr    — Revised Romanization of the twin, written to reflect
//             pronunciation (먹었어 → meogeosseo, 갔어 → gasseo)
//   Register is matched across the bridge: ます ↔ 해요체 (polite),
//   ない/た/て ↔ 해체/반말 (plain). Polite faces polite, plain faces plain.
//
// The Korean forge's central question is "what is the stem's last
// VOWEL?" (vowel harmony). Japanese asks a different one, every time:
// "what CLASS is the verb?" — and the class decides how the stem's
// last sound shifts. That shift is the gold syllable in the equation.
// =====================================================================

// the three conjugation classes — the fork the dictionary form decides
export const JV_CLASSES = [
  {
    id: 'ichidan',
    jp: '一段', rr: 'ichidan', en: 'ru-verb',
    cond: '-iる / -eる',
    rule: 'drop る, add the ending — the stem never moves',
  },
  {
    id: 'godan',
    jp: '五段', rr: 'godan', en: 'u-verb',
    cond: 'other -う',
    rule: 'the stem’s last sound shifts to meet the ending',
  },
  {
    id: 'irregular',
    jp: '不規則', rr: 'fukisoku', en: 'the two outlaws',
    cond: 'する · 来る',
    rule: 'learn them whole — there are only two',
  },
]

// the form selector (the "tense" row in the Korean forge)
export const JV_FORMS = [
  { id: 'polite',    label: 'polite',    jp: '〜ます' },
  { id: 'negative',  label: 'negative',  jp: '〜ない' },
  { id: 'past',      label: 'past',      jp: '〜た' },
  { id: 'te',        label: 'te-form',   jp: '〜て' },
  { id: 'potential', label: 'potential', jp: '〜(ら)れる' },
]

// ---- the tense board: tense × plain|polite lanes ----
// Politeness is NOT a form alongside negation/past — it's an orthogonal axis,
// so the forge shows TENSE down the side and the plain | polite lanes across.
// The two lanes do real teaching: the plain past uses 音便 (飲んだ) while the
// polite past uses the clean 連用形 (飲みました) — the contrast is right there.
export const JV_TENSES = [
  { id: 'nonpast', label: 'non-past', jp: '〜る / ます', hint: 'now · habitual · future' },
  { id: 'past', label: 'past', jp: '〜た / ました', hint: 'did' },
  { id: 'prog', label: 'progressive', jp: '〜ている', hint: 'is —ing · ongoing state' },
]

// Progressive (〜ている) Korean twins + English gerunds — the one bit not
// derivable from the existing forms, keyed by verb id.
const PROG = {
  taberu: { ger: 'eating', ko: '먹고 있어', koRr: 'meokgo isseo' },
  miru: { ger: 'watching', ko: '보고 있어', koRr: 'bogo isseo' },
  iku: { ger: 'going', ko: '가고 있어', koRr: 'gago isseo' },
  kaku: { ger: 'writing', ko: '쓰고 있어', koRr: 'sseugo isseo' },
  nomu: { ger: 'drinking', ko: '마시고 있어', koRr: 'masigo isseo' },
  matsu: { ger: 'waiting', ko: '기다리고 있어', koRr: 'gidarigo isseo' },
  hanasu: { ger: 'speaking', ko: '말하고 있어', koRr: 'malhago isseo' },
  suru: { ger: 'doing', ko: '하고 있어', koRr: 'hago isseo' },
  kuru: { ger: 'coming', ko: '오고 있어', koRr: 'ogo isseo' },
}

const stripYo = s => s.replace(/요$/, '')
const stripYoRr = s => s.replace(/yo$/, '')

// Derive the six tense-lane cells from a verb's existing hand-checked forms:
//   nonpast/plain = the dictionary form;  nonpast/polite = the ます form
//   past/plain    = the 音便 past (た);    past/polite    = 連用形 + ました
//   prog          = te-form + いる / います
// Korean: plain lane = 반말 (먹어), polite lane = 해요체 (먹어요).
export function tenseCells(verb) {
  const p = verb.forms.polite, pa = verb.forms.past, te = verb.forms.te
  const prog = PROG[verb.id]
  const dictTail = verb.jp.slice(verb.stem.length)
  return {
    nonpast: {
      plain: { pieces: [{ t: verb.stem, c: 'stem' }, { t: dictTail, c: 'tail' }], result: verb.jp, reading: verb.reading, en: verb.gloss.replace('to ', ''), ko: stripYo(p.ko), koRr: stripYoRr(p.koRr) },
      polite: { pieces: p.pieces, result: p.result, reading: p.reading, en: p.en, ko: p.ko, koRr: p.koRr },
    },
    past: {
      plain: { pieces: pa.pieces, result: pa.result, reading: pa.reading, en: pa.en, ko: pa.ko, koRr: pa.koRr },
      polite: { pieces: p.pieces.map((x, i) => i === p.pieces.length - 1 ? { ...x, t: 'ました' } : x), result: p.result.replace(/ます$/, 'ました'), reading: p.reading.replace(/masu$/, 'mashita'), en: pa.en + ' (polite)', ko: pa.ko + '요', koRr: pa.koRr + 'yo' },
    },
    prog: {
      plain: { pieces: [...te.pieces, { t: 'いる', c: 'tail' }], result: te.result + 'いる', reading: te.reading + ' iru', en: 'is ' + prog.ger, ko: prog.ko, koRr: prog.koRr },
      polite: { pieces: [...te.pieces, { t: 'います', c: 'tail' }], result: te.result + 'います', reading: te.reading + ' imasu', en: 'is ' + prog.ger + ' (polite)', ko: prog.ko + '요', koRr: prog.koRr + 'yo' },
    },
  }
}

// onbin: true for godan verbs whose past/te-form takes a sound change
// (く→い, む→ん, つ→っ…). 話す (す→し) is the sibilant exception: false.
export const FORGE_VERBS = [
  // ---- 一段 · ichidan (ru-verbs) — the stem never changes ----
  {
    id: 'taberu', jp: '食べる', reading: 'taberu', stem: '食べ', stemReading: 'tabe',
    cls: 'ichidan', gloss: 'to eat', ko: '먹다', koRr: 'meokda',
    forms: {
      polite:    { pieces: [{ t: '食べ', c: 'stem' }, { t: 'ます', c: 'tail' }], result: '食べます', reading: 'tabemasu', en: 'eat (polite)', ko: '먹어요', koRr: 'meogeoyo', fuse: 'Ichidan: drop る, add ます. The stem <b>食べ</b> never moves — the whole class is this calm.' },
      negative:  { pieces: [{ t: '食べ', c: 'stem' }, { t: 'ない', c: 'tail' }], result: '食べない', reading: 'tabenai', en: "don't eat", ko: '안 먹어', koRr: 'an meogeo', fuse: 'る → ない, nothing else. Korean negates with a free-standing <b>안</b> before the verb — 안 먹어 — or the long 먹지 않아.' },
      past:      { pieces: [{ t: '食べ', c: 'stem' }, { t: 'た', c: 'tail' }], result: '食べた', reading: 'tabeta', en: 'ate', ko: '먹었어', koRr: 'meogeosseo', fuse: 'る → た. No sound change to make — ichidan has no 音便. Korean piles on the past marker 었: 먹 + 었어.' },
      te:        { pieces: [{ t: '食べ', c: 'stem' }, { t: 'て', c: 'tail' }], result: '食べて', reading: 'tabete', en: 'eat and… / eating', ko: '먹어서 · 먹고', koRr: 'meogeoseo · meokgo', fuse: 'The connective て. Korean splits the one て into two: <b>먹어서</b> (and so / then) vs <b>먹고</b> (and, listing).' },
      potential: { pieces: [{ t: '食べ', c: 'stem' }, { t: 'られる', c: 'tail' }], result: '食べられる', reading: 'taberareru', en: 'can eat', ko: '먹을 수 있어', koRr: 'meogeul su isseo', fuse: 'Ichidan potential is られる (casual ら-less: 食べれる). Korean builds it analytically: -(으)ㄹ 수 있다 — 먹을 수 있어, “there is a way to eat.”' },
    },
  },
  {
    id: 'miru', jp: '見る', reading: 'miru', stem: '見', stemReading: 'mi',
    cls: 'ichidan', gloss: 'to see / watch', ko: '보다', koRr: 'boda',
    forms: {
      polite:    { pieces: [{ t: '見', c: 'stem' }, { t: 'ます', c: 'tail' }], result: '見ます', reading: 'mimasu', en: 'see (polite)', ko: '봐요', koRr: 'bwayo', fuse: 'Another ichidan — same calm rule. Korean 보다 fuses ㅗ+아 into a glide: 보아요 → <b>봐요</b>.' },
      negative:  { pieces: [{ t: '見', c: 'stem' }, { t: 'ない', c: 'tail' }], result: '見ない', reading: 'minai', en: "don't see", ko: '안 봐', koRr: 'an bwa', fuse: 'る → ない. Korean: 안 + 봐.' },
      past:      { pieces: [{ t: '見', c: 'stem' }, { t: 'た', c: 'tail' }], result: '見た', reading: 'mita', en: 'saw', ko: '봤어', koRr: 'bwasseo', fuse: 'る → た. Korean glide + past: 보았 → <b>봤</b>어.' },
      te:        { pieces: [{ t: '見', c: 'stem' }, { t: 'て', c: 'tail' }], result: '見て', reading: 'mite', en: 'see and… / watching', ko: '봐서 · 보고', koRr: 'bwaseo · bogo', fuse: 'て → 봐서 / 보고.' },
      potential: { pieces: [{ t: '見', c: 'stem' }, { t: 'られる', c: 'tail' }], result: '見られる', reading: 'mirareru', en: 'can see', ko: '볼 수 있어', koRr: 'bol su isseo', fuse: 'られる (casual 見れる). Korean: 볼 수 있어.' },
    },
  },

  // ---- 五段 · godan (u-verbs) — the stem-end shifts to fit the ending ----
  {
    id: 'iku', jp: '行く', reading: 'iku', stem: '行', stemReading: 'i',
    cls: 'godan', gloss: 'to go', ko: '가다', koRr: 'gada', onbin: true, exception: true,
    forms: {
      polite:    { pieces: [{ t: '行', c: 'stem' }, { t: 'き', c: 'harm' }, { t: 'ます', c: 'tail' }], result: '行きます', reading: 'ikimasu', en: 'go (polite)', ko: '가요', koRr: 'gayo', fuse: 'Godan ます takes the い-row stem (連用形): く → <b>き</b>. Korean just appends the harmony vowel + 요: 가 + 아요 → <b>가요</b>.' },
      negative:  { pieces: [{ t: '行', c: 'stem' }, { t: 'か', c: 'harm' }, { t: 'ない', c: 'tail' }], result: '行かない', reading: 'ikanai', en: "don't go", ko: '안 가', koRr: 'an ga', fuse: 'Negative takes the あ-row stem (未然形): く → <b>か</b>. Korean leaves the verb alone and sets <b>안</b> in front: 안 가.' },
      past:      { pieces: [{ t: '行', c: 'stem' }, { t: 'っ', c: 'harm' }, { t: 'た', c: 'tail' }], result: '行った', reading: 'itta', en: 'went', ko: '갔어', koRr: 'gasseo', fuse: 'The one rogue: regular く→いた would give ✗行いた, but 行く alone takes <b>っ</b> — 行った. Korean fuses to 갔: 가 + 았 → <b>갔</b>어.' },
      te:        { pieces: [{ t: '行', c: 'stem' }, { t: 'っ', c: 'harm' }, { t: 'て', c: 'tail' }], result: '行って', reading: 'itte', en: 'go and… ', ko: '가서 · 가고', koRr: 'gaseo · gago', fuse: 'Same exception in the て-form: <b>行って</b>, never ✗行いて. Korean: 가서 / 가고.' },
      potential: { pieces: [{ t: '行', c: 'stem' }, { t: 'け', c: 'harm' }, { t: 'る', c: 'tail' }], result: '行ける', reading: 'ikeru', en: 'can go', ko: '갈 수 있어', koRr: 'gal su isseo', fuse: 'Potential shifts to the え-row + る: く → <b>け</b>る. Korean: 갈 수 있어.' },
    },
  },
  {
    id: 'kaku', jp: '書く', reading: 'kaku', stem: '書', stemReading: 'ka',
    cls: 'godan', gloss: 'to write', ko: '쓰다', koRr: 'sseuda', onbin: true,
    forms: {
      polite:    { pieces: [{ t: '書', c: 'stem' }, { t: 'き', c: 'harm' }, { t: 'ます', c: 'tail' }], result: '書きます', reading: 'kakimasu', en: 'write (polite)', ko: '써요', koRr: 'sseoyo', fuse: 'く → き + ます. Korean 쓰다 has a ㅡ-drop: 쓰 + 어요 → <b>써요</b>.' },
      negative:  { pieces: [{ t: '書', c: 'stem' }, { t: 'か', c: 'harm' }, { t: 'ない', c: 'tail' }], result: '書かない', reading: 'kakanai', en: "don't write", ko: '안 써', koRr: 'an sseo', fuse: 'く → か + ない. Korean: 안 써.' },
      past:      { pieces: [{ t: '書', c: 'stem' }, { t: 'い', c: 'harm' }, { t: 'た', c: 'tail' }], result: '書いた', reading: 'kaita', en: 'wrote', ko: '썼어', koRr: 'sseosseo', fuse: 'The く-音便: く → <b>い</b>た — 書いた. Korean: 써 + ㅆ → <b>썼</b>어.' },
      te:        { pieces: [{ t: '書', c: 'stem' }, { t: 'い', c: 'harm' }, { t: 'て', c: 'tail' }], result: '書いて', reading: 'kaite', en: 'write and…', ko: '써서 · 쓰고', koRr: 'sseoseo · sseugo', fuse: 'Same く→い 音便: 書いて. (ぐ-verbs voice it: 泳ぐ → 泳いで.) Korean: 써서 / 쓰고.' },
      potential: { pieces: [{ t: '書', c: 'stem' }, { t: 'け', c: 'harm' }, { t: 'る', c: 'tail' }], result: '書ける', reading: 'kakeru', en: 'can write', ko: '쓸 수 있어', koRr: 'sseul su isseo', fuse: 'く → け + る. Korean: 쓸 수 있어.' },
    },
  },
  {
    id: 'nomu', jp: '飲む', reading: 'nomu', stem: '飲', stemReading: 'no',
    cls: 'godan', gloss: 'to drink', ko: '마시다', koRr: 'masida', onbin: true,
    forms: {
      polite:    { pieces: [{ t: '飲', c: 'stem' }, { t: 'み', c: 'harm' }, { t: 'ます', c: 'tail' }], result: '飲みます', reading: 'nomimasu', en: 'drink (polite)', ko: '마셔요', koRr: 'masyeoyo', fuse: 'む → み + ます. Korean 마시다 glides ㅣ+어 → ㅕ: 마시 + 어요 → <b>마셔요</b>.' },
      negative:  { pieces: [{ t: '飲', c: 'stem' }, { t: 'ま', c: 'harm' }, { t: 'ない', c: 'tail' }], result: '飲まない', reading: 'nomanai', en: "don't drink", ko: '안 마셔', koRr: 'an masyeo', fuse: 'む → ま + ない. Korean: 안 마셔.' },
      past:      { pieces: [{ t: '飲', c: 'stem' }, { t: 'ん', c: 'harm' }, { t: 'だ', c: 'tail' }], result: '飲んだ', reading: 'nonda', en: 'drank', ko: '마셨어', koRr: 'masyeosseo', fuse: 'The ん-音便 (む・ぶ・ぬ verbs), and it voices the ending: た → <b>だ</b> — 飲んだ. Korean: 마셔 + ㅆ → <b>마셨</b>어.' },
      te:        { pieces: [{ t: '飲', c: 'stem' }, { t: 'ん', c: 'harm' }, { t: 'で', c: 'tail' }], result: '飲んで', reading: 'nonde', en: 'drink and…', ko: '마셔서 · 마시고', koRr: 'masyeoseo · masigo', fuse: 'ん-音便, voiced: て → <b>で</b> — 飲んで. Korean: 마셔서 / 마시고.' },
      potential: { pieces: [{ t: '飲', c: 'stem' }, { t: 'め', c: 'harm' }, { t: 'る', c: 'tail' }], result: '飲める', reading: 'nomeru', en: 'can drink', ko: '마실 수 있어', koRr: 'masil su isseo', fuse: 'む → め + る. Korean: 마실 수 있어.' },
    },
  },
  {
    id: 'matsu', jp: '待つ', reading: 'matsu', stem: '待', stemReading: 'ma',
    cls: 'godan', gloss: 'to wait', ko: '기다리다', koRr: 'gidarida', onbin: true,
    forms: {
      polite:    { pieces: [{ t: '待', c: 'stem' }, { t: 'ち', c: 'harm' }, { t: 'ます', c: 'tail' }], result: '待ちます', reading: 'machimasu', en: 'wait (polite)', ko: '기다려요', koRr: 'gidaryeoyo', fuse: 'つ → ち + ます (the い-row of the た-line). Korean 기다리다 glides like 마시다: 기다리 + 어요 → <b>기다려요</b>.' },
      negative:  { pieces: [{ t: '待', c: 'stem' }, { t: 'た', c: 'harm' }, { t: 'ない', c: 'tail' }], result: '待たない', reading: 'matanai', en: "don't wait", ko: '안 기다려', koRr: 'an gidaryeo', fuse: 'つ → た + ない. Korean: 안 기다려.' },
      past:      { pieces: [{ t: '待', c: 'stem' }, { t: 'っ', c: 'harm' }, { t: 'た', c: 'tail' }], result: '待った', reading: 'matta', en: 'waited', ko: '기다렸어', koRr: 'gidaryeosseo', fuse: 'The っ-音便 (つ・う・る verbs): 待った. Korean: 기다려 + ㅆ → <b>기다렸</b>어.' },
      te:        { pieces: [{ t: '待', c: 'stem' }, { t: 'っ', c: 'harm' }, { t: 'て', c: 'tail' }], result: '待って', reading: 'matte', en: 'wait and…', ko: '기다려서 · 기다리고', koRr: 'gidaryeoseo · gidarigo', fuse: 'っ-音便: 待って. (Mind 待って vs 待て — the bare imperative.) Korean: 기다려서 / 기다리고.' },
      potential: { pieces: [{ t: '待', c: 'stem' }, { t: 'て', c: 'harm' }, { t: 'る', c: 'tail' }], result: '待てる', reading: 'materu', en: 'can wait', ko: '기다릴 수 있어', koRr: 'gidaril su isseo', fuse: 'つ → て + る — 待てる, which looks just like the te-form 待て but means “can wait.” Korean: 기다릴 수 있어.' },
    },
  },
  {
    id: 'hanasu', jp: '話す', reading: 'hanasu', stem: '話', stemReading: 'hana',
    cls: 'godan', gloss: 'to speak', ko: '말하다', koRr: 'malhada', onbin: false,
    forms: {
      polite:    { pieces: [{ t: '話', c: 'stem' }, { t: 'し', c: 'harm' }, { t: 'ます', c: 'tail' }], result: '話します', reading: 'hanashimasu', en: 'speak (polite)', ko: '말해요', koRr: 'malhaeyo', fuse: 'す → し + ます. Korean 말하다 is noun 말 + 하다, so it rides the 하 wildcard: 하 + 여요 → <b>말해요</b>.' },
      negative:  { pieces: [{ t: '話', c: 'stem' }, { t: 'さ', c: 'harm' }, { t: 'ない', c: 'tail' }], result: '話さない', reading: 'hanasanai', en: "don't speak", ko: '말 안 해', koRr: 'mal an hae', fuse: 'す → さ + ない. With noun + 하다, Korean wedges 안 inside: 말 <b>안</b> 해.' },
      past:      { pieces: [{ t: '話', c: 'stem' }, { t: 'し', c: 'harm' }, { t: 'た', c: 'tail' }], result: '話した', reading: 'hanashita', en: 'spoke', ko: '말했어', koRr: 'malhaesseo', fuse: 'The sibilant exception: す verbs take <b>no</b> 音便 — plain 連用形 し + た, 話した. Korean: 하 + 였 → 했 → <b>말했</b>어.' },
      te:        { pieces: [{ t: '話', c: 'stem' }, { t: 'し', c: 'harm' }, { t: 'て', c: 'tail' }], result: '話して', reading: 'hanashite', en: 'speak and…', ko: '말해서 · 말하고', koRr: 'malhaeseo · malhago', fuse: 'し + て, no 音便. Korean: 말해서 / 말하고.' },
      potential: { pieces: [{ t: '話', c: 'stem' }, { t: 'せ', c: 'harm' }, { t: 'る', c: 'tail' }], result: '話せる', reading: 'hanaseru', en: 'can speak', ko: '말할 수 있어', koRr: 'malhal su isseo', fuse: 'す → せ + る. Korean: 말할 수 있어.' },
    },
  },

  // ---- 不規則 · irregular — there are only two ----
  {
    id: 'suru', jp: 'する', reading: 'suru', stem: 'す', stemReading: 'su',
    cls: 'irregular', gloss: 'to do', ko: '하다', koRr: 'hada',
    forms: {
      polite:    { pieces: [{ t: 'し', c: 'harm' }, { t: 'ます', c: 'tail' }], result: 'します', reading: 'shimasu', en: 'do (polite)', ko: '해요', koRr: 'haeyo', fuse: 'する → the stem becomes <b>し</b> + ます. Korean’s 하다 is its mirror: noun + 하다 = noun + する (勉強する = 공부하다). But 하다 is <i>regular</i> — only the 하 + 여 → 해 contraction marks it.' },
      negative:  { pieces: [{ t: 'し', c: 'harm' }, { t: 'ない', c: 'tail' }], result: 'しない', reading: 'shinai', en: "don't do", ko: '안 해', koRr: 'an hae', fuse: 'し + ない. Korean: 안 해.' },
      past:      { pieces: [{ t: 'し', c: 'harm' }, { t: 'た', c: 'tail' }], result: 'した', reading: 'shita', en: 'did', ko: '했어', koRr: 'haesseo', fuse: 'し + た. Korean: 하 + 였 → <b>했</b>어.' },
      te:        { pieces: [{ t: 'し', c: 'harm' }, { t: 'て', c: 'tail' }], result: 'して', reading: 'shite', en: 'do and…', ko: '해서 · 하고', koRr: 'haeseo · hago', fuse: 'し + て. Korean: 해서 / 하고.' },
      potential: { pieces: [{ t: 'でき', c: 'harm' }, { t: 'る', c: 'tail' }], result: 'できる', reading: 'dekiru', en: 'can do', ko: '할 수 있어', koRr: 'hal su isseo', fuse: 'Wholly suppletive: する’s potential is its own verb, <b>できる</b>. Korean stays regular: 할 수 있어.' },
    },
  },
  {
    id: 'kuru', jp: '来る', reading: 'kuru', stem: '来', stemReading: 'ku',
    cls: 'irregular', gloss: 'to come', ko: '오다', koRr: 'oda',
    forms: {
      polite:    { pieces: [{ t: '来', c: 'harm' }, { t: 'ます', c: 'tail' }], result: '来ます', reading: 'kimasu', en: 'come (polite)', ko: '와요', koRr: 'wayo', fuse: 'The kanji 来 holds still while its <i>reading</i> moves: 来る (ku-) → 来ます (<b>ki</b>-). Korean 오다 glides ㅗ+아 → ㅘ: 오 + 아요 → <b>와요</b>.' },
      negative:  { pieces: [{ t: '来', c: 'harm' }, { t: 'ない', c: 'tail' }], result: '来ない', reading: 'konai', en: "don't come", ko: '안 와', koRr: 'an wa', fuse: 'Reading shifts again: 来ない is read <b>ko</b>-nai. Three vowels for one kanji — く / き / こ. Korean: 안 와.' },
      past:      { pieces: [{ t: '来', c: 'harm' }, { t: 'た', c: 'tail' }], result: '来た', reading: 'kita', en: 'came', ko: '왔어', koRr: 'wasseo', fuse: '来た = <b>ki</b>-ta. Korean: 오 + 았 → <b>왔</b>어.' },
      te:        { pieces: [{ t: '来', c: 'harm' }, { t: 'て', c: 'tail' }], result: '来て', reading: 'kite', en: 'come and…', ko: '와서 · 오고', koRr: 'waseo · ogo', fuse: '来て = ki-te. Korean: 와서 / 오고.' },
      potential: { pieces: [{ t: '来', c: 'harm' }, { t: 'られる', c: 'tail' }], result: '来られる', reading: 'korareru', en: 'can come', ko: '올 수 있어', koRr: 'ol su isseo', fuse: '来られる = <b>ko</b>-rareru (casual 来れる, kireru). Korean: 올 수 있어.' },
    },
  },
]

// ---- negation: ない / ません, and the bridge to Korean's two no's ----
// Japanese has one negator (ない) where Korean splits won't (안) from can't
// (못 — which maps to the Japanese potential-negative 食べられない). The short
// 안-form, the long -지 않다, and 못 are authored per verb (Korean negation has
// its own placement rules — 말 안 해, not ✗안 말해); the Japanese forms derive.
const NEG_KO = {
  taberu: { an: '안 먹어', anRr: 'an meogeo', mot: '못 먹어', motRr: 'mot meogeo', ji: '먹지 않아', jiRr: 'meokji anha' },
  miru: { an: '안 봐', anRr: 'an bwa', mot: '못 봐', motRr: 'mot bwa', ji: '보지 않아', jiRr: 'boji anha' },
  iku: { an: '안 가', anRr: 'an ga', mot: '못 가', motRr: 'mot ga', ji: '가지 않아', jiRr: 'gaji anha' },
  kaku: { an: '안 써', anRr: 'an sseo', mot: '못 써', motRr: 'mot sseo', ji: '쓰지 않아', jiRr: 'sseuji anha' },
  nomu: { an: '안 마셔', anRr: 'an masyeo', mot: '못 마셔', motRr: 'mot masyeo', ji: '마시지 않아', jiRr: 'masiji anha' },
  matsu: { an: '안 기다려', anRr: 'an gidaryeo', mot: '못 기다려', motRr: 'mot gidaryeo', ji: '기다리지 않아', jiRr: 'gidariji anha' },
  hanasu: { an: '말 안 해', anRr: 'mal an hae', mot: '말 못 해', motRr: 'mal mot hae', ji: '말하지 않아', jiRr: 'malhaji anha' },
  suru: { an: '안 해', anRr: 'an hae', mot: '못 해', motRr: 'mot hae', ji: '하지 않아', jiRr: 'haji anha' },
  kuru: { an: '안 와', anRr: 'an wa', mot: '못 와', motRr: 'mot wa', ji: '오지 않아', jiRr: 'oji anha' },
}

export function negCells(verb) {
  const neg = verb.forms.negative, pol = verb.forms.polite, pot = verb.forms.potential
  const g = verb.gloss.replace('to ', '')
  return {
    nonpast: {
      plain: { result: neg.result, reading: neg.reading, en: 'don’t ' + g },
      polite: { result: pol.result.replace(/ます$/, 'ません'), reading: pol.reading.replace(/masu$/, 'masen'), en: 'don’t ' + g + ' (polite)' },
    },
    past: {
      plain: { result: neg.result.replace(/ない$/, 'なかった'), reading: neg.reading.replace(/nai$/, 'nakatta'), en: 'didn’t ' + g },
      polite: { result: pol.result.replace(/ます$/, 'ませんでした'), reading: pol.reading.replace(/masu$/, 'masen deshita'), en: 'didn’t ' + g + ' (polite)' },
    },
    cant: {
      plain: { result: pot.result.replace(/る$/, 'ない'), reading: pot.reading.replace(/ru$/, 'nai'), en: 'can’t ' + g },
      polite: { result: pot.result.replace(/る$/, 'ません'), reading: pot.reading.replace(/ru$/, 'masen'), en: 'can’t ' + g + ' (polite)' },
    },
    ko: NEG_KO[verb.id],
  }
}

// ---- politeness: the lane, and the rule that only the FINAL verb carries it ----
// A multi-clause sentence has many verbs, but politeness lands once — at the
// very end. The medial clauses (te-form / -고 / -아서) are register-neutral;
// toggling polite changes ONLY the final verb. This is the load-bearing fact
// English speakers miss (they reach for "please/polite" words throughout).
export const POLITENESS = {
  prompt:
    'Japanese keeps roughly two registers — plain and polite (ます/です) — where Korean keeps four. ' +
    'But the move that matters is the same in both: in a long sentence, politeness lands exactly ' +
    'once, on the FINAL verb. Every clause before the end stays plain. Flip the lane and watch only ' +
    'the last word change.',
  sentences: [
    {
      id: 'morning', en: 'I woke up, ate breakfast, and went to school.',
      clauses: [
        { jp: '朝起きて', reading: 'asa okite' },
        { jp: '、ご飯を食べて', reading: 'gohan o tabete' },
        { jp: '、学校に', reading: 'gakkō ni' },
      ],
      final: { plain: { jp: '行った', reading: 'itta' }, polite: { jp: '行きました', reading: 'ikimashita' } },
      ko: {
        clauses: [
          { jp: '아침에 일어나서', reading: 'achime ireonaseo' },
          { jp: ' 밥을 먹고', reading: 'babeul meokgo' },
          { jp: ' 학교에', reading: 'hakgyoe' },
        ],
        final: { plain: { jp: ' 갔어', reading: 'gasseo' }, polite: { jp: ' 갔어요', reading: 'gasseoyo' } },
      },
    },
    {
      id: 'cafe', en: 'I drank coffee, read a book, and waited for a friend.',
      clauses: [
        { jp: 'コーヒーを飲んで', reading: 'kōhī o nonde' },
        { jp: '、本を読んで', reading: 'hon o yonde' },
        { jp: '、友達を', reading: 'tomodachi o' },
      ],
      final: { plain: { jp: '待った', reading: 'matta' }, polite: { jp: '待ちました', reading: 'machimashita' } },
      ko: {
        clauses: [
          { jp: '커피를 마시고', reading: 'keopireul masigo' },
          { jp: ' 책을 읽고', reading: 'chaegeul ilkgo' },
          { jp: ' 친구를', reading: 'chingureul' },
        ],
        final: { plain: { jp: ' 기다렸어', reading: 'gidaryeosseo' }, polite: { jp: ' 기다렸어요', reading: 'gidaryeosseoyo' } },
      },
    },
  ],
  note:
    'The medial verbs are in the te-form (Korean: -고 / -아서) — register-neutral connectors. They ' +
    'never inflect for politeness; they only hand off to the next clause. Politeness is a property of ' +
    'the sentence’s END, not of each verb.',
  lantern: {
    head: 'politeness lands once — at the end',
    body: 'You toggled the register and <b>only the final verb moved</b>. Every clause before it stayed ' +
      'plain, because te-form / -고 connectors carry no register. This is why Japanese (and Korean) feel ' +
      'economical: you don’t re-mark politeness on every verb — you set it once, on the word that closes ' +
      'the sentence. Korean simply runs the same rule across <b>four</b> levels instead of two — see the ' +
      'register dial on the 동사 folio.',
  },
}

export const FORGE_EUREKAS = {
  cls: {
    head: '活用 — class, not vowel',
    body: 'Every Japanese verb belongs to one of three classes, and the class is the whole game: ' +
          'ichidan just drops る, godan shifts its last sound to fit the ending, and there are exactly ' +
          'two outlaws. <b>Korean throws this hierarchy away.</b> It asks one question instead — is the ' +
          'stem’s last vowel bright (ㅏ/ㅗ) or not? — and conjugates everything off that, with a tiny ' +
          'irregular drawer. Japanese sorts the <i>verbs</i>; Korean sorts the <i>endings</i> by sound.',
  },
  onbin: {
    head: '音便 — the euphonic shift, and Korean’s answer to it',
    body: 'That gold syllable is 音便: in the past/te-form a godan stem morphs so it can be said in one ' +
          'breath — く→い (書いた), む/ぶ/ぬ→ん + voicing (飲んだ), つ/う/る→っ (待った), with 行って the lone ' +
          'rogue and す verbs (話した) opting out. <b>Korean pays the same euphony tax at the same joint</b> — ' +
          'vowel fusion (가 + 아 → 갔), and the irregular drawer (ㄷ→ㄹ, ㅂ→우). Both languages smooth exactly ' +
          'where stem meets ending; they just smooth differently.',
  },
  irregular: {
    head: '不規則 — only two, and one of them is a factory',
    body: 'する and 来る are the entire irregular list. <b>する is the verb-factory</b>: any Sino-noun + する is ' +
          'a verb (勉強する, 説明する) — and that is exactly Korean’s 하다 (공부하다, 설명하다), noun for noun. ' +
          '来る hides its irregularity in the <i>reading</i> (く・き・こ); Korean 오다 stays regular. So the two ' +
          'systems’ exceptions nearly cancel: learn する↔하다 once and thousands of verbs come free.',
  },
}
