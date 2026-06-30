import React, { useEffect, useState } from 'react'
import JapaneseGrammar from './pages/JapaneseGrammar.jsx'
import KoreanHangul from './pages/KoreanHangul.jsx'
import KoreanPhonetics from './pages/KoreanPhonetics.jsx'
import KoreanGrammar from './pages/KoreanGrammar.jsx'
import KoreanDeixis from './pages/KoreanDeixis.jsx'
import KoreanVerbs from './pages/KoreanVerbs.jsx'
import KoreanForms from './pages/KoreanForms.jsx'
import KoreanParticles from './pages/KoreanParticles.jsx'
import KoreanCognates from './pages/KoreanCognates.jsx'
import KoreanVocab from './pages/KoreanVocab.jsx'
import KoreanReading from './pages/KoreanReading.jsx'
import KoreanSong from './pages/KoreanSong.jsx'
import KoreanCustom from './pages/KoreanCustom.jsx'
import KoreanRoadmap from './pages/KoreanRoadmap.jsx'
import KoreanQuizzes from './pages/KoreanQuizzes.jsx'
import JapaneseKana from './pages/JapaneseKana.jsx'
import JapanesePhonetics from './pages/JapanesePhonetics.jsx'
import JapaneseDeixis from './pages/JapaneseDeixis.jsx'
import JapaneseVerbs from './pages/JapaneseVerbs.jsx'
import JapaneseForms from './pages/JapaneseForms.jsx'
import JapaneseAdjectives from './pages/JapaneseAdjectives.jsx'
import JapaneseParticles from './pages/JapaneseParticles.jsx'
import JapaneseVocab from './pages/JapaneseVocab.jsx'
import JapaneseQuizzes from './pages/JapaneseQuizzes.jsx'
import './styles/base.css'
import './styles/aburaya.css'
import './styles/grammar.css'
import './styles/korean.css'
import './styles/japanese.css'
import './styles/jparticles.css'
import './styles/particles.css'
import './styles/cognates.css'
import './styles/roadmap.css'
import './styles/vocab.css'
import './styles/reading.css'
import './styles/song.css'
import './styles/scripts.css'
import './styles/deixis.css'
import './styles/phonetics.css'
import './styles/jphonetics.css'
import './styles/quiz.css'

// Two-level atlas: language → folio pages within it.
const LANGS = [
  {
    id: 'ko', glyph: '한국어', name: 'Korean', metaGlyph: '문법', font: 'var(--font-kr-serif)',
    pages: [
      { id: 'hangul',    glyph: '한글', label: 'hangul forge',     component: KoreanHangul },
      { id: 'phonetics', glyph: '소리', label: 'sound & shape',     component: KoreanPhonetics },
      { id: 'grammar',   glyph: '문법', label: 'grammar engine',   component: KoreanGrammar },
      { id: 'deixis',    glyph: '이그저', label: 'this · that · what', component: KoreanDeixis },
      { id: 'verbs',     glyph: '동사', label: 'verb forge',       component: KoreanVerbs },
      { id: 'forms',     glyph: '활용', label: 'constructions',    component: KoreanForms },
      { id: 'particles', glyph: '조사', label: 'particle cabinet', component: KoreanParticles },
      { id: 'quiz',      glyph: '단련', label: 'proving ground',   component: KoreanQuizzes },
      { id: 'cognates',  glyph: '한자어', label: 'cognate bridge',  component: KoreanCognates },
      { id: 'vocab',     glyph: '어휘', label: 'word bank',        component: KoreanVocab },
      { id: 'reading',   glyph: '다독', label: 'the reading room', component: KoreanReading },
      { id: 'song',      glyph: '노래', label: 'the song',         component: KoreanSong },
      { id: 'custom',    glyph: '자작', label: 'custom',           component: KoreanCustom },
      { id: 'roadmap',   glyph: '여정', label: 'fluency roadmap',  component: KoreanRoadmap },
    ],
  },
  {
    id: 'ja', glyph: '日本語', name: 'Japanese', metaGlyph: '文法', font: 'var(--font-cjk-serif)',
    pages: [
      { id: 'kana',      glyph: '仮名', label: 'kana foundry',     component: JapaneseKana },
      { id: 'phonetics', glyph: '発音', label: 'sound & pitch',    component: JapanesePhonetics },
      { id: 'grammar',   glyph: '文法', label: 'grammar engine',   component: JapaneseGrammar },
      { id: 'deixis',  glyph: 'こそあど', label: 'this · that · what', component: JapaneseDeixis },
      { id: 'verbs',      glyph: '動詞', label: 'verb forge',      component: JapaneseVerbs },
      { id: 'forms',      glyph: '活用', label: 'constructions',   component: JapaneseForms },
      { id: 'adjectives', glyph: '形容詞', label: 'adjectives',     component: JapaneseAdjectives },
      { id: 'particles',  glyph: '助詞', label: 'particle cabinet', component: JapaneseParticles },
      { id: 'quiz',       glyph: '鍛錬', label: 'proving ground',   component: JapaneseQuizzes },
      { id: 'vocab',      glyph: '語彙', label: 'word bank',        component: JapaneseVocab },
    ],
  },
]

