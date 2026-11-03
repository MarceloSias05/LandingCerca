import { useRef, useState, type KeyboardEvent } from 'react'
import { track } from '../analytics'
import { CALENDAR, CITIES, MOMENTS } from '../content'
import { useCopy } from '../i18n'
import { Photo } from './Photo'

/*
 * Así funciona: tres pasos y un teléfono que muestra las tres vistas
 * confirmadas (línea del tiempo, mapa, calendario). No son capturas de la app:
 * es una maqueta del prototipo con datos de ejemplo, y lo dice siempre.
 * El rojo solo aparece como hilo y sus nudos, igual que en la app.
 */
type View = 'timeline' | 'map' | 'calendar'
const VIEWS: View[] = ['timeline', 'map', 'calendar']

export function HowItWorks() {
  const t = useCopy().how
  const [view, setView] = useState<View>('timeline')
  const tabRefs = useRef<Record<View, HTMLButtonElement | null>>({ timeline: null, map: null, calendar: null })

  function choose(next: View, focus = false) {
    if (next !== view) track('demo_view_change', { view: next })
    setView(next)
    if (focus) tabRefs.current[next]?.focus()
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>) {
    const i = VIEWS.indexOf(view)
    const next =
      event.key === 'ArrowRight'
        ? (i + 1) % VIEWS.length
        : event.key === 'ArrowLeft'
          ? (i - 1 + VIEWS.length) % VIEWS.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? VIEWS.length - 1
              : -1
    if (next < 0) return
    event.preventDefault()
    choose(VIEWS[next], true)
  }

  return (
    <section className="how" aria-labelledby="how-title">
      <div className="section-inner how__inner">
        <div className="how__text">
          <h2 id="how-title" className="section-title">
            {t.title}
          </h2>
          <ol className="steps">
            {t.steps.map((step, i) => (
              <li key={step.title} className="step">
                <span className="step__n" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="demo">
          <p className="demo__label">{t.demoLabel}</p>
          <div className="phone">
            <div
              className="phone__screen"
              role="tabpanel"
              id={`demo-${view}`}
              aria-labelledby={`demo-tab-${view}`}
            >
              {view === 'timeline' && <TimelineScreen />}
              {view === 'map' && <MapScreen />}
              {view === 'calendar' && <CalendarScreen />}
            </div>
          </div>
          <div className="segmented" role="tablist" aria-label={t.views}>
            {VIEWS.map((v) => (
              <button
                key={v}
                ref={(el) => {
                  tabRefs.current[v] = el
                }}
                type="button"
                role="tab"
                id={`demo-tab-${v}`}
                aria-selected={view === v}
                aria-controls={`demo-${v}`}
                tabIndex={view === v ? 0 : -1}
                onClick={() => choose(v)}
                onKeyDown={onKey}
              >
                {t.tabs[v]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ScreenHeader({ title }: { title: string }) {
  return <p className="screen__title">{title}</p>
}

function TimelineScreen() {
  const copy = useCopy()
  const t = copy.how.screen
  return (
    <div className="screen screen--timeline" aria-label={t.describe.timeline} role="img">
      <ScreenHeader title={t.pair} />
      <ol className="tl" aria-hidden="true">
        {[...MOMENTS].reverse().map((m) => {
          const text = copy.everyday.moments[m.id]
          return (
            <li key={m.id} className="tl__item">
              <span className="tl__knot" />
              <p className="tl__who">
                <strong>{t.names[m.from]}</strong> · {t.day(m.day)}
              </p>
              <div className="tl__photo">
                <Photo id={m.photo} alt="" sizes="200px" />
              </div>
              <p className="tl__caption">{text.quote}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// Proyección equirectangular simple de una parte del mundo (lon −110…25, lat 15…55).
const project = ([lon, lat]: [number, number]) => [((lon + 110) / 135) * 300, ((55 - lat) / 40) * 260]

function MapScreen() {
  const copy = useCopy()
  const t = copy.how.screen
  const mty = project(CITIES.monterrey.lonLat)
  const nap = project(CITIES.napoles.lonLat)
  const mid = [(mty[0] + nap[0]) / 2, Math.min(mty[1], nap[1]) - 70]
  const count = (city: 'monterrey' | 'napoles') => MOMENTS.filter((m) => m.city === city).length
  const thumb = (city: 'monterrey' | 'napoles') => MOMENTS.find((m) => m.city === city)!.photo

  return (
    <div className="screen screen--map" aria-label={t.describe.map} role="img">
      <ScreenHeader title={t.mapTitle} />
      <div className="map" aria-hidden="true">
        <svg viewBox="0 0 300 260" className="map__svg">
          <path className="map__land" d={AMERICA} />
          <path className="map__land" d={EUROPE} />
          <path className="map__land" d={AFRICA} />
          <path className="map__thread" d={`M${mty[0]} ${mty[1]} Q${mid[0]} ${mid[1]} ${nap[0]} ${nap[1]}`} />
          <circle className="map__knot" cx={mty[0]} cy={mty[1]} r="3.5" />
          <circle className="map__knot" cx={nap[0]} cy={nap[1]} r="3.5" />
        </svg>
        {(['monterrey', 'napoles'] as const).map((city) => {
          const [x, y] = city === 'monterrey' ? mty : nap
          return (
            <div
              key={city}
              className="map__pin"
              data-align={city === 'monterrey' ? 'start' : 'end'}
              style={{ left: `${(x / 300) * 100}%`, top: `${(y / 260) * 100}%` }}
            >
              <span className="map__thumb">
                <Photo id={thumb(city)} alt="" sizes="64px" />
              </span>
              <span className="map__count">
                {city === 'monterrey' ? copy.hero.near.city : copy.hero.far.city} · {t.moments(count(city))}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CalendarScreen() {
  const copy = useCopy()
  const t = copy.how.screen
  const byDay = new Map(MOMENTS.map((m) => [m.day, m]))
  const cells = [
    ...Array.from({ length: CALENDAR.leadingBlanks }, () => 0),
    ...Array.from({ length: CALENDAR.days }, (_, i) => i + 1),
  ]
  return (
    <div className="screen screen--calendar" aria-label={t.describe.calendar} role="img">
      <ScreenHeader title={t.month} />
      <div className="cal" aria-hidden="true">
        {t.weekdays.map((d, i) => (
          <span key={i} className="cal__wd">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          const m = day ? byDay.get(day) : undefined
          return (
            <span key={i} className={m ? 'cal__day cal__day--moment' : 'cal__day'}>
              {m && <Photo id={m.photo} alt="" sizes="48px" />}
              {day > 0 && <span className="cal__n">{day}</span>}
            </span>
          )
        })}
      </div>
    </div>
  )
}

// Contornos muy simplificados (solo para la maqueta).
const poly = (points: [number, number][]) =>
  'M' + points.map((p) => project(p).map((n) => n.toFixed(1)).join(' ')).join(' L') + 'Z'

const AMERICA = poly([
  [-110, 55], [-110, 31], [-106, 24], [-104, 19], [-97, 16], [-92, 15], [-88, 15], [-86, 15], [-87, 21],
  [-90, 21.5], [-97, 22], [-97, 27], [-94, 29.5], [-89, 30], [-84, 30], [-81, 25], [-80, 31], [-76, 35],
  [-74, 40], [-70, 42], [-66, 44], [-60, 46], [-55, 50], [-58, 55],
])
const EUROPE = poly([
  [-9, 37], [-9, 43], [-2, 43.5], [-1, 46], [-4, 48], [-2, 49], [2, 51], [4, 52], [8, 54], [9, 55], [25, 55],
  [25, 40], [23, 38], [20, 40], [19, 42], [13.5, 45], [16, 41.5], [18.5, 40], [16, 38], [15.6, 40], [12, 42],
  [10, 44], [7, 44], [3, 43], [0, 39], [-2, 37], [-6, 36],
])
const AFRICA = poly([
  [-6, 35.8], [-10, 30], [-16, 22], [-17, 15], [25, 15], [25, 32], [20, 31], [11, 33], [10, 37], [-2, 35.2],
])
