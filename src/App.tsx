import { Everyday } from './components/Everyday'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { Faq, Join, Situations } from './components/Sections'
import { StickyCta } from './components/StickyCta'
import { WaitlistButton, WaitlistProvider } from './components/Waitlist'
import { BRAND_NAME } from './config'
import { LANGS, useCopy, useLang } from './i18n'

/*
 * Rediseño «Dos horarios, un hilo» (docs/plan-rediseno/PLAN.md).
 * Recorrido: noche (inicio) → día (lo cotidiano, así funciona, situaciones,
 * preguntas) → noche (registro). El diseño anterior sigue intacto en la rama
 * feat/landing-hilo.
 */
export default function App({ confirmed = false }: { confirmed?: boolean }) {
  const t = useCopy()

  return (
    <WaitlistProvider initialConfirmed={confirmed}>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="wordmark" href="#main" aria-label={t.home}>
            {BRAND_NAME}
          </a>
          <div className="site-header__end">
            <LangSwitch />
            <span className="site-header__cta">
              <WaitlistButton location="header" variant="small">
                {t.headerCta}
              </WaitlistButton>
            </span>
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        <Hero />
        <Everyday />
        <HowItWorks />
        <Situations />
        <Faq />
        <Join />
      </main>
      <Footer />
      <StickyCta />
    </WaitlistProvider>
  )
}

function LangSwitch() {
  const { lang, setLang } = useLang()
  const t = useCopy()
  return (
    <div className="lang-switch" role="group" aria-label={t.lang.label}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-label={`${l.toUpperCase()} · ${t.lang[l]}`}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
