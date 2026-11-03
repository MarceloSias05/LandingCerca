import { useCopy } from '../i18n'
import { WaitlistButton } from './Waitlist'

/** Beneficios atados a situaciones reales, no a funciones. */
export function Situations() {
  const t = useCopy().situations
  return (
    <section className="situations" aria-labelledby="situations-title">
      <div className="section-inner">
        <h2 id="situations-title" className="section-title">
          {t.title}
        </h2>
        <ul className="situations__list">
          {t.items.map((item) => (
            <li key={item.title} className="situation">
              <h3 className="situation__title">{item.title}</h3>
              <p className="situation__text">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Preguntas con <details> nativo: teclado y lector de pantalla sin JS. */
export function Faq() {
  const t = useCopy().faq
  return (
    <section className="faq" aria-labelledby="faq-title">
      <div className="section-inner faq__inner">
        <h2 id="faq-title" className="section-title">
          {t.title}
        </h2>
        <div className="faq__list">
          {t.items.map((item) => (
            <details key={item.q} className="faq__item">
              <summary>
                <span>{item.q}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="faq__icon">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Cierre y registro. En la Fase 4 el botón se sustituye por el formulario
 * propio (correo + consentimiento) con estados de envío, error y gracias.
 */
export function Join() {
  const t = useCopy().join
  return (
    <section className="join on-night" id="lista" aria-labelledby="join-title" data-join>
      <div className="join__glow" aria-hidden="true" />
      <div className="section-inner join__inner">
        <h2 id="join-title" className="join__title">
          {t.title}
        </h2>
        <p className="join__text">{t.text}</p>
        <WaitlistButton location="final">{t.cta}</WaitlistButton>
        <p className="join__note">{t.note}</p>
      </div>
    </section>
  )
}
