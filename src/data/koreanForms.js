// =====================================================================
// The Polyglot's Atlas — Korean · 활용 constructions (the forms folio)
//
// The mirror of japaneseForms.js, run the other direction: Korean is the
// headword, Japanese is the bridge (marked 日, the showJp toggle). These
// are the joints that DON'T fall out of the 동사 forge's tense/register
// rules — the connective stems, the conditional, the urging forms, and
// voice (which the Korean verb folio doesn't host yet).
//
// The verb list/stems are imported from koreanData.js (FORGE_VERBS, the
// single source of truth), exactly as japaneseForms.js reuses its forge
// verbs. The construction forms and the Japanese twins are authored here
// and hand-checked — Korean morphophonology (harmony, the 으 buffer, the
// ㄷ-irregular, lexical voice) is gnarlier than clean derivation allows,
// and a wrong specimen is worse than a missing one.
// =====================================================================
import { FORGE_VERBS } from './koreanData.js'

const pick = (...ids) => ids.map(id => FORGE_VERBS.find(v => v.id === id))

// =====================================================================
// INSTRUMENT I — the connective: -고 vs -아/어(서) (the te-form, split)
// =====================================================================
// Japanese spends one て; Korean splits its load across two stems. Both
// stems derive cleanly from the forge: the -고 stem is stem + 고; the
// -아/어 stem is the forge's present tense minus 요 (the fused harmony
// vowel). So connBases() is pure derivation from FORGE_VERBS.
export const CONN_VERBS = pick('meokda', 'gada', 'boda', 'masida', 'hada', 'deutda')

/** The two connective stems for a verb, derived from the forge. */
export function connBases(verb) {
  return {
    goBase: verb.stem + '고',
    goRr: verb.stemRr + 'go',
    aBase: verb.tenses.present.result.replace(/요$/, ''),
    aRr: verb.tenses.present.rr.replace(/yo$/, ''),
  }
}

// each compound hangs off one of the two stems. base: 'go' → goBase,
// 'a' → aBase. The assembled form is base + suffix; RR is baseRr + sfxRr.
// jpPat/jpGloss is the Japanese twin — the point being that every one of
// these is a single て in Japanese (ている, てみる, …).
export const CONN_COMPOUNDS = [
  { id: 'bare-go', base: 'go', suffix: '', sfxRr: '', label: '-고', teNote: true,
    gloss: 'and / and then — plain listing or sequence of separate events. The neutral “and”: 밥을 먹고 잤어요 = I ate and (then) slept.',
    jpPat: 'て', jpGloss: 'listing — and this is the same 食べて that -아/어서 uses' },
  { id: 'go-itda', base: 'go', suffix: ' 있다', sfxRr: ' itda', label: '-고 있다',
    gloss: 'be —ing — the progressive. 먹고 있다 = is eating; 가고 있다 = is on the way.',
    jpPat: 'ている', jpGloss: 'progressive / resultant state' },
  { id: 'go-naseo', base: 'go', suffix: ' 나서', sfxRr: ' naseo', label: '-고 나서',
    gloss: 'after —ing, (then)… — explicit “only after this, that.”',
    jpPat: 'てから', jpGloss: 'after' },
  { id: 'go-sipda', base: 'go', suffix: ' 싶다', sfxRr: ' sipda', label: '-고 싶다',
    gloss: 'want to — . The desire ending (1st/2nd person); 먹고 싶어요 = I want to eat.',
    jpPat: 'たい', jpGloss: 'desire — Japanese builds it off the ます-stem, not て' },
  { id: 'seo', base: 'a', suffix: '서', sfxRr: 'seo', label: '-아/어서', teNote: true,
    gloss: 'and so / because — the two clauses are linked: the first causes or flows into the second. 비가 와서 = because it rained; 만나서 반가워요 = (we) met and (so I’m) glad.',
    jpPat: 'て', jpGloss: 'cause / flow — again a single 食べて, but a different Korean stem' },
  { id: 'a-boda', base: 'a', suffix: ' 보다', sfxRr: ' boda', label: '-아/어 보다',
    gloss: 'try —ing — do it and see. 먹어 보다 = try eating; 가 보다 = try going.',
    jpPat: 'てみる', jpGloss: 'attempt — same metaphor (“see”)' },
  { id: 'a-juda', base: 'a', suffix: ' 주다', sfxRr: ' juda', label: '-아/어 주다',
    gloss: 'do — for someone (a favour). 도와 주다 = help; the polite request is -아/어 주세요.',
    jpPat: 'てあげる / てくれる', jpGloss: 'benefactive — and -아/어 주세요 = てください' },
  { id: 'a-beorida', base: 'a', suffix: ' 버리다', sfxRr: ' beorida', label: '-아/어 버리다',
    gloss: 'do completely — or do to one’s regret / for good. 먹어 버렸어요 = (I) went and ate it all.',
    jpPat: 'てしまう', jpGloss: 'completion / regret' },
  { id: 'a-do-doeda', base: 'a', suffix: '도 되다', sfxRr: 'do doeda', label: '-아/어도 되다',
    gloss: 'may —, it’s OK to — . Permission. 가도 돼요 = you may go; 먹어도 돼요 = it’s fine to eat.',
    jpPat: 'てもいい', jpGloss: 'permission' },
  { id: 'a-ya-doeda', base: 'a', suffix: '야 되다', sfxRr: 'ya doeda', label: '-아/어야 되다',
    gloss: 'must / have to — . Obligation (also -아/어야 하다). 가야 돼요 = (I) have to go.',
    jpPat: 'なければならない', jpGloss: 'obligation — Japanese builds it off the ない-stem' },
]

