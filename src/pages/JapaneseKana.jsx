import React, { useState } from 'react'
import KanaGrid from '../components/japanese/KanaGrid.jsx'
import ScriptDrill from '../components/scripts/ScriptDrill.jsx'
import Transliterator from '../components/scripts/Transliterator.jsx'
import useScriptStore from '../components/scripts/useScriptStore.js'
import { kanaGlyphs, kanaGroups, kanaKeyboard, KATAKANA_WORDS } from '../data/japaneseKana.js'
import { speechSupported, hasVoice } from '../components/scripts/speech.js'

function KanaColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 仮名 ⟡</div>
      The Polyglot's Atlas · Japanese folio · the kana foundry<br />
      drawn in the Aburaya hand · five vowels, one grid — and a keyboard you never switch
    </div>
  )
}

export default function JapaneseKana() {
  const store = useScriptStore('ja')
  const [drillScript, setDrillScript] = useState('hiragana')
  const noVoice = !(speechSupported() && hasVoice('ja'))

  return (
    <div className="page" data-screen-label="Japanese — Kana">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num">か</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph">仮名</span>
            The kana foundry
          </h1>
          <div className="latin">
            officina syllabarum · the 五十音 <span style={{ fontStyle: 'normal' }}>(gojūon)</span> —
            ひらがな &amp; カタカナ, heard and made by hand
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            tap · drill · spell
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Kana looks like a hundred shapes to memorize. It isn’t — it’s a{' '}
        <span className="accent">grid</span>: five vowels (あ い う え お) across, a handful of
        consonants down, and almost every kana sits at one (consonant × vowel) crossing. Learn the
        five columns and the ten rows and the table fills itself in. The two scripts —{' '}
        <span className="accent">ひらがな</span> for native words, <span className="accent">カタカナ</span> for
        the borrowed ones — share that one skeleton.
      </p>
      <p className="gram-sub">
        Three instruments: the grid to <i>see</i> the system and hear each sound, the drill to make
        the shapes reflexive, and the transliteration bench — where English loanwords cross into
        カタカナ and back, and you type Japanese with no keyboard switch at all.
        {noVoice && (
          <span style={{ display: 'block', marginTop: 8, color: 'var(--ink-faded)', fontSize: '0.86rem' }}>
            (No Japanese system voice detected — the sound will stay quiet until you install a 日本語
            voice in your OS. Everything else works.)
          </span>
        )}
      </p>

      {/* INSTRUMENT I — the gojūon grid */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The gojūon grid</h2>
        <div className="latin">五十音 · the table as a machine — consonant × vowel</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap a kana to hear it and see its twin · switch ひらがな/カタカナ · open the 濁音 &amp; 拗音 drawers
      </div>
      <KanaGrid lang="ja-JP" />

      {/* INSTRUMENT II — the drill */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">II</div>
        <h2>The drill</h2>
        <div className="latin">稽古 · recognition until it’s reflex — the lamps fill as you learn</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a script and a mode (glyph→sound, sound→glyph, hear→glyph) · keep the streak alive · scope to 基本/濁音/拗音
      </div>
      <div className="drill-script-seg" role="tablist" aria-label="drill script">
        <button role="tab" aria-selected={drillScript === 'hiragana'} className={'kg-segbtn' + (drillScript === 'hiragana' ? ' active' : '')} onClick={() => setDrillScript('hiragana')} lang="ja-JP">ひらがな</button>
        <button role="tab" aria-selected={drillScript === 'katakana'} className={'kg-segbtn' + (drillScript === 'katakana' ? ' active' : '')} onClick={() => setDrillScript('katakana')} lang="ja-JP">カタカナ</button>
      </div>
      <ScriptDrill
        key={drillScript}
        lang="ja-JP"
        glyphs={kanaGlyphs(drillScript)}
        groups={kanaGroups(drillScript)}
        defaultScope="base"
        store={store}
      />

      {/* INSTRUMENT III — the transliteration bench */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">III</div>
        <h2>The transliteration bench</h2>
        <div className="latin">外来語 · loanwords across the border — and why they bend</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> spell English words in カタカナ (type romaji — long vowel is “-”, or tap the pad) · or read them back to English
      </div>
      <Transliterator
        lang="ja-JP"
        script="katakana"
        words={KATAKANA_WORDS}
        keyboard={kanaKeyboard('katakana')}
        padLabel="カタカナ"
        store={store}
      />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>One grid, two hands</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              The whole of kana is the gojūon plus three small rules: the ten-ten ( ゛) that voices a
              series, the maru ( ゜) that turns は into ぱ, and the small ゃゅょ that glide an i-row kana
              into one mora. Past those, the only real labor is カタカナ’s job — wearing foreign words —
              which is exactly why it bends them: every consonant gets a vowel, long sounds stretch to
              ー, and a stray stop clips to a small っ.
            </p>
            <p>
              The same problem has the same shape in Korean — loanwords broken to fit a syllabary-like
              block, an echo vowel where a consonant can’t stand alone (Korean reaches for ㅡ where
              Japanese reaches for ウ). The <b>한글</b> folio runs this identical bench on hangul, so the
              two scripts teach each other: 커피 and コーヒー are the same coffee, adapted by two grammars.
            </p>
            <blockquote>
              Don’t memorize a hundred kana. Learn five vowels, ten consonants, and three diacritic
              rules — then spend them on real words until the shapes answer before the romaji does.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">stroke order</span>
              The grid teaches the shape and the sound; writing them is the next instrument — an
              animated 書き順 trace so the hand learns the kana too, not just the eye.
            </div>
            <div className="note">
              <span className="date">the look-alikes</span>
              シ/ツ, ソ/ン, は/ほ, ね/れ/わ — a focused drill on just the confusable pairs, where most
              early errors actually live.
            </div>
            <div className="note">
              <span className="date">한글 · the sibling</span>
              The Korean script folio shares the drill and the transliteration bench — and adds a block
              builder, since hangul’s genius is that you assemble each syllable yourself.
            </div>
          </aside>
        </div>
      </section>

      <KanaColophon />
    </div>
  )
}
