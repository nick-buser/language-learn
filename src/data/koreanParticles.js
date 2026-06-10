// =====================================================================
// The Polyglot's Atlas — Korean · the particle cabinet (조사)
// Conventions (same as koreanData.js):
//   kr   — hangul; the particle under study is wrapped in <m>…</m>
//   rr   — Revised Romanization, written to reflect pronunciation
//          (책을 읽어요 → chaegeul ilgeoyo)
//   jp   — the corresponding Japanese form (the bridge)
//   jpRr — romaji for the bridge sentence
// Five drawers (families), one card per particle. The cabinet skips the
// rarefied drawer-liners (커녕, 더러, 보고, 마는…) on purpose.
// =====================================================================

export const PARTICLE_FAMILIES = [
  // -------------------------------------------------------------------
  // DRAWER II — THE SKELETON · 격조사 core
  // -------------------------------------------------------------------
  {
    id: 'skeleton',
    no: 'II',
    name: 'The skeleton',
    kr: '뼈대',
    latin: '격조사 (gyeokjosa) · 格助詞 — は·が·を·の, refitted',
    color: 'var(--accent)',
    blurb:
      'The load-bearing four. All of them already work inside the grammar folio’s instruments — ' +
      'the loom, the gate, the spotlight — so these cards file the essentials, plus the traps ' +
      'the Japanese bridge does not carry.',
    entries: [
      {
        id: 'neun',
        forms: '은 / 는',
        rr: 'eun / neun',
        formRule: '받침 → 은 · vowel → 는',
        role: 'topic · contrast',
        jp: 'は',
        tagline: 'lifts a thing up — “here is what we’re talking about” — and, doubled, sets two things against each other',
        ex: {
          kr: '커피<m>는</m> 마시지만 차<m>는</m> 안 마셔요.',
          rr: 'keopineun masijiman chaneun an masyeoyo',
          jp: 'コーヒーは飲むけど、お茶は飲みません。',
          jpRr: 'kōhī wa nomu kedo, ocha wa nomimasen',
          en: 'Coffee I do drink — tea I don’t.',
        },
        whyHtml:
          'Your は, wholesale — topic (“as for X”) and contrast both. The specimen shows the ' +
          'contrast face: two topics held against each other, the double-は move exactly. The full ' +
          'topic-vs-subject battle (은/는 vs 이/가) has its own instrument in the <b>grammar ' +
          'folio</b>; this card just files the particle.',
        note: {
          head: 'it reaches past nouns',
          html: '맵지<b>는</b> 않아요 (maepjineun anayo) — “it’s not <i>spicy</i>, (but…)” — 는 docks ' +
                'inside a verb form, exactly where Japanese puts は in 辛く<b>は</b>ない. ' +
                'Delimiters ride anything; the focus drawer below is built on that.',
        },
      },
      {
        id: 'ga',
        forms: '이 / 가',
        rr: 'i / ga',
        formRule: '받침 → 이 · vowel → 가',
        role: 'subject · selection',
        jp: 'が',
        tagline: 'points at the doer — new information, or the answer to “which one?”',
        ex: {
          kr: '비<m>가</m> 와요.',
          rr: 'biga wayo',
          jp: '雨が降っています。',
          jpRr: 'ame ga futte imasu',
          en: 'It’s raining.',
        },
        whyHtml:
          'が, redeployed. Weather, arrivals, existence — the classic が territory is 가 territory: ' +
          'things entering the scene take 이/가. (Korean rain <i>comes</i> — 비가 와요, “rain ' +
          'comes” — where Japanese rain falls; the verb idiom differs, the particle doesn’t.)',
        note: {
          head: 'three fused forms',
          html: '나 + 가 → <b>내가</b> (naega), 저 + 가 → <b>제가</b> (jega), 누구 + 가 → <b>누가</b> ' +
                '(nuga) — Korean’s only particle-driven pronoun changes, and the reason the ' +
                'grammar folio’s spotlight sentence reads 제가, not 저가.',
        },
      },
      {
        id: 'reul',
        forms: '을 / 를',
        rr: 'eul / reul',
        formRule: '받침 → 을 · vowel → 를',
        role: 'object · done-to',
        jp: 'を',
        tagline: 'marks the done-to — but a few verbs disagree with Japanese about what counts as an object',
        ex: {
          kr: '책<m>을</m> 읽어요.',
          rr: 'chaegeul ilgeoyo',
          jp: '本を読みます。',
          jpRr: 'hon o yomimasu',
          en: 'I read a book.',
        },
        whyHtml:
          '를↔を carries almost everywhere. What this card files is the short list where it ' +
          '<i>doesn’t</i> — verbs that take a direct object in Korean while Japanese reaches for ' +
          'に or が. Own the three below and the rest of 을/를 is free.',
        faces: [
          { tag: 'に会う → 를', kr: '친구<m>를</m> 만나요', rr: 'chingureul mannayo', jp: '友達に会う' },
          { tag: 'に乗る → 를', kr: '버스<m>를</m> 타요', rr: 'beoseureul tayo', jp: 'バスに乗る' },
          { tag: 'が好き → 를', kr: '커피<m>를</m> 좋아해요', rr: 'keopireul joahaeyo', jp: 'コーヒーが好きだ' },
        ],
      },
      {
        id: 'ui',
        forms: '의',
        rr: 'ui — read [e]',
        formRule: 'one shape · spoken as 에',
        role: 'possession · of',
        jp: 'の',
        tagline: 'の’s quiet cousin — written everywhere, said as 에, and dropped whenever it can be',
        ex: {
          kr: '친구<m>의</m> 책이에요.',
          rr: 'chingue chaegieyo',
          jp: '友達の本です。',
          jpRr: 'tomodachi no hon desu',
          en: 'It’s my friend’s book.',
        },
        whyHtml:
          'Different from の in two ways. One: the spelling 의 keeps an old vowel the voice has ' +
          'abandoned — as a particle it is read <b>에</b> [e]. Two: it is shy where の is ' +
          'compulsory. Speech drops it whenever the relation is obvious — 엄마 책 (mom’s book), ' +
          '우리 집 (our house) — where Japanese must say 母<b>の</b>本. Write it; don’t over-say it.',
        note: {
          head: 'fused possessives',
          html: '나의 → <b>내</b> (nae), 저의 → <b>제</b> (je), 너의 → <b>네</b> (ne — said ' +
                '<b>니</b> [ni] in speech, to keep it apart from 내). And 우리 (“our”) covers home ' +
                'and family the way うち does: 우리 엄마, 우리 집.',
        },
      },
    ],
  },

  // -------------------------------------------------------------------
  // DRAWER III — PLACE, TIME & DIRECTION · the adverbial set
  // -------------------------------------------------------------------
  {
    id: 'place',
    no: 'III',
    name: 'Place, time & direction',
    kr: '자리',
    latin: '부사격 조사 · に·で·へ·から·まで, redrawn',
    color: 'var(--st-travel)',
    blurb:
      'Where Japanese spends に・で・へ・から・まで, Korean spends these seven. The mapping is ' +
      'clean but the borders are redrawn: に splits by animacy, and から splits three ways — by ' +
      'what is being left.',
    entries: [
      {
        id: 'e',
        forms: '에',
        rr: 'e',
        formRule: 'one shape — never changes',
        role: 'at · to · in (time)',
        jp: 'に',
        tagline: 'the pin on the map — where things are, where they head, when they happen',
        ex: {
          kr: '고양이가 집<m>에</m> 있어요.',
          rr: 'goyangiga jibe isseoyo',
          jp: '猫が家にいます。',
          jpRr: 'neko ga ie ni imasu',
          en: 'The cat is at home.',
        },
        whyHtml:
          'The static に, nearly 1:1: existence (있어요/없어요), destination, clock time, rates. ' +
          'What 에 never marks is where an action <i>happens</i> — that is 에서’s job, and the ' +
          'spotlight below settles the border between them.',
        faces: [
          { tag: 'destination · に', kr: '학교<m>에</m> 가요', rr: 'hakgyoe gayo', jp: '学校に行く' },
          { tag: 'time · に', kr: '세 시<m>에</m> 만나요', rr: 'se sie mannayo', jp: '3時に会う' },
          { tag: 'rate · に', kr: '하루<m>에</m> 두 번', rr: 'harue du beon', jp: '一日に二回' },
        ],
      },
      {
        id: 'eseo',
        forms: '에서',
        rr: 'eseo',
        formRule: 'one shape — never changes',
        role: 'at (doing) · from (place)',
        jp: 'で・から',
        tagline: 'the stage — where things happen; and, second job, where things set out from',
        ex: {
          kr: '카페<m>에서</m> 친구를 만났어요.',
          rr: 'kapeeseo chingureul mannasseoyo',
          jp: 'カフェで友達に会いました。',
          jpRr: 'kafe de tomodachi ni aimashita',
          en: 'I met a friend at a cafe.',
        },
        whyHtml:
          'One coat, two Japanese particles. Face one is your で exactly: the venue where ' +
          'something <i>gets done</i>. Face two is から — but only for places. Korean splits ' +
          '“from” by what is being left: place → 에서, time → 부터, person → 한테서.',
        faces: [
          { tag: 'venue · で', kr: '도서관<m>에서</m> 공부해요', rr: 'doseogwaneseo gongbuhaeyo', jp: '図書館で勉強する' },
          { tag: 'origin · から', kr: '부산<m>에서</m> 왔어요', rr: 'busaneseo wasseoyo', jp: '釜山から来た' },
        ],
      },
      {
        id: 'ege',
        forms: '에게 / 한테',
        rr: 'ege / hante',
        formRule: 'never changes · 에게 written, 한테 spoken',
        role: 'to (someone)',
        jp: 'に (animate)',
        tagline: 'the animate に — Japanese hands に to everything; Korean checks for a pulse first',
        ex: {
          kr: '친구<m>한테</m> 문자를 보냈어요.',
          rr: 'chinguhante munjareul bonaesseoyo',
          jp: '友達にメッセージを送りました。',
          jpRr: 'tomodachi ni messēji o okurimashita',
          en: 'I texted my friend.',
        },
        whyHtml:
          'People and animals take 에게/한테; places and things take 에. The pair itself is ' +
          'register, not grammar — 에게 on the page, 한테 in the air. When the receiver outranks ' +
          'you, both step aside for 께 (the social drawer).',
        note: {
          head: 'the pulse check',
          html: '꽃<b>에</b> 물을 줘요 (kkoche mureul jwoyo) — water goes “to the flowers” with 에: ' +
                'plants fail the check. 강아지<b>한테</b> 밥을 줘요 (gangajihante) — the puppy passes.',
        },
      },
      {
        id: 'egeseo',
        forms: '에게서 / 한테서',
        rr: 'egeseo / hanteseo',
        formRule: 'never changes · written / spoken pair',
        role: 'from (someone)',
        jp: 'から (person)',
        tagline: 'the animate から — what arrives from a person',
        ex: {
          kr: '엄마<m>한테서</m> 전화가 왔어요.',
          rr: 'eommahanteseo jeonhwaga wasseoyo',
          jp: '母から電話が来ました。',
          jpRr: 'haha kara denwa ga kimashita',
          en: 'A call came from mom.',
        },
        whyHtml:
          'In speech the 서 often falls away and plain 한테 covers both directions — exactly the ' +
          'way Japanese 友達<b>に</b>聞いた can mean hearing <i>from</i> the friend. Writing keeps ' +
          'the directions dressed apart: 에게 to, 에게서 from.',
      },
      {
        id: 'ro',
        forms: '(으)로',
        rr: 'euro / ro',
        formRule: '받침 → 으로 · vowel or ㄹ → 로',
        role: 'toward · by means of',
        jp: 'で・へ',
        tagline: 'direction of travel, tool of choice — and, surprisingly, the particle of decisions',
        ex: {
          kr: '지하철<m>로</m> 가요.',
          rr: 'jihacheollo gayo',
          jp: '地下鉄で行きます。',
          jpRr: 'chikatetsu de ikimasu',
          en: 'I go by subway.',
        },
        whyHtml:
          'Means-で and direction-へ share one Korean coat — plus a face Japanese gives, ' +
          'unexpectedly, to に: decisions. これ<b>に</b>します is 이걸<b>로</b> 할게요 — choosing ' +
          'is a direction here. And mind the gate’s one exception: a final ㄹ counts as open — ' +
          '지하철로, 서울로.',
        faces: [
          { tag: 'direction · へ', kr: '서울<m>로</m> 가요', rr: 'seoullo gayo', jp: 'ソウルへ行く' },
          { tag: 'tool · で', kr: '젓가락<m>으로</m> 먹어요', rr: 'jeotgarageuro meogeoyo', jp: '箸で食べる' },
          { tag: 'material · で', kr: '쌀<m>로</m> 만들어요', rr: 'ssallo mandeureoyo', jp: '米で作る' },
          { tag: 'decision · に', kr: '이걸<m>로</m> 할게요', rr: 'igeollo halgeyo', jp: 'これにします' },
        ],
      },
      {
        id: 'buteo',
        forms: '부터',
        rr: 'buteo',
        formRule: 'one shape — never changes',
        role: 'from (a start)',
        jp: 'から (time)',
        tagline: 'the starting line — time, sequence, “you first”',
        ex: {
          kr: '수업은 아홉 시<m>부터</m>예요.',
          rr: 'sueobeun ahop sibuteoyeyo',
          jp: '授業は9時からです。',
          jpRr: 'jugyō wa kuji kara desu',
          en: 'Class starts at (from) nine.',
        },
        whyHtml:
          'から, split three ways — and 부터 takes the time-and-sequence share: 아침부터 ' +
          '(朝から), 처음부터 (最初から), 너부터 (君から — you first). It pairs with 까지 the way ' +
          'から pairs with まで: 부터…까지 frames every schedule in the language.',
      },
      {
        id: 'kkaji',
        forms: '까지',
        rr: 'kkaji',
        formRule: 'one shape — never changes',
        role: 'up to · until · even',
        jp: 'まで',
        tagline: 'the far edge — of a road, a deadline, or what you thought possible',
        ex: {
          kr: '아홉 시부터 다섯 시<m>까지</m> 일해요.',
          rr: 'ahop sibuteo daseot sikkaji ilhaeyo',
          jp: '9時から5時まで働きます。',
          jpRr: 'kuji kara goji made hatarakimasu',
          en: 'I work from nine to five.',
        },
        whyHtml:
          'まで in full: the spatial limit (역까지 — 駅まで), the deadline (내일까지 — 明日まで), ' +
          'and the scalar “even” (너까지 — 君まで, you of all people). The scalar face has two ' +
          'sharper siblings in the focus drawer, 조차 and 마저 — the three-way is settled there.',
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
    kr: '짝',
    latin: '접속과 비교 · と in three registers · より·ほど·ずつ·毎',
    color: 'var(--st-active)',
    blurb:
      'The particles that put two nouns side by side: and, with, than, as much as, like, every, ' +
      'apiece. The news in this drawer is registered “and” — Korean inflects と for intimacy.',
    entries: [
      {
        id: 'wa',
        forms: '와 / 과',
        rr: 'wa / gwa',
        formRule: 'vowel → 와 · 받침 → 과',
        role: 'and · with (written)',
        jp: 'と',
        tagline: 'the bookish と — print, lectures, lyrics',
        ex: {
          kr: '빵<m>과</m> 우유를 샀어요.',
          rr: 'ppanggwa uyureul sasseoyo',
          jp: 'パンと牛乳を買いました。',
          jpRr: 'pan to gyūnyū o kaimashita',
          en: 'I bought bread and milk.',
        },
        whyHtml:
          'Both と jobs — listing and accompaniment — in formal dress. One oddity: this is the ' +
          'cabinet’s only pair whose fitting ignores liaison logic. After a 받침 you get ' +
          'consonant-initial <b>과</b> (빵과), after a vowel <b>와</b> (우유와). Memorize the ' +
          'pairing as-is and move on.',
      },
      {
        id: 'hago',
        forms: '하고',
        rr: 'hago',
        formRule: 'one shape — never changes',
        role: 'and · with (neutral)',
        jp: 'と',
        tagline: 'the everyday と — and blessedly invariant',
        ex: {
          kr: '친구<m>하고</m> 영화를 봤어요.',
          rr: 'chinguhago yeonghwareul bwasseoyo',
          jp: '友達と映画を見ました。',
          jpRr: 'tomodachi to eiga o mimashita',
          en: 'I saw a movie with a friend.',
        },
        whyHtml:
          'Speech’s default “and/with”: 빵하고, 책하고 — no fitting, no thinking. Listing (A하고 ' +
          'B) and company (친구하고 같이 = 友達と一緒に) both. When in doubt out loud, 하고 is ' +
          'never wrong.',
      },
      {
        id: 'rang',
        forms: '(이)랑',
        rr: 'irang / rang',
        formRule: '받침 → 이랑 · vowel → 랑',
        role: 'and · with (intimate)',
        jp: 'と (casual)',
        tagline: 'the banmal と — “and” between friends',
        ex: {
          kr: '언니<m>랑</m> 떡볶이 먹었어.',
          rr: 'eonnirang tteokbokki meogeosseo',
          jp: 'お姉ちゃんとトッポッキ食べた。',
          jpRr: 'onēchan to toppokki tabeta',
          en: 'Had tteokbokki with my big sister.',
        },
        whyHtml:
          'Korean inflects “and” for intimacy: 와/과 on the page, 하고 across the counter, ' +
          '(이)랑 between friends — three registers where Japanese と never changes clothes. ' +
          '(The specimen also quietly dropped 를 after 떡볶이 — casual Korean sheds case ' +
          'particles exactly like casual Japanese sheds を.)',
      },
      {
        id: 'boda',
        forms: '보다',
        rr: 'boda',
        formRule: 'one shape — never changes',
        role: 'than',
        jp: 'より',
        tagline: 'the yardstick — comparison without inflection, just like home',
        ex: {
          kr: '오늘이 어제<m>보다</m> 더 추워요.',
          rr: 'oneuri eojeboda deo chuwoyo',
          jp: '今日は昨日より（もっと）寒いです。',
          jpRr: 'kyō wa kinō yori samui desu',
          en: 'Today is colder than yesterday.',
        },
        whyHtml:
          'より, straight across: the standard of comparison takes 보다, the adjective stays ' +
          'untouched, and 더 (“more”) rides along the way もっと does. Watch the homograph — ' +
          '보다 is also the verb “to see”; the particle always hangs off a noun.',
      },
      {
        id: 'mankeum',
        forms: '만큼',
        rr: 'mankeum',
        formRule: 'one shape — never changes',
        role: 'as much as',
        jp: 'ほど・くらい',
        tagline: 'the equals sign — to X’s extent',
        ex: {
          kr: '너<m>만큼</m> 잘하고 싶어.',
          rr: 'neomankeum jalhago sipeo',
          jp: '君ほど上手になりたい。',
          jpRr: 'kimi hodo jōzu ni naritai',
          en: 'I want to be as good as you.',
        },
        whyHtml:
          'Where 보다 ranks, 만큼 equates: “to X’s extent.” With negation it is ほど…ない ' +
          'exactly: 어제만큼 안 추워요 (eojemankeum an chuwoyo) — 昨日ほど寒くない, “not as cold ' +
          'as yesterday.”',
      },
      {
        id: 'cheoreom',
        forms: '처럼',
        rr: 'cheoreom',
        formRule: 'one shape — never changes',
        role: 'like · as',
        jp: 'のように',
        tagline: 'the resemblance particle — のように in one word, no glue',
        ex: {
          kr: '아이<m>처럼</m> 웃어요.',
          rr: 'aicheoreom useoyo',
          jp: '子供のように笑います。',
          jpRr: 'kodomo no yō ni waraimasu',
          en: 'She laughs like a child.',
        },
        whyHtml:
          'のように/みたいに, no の needed. Synonym: N같이 (gachi — from 같다, “to be like”), ' +
          'interchangeable in most seats. For the predicate, Korean uses 같다 where Japanese uses ' +
          'みたいだ: 꿈 같아요 (kkum gatayo) — 夢みたいだ, “it’s like a dream.”',
      },
      {
        id: 'mada',
        forms: '마다',
        rr: 'mada',
        formRule: 'one shape — never changes',
        role: 'every',
        jp: '毎・ごとに',
        tagline: 'the metronome — every morning, every weekend, every ten minutes',
        ex: {
          kr: '아침<m>마다</m> 운동해요.',
          rr: 'achimmada undonghaeyo',
          jp: '毎朝運動します。',
          jpRr: 'maiasa undō shimasu',
          en: 'I work out every morning.',
        },
        whyHtml:
          'Where Japanese prefixes (毎朝, 毎日), Korean suffixes: 아침마다, 날마다, 주말마다. ' +
          'Intervals too: 10분마다 = 10分ごとに. And the “each one differently” face: 사람마다 ' +
          '달라요 (sarammada dallayo) — 人それぞれ違う.',
      },
      {
        id: 'ssik',
        forms: '씩',
        rr: 'ssik',
        formRule: 'one shape — never changes',
        role: 'apiece · at a time',
        jp: 'ずつ',
        tagline: 'the ration — one each, little by little',
        ex: {
          kr: '하나<m>씩</m> 말해 주세요.',
          rr: 'hanassik malhae juseyo',
          jp: '一つずつ話してください。',
          jpRr: 'hitotsu zutsu hanashite kudasai',
          en: 'One at a time, please.',
        },
        whyHtml:
          'ずつ, exactly: distribution over people or turns. 조금씩 = 少しずつ (little by ' +
          'little), 두 개씩 = 二個ずつ. It rides on quantities, and teams up with 마다: 주말마다 ' +
          '한 편씩 — one episode each weekend.',
      },
    ],
  },

  // -------------------------------------------------------------------
  // DRAWER V — THE FOCUS SET · 보조사 (取り立て)
  // -------------------------------------------------------------------
  {
    id: 'focus',
    no: 'V',
    name: 'The focus set',
    kr: '초점',
    latin: '보조사 (bojosa) · 取り立て — も·だけ·しか·さえ·こそ·でも',
    color: 'var(--signal-lit)',
    blurb:
      'Japanese grammars call these 取り立て助詞 — particles that shine a light on a word: also, ' +
      'only, even, at least, indeed. The Korean set maps onto も・だけ・しか・さえ・こそ・でも ' +
      'nearly piece for piece — the best transfer deal in the folio. They mark no grammar role; ' +
      'they ride on top of roles (→ the stack, below).',
    entries: [
      {
        id: 'do',
        forms: '도',
        rr: 'do',
        formRule: 'one shape — never changes',
        role: 'also · even',
        jp: 'も',
        tagline: 'the “me too” particle — and the emphatic zero under negation',
        ex: {
          kr: '저<m>도</m> 가고 싶어요.',
          rr: 'jeodo gago sipeoyo',
          jp: '私も行きたいです。',
          jpRr: 'watashi mo ikitai desu',
          en: 'I want to go too.',
        },
        whyHtml:
          'も entire: addition (저도 — 私も), and the emphatic zero with negatives — 하나도 ' +
          '없어요 (hanado eopseoyo) = 一つもない, 아무도 안 왔어요 = 誰も来なかった. When 도 ' +
          'lands on a subject or object, the case particle steps aside (✗저가도): the が/を-' +
          'under-も rule you already obey. The stack below proves it.',
      },
      {
        id: 'man',
        forms: '만',
        rr: 'man',
        formRule: 'one shape — never changes',
        role: 'only',
        jp: 'だけ',
        tagline: 'the neutral “only” — counts what’s there',
        ex: {
          kr: '너<m>만</m> 믿어.',
          rr: 'neoman mideo',
          jp: '君だけを信じる。',
          jpRr: 'kimi dake o shinjiru',
          en: 'I trust only you.',
        },
        whyHtml:
          'だけ — “only,” comfortable in plain statements. Like だけ it tolerates case particles ' +
          'around it: 너만<b>을</b> 믿어 = 君だけ<b>を</b>信じる, 너만<b>이</b> = 君だけ<b>が</b> — ' +
          'the one delimiter that outranks case (→ the stack). For “nothing but,” with the ' +
          'grammar of grievance, reach for 밖에 next door.',
      },
      {
        id: 'bakke',
        forms: '밖에',
        rr: 'bakke',
        formRule: 'one shape · the sentence must end negative',
        role: 'nothing but',
        jp: 'しか〜ない',
        tagline: 'literally “outside of” — outside this, nothing',
        ex: {
          kr: '천 원<m>밖에</m> 없어요.',
          rr: 'cheon wonbakke eopseoyo',
          jp: '千ウォンしかありません。',
          jpRr: 'sen won shika arimasen',
          en: 'I’ve got nothing but a thousand won.',
        },
        whyHtml:
          'しか, with the same contract: the sentence <b>must</b> close negative — 밖에 … ' +
          '없다/안/못. Built from 밖 “outside” + 에: everything outside X does not exist. The ' +
          '만/밖에 split is the だけ/しか split: 만 counts what is there; 밖에 mourns what isn’t.',
      },
      {
        id: 'ppun',
        forms: '뿐',
        rr: 'ppun',
        formRule: 'one shape · lives with the copula: 뿐이다',
        role: 'just that, nothing else',
        jp: 'だけ(だ)・のみ',
        tagline: 'the “that’s all there is” particle — closes the sentence around its noun',
        ex: {
          kr: '너<m>뿐</m>이야.',
          rr: 'neoppuniya',
          jp: '君だけだ。',
          jpRr: 'kimi dake da',
          en: 'It’s only you.',
        },
        whyHtml:
          'The predicate-side “only”: N뿐이다 — 君だけだ. With verbs, -(으)ㄹ 뿐이다: 웃을 ' +
          '뿐이에요 (useul ppunieyo) — 笑うだけです, “all I do is smile.” Where 만 trims one noun ' +
          'mid-sentence, 뿐 declares the whole sentence holds nothing else. K-drama title-grade.',
      },
      {
        id: 'na',
        forms: '(이)나',
        rr: 'ina / na',
        formRule: '받침 → 이나 · vowel → 나',
        role: 'or · or something · as much as',
        jp: 'か・でも・も',
        tagline: 'one particle, three Japanese hats — context picks which',
        ex: {
          kr: '주스<m>나</m> 커피 드릴까요?',
          rr: 'juseuna keopi deurilkkayo',
          jp: 'ジュースかコーヒー、いかがですか。',
          jpRr: 'jūsu ka kōhī, ikaga desu ka',
          en: 'Can I get you juice or coffee?',
        },
        whyHtml:
          'Plain “or” (か) between nouns; the shrugging “…or something” (でも) on suggestions; ' +
          'and on a quantity, the speaker’s raised eyebrows: 열 시간이나 — 10時間<b>も</b> — “a ' +
          'whole ten hours.” What it rides, and the sentence around it, pick the hat.',
        faces: [
          { tag: 'or · か', kr: '주스<m>나</m> 커피', rr: 'juseuna keopi', jp: 'ジュースかコーヒー' },
          { tag: 'settle-for · でも', kr: '산책<m>이나</m> 할까?', rr: 'sanchaegina halkka', jp: '散歩でもしようか' },
          { tag: 'as much as · も', kr: '열 시간<m>이나</m> 잤어요', rr: 'yeol siganina jasseoyo', jp: '10時間も寝た' },
        ],
      },
      {
        id: 'rado',
        forms: '(이)라도',
        rr: 'irado / rado',
        formRule: '받침 → 이라도 · vowel → 라도',
        role: 'at least · even if just',
        jp: 'でも',
        tagline: 'the settling-for でも — second-best, offered politely',
        ex: {
          kr: '물<m>이라도</m> 드릴까요?',
          rr: 'murirado deurilkkayo',
          jp: 'お水でもいかがですか。',
          jpRr: 'omizu demo ikaga desu ka',
          en: 'Could I at least get you some water?',
        },
        whyHtml:
          '“Not the first choice, but better than nothing” — the polite-offer でも. The ' +
          'temperature differs from (이)나’s shrug: 산책이나 is “whatever, a walk or something”; ' +
          '산책이라도 is “a walk, if nothing better is possible.” Also 지금이라도 — 今からでも, ' +
          '“even now, it’s not too late.”',
      },
      {
        id: 'deunji',
        forms: '(이)든지',
        rr: 'ideunji / deunji',
        formRule: '받침 → 이든지 · vowel → 든지 · clips to 든',
        role: 'any · whether',
        jp: 'でも (wh+)',
        tagline: 'the blank check — whatever, whenever, whoever',
        ex: {
          kr: '뭐<m>든지</m> 물어보세요.',
          rr: 'mwodeunji mureoboseyo',
          jp: '何でも聞いてください。',
          jpRr: 'nan demo kiite kudasai',
          en: 'Ask me anything.',
        },
        whyHtml:
          'The wh+でも paradigm, wholesale — see the table below. Clipped to 든 in speech ' +
          '(뭐든). And “whether A or B”: A든지 B든지 — AでもBでも, 가든지 말든지 — “go or ' +
          'don’t, see if I care.”',
        faces: [
          { tag: '何でも', kr: '뭐<m>든지</m>', rr: 'mwodeunji', jp: '何でも' },
          { tag: '誰でも', kr: '누구<m>든지</m>', rr: 'nugudeunji', jp: '誰でも' },
          { tag: 'いつでも', kr: '언제<m>든지</m>', rr: 'eonjedeunji', jp: 'いつでも' },
          { tag: 'どこでも', kr: '어디<m>든지</m>', rr: 'eodideunji', jp: 'どこでも' },
        ],
      },
      {
        id: 'jocha',
        forms: '조차',
        rr: 'jocha',
        formRule: 'one shape · leans negative',
        role: 'even (it got that bad)',
        jp: 'さえ・すら',
        tagline: 'even the bare minimum — and it failed',
        ex: {
          kr: '인사<m>조차</m> 안 했어요.',
          rr: 'insajocha an haesseoyo',
          jp: '挨拶さえしませんでした。',
          jpRr: 'aisatsu sae shimasen deshita',
          en: 'He didn’t even say hello.',
        },
        whyHtml:
          'さえ/すら: the floor fell through. 조차 leans into negatives and bad news — nobody ' +
          'celebrates with 조차. What makes it sting is the implied baseline: a greeting is the ' +
          'least one does, and even that didn’t happen.',
      },
      {
        id: 'majeo',
        forms: '마저',
        rr: 'majeo',
        formRule: 'one shape — never changes',
        role: 'even the last one',
        jp: 'まで(も)',
        tagline: 'the final straw — the last remaining one, also gone',
        ex: {
          kr: '너<m>마저</m> 떠나면 어떡해.',
          rr: 'neomajeo tteonamyeon eotteokae',
          jp: '君までいなくなったらどうするんだ。',
          jpRr: 'kimi made inakunattara dō surun da',
          en: 'If even you leave, what do I do?',
        },
        whyHtml:
          'Loss with a sense of completion — Korean Caesar says 브루투스, 너마저? (Et tu, ' +
          'Brute?). The “even” triangle: <b>까지</b> neutral extreme · <b>조차</b> failed ' +
          'minimum · <b>마저</b> final straw. Japanese spreads まで・さえ・すら across the same ' +
          'ground, but the corners don’t align 1:1 — learn these three by temperament, not ' +
          'translation.',
      },
      {
        id: 'yamallo',
        forms: '(이)야말로',
        rr: 'iyamallo / yamallo',
        formRule: '받침 → 이야말로 · vowel → 야말로',
        role: 'precisely · the very one',
        jp: 'こそ',
        tagline: 'こそ in a suit — the very one, against all alternatives',
        ex: {
          kr: '저<m>야말로</m> 감사합니다.',
          rr: 'jeoyamallo gamsahamnida',
          jp: 'こちらこそありがとうございます。',
          jpRr: 'kochira koso arigatō gozaimasu',
          en: 'It’s I who should be thanking you.',
        },
        whyHtml:
          'こそ, nearly 1:1. The set-phrase reply is a free win: 저야말로 = こちらこそ. And the ' +
          'New Year’s register: 올해야말로 (olhaeyamallo) — 今年こそ — “<i>this</i> is the year.”',
      },
    ],
  },

  // -------------------------------------------------------------------
  // DRAWER VI — THE SOCIAL SET · the people in the room
  // -------------------------------------------------------------------
  {
    id: 'social',
    no: 'VI',
    name: 'The social set',
    kr: '사람',
    latin: '높임과 부름 · the bowing, calling, politeness particles',
    color: 'var(--accent-deep)',
    blurb:
      'Four particles that mark not grammar but the people in the room — who outranks whom, who ' +
      'may be called by bare name, who is listening. Japanese does all of this with verb ' +
      'morphology and never touches its particles; Korean bows even the particles.',
    entries: [
      {
        id: 'kkeseo',
        forms: '께서',
        rr: 'kkeseo',
        formRule: 'one shape · replaces 이/가 for honored subjects',
        role: 'subject, honored',
        jp: 'が + 尊敬語',
        tagline: '이/가 stands and bows — hardware Japanese does not have',
        ex: {
          kr: '할아버지<m>께서</m> 신문을 읽으세요.',
          rr: 'harabeojikkeseo sinmuneul ilgeuseyo',
          jp: 'おじいさんが新聞をお読みになります。',
          jpRr: 'ojīsan ga shinbun o oyomi ni narimasu',
          en: 'Grandfather is reading the paper.',
        },
        whyHtml:
          'When the subject outranks you, the subject particle itself defers: 께서. It travels ' +
          'with -시- on the verb (읽<b>으세</b>요) — particle and verb honoring the same person ' +
          'in stereo. Japanese keigo honors through the verb alone (お読みになる); a particle ' +
          'that bows is Korean-only machinery. The verb folio’s register dial is the other half ' +
          'of this card.',
      },
      {
        id: 'kke',
        forms: '께',
        rr: 'kke',
        formRule: 'one shape · replaces 에게/한테 for honored receivers',
        role: 'to (someone honored)',
        jp: 'に + 謙譲語',
        tagline: '에게/한테 in formal dress — and it recruits the humble verbs',
        ex: {
          kr: '선생님<m>께</m> 여쭤봤어요.',
          rr: 'seonsaengnimkke yeojjwobwasseoyo',
          jp: '先生に伺いました。',
          jpRr: 'sensei ni ukagaimashita',
          en: 'I asked the teacher (humbly).',
        },
        whyHtml:
          'The honored receiver. It calls in the humble verbs the way 伺う/差し上げる work: ' +
          '주다 → <b>드리다</b> (差し上げる), 묻다 → <b>여쭙다</b> (伺う), 보다 → <b>뵙다</b> ' +
          '(お目にかかる). Your keigo frame — 尊敬 raises them, 謙譲 lowers you — runs here ' +
          'unmodified; Korean simply wires it into the particle layer too.',
      },
      {
        id: 'aya',
        forms: '아 / 야',
        rr: 'a / ya',
        formRule: '받침 → 아 · vowel → 야 · names only',
        role: 'hey, [name] — the call',
        jp: '— (呼びかけ)',
        tagline: 'a particle for calling someone — grammar Japanese does without',
        ex: {
          kr: '지민<m>아</m>, 밥 먹었어?',
          rr: 'jimina, bap meogeosseo',
          jp: 'ジミン、ご飯食べた？',
          jpRr: 'jimin, gohan tabeta?',
          en: 'Jimin — have you eaten?',
        },
        whyHtml:
          'The vocative. Strictly intimate: friends’ names, younger people, banmal company — ' +
          'calling a superior with 아/야 is unthinkable. The gate logic fits the call: closed ' +
          'name + 아 (지민아!), open name + 야 (수아야!). Japanese has no equivalent particle — ' +
          'calling there is bare name plus register; Korean gives the call itself a grammar.',
        note: {
          head: 'names grow a syllable',
          html: 'Casual speech also pads closed-syllable names with 이 before case particles: ' +
                '지민<b>이</b>가 왔어 (jiminiga wasseo) — “Jimin came.” Not a vocative — just the ' +
                'name wearing a buffer.',
        },
      },
      {
        id: 'yo',
        forms: '요',
        rr: 'yo',
        formRule: 'after a consonant, often 이요 (밥이요)',
        role: 'politeness, clip-on',
        jp: 'です (fragment)',
        tagline: 'politeness as a detachable badge — pin it to anything',
        ex: {
          kr: '저<m>요</m>?',
          rr: 'jeoyo',
          jp: '私ですか。',
          jpRr: 'watashi desu ka',
          en: 'Me?',
        },
        whyHtml:
          'The reason 해요체 is called 해요체: 요 is officially a particle (보조사), and it clips ' +
          'politeness onto <i>anything</i> — a verb (가요), a fragment (저요? 진짜요?), an adverb ' +
          '(빨리요!), even another particle (어디서요?). Japanese politeness is welded into the ' +
          'verb machinery; Korean politeness is a badge. One particle, the entire everyday-polite ' +
          'register.',
      },
    ],
  },
]

// ---------------------------------------------------------------------
// SPOTLIGHT — 에 vs 에서 (the に/で border, redrawn)
// ---------------------------------------------------------------------
export const E_ESEO = {
  e: {
    particle: '에',
    name: 'e · the pin',
    sentence: { kr: '고양이가 집<span class="mark">에</span> 있어요', rr: 'goyangiga jibe isseoyo' },
    jp: { kr: '猫が家にいます', rr: 'neko ga ie ni imasu' },
    question: 'answers: “where is it? where to?”',
    enHtml:
      'Where something <b>is</b>, or where it’s headed — the map-pin particle. Existence ' +
      '(있다/없다) and motion toward (가다/오다) both pin with 에. Your に, nearly untouched.',
  },
  eseo: {
    particle: '에서',
    name: 'eseo · the stage',
    sentence: { kr: '고양이가 집<span class="mark">에서</span> 놀아요', rr: 'goyangiga jibeseo norayo' },
    jp: { kr: '猫が家で遊びます', rr: 'neko ga ie de asobimasu' },
    question: 'answers: “where does it happen?”',
    enHtml:
      'Where an action <b>unfolds</b> — the stage particle. If the verb does something (play, ' +
      'work, eat, study, meet), the venue takes 에서. Your で, redeployed.',
  },
  rule:
    'Same cat, same house — the particle splits <b>being</b> from <b>doing</b>. 있어요 needs the ' +
    'pin (에); 놀아요 needs the stage (에서). This is precisely the に/で border you already ' +
    'patrol in Japanese; the instinct transfers whole.',
  traps: [
    {
      head: 'one trap: 살다',
      body: '“To live” rides both: 서울<b>에</b> 살아요 and 서울<b>에서</b> 살아요 are both fine — ' +
            'where Japanese 住む allows only に. When in doubt with 살다, either door opens.',
    },
    {
      head: 'the second coat',
      body: '에서 moonlights as “from”: 부산<b>에서</b> 왔어요 = 釜山から来ました. で and から ' +
            'share one Korean coat — and the from-jobs split three ways: place → 에서, time → ' +
            '부터, person → 한테서.',
    },
  ],
}

// ---------------------------------------------------------------------
// THE STACK — particle compounding (조사 결합)
// Two castes: holders (adverbial particles — delimiters stack after)
// and yielders (case particles 이/가·을/를 — delimiters replace them).
// ---------------------------------------------------------------------
export const STACK_DELIMS = [
  { id: 'none', kr: '—', rr: '', jp: '—', label: 'bare' },
  { id: 'neun', kr: '는', rr: 'neun', jp: 'は', label: 'topic · contrast' },
  { id: 'do',   kr: '도', rr: 'do',   jp: 'も', label: 'also' },
  { id: 'man',  kr: '만', rr: 'man',  jp: 'だけ', label: 'only' },
]

export const STACK_BASES = [
  {
    id: 'hakgyoe',
    noun: { kr: '학교', rr: 'hakgyo', jp: '学校' },
    base: { kr: '에', rr: 'e', jp: 'に', kind: 'holder', tag: 'place · holds' },
    gloss: 'to school',
    combos: {
      none: { kr: '학교<m>에</m> 가요.', rr: 'hakgyoe gayo', jp: '学校に行きます。', jpRr: 'gakkō ni ikimasu', en: 'I go to school.' },
      neun: { kr: '학교<m>에는</m> 가요.', rr: 'hakgyoeneun gayo', jp: '学校には行きます。', jpRr: 'gakkō ni wa ikimasu', en: 'To school, at least, I do go.' },
      do:   { kr: '학교<m>에도</m> 가요.', rr: 'hakgyoedo gayo', jp: '学校にも行きます。', jpRr: 'gakkō ni mo ikimasu', en: 'I go to school too (among other places).' },
      man:  { kr: '학교<m>에만</m> 가요.', rr: 'hakgyoeman gayo', jp: '学校にだけ行きます。', jpRr: 'gakkō ni dake ikimasu', en: 'School is the only place I go.' },
    },
  },
  {
    id: 'doseogwaneseo',
    noun: { kr: '도서관', rr: 'doseogwan', jp: '図書館' },
    base: { kr: '에서', rr: 'eseo', jp: 'で', kind: 'holder', tag: 'venue · holds' },
    gloss: 'at the library',
    combos: {
      none: { kr: '도서관<m>에서</m> 공부해요.', rr: 'doseogwaneseo gongbuhaeyo', jp: '図書館で勉強します。', jpRr: 'toshokan de benkyō shimasu', en: 'I study at the library.' },
      neun: { kr: '도서관<m>에서는</m> 공부해요.', rr: 'doseogwaneseoneun gongbuhaeyo', jp: '図書館では勉強します。', jpRr: 'toshokan de wa benkyō shimasu', en: 'At the library, I do study (elsewhere — no promises).' },
      do:   { kr: '도서관<m>에서도</m> 공부해요.', rr: 'doseogwaneseodo gongbuhaeyo', jp: '図書館でも勉強します。', jpRr: 'toshokan de mo benkyō shimasu', en: 'I study at the library too.' },
      man:  { kr: '도서관<m>에서만</m> 공부해요.', rr: 'doseogwaneseoman gongbuhaeyo', jp: '図書館でだけ勉強します。', jpRr: 'toshokan de dake benkyō shimasu', en: 'I study only at the library.' },
    },
  },
  {
    id: 'chinguhante',
    noun: { kr: '친구', rr: 'chingu', jp: '友達' },
    base: { kr: '한테', rr: 'hante', jp: 'に', kind: 'holder', tag: 'person · holds' },
    gloss: 'to my friend',
    combos: {
      none: { kr: '친구<m>한테</m> 말했어요.', rr: 'chinguhante malhaesseoyo', jp: '友達に話しました。', jpRr: 'tomodachi ni hanashimashita', en: 'I told my friend.' },
      neun: { kr: '친구<m>한테는</m> 말했어요.', rr: 'chinguhanteneun malhaesseoyo', jp: '友達には話しました。', jpRr: 'tomodachi ni wa hanashimashita', en: 'My friend I did tell (the others — not yet).' },
      do:   { kr: '친구<m>한테도</m> 말했어요.', rr: 'chinguhantedo malhaesseoyo', jp: '友達にも話しました。', jpRr: 'tomodachi ni mo hanashimashita', en: 'I told my friend too.' },
      man:  { kr: '친구<m>한테만</m> 말했어요.', rr: 'chinguhanteman malhaesseoyo', jp: '友達にだけ話しました。', jpRr: 'tomodachi ni dake hanashimashita', en: 'I told only my friend.' },
    },
  },
  {
    id: 'keopireul',
    noun: { kr: '커피', rr: 'keopi', jp: 'コーヒー' },
    base: { kr: '를', rr: 'reul', jp: 'を', kind: 'case', tag: 'object · yields' },
    gloss: 'coffee (object)',
    combos: {
      none: { kr: '커피<m>를</m> 마셔요.', rr: 'keopireul masyeoyo', jp: 'コーヒーを飲みます。', jpRr: 'kōhī o nomimasu', en: 'I drink coffee.' },
      neun: { kr: '커피<m>는</m> 마셔요.', rr: 'keopineun masyeoyo', jp: 'コーヒーは飲みます。', jpRr: 'kōhī wa nomimasu', en: 'Coffee I do drink (tea, not so much).' },
      do:   { kr: '커피<m>도</m> 마셔요.', rr: 'keopido masyeoyo', jp: 'コーヒーも飲みます。', jpRr: 'kōhī mo nomimasu', en: 'I drink coffee too.' },
      man:  { kr: '커피<m>만</m> 마셔요.', rr: 'keopiman masyeoyo', jp: 'コーヒーだけ飲みます。', jpRr: 'kōhī dake nomimasu', en: 'Coffee is all I drink.' },
    },
  },
  {
    id: 'biga',
    noun: { kr: '비', rr: 'bi', jp: '雨' },
    base: { kr: '가', rr: 'ga', jp: 'が', kind: 'case', tag: 'subject · yields' },
    gloss: 'rain (subject)',
    combos: {
      none: { kr: '비<m>가</m> 와요.', rr: 'biga wayo', jp: '雨が降っています。', jpRr: 'ame ga futte imasu', en: 'It’s raining.' },
      neun: { kr: '비<m>는</m> 와요.', rr: 'bineun wayo', jp: '雨は降っています。', jpRr: 'ame wa futte imasu', en: 'Rain, at least, is falling (the snow held off).' },
      do:   { kr: '비<m>도</m> 와요.', rr: 'bido wayo', jp: '雨も降っています。', jpRr: 'ame mo futte imasu', en: 'Now it’s raining too (on top of everything).' },
      man:  { kr: '비<m>만</m> 와요.', rr: 'biman wayo', jp: '雨だけ降っています。', jpRr: 'ame dake futte imasu', en: 'Nothing but rain is falling.' },
    },
  },
]

export const STACK_EUREKAS = {
  yield: {
    head: '격조사 yields — the を-rule, redeployed',
    body: 'The case particle stepped out the moment the delimiter arrived: 커피를 + 는 → ' +
          '<b>커피는</b>, never ✗커피를는. You have obeyed this rule for years — 雨が + も → ' +
          '雨も, never ✗がも. Case yields to focus, in both languages.',
  },
  castes: {
    head: 'two castes — the same two as Japanese',
    body: 'Place-and-direction particles <b>hold</b> and let the delimiter dock after: 에 + 는 → ' +
          '<b>에는</b>, exactly には. Case particles <b>vanish</b> instead. One rule governs every ' +
          'combination you will ever meet — 에서도, 한테만, 까지는, 께서도 — <b>adverbials ' +
          'stack, cases yield</b>.',
  },
}

// ready-made stacks worth owning as words
export const STACK_CATALOGUE = [
  { kr: '에는 → 엔', rr: 'eneun → en', jp: 'には', en: 'to/at, as topic' },
  { kr: '에도', rr: 'edo', jp: 'にも', en: 'also to/at' },
  { kr: '에서는 → 에선', rr: 'eseoneun → eseon', jp: 'では', en: 'at (doing), as topic' },
  { kr: '에서도', rr: 'eseodo', jp: 'でも', en: 'also at (doing)' },
  { kr: '한테는', rr: 'hanteneun', jp: '(人)には', en: 'to him/her, as topic' },
  { kr: '한테만', rr: 'hanteman', jp: 'にだけ', en: 'only to' },
  { kr: '부터는', rr: 'buteoneun', jp: 'からは', en: 'from then on' },
  { kr: '까지는', rr: 'kkajineun', jp: 'までは', en: 'up to that point, at least' },
  { kr: '까지만', rr: 'kkajiman', jp: 'までで', en: 'only up to — 오늘까지만, “just until today”' },
  { kr: '보다는', rr: 'bodaneun', jp: 'よりは', en: 'rather than' },
  { kr: '와는 / 과는', rr: 'waneun / gwaneun', jp: 'とは', en: 'with X, as topic' },
  { kr: '만이', rr: 'mani', jp: 'だけが', en: 'only X — subject kept' },
  { kr: '만을', rr: 'maneul', jp: 'だけを', en: 'only X — object kept' },
  { kr: '께서는', rr: 'kkeseoneun', jp: 'は (敬)', en: 'honored subject, as topic' },
]

export const STACK_FOOTNOTES = [
  {
    head: 'one slot only',
    html: '은/는, 도, 만 compete for the same final slot — pick one. ✗도는, ✗는만 — for the same ' +
          'reason Japanese forbids ✗もは. The slot is the comment the sentence makes about the ' +
          'noun, and a noun gets one comment.',
  },
  {
    head: '만 outranks the case',
    html: 'The one delimiter that can keep case particles <i>after</i> it: 너<b>만이</b> = ' +
          '君<b>だけが</b>, 너<b>만을</b> = 君<b>だけを</b>. Both languages carve out the same ' +
          'single exception — だけ tolerates が/を behind it, 만 tolerates 이/을. Symmetry this ' +
          'deep is typology, not coincidence.',
  },
  {
    head: 'the spoken squeeze',
    html: 'High-traffic stacks contract: 에는 → <b>엔</b>, 에서는 → <b>에선</b>; and bare 는/를 ' +
          'squeeze onto pronouns — 나는 → <b>난</b>, 나를 → <b>날</b>, 저는 → <b>전</b>, 너를 → ' +
          '<b>널</b>, 이것은 → <b>이건</b>. Korean’s では → じゃ. Subtitles are full of these; ' +
          'the cabinet explains them.',
  },
]