// the minimal pair that makes the split felt, plus the cause sense and
// the trap a Japanese speaker walks into.
export const CONN_CONTRAST = {
  go: {
    kr: '친구를 만나고 영화를 봤어요.', rr: 'chingureul mannago yeonghwareul bwasseoyo',
    en: 'I met a friend, and (then, separately) watched a movie.',
    note: 'Two independent events, merely listed in order.',
  },
  seo: {
    kr: '친구를 만나서 영화를 봤어요.', rr: 'chingureul mannaseo yeonghwareul bwasseoyo',
    en: 'I met a friend and (then, with them) watched a movie.',
    note: 'The meeting carries into the watching — same friend, one flow.',
  },
  cause: {
    kr: '비가 와서 못 갔어요.', rr: 'biga waseo mot gasseoyo',
    en: 'It rained, so I couldn’t go.',
    note: '-아/어서 is also the everyday “because.”',
  },
  trap: {
    head: 'the trap: -아/어서 can’t carry a command',
    body: 'Like Japanese と, the cause-connective <b>-아/어서</b> forbids a command or proposal in the ' +
      'main clause. “It’s late, <i>so go home</i>” can’t be ✗늦어서 집에 가세요. For “so + ' +
      'command,” Korean switches to <b>-(으)니까</b>: <b>늦었으니까 집에 가세요</b> ' +
      '(neujeosseunikka jibe gaseyo). -(으)니까 is the reason-connective that <i>does</i> allow it.',
  },
}

export const CONN_LANTERN = {
  head: 'one て, two Korean stems',
  body: 'Everything the Japanese て-form does, Korean splits across <b>two</b> joints. The <b>-고</b> ' +
    'stem lists and sequences (먹고 있다 = 食べている, 먹고 나서 = 食べてから); the <b>-아/어</b> stem ' +
    'flows and causes (먹어 보다 = 食べてみる, 비가 와서… = cause). Both are a single 食べて in Japanese — ' +
    'the choice Korean forces, Japanese never makes. So the reflex to build: when you would reach for ' +
    'て, ask — is this a <i>list</i> (-고) or a <i>flow / cause</i> (-아/어)?',
}

