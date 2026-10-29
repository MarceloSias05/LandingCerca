import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Postcard } from './components/Postcard'
import { Stamp } from './components/Stamp'
import { Thread } from './components/Thread'
import { WaitlistButton, WaitlistProvider } from './components/Waitlist'
import { BRAND_NAME } from './config'
import { DISTANCE, MOMENTS, PEOPLE, STATIONS } from './content'

gsap.registerPlugin(ScrollTrigger)

const rot = (deg: number) => ({ '--r': `${deg}deg` }) as CSSProperties

export default function App({ confirmed = false }: { confirmed?: boolean }) {
  const journeyRef = useRef<HTMLElement>(null)
  const [discovered, setDiscovered] = useState<string[]>([])

  useEntrances(journeyRef)

  return (
    <WaitlistProvider initialConfirmed={confirmed}>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <header className="site-header">
        <a className="wordmark" href="#main" aria-label={`${BRAND_NAME}, inicio`}>
          {BRAND_NAME}
        </a>
        <WaitlistButton location="header" variant="small">
          Lista de espera
        </WaitlistButton>
      </header>

      <main id="main" className="journey" ref={journeyRef}>
        <Thread rootRef={journeyRef} />

        {/* Inicio */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__text">
            <p className="hand kicker">para quien está lejos</p>
            <h1 id="hero-title" className="display">
              Hay kilómetros entre ustedes. <em>Que no se sientan en todo.</em>
            </h1>
            <p className="lede">
              Un espacio para compartir pequeños momentos y sentir cerca a esa persona, aunque esté lejos.
            </p>
            <div className="cta-row">
              <WaitlistButton location="hero">Quiero estar cerca</WaitlistButton>
              <p className="cta-note">Únete a la lista de espera.</p>
            </div>
            <p className="platform">{BRAND_NAME} es una app para iPhone, en desarrollo.</p>
          </div>

          <div className="hero__collage">
            <figure className="place place--far">
              <span className="node node--pin" data-anchor aria-hidden="true" />
              <div className="place__card" data-reveal style={rot(3.5)}>
                <Stamp art="napoles" tone="sky" />
              </div>
              <figcaption className="tag tag--sky">
                {PEOPLE.valeria.city} <span>9:20 p. m.</span>
              </figcaption>
            </figure>
            <figure className="place place--near">
              <span className="node node--pin" data-anchor aria-hidden="true" />
              <div className="place__card" data-reveal style={rot(-4)}>
                <Stamp art="monterrey" tone="butter" />
              </div>
              <figcaption className="tag tag--butter">
                {PEOPLE.mama.city} <span>1:20 p. m.</span>
              </figcaption>
              <span className="anchor-ghost place__exit" data-anchor aria-hidden="true" />
            </figure>
            <p className="postmark" data-reveal>
              <span>{DISTANCE.km} km</span>
              <span>{DISTANCE.hours} h de diferencia</span>
            </p>
            <p className="hand collage-note" aria-hidden="true">
              tú aquí, yo allá
            </p>
          </div>

          <a className="scroll-hint hand" href="#recorrido">
            sigue el hilo
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v15M6 13l6 6 6-6" />
            </svg>
          </a>
        </section>

        {/* El recorrido */}
        <section className="route" id="recorrido" aria-labelledby="route-title">
          <h2 id="route-title" className="route__intro display-sm">
            Todos los días pasa algo que quisieras contarle a alguien.
          </h2>
          <ol className="stations">
            {STATIONS.map((s, i) => (
              <li key={s.id} className={`station station--${i % 2 ? 'left' : 'right'}`}>
                <div className="station__media">
                  <span className="node node--pin" data-anchor aria-hidden="true" />
                  <div className="station__card" data-reveal style={rot([4, -3.5, 2.5][i])}>
                    <Stamp art={s.art} tone={s.tone} />
                  </div>
                  <span className="anchor-ghost station__exit" data-anchor aria-hidden="true" />
                </div>
                <div className="station__text" data-reveal-text>
                  <p className="hand station__kicker">
                    <span className="station__num" aria-hidden="true">
                      {i + 1}
                    </span>
                    {s.kicker}
                  </p>
                  <p className="station__phrase">«{s.phrase}»</p>
                  <p className="station__meta">{s.meta}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="route__bridge">
            Con {BRAND_NAME}, esos momentos le llegan a la persona en la que pensabas, del otro lado del hilo.
          </p>
        </section>

        {/* La postal */}
        <section className="postcard-section" aria-labelledby="postcard-title">
          <div className="postcard-section__intro">
            <p className="hand kicker">a mitad del camino</p>
            <h2 id="postcard-title" className="display-md">
              Explora la postal
            </h2>
            <p>
              Así se siente {BRAND_NAME}: lo que vive uno le llega al otro. Toca una foto para abrir un momento, o
              cambia al mapa para ver dónde está cada quien.
            </p>
          </div>
          <Postcard onDiscover={(id) => setDiscovered((d) => (d.includes(id) ? d : [...d, id]))} />
          <div className="mid-cta">
            <p>¿Hay alguien con quien quisieras compartir así?</p>
            <WaitlistButton location="postcard">Quiero estar cerca</WaitlistButton>
            <p className="cta-note">Únete a la lista de espera.</p>
          </div>
        </section>

        {/* El beneficio */}
        <section className="benefit" aria-labelledby="benefit-title">
          <h2 id="benefit-title" className="display-md benefit__title">
            Compartir lo pequeño también es estar presente.
          </h2>
          <p className="benefit__text">
            Lo que se mandan se queda guardado: una historia de los dos que se va llenando, aunque vivan en horarios
            distintos.
          </p>
          <div className="clothesline">
            <span className="node node--nail clothesline__start" data-anchor data-tangent-out="1,0.18" aria-hidden="true" />
            <ul className="clothesline__items" aria-label="Momentos de la postal">
              {MOMENTS.map((m, i) => {
                const seen = discovered.includes(m.id)
                return (
                  <li key={m.id} className="hang" data-open={seen} style={rot([-4, 3, -2, 4][i])}>
                    <span className="hang__pin" aria-hidden="true" />
                    <Stamp art={m.art} tone={m.tone} image={m.image} />
                    <span className="hang__label hand">
                      <span className="hang__label-short">{m.label}</span>
                      {seen && <span className="hang__label-full">«{m.message}»</span>}
                    </span>
                  </li>
                )
              })}
            </ul>
            <span className="node node--nail clothesline__end" data-anchor data-tangent="1,-0.18" data-tangent-out="0,1" aria-hidden="true" />
          </div>
        </section>

        {/* El destino */}
        <section className="destination" aria-labelledby="final-title">
          <div className="xmark" data-x-mark aria-hidden="true">
            <span className="hand xmark__label">aquí se encuentran</span>
          </div>
          <div className="ticket">
            <h2 id="final-title" className="display-md">
              Lo próximo que compartan puede empezar aquí.
            </h2>
            <p>Únete a la lista de espera de {BRAND_NAME} y recibe novedades sobre su lanzamiento.</p>
            <WaitlistButton location="final">Unirme a la lista de espera</WaitlistButton>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="wordmark wordmark--small">{BRAND_NAME}</p>
        <p>
          Una app para iPhone, en desarrollo. Las imágenes son ilustraciones provisionales; las personas, horas y
          mensajes de la postal son datos de demostración.
        </p>
      </footer>
    </WaitlistProvider>
  )
}

/** Entradas suaves de fotos, textos y la postal. Sin animación si el usuario pide menos movimiento. */
function useEntrances(scope: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', small: '(max-width: 760px)' },
      (ctx) => {
        const { motion, small } = ctx.conditions as { motion: boolean; small: boolean }
        if (!motion) return

        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el, i) => {
          gsap.from(el, {
            y: small ? 18 : 32,
            rotation: i % 2 ? 5 : -5,
            opacity: 0,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

        gsap.utils.toArray<HTMLElement>('[data-reveal-text]').forEach((el) => {
          gsap.from(el.children, {
            y: 14,
            opacity: 0,
            duration: 0.7,
            ease: 'expo.out',
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })

        // La postal es el punto culminante: llega girando y se asienta con el scroll.
        const card = document.querySelector<HTMLElement>('[data-reveal-card]')
        if (card) {
          gsap.fromTo(
            card,
            { y: small ? 40 : 90, rotation: small ? -2 : -6, scale: small ? 0.96 : 0.9 },
            {
              y: 0,
              rotation: 0,
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 30%', scrub: 0.6 },
            },
          )
        }

        gsap.utils.toArray<HTMLElement>('.hang').forEach((el, i) => {
          gsap.from(el, {
            y: -24,
            rotation: i % 2 ? 10 : -10,
            opacity: 0,
            duration: 1.1,
            ease: 'elastic.out(1, 0.6)',
            delay: i * 0.07,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })
      },
      scope.current ?? undefined,
    )
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => mm.revert()
  }, [scope])
}
