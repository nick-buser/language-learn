// =====================================================================
// The Polyglot's Atlas — Japanese · the particle cabinet (助詞)
// The Korean cabinet, run the other way: the Japanese particle is the
// headword, the Korean twin is the bridge. Two themes recur and they
// are the mirror image of the Korean folio's:
//   · Japanese particles DON'T tailor — は is は after anything, where
//     Korean fits 은/는 to the 받침. Invariance is the luxury.
//   · Where Japanese spends one particle, Korean often spends several:
//     に → 에 / 에게, で → 에서 / 으로, から → 에서 / 부터 / 한테서,
//     と → 와·과 / 하고 / 랑. "Korean splits this" is the running note.
// And one drawer Korean has no real answer for: the 終助詞, the
// sentence-final particles — Korean does that work with verb ENDINGS.
//
// Conventions:
//   forms — the Japanese particle (the particle under study wears <m>)
//   rr    — romaji
//   ko    — the Korean twin (the bridge); koRr — its Revised Romanization
//   ex    — { jp, jpRr, ko, koRr, en }
// =====================================================================

export const PARTICLE_FAMILIES = [
  // -------------------------------------------------------------------
  // DRAWER II — THE SKELETON · 格助詞 core
  // -------------------------------------------------------------------
  {
    id: 'skeleton',
    no: 'II',
    name: 'The skeleton',
    jp: '骨組み',
    latin: '格助詞 (kakujoshi) · は·が·を·の — the load-bearing four',
    color: 'var(--accent)',
    blurb:
      'The four that carry the sentence — and the place to feel the first big difference: a Japanese ' +
      'particle never changes shape. は is は after any noun. Korean fits the same particle to the ' +
      'noun’s last sound (은/는, 이/가); that tailoring is the tax Japanese simply doesn’t pay.',
    entries: [
      {
        id: 'wa', forms: 'は', rr: 'wa', formRule: 'one shape · read wa, not ha',
        role: 'topic · contrast', ko: '은 / 는', koRr: 'eun / neun',
        tagline: 'lifts a thing up — “as for X” — and, doubled, sets two things against each other',
        ex: {
          jp: 'コーヒー<m>は</m>飲むけど、お茶<m>は</m>飲まない。',
          jpRr: 'kōhī wa nomu kedo, ocha wa nomanai',
          ko: '커피는 마시지만 차는 안 마셔요.',
          koRr: 'keopineun masijiman chaneun an masyeoyo',
          en: 'Coffee I do drink — tea I don’t.',
        },
        whyHtml:
          'Topic and contrast both, exactly as in Korean — 은/는 is は wholesale. The only new thing on the ' +
          'Korean side is the fitting: <b>은</b> after a consonant (받침), <b>는</b> after a vowel. Japanese ' +
          'hands you one form and never asks you to choose.',
        note: {
          head: 'は ≠ が is the eternal question',
          html: 'The topic-vs-subject border is its own instrument on the <b>文法 · grammar engine</b> folio ' +
                '(は &amp; が — the spotlight). Korean fights the identical battle as 은/는 vs 이/가.',
        },
      },
      {
        id: 'ga', forms: 'が', rr: 'ga', formRule: 'one shape — never changes',
        role: 'subject · selection', ko: '이 / 가', koRr: 'i / ga',
        tagline: 'points at the doer — new information, or the answer to “which one?”',
        ex: {
          jp: '雨<m>が</m>降っている。', jpRr: 'ame ga futte iru',
          ko: '비가 와요.', koRr: 'biga wayo',
          en: 'It’s raining.',
        },
        whyHtml:
          'が → 이/가, role for role: weather, existence, arrivals — the things that enter a scene take it in ' +
          'both languages. (Note the verbs differ: Japanese rain <i>falls</i>, Korean rain <i>comes</i> — 비가 ' +
          '와요 — but the particle is the same.) Korean adds the 받침 fitting and three fused subjects ' +
          '(내가, 제가, 누가).',
      },
      {
        id: 'o', forms: 'を', rr: 'o', formRule: 'one shape · read o · object-only kana',
        role: 'object · done-to', ko: '을 / 를', koRr: 'eul / reul',
        tagline: 'marks the done-to — and a handful of verbs disagree across the strait about what counts',
        ex: {
          jp: '本<m>を</m>読む。', jpRr: 'hon o yomu',
          ko: '책을 읽어요.', koRr: 'chaegeul ilgeoyo',
          en: 'I read a book.',
        },
        whyHtml:
          'を ↔ 을/를 almost everywhere. The mismatches run the OTHER way from this card’s usual direction — ' +
          'verbs that take に or が in Japanese but 을/를 in Korean: 友達<b>に</b>会う = 친구<b>를</b> 만나요, ' +
          'バス<b>に</b>乗る = 버스<b>를</b> 타요, コーヒー<b>が</b>好き = 커피<b>를</b> 좋아해요. Learn those three.',
      },
      {
        id: 'no', forms: 'の', rr: 'no', formRule: 'one shape — and compulsory',
        role: 'of · ’s · nominalizer', ko: '의', koRr: 'ui — read [e]',
        tagline: 'the genitive workhorse — and where Korean goes quiet, Japanese must speak',
        ex: {
          jp: '友達<m>の</m>本です。', jpRr: 'tomodachi no hon desu',
          ko: '친구의 책이에요.', koRr: 'chingue chaegieyo',
          en: 'It’s my friend’s book.',
        },
        whyHtml:
          'の is 의 — but mind two gaps. One: Korean writes 의 and <i>says</i> it [e]. Two: の is compulsory ' +
          '(母<b>の</b>本) where Korean drops 의 the moment the relation is obvious — 엄마 책, 우리 집. So の ' +
          'maps to 의, but Korean uses far fewer of them. (の also nominalizes — 食べる<b>の</b>が好き — a job ' +
          'Korean gives to 것/기.)',
      },
    ],
  },

  // -------------------------------------------------------------------
  // DRAWER III — PLACE, TIME & DIRECTION · 格助詞 adverbial
  // -------------------------------------------------------------------
  {
    id: 'place',
    no: 'III',
    name: 'Place, time & direction',
    jp: '場所',
    latin: 'に·で·へ·から·まで — where one Japanese word, Korean spends several',
    color: 'var(--st-travel)',
    blurb:
      'This drawer is where Japanese economy meets Korean precision. に, で and から each do a job that ' +
      'Korean divides among two or three particles — by animacy, by what’s being left. Owning one Japanese ' +
      'particle here means learning which Korean fork it splits into.',
    entries: [
      {
        id: 'ni', forms: 'に', rr: 'ni', formRule: 'one shape — never changes',
        role: 'at · to · time · recipient', ko: '에 / 에게·한테', koRr: 'e / ege·hante',
        tagline: 'the all-purpose pin — and Korean splits it the instant the target has a pulse',
        ex: {
          jp: '猫が家<m>に</m>いる。', jpRr: 'neko ga ie ni iru',
          ko: '고양이가 집에 있어요.', koRr: 'goyangiga jibe isseoyo',
          en: 'The cat is at home.',
        },
        whyHtml:
          'Existence, destination, clock time, rates — all に, all <b>에</b>. But the moment に points at a ' +
          'living recipient, Korean switches particles: 友達<b>に</b>話す = 친구<b>에게/한테</b> 말해요. ' +
          'Japanese checks nothing; Korean checks for a pulse — 에 for places and things, 에게/한테 for people ' +
          'and animals.',
        faces: [
          { tag: 'destination', jp: '学校<m>に</m>行く', jpRr: 'gakkō ni iku', ko: '학교에 가요', koRr: 'hakgyoe gayo' },
          { tag: 'time', jp: '3時<m>に</m>会う', jpRr: 'sanji ni au', ko: '세 시에 만나요', koRr: 'se sie mannayo' },
          { tag: 'recipient → 에게', jp: '友達<m>に</m>あげる', jpRr: 'tomodachi ni ageru', ko: '친구에게 줘요', koRr: 'chinguege jwoyo' },
        ],
      },
      {
        id: 'de', forms: 'で', rr: 'de', formRule: 'one shape — never changes',
        role: 'venue · means · material', ko: '에서 / (으)로', koRr: 'eseo / (eu)ro',
        tagline: 'the stage and the tool, on one coat — Korean keeps them on two',
        ex: {
          jp: 'カフェ<m>で</m>友達に会った。', jpRr: 'kafe de tomodachi ni atta',
          ko: '카페에서 친구를 만났어요.', koRr: 'kapeeseo chingureul mannasseoyo',
          en: 'I met a friend at a cafe.',
        },
        whyHtml:
          'で carries two ideas Korean refuses to merge. The <b>venue</b> where something is done → 에서 ' +
          '(your stage particle). The <b>means or material</b> → (으)로. 箸<b>で</b>食べる = 젓가락<b>으로</b> ' +
          '먹어요, but カフェ<b>で</b> = 카페<b>에서</b>. One で, two Korean drawers.',
        faces: [
          { tag: 'venue → 에서', jp: '図書館<m>で</m>勉強する', jpRr: 'toshokan de benkyō suru', ko: '도서관에서 공부해요', koRr: 'doseogwaneseo gongbuhaeyo' },
          { tag: 'means → 으로', jp: '地下鉄<m>で</m>行く', jpRr: 'chikatetsu de iku', ko: '지하철로 가요', koRr: 'jihacheollo gayo' },
        ],
      },
      {
        id: 'e', forms: 'へ', rr: 'e', formRule: 'one shape · read e, not he',
        role: 'toward (direction)', ko: '(으)로 / 에', koRr: '(eu)ro / e',
        tagline: 'the direction-of-travel particle — softer than に, and read e',
        ex: {
          jp: 'ソウル<m>へ</m>行く。', jpRr: 'seouru e iku',
          ko: '서울로 가요.', koRr: 'seoullo gayo',
          en: 'I’m heading to Seoul.',
        },
        whyHtml:
          'へ stresses the heading rather than the goal; in practice に and へ overlap for destinations. Korean ' +
          'leans on directional <b>(으)로</b> here — 서울<b>로</b>, 집<b>으로</b> — and mind the gate exception ' +
          'the Korean folio flags: a final ㄹ counts as open, so 서울 takes 로, not 으로.',
      },
      {
        id: 'kara', forms: 'から', rr: 'kara', formRule: 'one shape — never changes',
        role: 'from · since · because', ko: '에서 / 부터 / 한테서', koRr: 'eseo / buteo / hanteseo',
        tagline: 'one “from” — which Korean splits three ways by what is being left',
        ex: {
          jp: '釜山<m>から</m>来た。', jpRr: 'pusan kara kita',
          ko: '부산에서 왔어요.', koRr: 'busaneseo wasseoyo',
          en: 'I came from Busan.',
        },
        whyHtml:
          'The widest split in the cabinet. Japanese から is one word for every “from”; Korean sorts it by ' +
          'source: <b>place → 에서</b> (부산에서), <b>time → 부터</b> (9시부터), <b>person → 한테서</b> ' +
          '(친구한테서). から also means “because” on a clause — a job Korean gives to the ending -니까/-아서, ' +
          'not a particle.',
        faces: [
          { tag: 'place → 에서', jp: '駅<m>から</m>歩く', jpRr: 'eki kara aruku', ko: '역에서 걸어요', koRr: 'yeogeseo georeoyo' },
          { tag: 'time → 부터', jp: '9時<m>から</m>', jpRr: 'kuji kara', ko: '아홉 시부터', koRr: 'ahop sibuteo' },
          { tag: 'person → 한테서', jp: '母<m>から</m>聞いた', jpRr: 'haha kara kiita', ko: '엄마한테서 들었어요', koRr: 'eommahanteseo deureosseoyo' },
        ],
      },
      {
        id: 'made', forms: 'まで', rr: 'made', formRule: 'one shape — never changes',
        role: 'up to · until · even', ko: '까지', koRr: 'kkaji',
        tagline: 'the far edge — of a road, a deadline, or what you’d have believed',
        ex: {
          jp: '9時から5時<m>まで</m>働く。', jpRr: 'kuji kara goji made hataraku',
          ko: '아홉 시부터 다섯 시까지 일해요.', koRr: 'ahop sibuteo daseot sikkaji ilhaeyo',
          en: 'I work from nine to five.',
        },
        whyHtml:
          'まで ↔ 까지, clean across: the spatial limit (駅まで = 역까지), the deadline (明日まで = 내일까지), ' +
          'and the scalar “even” (君まで = 너까지). It pairs with から the way 까지 pairs with 부터 — から…まで ' +
          'frames every schedule, 부터…까지 the same.',
      },
    ],
  },

  // -------------------------------------------------------------------
  // DRAWER IV — PAIRING & COMPARING
  // -------------------------------------------------------------------
  {
    id: 'pairing',
    no: 'IV',
    name: 'Pairing & comparing',
    jp: '並べる',
    latin: 'と·や·より·ほど·など·くらい — listing, likening, measuring',
    color: 'var(--st-active)',
    blurb:
      'The particles that set two things side by side — and / with / than / about / and-the-like. The news ' +
      'is registered “and”: Japanese has one と, but Korean inflects it for intimacy (와·과 / 하고 / 랑), and ' +
      'Japanese keeps a second, vaguer “and” — や — that Korean has no single word for.',
    entries: [
      {
        id: 'to', forms: 'と', rr: 'to', formRule: 'one shape — never changes',
        role: 'and · with · quotation', ko: '와·과 / 하고 / (이)랑', koRr: 'wa·gwa / hago / (i)rang',
        tagline: 'the exhaustive “and,” the “with,” the quote-marker — one word for what Korean splits by register',
        ex: {
          jp: 'パン<m>と</m>牛乳を買った。', jpRr: 'pan to gyūnyū o katta',
          ko: '빵과 우유를 샀어요.', koRr: 'ppanggwa uyureul sasseoyo',
          en: 'I bought bread and milk.',
        },
        whyHtml:
          'と is the complete-list “and” and the “with” of company — both. Korean keeps the meaning but splits ' +
          'the <b>register</b>: 와/과 on the page, 하고 across the counter, (이)랑 between friends. (と also ' +
          'marks quotations — 「行く」と言った — where Korean uses 고: 간다고 했어요.)',
      },
      {
        id: 'ya', forms: 'や', rr: 'ya', formRule: 'one shape — never changes',
        role: 'and (among others)', ko: '(이)나 / -(이)며', koRr: '(i)na / (i)myeo',
        tagline: 'the open-ended “and” — lists examples, not the whole set',
        ex: {
          jp: '本<m>や</m>ノートを買った。', jpRr: 'hon ya nōto o katta',
          ko: '책이나 공책 같은 걸 샀어요.', koRr: 'chaegina gongchaek gateun geol sasseoyo',
          en: 'I bought books and notebooks (among other things).',
        },
        whyHtml:
          'Where と closes the list (just these), や leaves it open (these, for instance) and often ends with ' +
          'など (“and so on”). Korean has no single twin: (이)나 leans this way, or -며 in writing, or just ' +
          '같은 거 (“things like”). One of the few places Japanese is the more economical language.',
      },
      {
        id: 'yori', forms: 'より', rr: 'yori', formRule: 'one shape — never changes',
        role: 'than', ko: '보다', koRr: 'boda',
        tagline: 'the yardstick — comparison with no inflection, same in both',
        ex: {
          jp: '今日は昨日<m>より</m>寒い。', jpRr: 'kyō wa kinō yori samui',
          ko: '오늘이 어제보다 추워요.', koRr: 'oneuri eojeboda chuwoyo',
          en: 'Today is colder than yesterday.',
        },
        whyHtml:
          'より ↔ 보다, straight across: the standard takes the particle, the adjective stays bare, and もっと ' +
          'rides along the way 더 does. Korean’s 보다 doubles as the verb “to see,” so listen for the seat — the ' +
          'particle always hangs off a noun.',
      },
      {
        id: 'hodo', forms: 'ほど', rr: 'hodo', formRule: 'one shape — never changes',
        role: 'extent · as ~ as', ko: '만큼', koRr: 'mankeum',
        tagline: 'the equals sign — to that extent; and, with a negative, “not as ~ as”',
        ex: {
          jp: '君<m>ほど</m>上手じゃない。', jpRr: 'kimi hodo jōzu ja nai',
          ko: '너만큼 잘하지 못해.', koRr: 'neomankeum jalhaji motae',
          en: 'I’m not as good as you.',
        },
        whyHtml:
          'ほど ↔ 만큼: “to X’s extent,” and the ほど…ない frame is 만큼…못/안 exactly — 昨日ほど寒くない = ' +
          '어제만큼 안 추워요. (For approximations, ほど hands off to くらい, next door.)',
      },
      {
        id: 'nado', forms: 'など', rr: 'nado', formRule: 'one shape · casual なんか',
        role: 'etc. · and the like', ko: '등 (等) / 따위', koRr: 'deung / ttawi',
        tagline: 'the “and so on” that closes an open list — often the partner of や',
        ex: {
          jp: '本やノート<m>など</m>を買った。', jpRr: 'hon ya nōto nado o katta',
          ko: '책이나 공책 등을 샀어요.', koRr: 'chaegina gongchaek deungeul sasseoyo',
          en: 'I bought books, notebooks, and so on.',
        },
        whyHtml:
          'The Sino word 等 is shared: Japanese reads it など, Korean reads it <b>등</b> (deung) — same character, ' +
          'same job, closing a sample list. 따위 is the dismissive cousin (“and such rubbish”), matching the ' +
          'belittling tone など can take (私<b>なんか</b> = 나 따위).',
      },
      {
        id: 'kurai', forms: 'くらい / ぐらい', rr: 'kurai / gurai', formRule: 'two readings · free variants',
        role: 'about · to the extent', ko: '쯤 / 정도', koRr: 'jjeum / jeongdo',
        tagline: 'the approximator — roughly this much, or this small a thing',
        ex: {
          jp: '千円<m>くらい</m>かかった。', jpRr: 'sen’en kurai kakatta',
          ko: '천 원쯤 들었어요.', koRr: 'cheon wonjjeum deureosseoyo',
          en: 'It cost about a thousand yen.',
        },
        whyHtml:
          'Approximate quantity → 쯤 or 정도 (3時くらい = 세 시쯤). It also scales downward — これくらい (“this ' +
          'much / this trifling”) = 이 정도 — and shades into 만큼 for “to the extent that.” くらい/ぐらい are ' +
          'free variants; pick by what sounds smooth.',
      },
    ],
  },

  // -------------------------------------------------------------------
  // DRAWER V — THE FOCUS SET · 取り立て助詞
  // -------------------------------------------------------------------
  {
    id: 'focus',
    no: 'V',
    name: 'The focus set',
    jp: '取り立て',
    latin: '副助詞 · も·だけ·しか·さえ·こそ·でも·ばかり — shining a light',
    color: 'var(--signal-lit)',
    blurb:
      'The particles that spotlight a word: also, only, even, precisely. This is the best transfer deal in the ' +
      'cabinet — the Korean focus drawer maps onto it almost piece for piece. They mark no grammatical role; ' +
      'they ride on top of one, and (like Korean) they push the case particle aside when they land.',
    entries: [
      {
        id: 'mo', forms: 'も', rr: 'mo', formRule: 'one shape · displaces が/を',
        role: 'also · even', ko: '도', koRr: 'do',
        tagline: 'the “me too” particle — and the emphatic zero under a negative',
        ex: {
          jp: '私<m>も</m>行きたい。', jpRr: 'watashi mo ikitai',
          ko: '저도 가고 싶어요.', koRr: 'jeodo gago sipeoyo',
          en: 'I want to go too.',
        },
        whyHtml:
          'も ↔ 도, whole: addition (私も = 저도), and the emphatic zero with negatives — 一つ<b>も</b>ない = ' +
          '하나<b>도</b> 없어요, 誰<b>も</b>来ない = 아무<b>도</b> 안 와요. And the case rule you already obey: ' +
          'が/を vanish under も (✗がも), exactly as 이/가·을/를 vanish under 도.',
      },
      {
        id: 'dake', forms: 'だけ', rr: 'dake', formRule: 'one shape · tolerates が/を after it',
        role: 'only', ko: '만', koRr: 'man',
        tagline: 'the neutral “only” — counts what is there',
        ex: {
          jp: '君<m>だけ</m>を信じる。', jpRr: 'kimi dake o shinjiru',
          ko: '너만 믿어.', koRr: 'neoman mideo',
          en: 'I trust only you.',
        },
        whyHtml:
          'だけ ↔ 만, including the rare privilege of keeping case after it: 君だけ<b>が</b> = 너만<b>이</b>, ' +
          '君だけ<b>を</b> = 너만<b>을</b>. Both languages carve out the same single exception. For “nothing ' +
          'but,” with the grammar of grievance, see しか next door.',
      },
      {
        id: 'shika', forms: 'しか', rr: 'shika', formRule: 'one shape · the sentence must end negative',
        role: 'nothing but', ko: '밖에', koRr: 'bakke',
        tagline: 'the contract particle — names a floor, then forces a negative',
        ex: {
          jp: '千円<m>しか</m>ない。', jpRr: 'sen’en shika nai',
          ko: '천 원밖에 없어요.', koRr: 'cheon wonbakke eopseoyo',
          en: 'I’ve got nothing but a thousand yen.',
        },
        whyHtml:
          'しか〜ない ↔ 밖에 〜없다/안/못, contract and all: the sentence <b>must</b> close negative in both. ' +
          'The だけ/しか split is the 만/밖에 split — 만 counts what is there, 밖에 (literally “outside of”) ' +
          'mourns what isn’t.',
      },
      {
        id: 'sae', forms: 'さえ', rr: 'sae', formRule: 'one shape · も-side さえ / すら',
        role: 'even (the minimum)', ko: '조차 / 마저', koRr: 'jocha / majeo',
        tagline: 'even the bare minimum — and the floor fell through',
        ex: {
          jp: '挨拶<m>さえ</m>しなかった。', jpRr: 'aisatsu sae shinakatta',
          ko: '인사조차 안 했어요.', koRr: 'insajocha an haesseoyo',
          en: 'He didn’t even say hello.',
        },
        whyHtml:
          'さえ/すら lean into bad news, like Korean <b>조차</b> (the failed minimum) and <b>마저</b> (the last ' +
          'one, also gone). The corners don’t align 1:1 — まで・さえ・すら spread across the same ground as ' +
          '까지・조차・마저 — so learn these by temperament, not by lookup. (さえ has a bright side too: ' +
          '〜さえ…ば, “if only,” = -기만 하면.)',
      },
      {
        id: 'koso', forms: 'こそ', rr: 'koso', formRule: 'one shape — never changes',
        role: 'precisely · the very one', ko: '(이)야말로', koRr: '(i)yamallo',
        tagline: 'the very one, against all alternatives',
        ex: {
          jp: 'こちら<m>こそ</m>ありがとう。', jpRr: 'kochira koso arigatō',
          ko: '저야말로 감사합니다.', koRr: 'jeoyamallo gamsahamnida',
          en: 'It’s I who should be thanking you.',
        },
        whyHtml:
          'こそ ↔ (이)야말로, nearly 1:1 — and the set-phrase reply is a free win across both: こちらこそ = ' +
          '저야말로. The New Year register too: 今年<b>こそ</b> = 올해<b>야말로</b>, “<i>this</i> is the year.”',
      },
      {
        id: 'demo', forms: 'でも', rr: 'demo', formRule: 'one shape · wh + でも = any-',
        role: 'even · or ~ or something', ko: '(이)라도 / (이)나', koRr: '(i)rado / (i)na',
        tagline: 'the “even,” the soft suggestion, the blank check with a question word',
        ex: {
          jp: 'お茶<m>でも</m>飲む？', jpRr: 'ocha demo nomu?',
          ko: '차라도 마실래?', koRr: 'charado masillae?',
          en: 'Want to grab some tea or something?',
        },
        whyHtml:
          'Three hats, all matched. The settling-for offer → 라도 (お茶でも = 차라도). The “even (an extreme)” → ' +
          '라도/조차. And wh + でも = the any- paradigm: 何でも = 뭐든지, 誰でも = 누구든지, いつでも = 언제든지, ' +
          'どこでも = 어디든지.',
        faces: [
          { tag: '何でも', jp: '何<m>でも</m>', jpRr: 'nan demo', ko: '뭐든지', koRr: 'mwodeunji' },
          { tag: '誰でも', jp: '誰<m>でも</m>', jpRr: 'dare demo', ko: '누구든지', koRr: 'nugudeunji' },
          { tag: 'いつでも', jp: 'いつ<m>でも</m>', jpRr: 'itsu demo', ko: '언제든지', koRr: 'eonjedeunji' },
        ],
      },
      {
        id: 'bakari', forms: 'ばかり', rr: 'bakari', formRule: 'one shape · casual ばっかり/ばっか',
        role: 'nothing but · just (did) · about', ko: '만 / 뿐 / 막', koRr: 'man / ppun / mak',
        tagline: 'too much of one thing — or only just now',
        ex: {
          jp: '食べて<m>ばかり</m>いる。', jpRr: 'tabete bakari iru',
          ko: '먹기만 해요.', koRr: 'meokgiman haeyo',
          en: 'All he does is eat.',
        },
        whyHtml:
          'The exasperated “only”: 〜てばかり = -기만 하다 (do nothing but —). On a noun it overlaps だけ/만 ' +
          '(肉ばかり = 고기만). And the just-happened reading — 来たばかり (“only just arrived”) = 막 왔어요 — ' +
          'is where Korean reaches for the adverb 막, not a particle.',
      },
    ],
  },

  // -------------------------------------------------------------------
  // DRAWER VI — THE SENTENCE-FINAL SET · 終助詞
  // -------------------------------------------------------------------
  {
    id: 'final',
    no: 'VI',
    name: 'The sentence-final set',
    jp: '終助詞',
    latin: '終助詞 (shūjoshi) · か·ね·よ·な·の·かな — the particles that tune the room',
    color: 'var(--accent-deep)',
    blurb:
      'Here Japanese is the richer language, and the bridge changes character. These particles ride the very ' +
      'end of a sentence to set its stance — question, agreement, assertion, musing. Korean does almost all ' +
      'of this work not with particles but with verb ENDINGS (-요, -지, -네, -거든, -까). So each card pairs a ' +
      'Japanese particle with a Korean <i>ending</i>, not a twin.',
    entries: [
      {
        id: 'ka', forms: 'か', rr: 'ka', formRule: 'sentence-final · the question marker',
        role: 'question', ko: '-까(요) / -니 / -나(요)', koRr: '-kka(yo) / -ni / -na(yo)',
        tagline: 'turns a statement into a question — a job Korean hands to the verb ending',
        ex: {
          jp: '行きます<m>か</m>。', jpRr: 'ikimasu ka',
          ko: '가요? / 갑니까?', koRr: 'gayo? / gamnikka?',
          en: 'Are you going?',
        },
        whyHtml:
          'Japanese appends か (and, casually, just rising intonation). Korean rarely uses a final particle — ' +
          'it conjugates the question into the verb: 합쇼체 갑니<b>까</b>, 해요체 가<b>요?</b> (intonation), ' +
          'plain 가<b>니?</b> / 가<b>나?</b>. The register dial on the Korean verb folio is the real map here.',
      },
      {
        id: 'ne', forms: 'ね', rr: 'ne', formRule: 'sentence-final · seeks agreement',
        role: 'right? · isn’t it', ko: '-네(요) / -죠(=지요)', koRr: '-ne(yo) / -jyo',
        tagline: 'reaches for the listener’s nod — “…, right?”',
        ex: {
          jp: 'いい天気です<m>ね</m>。', jpRr: 'ii tenki desu ne',
          ko: '날씨 좋네요.', koRr: 'nalssi jonneyo',
          en: 'Nice weather, isn’t it.',
        },
        whyHtml:
          'Shared exclamation/agreement — and Korean even shares the <i>shape</i>: the ending -네(요) marks ' +
          'fresh realization, almost ね’s twin (좋<b>네요</b>). For “right?, don’t you think” Korean also uses ' +
          '-죠 (= -지요): 좋<b>죠?</b>. An ending where Japanese has a particle.',
      },
      {
        id: 'yo', forms: 'よ', rr: 'yo', formRule: 'sentence-final · asserts / informs',
        role: 'I’m telling you', ko: '-거든(요) / -잖아(요) / -어(요)', koRr: '-geodeun(yo) / -janha(yo)',
        tagline: 'pushes new information onto the listener — Korean answers with intonation and endings',
        ex: {
          jp: 'もう始まってる<m>よ</m>。', jpRr: 'mō hajimatteru yo',
          ko: '벌써 시작했거든요.', koRr: 'beolsseo sijakaetgeodeunyo',
          en: 'It’s already started, you know.',
        },
        whyHtml:
          'よ tells the listener something they didn’t have. Korean spreads the job: -거든(요) (“you see, ' +
          'because…”), -잖아(요) (“as you know”), or a plain emphatic 어(요) with falling stress. No single ' +
          'particle — the work lives in the ending and the tone.',
      },
      {
        id: 'na', forms: 'な', rr: 'na', formRule: 'sentence-final · musing — and, after a verb, prohibition',
        role: 'self-talk · don’t', ko: '-구나/-네 · -지 마', koRr: '-guna/-ne · -ji ma',
        tagline: 'a thought to oneself — or, on a dictionary-form verb, a hard “don’t”',
        ex: {
          jp: '行く<m>な</m>。', jpRr: 'iku na',
          ko: '가지 마.', koRr: 'gaji ma',
          en: 'Don’t go.',
        },
        whyHtml:
          'Two faces. Musing な (暑いな = 덥<b>구나</b> / 덥<b>네</b>) — the inward exclamation, a Korean ending ' +
          'again. And prohibitive な on a plain verb (行くな) — sharp, masculine — where Korean uses the ' +
          'negative command -지 마(라): 가지 마. (Soft な ≠ the な of な-adjectives; that one names a class.)',
      },
      {
        id: 'no_q', forms: 'の', rr: 'no', formRule: 'sentence-final · explanatory (casual のだ/んだ)',
        role: 'explaining · soft question', ko: '-거든(요) / -(으)ㄴ데 / -야?', koRr: '-geodeun / -(eu)nde / -ya?',
        tagline: 'the explanatory の — gives or asks for the story behind a fact',
        ex: {
          jp: 'どうした<m>の</m>？', jpRr: 'dō shita no?',
          ko: '무슨 일이야?', koRr: 'museun iriya?',
          en: 'What’s the matter?',
        },
        whyHtml:
          'This の (formal のだ/んだ) frames a statement as explanation or a question as concerned inquiry. ' +
          'Korean leans on -거든(요) to give the backstory and -(으)ㄴ데(요) to set one up; the soft casual ' +
          'question is just -야? / -니?. Distinct from the genitive の in the skeleton drawer.',
      },
      {
        id: 'kana', forms: 'かな', rr: 'kana', formRule: 'sentence-final · か + な, self-directed',
        role: 'I wonder', ko: '-(으)ㄹ까? (혼잣말)', koRr: '-(eu)lkka?',
        tagline: 'wondering aloud — and Korean has an almost-exact ending for it',
        ex: {
          jp: '来る<m>かな</m>。', jpRr: 'kuru kana',
          ko: '올까?', koRr: 'olkka?',
          en: 'I wonder if they’ll come.',
        },
        whyHtml:
          'Musing uncertainty — and a rare near-perfect match: Korean’s -(으)ㄹ까 does exactly this, as a ' +
          'self-question (올<b>까?</b>) or a proposal (갈<b>까?</b>, “shall we go?”). The same -까 that builds ' +
          'the formal question か mirror, turned inward. One of the few 終助詞 with a true Korean twin.',
      },
    ],
  },
]

export const CABINET_FOOT =
  'not in the cabinet, on purpose: the rarefied liners (ぞ・ぜ・さ・わ・の of literature and dialect) and ' +
  'the conjunction-particles (が・けど・から・ので — which join clauses, not nouns). They wait for the ' +
  'books that need them.'
