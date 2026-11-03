import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { useCopy } from '../i18n'
import { Photo } from './Photo'
import { WaitlistButton } from './Waitlist'

/*
 * Inicio · noche. Lo que hay que entender en el primer viewport: qué es (app
 * para compartir momentos), para quién (tu gente lejos), que está en
 * desarrollo y la única acción (lista de espera). Las dos ventanas —Nápoles de
 * noche, Monterrey de tarde— muestran los dos horarios unidos por el hilo.
 * La coreografía de entrada vive en styles/hero.css.
 */
export function Hero() {
  const t = useCopy().hero
  const words = t.title.split(' ')

  return (
    <section className="hero on-night" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__inner">
        <div className="hero__text">
          <p className="hero__eyebrow">{t.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            <span className="sr-only">{t.title}</span>
            <span aria-hidden="true">
              {words.map((word, i) => (
                <span key={i}>
                  <span className="w">
                    <span className="w__in" style={{ '--i': i } as CSSProperties}>
                      {word}
                    </span>
                  </span>
                  {i < words.length - 1 && ' '}
                </span>
              ))}
            </span>
          </h1>
          <p className="hero__who">
            <span className="sr-only">{t.whoLabel}</span>
            <WhoCycle items={t.who} />
          </p>
          <p className="hero__lede">{t.lede}</p>
          <div className="hero__actions">
            <WaitlistButton location="hero">{t.cta}</WaitlistButton>
            <p className="hero__note">{t.ctaNote}</p>
          </div>
        </div>

        <Places />
      </div>
    </section>
  )
}

/** Rota «¿A tu mamá? → ¿A tu hermano? …»: 3 vueltas y se queda en la primera. */
function WhoCycle({ items }: { items: string[] }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = true
    let paused = false
    let count = 0
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(el)
    const pause = () => (paused = true)
    const resume = () => (paused = false)
    el.parentElement?.addEventListener('pointerenter', pause)
    el.parentElement?.addEventListener('pointerleave', resume)
    const timer = window.setInterval(() => {
      if (!visible || paused || document.hidden) return
      count += 1
      setStep(count)
      if (count >= items.length * 3) window.clearInterval(timer)
    }, 2600)
    return () => {
      window.clearInterval(timer)
      io.disconnect()
      el.parentElement?.removeEventListener('pointerenter', pause)
      el.parentElement?.removeEventListener('pointerleave', resume)
    }
  }, [items.length])

  const active = step % items.length
  return (
    <span ref={ref} className={step > 0 ? 'cycle is-cycling' : 'cycle'} aria-hidden="true">
      {items.map((item, i) => (
        <span key={item} className={i === active ? 'cycle__item is-active' : 'cycle__item'}>
          {item}
        </span>
      ))}
    </span>
  )
}

function Places() {
  const t = useCopy().hero
  const boxRef = useRef<HTMLDivElement>(null)
  const farTagRef = useRef<HTMLElement>(null)
  const nearTagRef = useRef<HTMLElement>(null)
  const thread = useHeroThread(boxRef, farTagRef, nearTagRef)

  return (
    <div className="places" ref={boxRef} role="group" aria-label={t.placesLabel}>
      <figure className="place place--far">
        <div className="place__photo">
          <Photo id="hero-napoles" alt={t.far.alt} sizes="(min-width: 1024px) 400px, min(62vw, 300px)" priority />
        </div>
        <figcaption className="place__tag" ref={farTagRef}>
          <span className="place__city">{t.far.city}</span>
          <span className="place__time">{t.far.time}</span>
        </figcaption>
      </figure>
      <figure className="place place--near">
        <div className="place__photo">
          <Photo id="hero-monterrey" alt={t.near.alt} sizes="(min-width: 1024px) 290px, min(46vw, 220px)" eager />
        </div>
        <figcaption className="place__tag" ref={nearTagRef}>
          <span className="place__city">{t.near.city}</span>
          <span className="place__time">{t.near.time}</span>
        </figcaption>
      </figure>
      <p className="places__distance">{t.distance}</p>

      <svg className="hero-thread" aria-hidden="true" focusable="false">
        {thread && (
          <>
            <path className="hero-thread__glow" d={thread.d} pathLength={1} />
            <path className="hero-thread__line" d={thread.d} pathLength={1} />
            <circle className="hero-thread__knot hero-thread__knot--a" cx={thread.a.x} cy={thread.a.y} r="4.5" />
            <circle className="hero-thread__knot hero-thread__knot--b" cx={thread.b.x} cy={thread.b.y} r="4.5" />
          </>
        )}
      </svg>
    </div>
  )
}

type Point = { x: number; y: number }

/**
 * El hilo une las dos horas: sale de la etiqueta de Nápoles y llega a la de
 * Monterrey; si el espacio es estrecho pasa por detrás de la foto de Monterrey.
 * Se recalcula cuando la caja cambia de tamaño: fuentes, idioma, giro del teléfono.
 */
function useHeroThread(
  boxRef: RefObject<HTMLDivElement | null>,
  farTagRef: RefObject<HTMLElement | null>,
  nearTagRef: RefObject<HTMLElement | null>,
) {
  const [thread, setThread] = useState<{ d: string; a: Point; b: Point } | null>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    const far = farTagRef.current
    const near = nearTagRef.current
    if (!box || !far || !near) return

    const measure = () => {
      // Las etiquetas no llevan transformaciones (la cortina usa clip-path y un
      // ::after), así que sus rectángulos son estables durante la entrada.
      const origin = box.getBoundingClientRect()
      const f = far.getBoundingClientRect()
      const n = near.getBoundingClientRect()
      const r = (v: number) => Math.round(v * 10) / 10
      const a = { x: r(f.right - origin.left + 10), y: r(f.top - origin.top + f.height / 2) }
      const b = { x: r(n.left - origin.left - 10), y: r(n.top - origin.top + n.height / 2) }
      const reach = Math.max(36, Math.abs(b.x - a.x) * 0.7)
      const d = `M${a.x} ${a.y} C${a.x + reach} ${a.y} ${b.x - reach} ${b.y} ${b.x} ${b.y}`
      setThread((prev) => (prev?.d === d ? prev : { d, a, b }))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [boxRef, farTagRef, nearTagRef])

  return thread
}