// =====================================================================
// INSTRUMENT II — the conditional: -(으)면 (the four "if"s, collapsed)
// =====================================================================
// The head builds -(으)면 with the 으-buffer fork (open stem + 면, closed
// stem + 으면 — the same 받침 door as the forge's future). Authored per
// verb because the ㄷ-irregular (듣 → 들 before 으) makes clean derivation
// unsafe.
export const COND_VERBS = pick('gada', 'meokda', 'masida', 'hada', 'deutda', 'boda')

export const COND_MYEON = {
  gada: { r: '가면', rr: 'gamyeon', open: true },
  meokda: { r: '먹으면', rr: 'meogeumyeon', open: false },
  masida: { r: '마시면', rr: 'masimyeon', open: true },
  hada: { r: '하면', rr: 'hamyeon', open: true },
  deutda: { r: '들으면', rr: 'deureumyeon', open: false, irr: 'ㄷ → ㄹ before the buffer 으 — 듣 becomes 들' },
  boda: { r: '보면', rr: 'bomyeon', open: true },
}

// the conditional family — Korean leads, the Japanese form(s) each one
// absorbs follow. Examples are fixed (hand-checked), not verb-driven.
export const COND_FORMS = [
  {
    id: 'myeon', label: '-(으)면', niche: 'general · if / when',
    use: 'The all-purpose conditional — “if A, (then) B” and “when A, B.” It quietly does the work of ば, たら, and most of と at once. And unlike Japanese ば/と, it freely takes a command or proposal in the main clause.',
    ex: { kr: '시간이 있으면 전화해요.', rr: 'sigani isseumyeon jeonhwahaeyo', en: 'If you have time, call me.' },
    jp: 'ば · たら · と', jpNote: 'Where Japanese makes you choose among three, Korean just says -(으)면 — even with a command after it.',
  },
  {
    id: 'damyeon', label: '-(ㄴ/는)다면 · -(이)라면', niche: 'hypothetical · supposing',
    use: 'The explicitly hypothetical or counterfactual “if” — “supposing it were the case that A.” For nouns it’s -(이)라면 (학생이라면 = “if one were a student”). This is the one split Korean keeps.',
    ex: { kr: '내가 너라면 안 가겠어.', rr: 'naega neoramyeon an gagesseo', en: 'If I were you, I wouldn’t go.' },
    jp: 'なら · もし〜たら', jpNote: 'Matches なら’s “if it’s the case” and the marked-hypothetical もし.',
  },
  {
    id: 'geodeun', label: '-거든', niche: 'colloquial · if-then-do',
    use: 'Spoken “if/when A happens, then do B” — it sets up an instruction or suggestion that follows, so it pairs naturally with an imperative or -(으)세요.',
    ex: { kr: '도착하거든 연락해.', rr: 'dochakhageodeun yeollakhae', en: 'When you arrive, get in touch.' },
    jp: 'たら (命令) · なら', jpNote: 'Like the たら that can be followed by a command.',
  },
  {
    id: 'jamaja', label: '-자마자', niche: 'the moment that',
    use: '“As soon as / the moment A happens, B.” No gap and no choice — the second event follows immediately on the first.',
    ex: { kr: '집에 오자마자 잤어요.', rr: 'jibe ojamaja jasseoyo', en: 'The moment I got home, I slept.' },
    jp: 'と (自動) · 〜やいなや', jpNote: 'Covers the “automatic, immediate” sense of と.',
  },
]

export const COND_LANTERN = {
  head: 'four “if”s collapse into one',
  body: 'In Japanese you agonised over ば vs たら vs と vs なら. Korean hands almost all of it to a single ' +
    'form — <b>-(으)면</b> — and even lets it take a command (가면 전화해 — “if you go, call me”), which ' +
    'と and ば forbid. The only distinction worth keeping is <b>-(ㄴ/는)다면 / -(이)라면</b> for the ' +
    'explicitly hypothetical (내가 너라면 — “if I were you”). So the work here is <i>un</i>learning a ' +
    'reflex: stop hunting for the right “if,” and just say 면.',
}

