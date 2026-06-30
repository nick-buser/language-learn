import React from 'react'
import ConsonantArticulators from '../components/korean/ConsonantArticulators.jsx'
import VowelCompass from '../components/korean/VowelCompass.jsx'
import { speechSupported, hasVoice } from '../components/scripts/speech.js'

function PhoneticsColophon() {
  return (
    <div className="colophon">
      <div className="ornament">⟡ 소리 ⟡</div>
      The Polyglot's Atlas · Korean folio · sound &amp; shape<br />
      drawn in the Aburaya hand · the only script that draws its own mouth
    </div>
  )
}

export default function KoreanPhonetics({ showReadings = true, showJp = true }) {
  const noVoice = !(speechSupported() && hasVoice('ko'))

  return (
    <div className="page" data-screen-label="Korean — Phonetics">

      {/* Masthead */}
      <header className="folio-mast">
        <div className="folio-num kr">소리</div>
        <div className="folio-title-block">
          <h1>
            <span className="glyph kr">소리</span>
            Sound &amp; shape
          </h1>
          <div className="latin">
            phonetica · 발음 <span style={{ fontStyle: 'normal' }}>(bareum)</span> — the script that is a
            diagram of the mouth
          </div>
        </div>
        <div className="stamp-block">
          <div className="stamp double">Working Instrument</div>
          <div className="smallcaps" style={{ marginTop: 10 }}>
            articulate · plot
          </div>
        </div>
      </header>

      {/* Lede */}
      <p className="gram-lede">
        Every other alphabet is a code: the letter <i>b</i> looks nothing like a closing pair of lips.
        Hangul is the rare <span className="accent">featural</span> script — its inventors, in 1446, drew
        the letters as <span className="accent">pictures of the speech organs</span>. ㄱ is the back of the
        tongue blocking the throat; ㅁ is the mouth; ㅅ is a tooth. Add a stroke and you add a breath
        (ㄱ→ㅋ). The vowels run on a different but equally deliberate logic — a dot of Heaven on the lines
        of Earth and Human. These two instruments lay the shapes over the real mouth so you can{' '}
        <span className="accent">see the sound in the letter</span> — and meet the few places the design
        bends.
      </p>
      <p className="gram-sub">
        {showJp ? (
          <>
            The <b style={{ fontStyle: 'normal', color: 'var(--accent)', fontWeight: 500 }}>仮名 bridge</b>:
            kana is <i>arabic-numeral arbitrary</i> — か carries no trace of how [ka] is made — and Japanese
            gives you only one <i>k</i> and five clean vowels. Korean asks for two new dimensions your ear
            hasn’t had to split: a <b style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 500 }}>three-way</b>{' '}
            plain/aspirate/tense on every stop (ㄱ·ㅋ·ㄲ), and the vowels Japanese folds into one —
            ㅓ vs ㅗ, ㅡ vs ㅜ. The good news: hangul <i>tells you</i> the articulation, where kana never could.
          </>
        ) : (
          <>Two instruments: the consonant articulators — the letters as a map of the mouth, lit on a
            side-view diagram — and the vowel compass, the real IPA trapezoid laid under the ·/ㅡ/ㅣ geometry.</>
        )}
        {noVoice && (
          <span style={{ display: 'block', marginTop: 8, color: 'var(--ink-faded)', fontSize: '0.86rem' }}>
            (No Korean system voice detected — sound stays quiet until you install a 한국어 voice in your
            OS. The shapes, IPA, and diagrams all work.)
          </span>
        )}
      </p>

      {/* INSTRUMENT I — the consonant articulators */}
      <div className="instr-head">
        <div className="no">I</div>
        <h2>The articulators</h2>
        <div className="latin">자음 · the consonant as a picture of the organ that makes it</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap a letter — its place lights on the side-view mouth · read a row as one organ, a column as one more breath · the ✦ letters are where the shape-rule bends
      </div>
      <ConsonantArticulators showReadings={showReadings} />

      {/* INSTRUMENT II — the vowel compass */}
      <div className="instr-head" style={{ marginTop: 56 }}>
        <div className="no">II</div>
        <h2>The vowel compass</h2>
        <div className="latin">모음 · the IPA trapezoid under the dot-and-line geometry — and your own voice on it</div>
      </div>
      <div className="try-strip">
        <span className="dot"></span> tap a vowel on the real mouth-space, then read its letter built from ·/ㅡ/ㅣ · the dot’s side is vowel harmony, not tongue height · doubled dot = +y, added ㅣ = the front vowels, stacked pair = +w · switch to 발성 to speak your own vowel onto the trapezoid (calibrate to your voice first)
      </div>
      <VowelCompass showReadings={showReadings} />

      {/* Closing marginalia */}
      <section className="plate" style={{ marginTop: 64 }}>
        <div className="plate-header">
          <div className="plate-no">coda</div>
          <h2>Designed, and honest about it</h2>
          <div className="latin">nota in margine · the field note</div>
        </div>
        <div className="plate-two">
          <div className="plate-prose">
            <p className="lead">
              The consonants are an anatomy chart: five organs, five base letters, and a rule — a stronger,
              breathier sound earns one more stroke at the <em>same</em> place. That single principle gives
              you ㄱ→ㅋ, ㄷ→ㅌ, ㅂ→ㅍ, ㅈ→ㅊ for free. The vowels are a cosmology — a dot of Heaven placed
              above or below the line of Earth, left or right of the line of Human — and the side it falls on
              is <b>음양</b>, the bright/dark split that <em>is</em> Korean vowel harmony, the very engine of
              the verb forge’s 아/어 fork.
            </p>
            <p>
              What makes this instrument trustworthy is where it says <em>no</em>. The dot is not a tongue:
              ㅏ/ㅓ/ㅗ/ㅜ don’t chart tongue height the way the IPA trapezoid does, so both views sit here at
              once. And the consonant ladder has its renegades — <b>ㄹ</b> is drawn off the system (an
              이체자), the <b>tense</b> letters double instead of adding a stroke, and initial <b>ㅇ</b> is a
              silent seat with no sound to picture. A featural script you can poke until it admits its own
              exceptions is more convincing than one you take on faith.
            </p>
            {showJp && (
              <p>
                For the 仮名 reader, two muscles are new. Aspiration/tension is a <em>three-way</em> contrast
                Japanese doesn’t carry — 불 (fire) / 풀 (grass) / 뿔 (horn) are three different words on the
                same lips. And the back vowels split where Japanese has one: train the ㅓ/ㅗ and ㅡ/ㅜ pairs on
                the compass until the trapezoid distance feels like a real distance in the mouth.
              </p>
            )}
            <blockquote>
              Don’t memorize the letters as shapes — read each one as an instruction for the mouth. The script
              was built to be read that way; this folio just turns the instruction back on.
            </blockquote>
          </div>
          <aside className="marginalia">
            <h4>For the next plate</h4>
            <div className="note">
              <span className="date">minimal pairs, heard</span>
              불/풀/뿔, 달/탈, 자다/차다 — a drill that puts the plain/aspirate/tense triplets side by side and
              asks the ear to choose, where the real beginner errors live.
            </div>
            <div className="note">
              <span className="date">the seven-sounds 받침</span>
              Final consonants collapse to seven sounds — already felt in the <a href="#/ko/hangul">hangul
              forge</a>; a phonetics plate would animate the neutralization and the liaison/assimilation it
              seeds (책이 → <i>chae-gi</i>).
            </div>
            <div className="note">
              <span className="date">仮名 · the vowel mirror</span>
              Japanese’s five-vowel trapezoid laid over Korean’s ten — which Korean vowels a Japanese ear must
              newly split, and which arrive for free.
            </div>
          </aside>
        </div>
      </section>

      <PhoneticsColophon />
    </div>
  )
}
