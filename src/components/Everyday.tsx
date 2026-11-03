import { useState } from 'react'
import { track } from '../analytics'
import { MOMENTS, type Moment } from '../content'
import { useCopy } from '../i18n'
import { Photo } from './Photo'

/*
 * Lo cotidiano: identificación. Tres momentos de ejemplo; al tocar una foto se
 * descubre a quién se mandó y qué hora era del otro lado (el valor de la app:
 * no tienen que coincidir). Es un botón con aria-expanded: funciona con toque,
 * teclado y lector de pantalla; nada depende de hover.
 */
export function Everyday() {
  const t = useCopy().everyday

  return (
    <section className="everyday" aria-labelledby="everyday-title">
      <div className="section-inner">
        <header className="section-head">
          <h2 id="everyday-title" className="section-title">
            {t.title}
          </h2>
          <p className="section-text">{t.text}</p>
        </header>
        <ul className="moments">
          {MOMENTS.map((m, i) => (
            <MomentCard key={m.id} moment={m} index={i} />
          ))}
        </ul>
        <p className="sample-note">{t.sample}</p>
      </div>
    </section>
  )
}

function MomentCard({ moment, index }: { moment: Moment; index: number }) {
  const copy = useCopy()
  const t = copy.everyday
  const text = t.moments[moment.id]
  const [open, setOpen] = useState(false)
  const noteId = `moment-note-${moment.id}`

  function toggle() {
    setOpen((was) => {
      if (!was) track('moment_open', { moment: moment.id })
      return !was
    })
  }

  return (
    <li className="moment" data-side={index % 2 ? 'right' : 'left'}>
      <div className="moment__frame">
        <button
          type="button"
          className="moment__photo"
          aria-expanded={open}
          aria-controls={noteId}
          onClick={toggle}
        >
          <Photo id={moment.photo} alt="" sizes="(min-width: 1024px) 340px, (min-width: 600px) 45vw, 78vw" />
          {/* El nombre accesible empieza con el texto visible (control por voz). */}
          <span className="moment__hint">{t.hint}</span>
          <span className="sr-only"> {copy.quote(text.quote)}</span>
        </button>
        {/* Fuera del botón para que el lector de pantalla lo lea; los toques pasan al botón. */}
        <p className="moment__note" id={noteId} hidden={!open}>
          <span className="moment__knot" aria-hidden="true" />
          <span className="moment__to">{text.to}</span>
          <span className="moment__there">{text.there}</span>
        </p>
      </div>
      <p className="moment__quote">{copy.quote(text.quote)}</p>
      <p className="moment__meta">
        <span className="sr-only">{text.alt}. </span>
        {text.meta}
      </p>
    </li>
  )
}