// =====================================================================
// INSTRUMENT III — volitional & imperative (urging)
// =====================================================================
// Authored per verb and hand-checked (buffer + harmony + ㄷ-irregular all
// interact); cross-checked against the Korean twins already shipped in
// japaneseForms.js (VI_KO). Korean runs a 4-rung command ladder where
// Japanese has ~2 — the thesis of the instrument.
export const VI_VERBS = pick('meokda', 'gada', 'boda', 'masida', 'hada', 'deutda')

export const VI_FORMS = {
  meokda: {
    volC: '먹자', volCRr: 'meokja', volP: '먹읍시다', volPRr: 'meogeupsida', volQ: '먹을까요', volQRr: 'meogeulkkayo',
    impBlunt: '먹어라', impBluntRr: 'meogeora', impCasual: '먹어', impCasualRr: 'meogeo',
    impPolite: '먹으세요', impPoliteRr: 'meogeuseyo', impFormal: '먹으십시오', impFormalRr: 'meogeusipsio',
    impNeg: '먹지 마', impNegRr: 'meokji ma', impNegP: '먹지 마세요', impNegPRr: 'meokji maseyo',
  },
  gada: {
    volC: '가자', volCRr: 'gaja', volP: '갑시다', volPRr: 'gapsida', volQ: '갈까요', volQRr: 'galkkayo',
    impBlunt: '가라', impBluntRr: 'gara', impCasual: '가', impCasualRr: 'ga',
    impPolite: '가세요', impPoliteRr: 'gaseyo', impFormal: '가십시오', impFormalRr: 'gasipsio',
    impNeg: '가지 마', impNegRr: 'gaji ma', impNegP: '가지 마세요', impNegPRr: 'gaji maseyo',
  },
  boda: {
    volC: '보자', volCRr: 'boja', volP: '봅시다', volPRr: 'bopsida', volQ: '볼까요', volQRr: 'bolkkayo',
    impBlunt: '봐라', impBluntRr: 'bwara', impCasual: '봐', impCasualRr: 'bwa',
    impPolite: '보세요', impPoliteRr: 'boseyo', impFormal: '보십시오', impFormalRr: 'bosipsio',
    impNeg: '보지 마', impNegRr: 'boji ma', impNegP: '보지 마세요', impNegPRr: 'boji maseyo',
  },
  masida: {
    volC: '마시자', volCRr: 'masija', volP: '마십시다', volPRr: 'masipsida', volQ: '마실까요', volQRr: 'masilkkayo',
    impBlunt: '마셔라', impBluntRr: 'masyeora', impCasual: '마셔', impCasualRr: 'masyeo',
    impPolite: '마시세요', impPoliteRr: 'masiseyo', impFormal: '마시십시오', impFormalRr: 'masisipsio',
    impNeg: '마시지 마', impNegRr: 'masiji ma', impNegP: '마시지 마세요', impNegPRr: 'masiji maseyo',
  },
  hada: {
    volC: '하자', volCRr: 'haja', volP: '합시다', volPRr: 'hapsida', volQ: '할까요', volQRr: 'halkkayo',
    impBlunt: '해라', impBluntRr: 'haera', impCasual: '해', impCasualRr: 'hae',
    impPolite: '하세요', impPoliteRr: 'haseyo', impFormal: '하십시오', impFormalRr: 'hasipsio',
    impNeg: '하지 마', impNegRr: 'haji ma', impNegP: '하지 마세요', impNegPRr: 'haji maseyo',
  },
  deutda: {
    volC: '듣자', volCRr: 'deutja', volP: '들읍시다', volPRr: 'deureupsida', volQ: '들을까요', volQRr: 'deureulkkayo',
    impBlunt: '들어라', impBluntRr: 'deureora', impCasual: '들어', impCasualRr: 'deureo',
    impPolite: '들으세요', impPoliteRr: 'deureuseyo', impFormal: '들으십시오', impFormalRr: 'deureusipsio',
    impNeg: '듣지 마', impNegRr: 'deutji ma', impNegP: '듣지 마세요', impNegPRr: 'deutji maseyo',
  },
}

