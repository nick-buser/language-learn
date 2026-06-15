import React, { useEffect, useState } from 'react'
import JapaneseGrammar from './pages/JapaneseGrammar.jsx'
import KoreanGrammar from './pages/KoreanGrammar.jsx'
import KoreanVerbs from './pages/KoreanVerbs.jsx'
import KoreanParticles from './pages/KoreanParticles.jsx'
import KoreanCognates from './pages/KoreanCognates.jsx'
import KoreanVocab from './pages/KoreanVocab.jsx'
import KoreanSong from './pages/KoreanSong.jsx'
import KoreanCustom from './pages/KoreanCustom.jsx'
import KoreanRoadmap from './pages/KoreanRoadmap.jsx'
import JapaneseVocab from './pages/JapaneseVocab.jsx'
import './styles/base.css'
import './styles/aburaya.css'
import './styles/grammar.css'
import './styles/korean.css'
import './styles/particles.css'
import './styles/cognates.css'
import './styles/roadmap.css'
import './styles/vocab.css'
import './styles/song.css'

// Two-level atlas: language → folio pages within it.
const LANGS = [
  {
    id: 'ko', glyph: '한국어', name: 'Korean', metaGlyph: '문법', font: 'var(--font-kr-serif)',
    pages: [
      { id: 'grammar',   glyph: '문법', label: 'grammar engine',   component: KoreanGrammar },
      { id: 'verbs',     glyph: '동사', label: 'verb forge',       component: KoreanVerbs },
      { id: 'particles', glyph: '조사', label: 'particle cabinet', component: KoreanParticles },
      { id: 'cognates',  glyph: '한자어', label: 'cognate bridge',  component: KoreanCognates },
      { id: 'vocab',     glyph: '어휘', label: 'word bank',        component: KoreanVocab },
      { id: 'song',      glyph: '노래', label: 'the song',         component: KoreanSong },
      { id: 'custom',    glyph: '자작', label: 'custom',           component: KoreanCustom },
      { id: 'roadmap',   glyph: '여정', label: 'fluency roadmap',  component: KoreanRoadmap },
    ],
  },
  {
    id: 'ja', glyph: '日本語', name: 'Japanese', metaGlyph: '文法', font: 'var(--font-cjk-serif)',
    pages: [
      { id: 'grammar', glyph: '文法', label: 'grammar engine', component: JapaneseGrammar },
      { id: 'vocab',   glyph: '語彙', label: 'word bank',      component: JapaneseVocab },
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

  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0)
  }, [route])

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
            {lang.id === 'ko' && (
              <span
                className={'mini-toggle' + (showJp ? ' on' : '')}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowJp(v => !v)}
                role="switch"
                aria-checked={showJp}
              >
                <span className="box"></span>
                <span style={{ fontFamily: 'var(--font-cjk-serif)', letterSpacing: 0, marginRight: 4 }}>日本語</span>
                bridge
              </span>
            )}
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
