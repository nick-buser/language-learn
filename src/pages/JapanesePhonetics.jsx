import React from 'react'
import JapaneseMouthMap from '../components/japanese/JapaneseMouthMap.jsx'
import JapaneseVowelChart from '../components/japanese/JapaneseVowelChart.jsx'
import PitchRidge from '../components/japanese/PitchRidge.jsx'
import { speechSupported, hasVoice } from '../components/scripts/speech.js'

function PhoneticsColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 発音 ⟡</div>
      The Polyglot's Atlas · Japanese folio · sound &amp; pitch<br />
      drawn in the Aburaya hand · the sound the kana keeps to itself
    </div>
  )
}

export default function JapanesePhonetics({ showReadings = true, showJp = true }) {
  const noVoice = !(speechSupported() && hasVoice('ja'))

  return (
    <div className="page" data-screen-label="Japanese — Phonetics">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num jp">発音</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph jp">発音</span>
            Sound &amp; pitch
          </h1>
          <div className="latin">
            phonetica · 発音 <span style={{ fontStyle: 'normal' }}>(hatsuon)</span> — the sound the kana doesn’t write
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            articulate · plot · pitch
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Hangul draws the mouth; kana is the opposite — <span className="accent">の</span> carries no trace of how [no] is
        made. So this folio is the inversion of the Korean one: not “the script <i>is</i> the sound,” but{' '}
        <span className="accent">the sound the script keeps to itself</span>. Kana records the morae flawlessly and stays
        silent on three things — where each consonant is really made (し isn’t [si]), the true shape of the vowels
        (う isn’t rounded), and the <span className="accent">pitch</span> that tells 箸 from 橋 from 端. Three
        instruments coax each of those back into the open.
      </p>
      <p className="gram-sub">
        {showJp ? (
          <>
            The <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>한국어 bridge</b>: run
            against Korean, the contrasts swap sides. Japanese splits consonants by <b style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 500 }}>voice</b>{' '}
            (か/が) where Korean splits by <b style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 500 }}>breath</b> (ㄱ/ㅋ/ㄲ);
            Korean splits the back vowels (ㅡ/ㅜ, ㅗ/ㅓ) where Japanese hears one; and Japanese marks words by{' '}
            <b style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 500 }}>pitch</b> where Korean — having lost
            it — does not. Each instrument shows you its half of that trade.
          </>
        ) : (
          <>Three instruments: the gojūon mouth-map (the kana laid over a side-view mouth, with the ゛/゜ voicing
            ladder), the five-vowel compass (the real trapezoid, and the う that isn’t rounded), and the pitch ridge
            (the High/Low melody kana can’t write).</>
        )}
        {noVoice && (
          <span style={{ display: 'block', marginTop: 8, color: 'var(--ink-faded)', fontSize: '0.86rem' }}>
            (No Japanese system voice detected — sound stays quiet until you install a 日本語 voice in your OS. The pitch
            ridge still plays as synthesized tones, and every chart and diagram works.)
          </span>
        )}
      </p>

      {/* INSTRUMENT I — the mouth-map */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The gojūon mouth-map</h2>
        <div className="latin">子音 · the kana the shape won’t explain — read against the organ that makes it</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap a kana — its place lights on the side-view mouth · a row is one place, a column is the ゛/゜ voicing ladder · the ✦ cells are the allophones the row hides
      </div>
      <JapaneseMouthMap showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT II — the vowel compass */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">II</div>
        <h2>The five-vowel compass</h2>
        <div className="latin">母音 · five pure vowels on the real trapezoid — then what they do when they combine</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> switch between <b>the five</b>, their <b>combinations</b>, and <b>your voice</b> · in the five, tap a vowel (う is close-back but unrounded) and compare against Korean’s ten or Spanish’s near-identical five · in combinations, see whether a pair holds long (えい→ē) or stays two beats (あい) · in your voice, calibrate to your mouth and watch your own vowels land on the trapezoid live
      </div>
      <JapaneseVowelChart showReadings={showReadings} showJp={showJp} />

      {/* INSTRUMENT III — the pitch ridge */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">III</div>
        <h2>The pitch ridge</h2>
        <div className="latin">高低アクセント · the melody kana can’t write — 箸 / 橋 / 端 told apart by pitch</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> pick a word and play its ridge — the synth sounds the pitch, the voice says the word · the accent is where High drops to Low · watch 橋 vs 端 split only on the が · or tap <b>say it</b> and trace your own pitch over the target
      </div>
      <PitchRidge showReadings={showReadings} showJp={showJp} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>What a syllabary leaves out</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              Kana is a brilliant fit for Japanese — one glyph, one mora, almost no spelling to argue about. But that
              tidiness is exactly what hides the phonetics. The glyph か tells you the mora [ka] and nothing about the
              velum; the only place a kana’s <em>marks</em> track the sound is the dakuten (゛ = voice this) and the lone
              handakuten (゜ = the p-series). Everything else — the palatal jump in し/ち, the bilabial ふ, the unrounded
              う, the whole pitch melody — you simply have to be told.
            </p>
            <p>
              That is the honest mirror of the Korean folio. There the script <em>is</em> an anatomy chart and the
              instruments confirm it; here the script is deliberately mute and the instruments supply what it withholds.
              Same goal — to make the sound <em>felt</em> — reached from opposite ends.
            </p>
            {showJp && (
              <p>
                For the Korean learner the trades are worth memorizing as trades. You already <em>have</em> pitch-free
                words and a single back-high vowel; Korean asks you to add the ㄱ/ㅋ/ㄲ breath-ladder and to split ㅡ/ㅜ
                and ㅗ/ㅓ apart. Coming back the other way, a Korean speaker has to <em>grow</em> a pitch sense Seoul
                speech has shed. The compass and the ridge are where to drill each gap until the distance feels real.
              </p>
            )}
            <blockquote>
              Don’t trust the kana to teach you the sound — it was built to spell, not to pronounce. These instruments
              say out loud the part it leaves silent.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">the mora meter</span>
              Japanese is mora-timed: ん, っ, and ー each claim a full beat. An instrument that taps にっぽん as four
              equal beats (not three syllables) would make the rhythm — and the long/short minimal pairs — felt.
            </div>
            <div className="note">
              <span className="date">accent in the phrase</span>
              Pitch isn’t only lexical; whole phrases have a downstep contour. A plate that strings words into a phrase
              and traces the falling staircase would carry the ridge into real speech.
            </div>
            <div className="note">
              <span className="date">連濁 · sequential voicing</span>
              The dakuten as a live rule, not just a chart: ひと + ひと → ひとびと, why 山 in 富士山 voices and elsewhere
              doesn’t — the ゛ that appears when words compound.
            </div>
          </aside>
        </div>
      </section>

      <PhoneticsColophon />
    </div>
  )
}