// the volitional lanes: casual / formal / softened-question
export const VOL_LANES = [
  { id: 'volC', form: 'volC', rr: 'volCRr', reg: 'casual · 반말', pat: '-자',
    note: 'to a friend — “let’s.”', jp: '〜よう', jpEx: '食べよう' },
  { id: 'volP', form: 'volP', rr: 'volPRr', reg: 'formal · 합쇼', pat: '-(으)ㅂ시다',
    note: 'formal “let’s” — but can sound presumptuous to a senior; soften with the question form instead.', jp: '〜ましょう', jpEx: '食べましょう' },
  { id: 'volQ', form: 'volQ', rr: 'volQRr', reg: 'softened · 해요', pat: '-(으)ㄹ까요?',
    note: 'the polite, deferential proposal — “shall we?”, leaving the choice open.', jp: '〜ましょうか', jpEx: '食べましょうか' },
]

// the imperative ladder, blunt → polite, plus the negative
export const IMP_LADDER = [
  { id: 'blunt', form: 'impBlunt', rr: 'impBluntRr', label: 'blunt · 해라체', pat: '-아/어라',
    note: 'A bare order — parents to children, coaches, slogans, the written/quoted command. Firm, not for a senior.', jp: '〜ろ / 〜なさい' },
  { id: 'casual', form: 'impCasual', rr: 'impCasualRr', label: 'intimate · 반말', pat: '-아/어',
    note: 'Between close friends — banmal, the 해요체 command minus 요. 빨리 가! = “go, quick!”', jp: '〜て (casual)' },
  { id: 'polite', form: 'impPolite', rr: 'impPoliteRr', label: 'polite · 해요', pat: '-(으)세요',
    note: 'The everyday polite “please —.” What you’ll actually use; built on the honorific -시-.', jp: '〜てください' },
  { id: 'formal', form: 'impFormal', rr: 'impFormalRr', label: 'formal · 합쇼', pat: '-(으)십시오',
    note: 'The formal-deferential command — announcements, signage, customer service: 들어오십시오.', jp: 'お〜ください' },
]

export const IMP_NEG = {
  label: 'negative · “don’t —”', pat: '-지 마(세요)',
  note: 'The prohibition: bare 가지 마 (to a friend), polite 가지 마세요. Built on 말다, the “stop/don’t” verb.',
  jp: '〜な / 〜ないでください',
}

export const VI_LANTERN = {
  head: 'one ladder, four rungs — and that is the point',
  body: 'Japanese gives you roughly two levels of command — blunt 食べろ and polite 食べてください. Korean ' +
    'runs <b>four</b>: 먹어라 → 먹어 → 먹으세요 → 먹으십시오, climbing from a bare order to formal ' +
    'deference, with 먹지 마(세요) for “don’t.” Proposing splits the same way — 먹자 (friends) / 먹읍시다 ' +
    '(formal) / 먹을까요? (softened to a question). Urging is the act most loaded with social weight, so ' +
    'it’s exactly where Korean’s extra registers bite: pick the wrong rung and you’ve insulted someone. ' +
    'This is the grammar of being polite.',
}

