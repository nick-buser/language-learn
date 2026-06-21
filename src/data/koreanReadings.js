// =====================================================================
// The Polyglot's Atlas — Korean readings (다독 · extensive reading)
//
// A Reading is a passage the learner imports (or, later, the generator
// produces) to read at high known-word coverage. The text is the only thing
// authored here; morphology comes from POST /v1/reading/analyze (Kiwi) and the
// coverage join happens against the live vocab state — so a Reading carries no
// linguistic annotations of its own, just the raw passage.
//
// This shape is the localStorage pilot payload AND the contract for the future
// /v1/readings resource + Garage blob store (docs/vocabulary-plan.md phase 4).
//
// /**
//  * @typedef {Object} MorphToken — one morpheme from the analyzer (mirrors the
//  *   backend MorphToken: surface, lemma, pos, content, start, length)
//  *
//  * @typedef {Object} Reading
//  * @property {string} id                 stable id
//  * @property {string} title              the passage's title
//  * @property {string} text               the raw passage (hangul + punctuation)
//  * @property {?MorphToken[]} tokens       cached analysis (reopening skips the backend)
//  * @property {?number} coverageSnapshot   known-coverage at last analysis (0..1), informational
//  * @property {string} importedAt          ISO timestamp
//  */
// =====================================================================

// A couple of short, hand-checked beginner passages so the folio isn't empty on
// first visit. Plain present-tense 해요체; the kind of text the reading room is
// for. (Coverage against your bank will be honest — these aren't tuned to it.)
export const SAMPLE_READINGS = [
  {
    id: 'sample-haru',
    title: '내 하루 · my day',
    text:
      '저는 학생입니다. 아침에 학교에 가요. 학교에서 친구를 만나요. ' +
      '우리는 같이 밥을 먹어요. 점심을 먹고 도서관에서 공부해요. ' +
      '저녁에 집에 가요. 집에서 책을 읽어요. 그리고 일찍 자요.',
  },
  {
    id: 'sample-gajok',
    title: '우리 가족 · my family',
    text:
      '우리 가족은 네 명이에요. 아버지, 어머니, 형, 그리고 저예요. ' +
      '아버지는 회사에 다녀요. 어머니는 선생님이에요. 형은 대학생이에요. ' +
      '우리는 주말에 같이 시간을 보내요. 저는 우리 가족을 사랑해요.',
  },
]