const DEFAULT_ROUTE = 'ko/grammar'

function parseHash() {
  if (typeof window === 'undefined') return DEFAULT_ROUTE
  return window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '') || DEFAULT_ROUTE
}

export default function App() {
  const [route, setRoute] = useState(parseHash)
  const [showReadings, setShowReadings] = useState(true)
  const [showJp, setShowJp] = useState(true)
  // Night is home; Daylight is the counterpart (data-theme="day" in aburaya.css).
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'night'
    try { return window.localStorage.getItem('atlas-theme') === 'day' ? 'day' : 'night' }
    catch { return 'night' }
  })

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [route])

  // Drive the daylight skin off the document root, where the [data-theme="day"]
  // token overrides AND the .atlas-shell grain/foxing day-variants both key off.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (theme === 'day') root.setAttribute('data-theme', 'day')
    else root.removeAttribute('data-theme')
    try { window.localStorage.setItem('atlas-theme', theme) } catch { /* storage blocked */ }
  }, [theme])

  const [langId, pageId] = route.split('/')
  const lang = LANGS.find(l => l.id === langId) || LANGS[0]
  const page = lang.pages.find(p => p.id === pageId) || lang.pages[0]
  const Page = page.component

  const nav = (l, p) => {
    if (typeof window !== 'undefined') window.location.hash = '#/' + l + '/' + p
  }

  return (
    <div className="atlas-shell">
      {/* Binding — roofline nav: languages above, folios below */}
      <div className="binding">
        <div className="binding-inner">
          <span className="binding-title" onClick={() => nav(lang.id, lang.pages[0].id)}>
            The Polyglot's<span className="amp">&amp;</span>Atlas
          </span>
          <nav className="binding-nav lang-nav" aria-label="Language">
            {LANGS.map((l, k) => (
              <React.Fragment key={l.id}>
                {k > 0 && <span className="sep">·</span>}
                <button
                  className={l.id === lang.id ? 'active' : ''}
                  aria-current={l.id === lang.id ? 'true' : undefined}
                  onClick={() => nav(l.id, l.pages[0].id)}
                >
                  <span className="lang-glyph" style={{ fontFamily: l.font }}>{l.glyph}</span>
                  {l.name}
                </button>
              </React.Fragment>
            ))}
          </nav>
          <div className="binding-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 18 }}>
            <span
              className={'mini-toggle' + (showReadings ? ' on' : '')}
              style={{ cursor: 'pointer' }}
              onClick={() => setShowReadings(v => !v)}
              role="switch"
              aria-checked={showReadings}
            >
              <span className="box"></span>
              readings
            </span>
            {(lang.id === 'ko' || lang.id === 'ja') && (
              <span
                className={'mini-toggle' + (showJp ? ' on' : '')}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowJp(v => !v)}
                role="switch"
                aria-checked={showJp}
                title={lang.id === 'ko' ? 'Japanese bridge' : 'Korean bridge'}
              >
                <span className="box"></span>
                <span style={{
                  fontFamily: lang.id === 'ko' ? 'var(--font-cjk-serif)' : 'var(--font-kr-serif)',
                  letterSpacing: 0, marginRight: 4,
                }}>
                  {lang.id === 'ko' ? '日本語' : '한국어'}
                </span>
                bridge
              </span>
            )}
            <span
              className={'mini-toggle' + (theme === 'day' ? ' on' : '')}
              style={{ cursor: 'pointer' }}
              onClick={() => setTheme(t => (t === 'day' ? 'night' : 'day'))}
              role="switch"
              aria-checked={theme === 'day'}
              aria-label="daylight theme"
              title="daylight / night"
            >
              <span className="box"></span>
              <span style={{ fontFamily: 'var(--font-cjk-serif)', letterSpacing: 0, marginRight: 4 }}>昼</span>
              daylight
            </span>
            <span style={{ fontFamily: lang.font }}>{lang.metaGlyph}</span>
          </div>
        </div>

        {/* Level two — folios within the language */}
        <nav className="subnav" data-lang={lang.id} aria-label={lang.name + ' folios'}>
          <div className="subnav-inner">
            <span className="subnav-label">{lang.name} · folios</span>
            {lang.pages.map(p => (
              <button
                key={p.id}
                className={'subnav-page' + (p.id === page.id ? ' active' : '')}
                aria-current={p.id === page.id ? 'page' : undefined}
                onClick={() => nav(lang.id, p.id)}
              >
                <span className="glyph">{p.glyph}</span>
                {p.label}
              </button>
            ))}
            <span className="subnav-more">more plates to come — see the marginalia</span>
          </div>
        </nav>
      </div>

      <main className="atlas-content">
        <Page key={route} showReadings={showReadings} showJp={showJp} />
      </main>
    </div>
  )
}
