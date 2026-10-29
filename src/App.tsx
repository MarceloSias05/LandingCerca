import { useRef, useState, type CSSProperties } from 'react'
import { Postcard } from './components/Postcard'
import { Postmark } from './components/Postmark'
import { Stamp } from './components/Stamp'
import { Terrain } from './components/Terrain'
import { Thread } from './components/Thread'
import { WaitlistButton, WaitlistProvider } from './components/Waitlist'
import { BRAND_NAME } from './config'
import { DISTANCE, MOMENTS, PEOPLE, STATIONS } from './content'
import { useMotion } from './motion'

const rot = (deg: number) => ({ '--r': `${deg}deg` }) as CSSProperties

const STATION_LOOK = [
  { band: 'butter', terrain: 'colinas' },
  { band: 'pink', terrain: 'sierra' },
  { band: 'sage', terrain: 'olas' },
] as const

export default function App({ confirmed = false }: { confirmed?: boolean }) {
  const journeyRef = useRef<HTMLElement>(null)
  const [discovered, setDiscovered] = useState<string[]>([])

  useMotion(journeyRef)

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
        <section className="band band--blue hero" aria-labelledby="hero-title">
          <div className="hero__text">
            <h1 id="hero-title" className="hero__title">
              <span className="display" data-hero-lines>
                Hay kilómetros entre ustedes.
              </span>
              <em className="hero__turn" data-hero-fade>
                Que no se sientan en todo.
              </em>
            </h1>
            <p className="lede" data-hero-fade>
              Un espacio para compartir pequeños momentos y sentir cerca a esa persona, aunque esté lejos.
            </p>
            <div className="cta-row" data-hero-fade>
              <WaitlistButton location="hero">Quiero estar cerca</WaitlistButton>
              <p className="cta-note">Únete a la lista de espera.</p>
            </div>
            <p className="platform" data-hero-fade>
              {BRAND_NAME} es una app para iPhone, en desarrollo.
            </p>
          </div>

          <div className="hero__collage">
            <figure className="place place--far">
              <span className="node node--pin" data-anchor aria-hidden="true" />
              <div className="place__card" data-hero-stamp style={rot(5)}>
                <Stamp art="napoles" tone="sky" />
              </div>
              <figcaption className="tag tag--cream">
                {PEOPLE.valeria.city} <span>9:20 p. m.</span>
              </figcaption>
            </figure>
            <figure className="place place--near">
              <span className="node node--pin" data-anchor aria-hidden="true" />
              <div className="place__card" data-hero-stamp style={rot(-5)}>
                <Stamp art="monterrey" tone="butter" />
              </div>
              <figcaption className="tag tag--butter">
                {PEOPLE.mama.city} <span>1:20 p. m.</span>
              </figcaption>
              <span className="anchor-ghost place__exit" data-anchor aria-hidden="true" />
            </figure>
            <div className="hero__postmark" data-hero-postmark>
              <Postmark ring={`${BRAND_NAME} · DE AQUÍ PARA ALLÁ · `} center={`${DISTANCE.km}`} sub="KM" waves />
            </div>
            <p className="coords" aria-hidden="true">
              25°40′N 100°18′O · 40°51′N 14°16′E
            </p>
          </div>

          <a className="scroll-hint hand" href="#recorrido">
            sigue el hilo
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v15M6 13l6 6 6-6" />
            </svg>
          </a>
        </section>

        {/* Zoom: dentro de la estampilla */}
        <section className="band band--green zoom" id="recorrido" aria-labelledby="zoom-title" data-zoom>
          <Terrain shape="dunas" />
          <div className="zoom__stage">
            <h2 id="zoom-title" className="zoom__title">
              <span className="zoom__word zoom__word--top" data-zoom-top>
                Todos los días
              </span>{' '}
              <span className="zoom__word zoom__word--bottom" data-zoom-bottom>
                pasa algo
              </span>{' '}
              <span className="zoom__rest" data-zoom-rest>
                que quisieras contarle a alguien.
              </span>
            </h2>
            <div className="zoom__stamp" data-zoom-stamp>
              <Stamp art="lluvia" tone="sky" />
            </div>
          </div>
        </section>

        {/* Estaciones */}
        {STATIONS.map((s, i) => {
          const look = STATION_LOOK[i]
          const right = i % 2 === 0
          return (
            <section
              key={s.id}
              className={`band band--${look.band} station station--${right ? 'right' : 'left'}`}
              aria-label={s.kicker}
            >
              <Terrain shape={look.terrain} />
              <div className="station__media">
                <span className="node node--pin" data-anchor aria-hidden="true" />
                <div className="station__card" data-rise style={rot([5, -4, 3][i])}>
                  <Stamp art={s.art} tone={s.tone} />
                </div>
                <span className="anchor-ghost station__exit" data-anchor aria-hidden="true" />
              </div>
              <div className="station__text">
                <p className="station__phrase" data-words>
                  «{s.phrase}»
                </p>
                <p className="hand station__note">{s.kicker}</p>
                <p className="station__meta">{s.meta}</p>
                {i === STATIONS.length - 1 && (
                  <p className="station__bridge">
                    Con {BRAND_NAME}, esos momentos le llegan a la persona en la que pensabas, del otro lado del hilo.
                  </p>
                )}
              </div>
            </section>
          )
        })}

        {/* La postal */}
        <section className="band band--cream postcard-section" aria-labelledby="postcard-title">
          <Terrain shape="mesa" />
          <div className="postcard-section__intro">
            <h2 id="postcard-title" className="display-md" data-words>
              Explora la postal
            </h2>
            <p>
              Así se siente {BRAND_NAME}: lo que vive uno le llega al otro. Toca una foto para abrir un momento, o
              gira la postal para ver dónde está cada quien.
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
        <section className="band band--sky benefit" aria-labelledby="benefit-title">
          <Terrain shape="colinas" />
          <h2 id="benefit-title" className="display-md benefit__title" data-scrub-words>
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
        <section className="band band--blue destination" aria-labelledby="final-title">
          <Terrain shape="sierra" />
          <div className="xmark" data-x-mark aria-hidden="true">
            <span className="hand xmark__label">aquí se encuentran</span>
          </div>
          <div className="ticket" data-ticket>
            <h2 id="final-title" className="display-md">
              Lo próximo que compartan puede empezar aquí.
            </h2>
            <p>Únete a la lista de espera de {BRAND_NAME} y recibe novedades sobre su lanzamiento.</p>
            <WaitlistButton location="final">Unirme a la lista de espera</WaitlistButton>
            <Postmark className="ticket__postmark" ring={`LISTA DE ESPERA · ${BRAND_NAME} · `} center="AQUÍ" />
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