// =====================================================================
// INSTRUMENT IV — voice: lexical vs productive
// =====================================================================
// Japanese voice is one productive rule (-られる / -させる, any verb).
// Korean splits in two: a LEXICAL layer (이/히/리/기 passive, 이/히/리/기/
// 우/구/추 causative — unpredictable per verb) and a PRODUCTIVE layer
// (-아/어지다 passive, -게 하다 causative — always available). Every form
// here is hand-checked; the lexical forms especially.
//
// Cells absent on a verb (no lexical passive/causative) are left null —
// that gappiness IS the teaching point.
export const VOICE_VERBS = [
  {
    id: 'meokda', kr: '먹다', rr: 'meokda', gloss: 'to eat', jp: '食べる',
    jpPassive: '食べられる', jpPassiveRr: 'taberareru', jpCausative: '食べさせる', jpCausativeRr: 'tabesaseru',
    lexPassive: { kr: '먹히다', rr: 'meokhida', sfx: '히', gloss: 'be eaten' },
    periPassive: null, // 먹어지다 is unnatural — the lexical 먹히다 carries the passive
    lexCausative: { kr: '먹이다', rr: 'meogida', sfx: '이', gloss: 'feed (= make eat)' },
    periCausative: { kr: '먹게 하다', rr: 'meokge hada', gloss: 'make / let (sb) eat' },
    sentences: {
      active: { kr: '고양이가 생선을 먹어요.', rr: 'goyangiga saengseoneul meogeoyo', en: 'The cat eats the fish.' },
      passive: { kr: '생선이 고양이한테 먹혔어요.', rr: 'saengseoni goyangihante meokhyeosseoyo', en: 'The fish got eaten by the cat.' },
      causative: { kr: '엄마가 아기에게 밥을 먹여요.', rr: 'eommaga agiege babeul meogyeoyo', en: 'Mom feeds the baby (rice).' },
    },
    note: 'The clean case — and the warning: the passive takes 히, the causative takes 이. Different suffixes, both unpredictable. You learn them as two separate words.',
  },
  {
    id: 'boda', kr: '보다', rr: 'boda', gloss: 'to see', jp: '見る',
    jpPassive: '見られる・見える', jpPassiveRr: 'mirareru / mieru', jpCausative: '見せる・見させる', jpCausativeRr: 'miseru / misaseru',
    lexPassive: { kr: '보이다', rr: 'boida', sfx: '이', gloss: 'be seen / be visible (見える)' },
    periPassive: null,
    lexCausative: { kr: '보이다', rr: 'boida', sfx: '이', gloss: 'show (= make see, 見せる)' },
    periCausative: { kr: '보게 하다', rr: 'boge hada', gloss: 'make (sb) look' },
    sentences: {
      active: { kr: '저는 별을 봐요.', rr: 'jeoneun byeoreul bwayo', en: 'I look at the stars.' },
      passive: { kr: '여기서 별이 잘 보여요.', rr: 'yeogiseo byeori jal boyeoyo', en: 'The stars are clearly visible from here.' },
      causative: { kr: '친구에게 사진을 보여 줬어요.', rr: 'chinguege sajineul boyeo jwosseoyo', en: 'I showed my friend the photo.' },
    },
    note: 'The ambiguous case — one form, 보이다, is BOTH “be seen” and “show.” Japanese keeps them apart (見える vs 見せる); Korean lets context decide.',
  },
  {
    id: 'deutda', kr: '듣다', rr: 'deutda', gloss: 'to hear / listen', jp: '聞く',
    jpPassive: '聞かれる・聞こえる', jpPassiveRr: 'kikareru / kikoeru', jpCausative: '聞かせる', jpCausativeRr: 'kikaseru',
    lexPassive: { kr: '들리다', rr: 'deullida', sfx: '리', gloss: 'be heard / be audible (聞こえる)' },
    periPassive: null,
    lexCausative: null, // no clean lexical causative — 들려주다 (let hear) or 듣게 하다
    periCausative: { kr: '듣게 하다 · 들려주다', rr: 'deutge hada · deullyeojuda', gloss: 'make (sb) listen / play for (sb)' },
    sentences: {
      active: { kr: '저는 음악을 들어요.', rr: 'jeoneun eumageul deureoyo', en: 'I listen to music.' },
      passive: { kr: '음악이 잘 들려요.', rr: 'eumagi jal deullyeoyo', en: 'The music is clearly audible.' },
      causative: { kr: '아이에게 음악을 들려줘요.', rr: 'aiege eumageul deullyeojwoyo', en: 'I play music for the child.' },
    },
    note: 'A gap on the causative side — there’s a lexical passive (들리다) but no clean lexical causative, so Korean reaches for the productive 듣게 하다 (or 들려주다, “let hear”).',
  },
  {
    id: 'jukda', kr: '죽다', rr: 'jukda', gloss: 'to die', jp: '死ぬ',
    jpPassive: '死なれる', jpPassiveRr: 'shinareru', jpCausative: '死なせる・殺す', jpCausativeRr: 'shinaseru / korosu',
    lexPassive: null, // intransitive — no passive
    periPassive: null,
    lexCausative: { kr: '죽이다', rr: 'jugida', sfx: '이', gloss: 'kill (= make die, 殺す)' },
    periCausative: { kr: '죽게 하다', rr: 'jukge hada', gloss: 'let / cause (sth) to die' },
    sentences: {
      active: { kr: '꽃이 죽었어요.', rr: 'kkochi jugeosseoyo', en: 'The flower died.' },
      passive: null,
      causative: { kr: '제가 꽃을 죽였어요.', rr: 'jega kkocheul jugyeosseoyo', en: 'I killed the flower.' },
    },
    note: 'The 自他 case — an intransitive (죽다, “die”) whose lexical causative 죽이다 (“kill”) is a separate dictionary verb, exactly as Japanese pairs 死ぬ with 殺す. No passive: nothing acts on a dier.',
  },
  {
    id: 'mandeulda', kr: '만들다', rr: 'mandeulda', gloss: 'to make', jp: '作る',
    jpPassive: '作られる', jpPassiveRr: 'tsukurareru', jpCausative: '作らせる', jpCausativeRr: 'tsukuraseru',
    lexPassive: null, // no lexical voice at all
    periPassive: { kr: '만들어지다', rr: 'mandeureojida', gloss: 'get made / be made (作られる)' },
    lexCausative: null,
    periCausative: { kr: '만들게 하다', rr: 'mandeulge hada', gloss: 'make (sb) make' },
    sentences: {
      active: { kr: '친구가 케이크를 만들어요.', rr: 'chinguga keikeureul mandeureoyo', en: 'My friend makes a cake.' },
      passive: { kr: '케이크가 잘 만들어졌어요.', rr: 'keikeuga jal mandeureojyeosseoyo', en: 'The cake came out well (got made well).' },
      causative: { kr: '친구에게 케이크를 만들게 했어요.', rr: 'chinguege keikeureul mandeulge haesseoyo', en: 'I had my friend make a cake.' },
    },
    note: 'The pure-productive case — no lexical voice exists, so Korean falls back entirely on the regular machine: -아/어지다 (get done) and -게 하다 (make do). This is the layer that behaves most like Japanese.',
  },
]

export const VOICE_LANTERN = {
  head: 'two machines, where Japanese has one',
  body: 'Japanese voice is one productive rule: any verb takes 〜られる (passive) and 〜させる (causative), ' +
    'nothing to memorise. Korean splits the job in two. There’s a <b>lexical</b> layer — passive ' +
    '이/히/리/기, causative 이/히/리/기/우/구/추 — but <i>which</i> suffix a verb takes, or whether it has ' +
    'one at all, is unpredictable: 먹다 → 먹<b>히</b>다 (be eaten) yet 먹<b>이</b>다 (feed); 보이다 is ' +
    '<i>both</i> “be seen” and “show.” You learn these as vocabulary, like irregular verbs. And there’s ' +
    'a <b>productive</b> layer that always works — <b>-아/어지다</b> (get done) and <b>-게 하다</b> (make ' +
    'do) — the regular fallback, and the closest thing to the Japanese machine. So: memorise the lexical ' +
    'forms; reach for -게 하다 when a verb hasn’t got one.',
}
