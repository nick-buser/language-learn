import React from 'react'
import HangulBuilder from '../components/korean/HangulBuilder.jsx'
import ScriptDrill from '../components/scripts/ScriptDrill.jsx'
import Transliterator from '../components/scripts/Transliterator.jsx'
import useScriptStore from '../components/scripts/useScriptStore.js'
import { hangulGlyphs, hangulGroups, hangulKeyboard, KOREAN_WORDS } from '../data/koreanHangul.js'
import { speechSupported, hasVoice } from '../components/scripts/speech.js'

function HangulColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 한글 ⟡</div>
      The Polyglot's Atlas · Korean folio · the hangul forge<br />
      drawn in the Aburaya hand · a syllable you assemble — and a keyboard you never switch
    </div>
  )
}

export default function KoreanHangul({ showJp = true }) {
  const store = useScriptStore('ko')
  const noVoice = !(speechSupported() && hasVoice('ko'))

  return (
    <div className="page" data-screen-label="Korean — Hangul">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num kr">글</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">한글</span>
            The hangul forge
          </h1>
          <div className="latin">
            officina syllabarum · 자모 <span style={{ fontStyle: 'normal' }}>(jamo)</span> into the
            block — the alphabet you can learn in a morning
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            stack · drill · spell
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Hangul is the script that was <span className="accent">designed</span>, and it shows: 19
        consonants and 21 vowels — the <span className="kr">자모</span> (jamo) — and a single rule for
        packing them. You don’t read hangul letter-by-letter in a line; you read it in{' '}
        <span className="accent">syllable blocks</span>, each one a 초성 (initial) over or beside a
        중성 (medial), optionally closed by a 받침 (final). 한 = ㅎ + ㅏ + ㄴ. Learn forty shapes and a
        stacking rule and you can sound out anything.
      </p>
      <p className="gram-sub">
        {showJp ? (
          <>
            The <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>仮名 bridge</b>:
            kana gives you ~100 whole syllables to <i>memorize</i> (か is just か). Hangul gives you ~40
            <i> parts</i> to <i>assemble</i> — 가 is ㄱ + ㅏ, and every other ㄱ-syllable reuses that same ㄱ.
            That’s the trade, and it’s why hangul reads faster once the parts are in hand. The builder
            below is where you feel it.
          </>
        ) : (
          <>Three instruments: the builder to <i>assemble</i> blocks and hear them, the drill to make the
            jamo reflexive, and the transliteration bench where English loanwords cross into 한글 and back.</>
        )}
        {noVoice && (
          <span style={{ display: 'block', marginTop: 8, color: 'var(--ink-faded)', fontSize: '0.86rem' }}>
            (No Korean system voice detected — sound stays quiet until you install a 한국어 voice in your
            OS. Everything else works.)
          </span>
        )}
      </p>

      {/* INSTRUMENT I — the block builder */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The block builder</h2>
        <div className="latin">초성 · 중성 · 받침 — assemble the syllable, the script’s whole idea</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick an initial, a medial, a final — watch the block compose and hear it · try a ㅅ/ㅈ/ㅌ 받침 and meet the seven-sounds rule
      </div>
      <HangulBuilder lang="ko-KR" />

      {/* INSTRUMENT II — the drill */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">II</div>
        <h2>The drill</h2>
        <div className="latin">연습 · the jamo until they’re reflex — the lamps fill as you learn</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a mode (jamo→sound, sound→jamo, hear→jamo) · keep the streak alive · scope to 자음/모음, plain or the aspirate/tense rows
      </div>
      <ScriptDrill
        lang="ko-KR"
        glyphs={hangulGlyphs()}
        groups={hangulGroups()}
        defaultScope="cons-plain"
        store={store}
      />

      {/* INSTRUMENT III — the transliteration bench */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">III</div>
        <h2>The transliteration bench</h2>
        <div className="latin">외래어 · loanwords across the border — and why they bend</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> spell English words in 한글 (type RR-style romaja — g=ㄱ, k=ㅋ, ng=받침 ㅇ — or tap the 자모 pad) · or read them back to English
      </div>
      <Transliterator
        lang="ko-KR"
        script="hangul"
        words={KOREAN_WORDS}
        keyboard={hangulKeyboard()}
        padLabel="자모"
        store={store}
      />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>Parts, not shapes</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              The labor of hangul is front-loaded and small: the forty jamo, the stacking rule, and the
              one twist that trips everyone — the 받침. A final consonant doesn’t keep its full sound;
              every possible 받침 collapses to just <b>seven</b> (ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅇ), so ㅅ, ㅈ, ㅊ, ㅌ
              all close a block as a bare [t]. That neutralization is the seed of every sound-change
              downstream — liaison (책이 → <i>chae-gi</i>), nasalization, tensing.
            </p>
            {showJp && (
              <p>
                Set it beside Japanese and the contrast is clean. カタカナ and 한글 do the <em>same job</em>
                on loanwords — break the clusters, give every consonant a vowel — but reach for different
                crutches: Japanese pads with ウ (ミルク), Korean with the neutral ㅡ (밀크-style 크). コーヒー
                and 커피 are the same coffee, bent by two grammars. And where kana is a closed list to
                memorize, hangul is a generative system: the bench here rewards <em>assembling</em>, not
                recalling.
              </p>
            )}
            <blockquote>
              Don’t memorize syllables — learn the forty parts and the stacking rule, then build until a
              block resolves to sound the instant you see it. The 받침 is the whole difficulty; meet it
              early.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">the look-alikes</span>
              ㅓ/ㅏ, ㅗ/ㅛ, ㅜ/ㅠ, ㄱ/ㅋ, ㅁ/ㅇ — a focused drill on just the confusable jamo, where the
              early errors actually live.
            </div>
            <div className="note">
              <span className="date">liaison, heard</span>
              The 받침 that re-attaches across a word boundary (책이 → 채기) — a small instrument that
              animates the consonant migrating, linking back to the grammar folio’s gate.
            </div>
            <div className="note">
              <span className="date">仮名 · the sibling</span>
              The Japanese script folio runs the same drill and bench on kana — and the two transliteration
              benches are mirrors: ウ-padding vs ㅡ-padding, the same loanwords adapted twice.
            </div>
          </aside>
        </div>
      </section>

      <HangulColophon />
    </div>
  )
}
