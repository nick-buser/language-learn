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
