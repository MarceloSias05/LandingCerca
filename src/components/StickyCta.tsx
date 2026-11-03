import { useEffect, useState } from 'react'
import { useCopy } from '../i18n'
import { WaitlistButton } from './Waitlist'

/*
 * CTA persistente en teléfono y tablet. Aparece cuando el botón del inicio ya
 * no se ve y se esconde cuando el cierre (#lista) está en pantalla, para no
 * duplicar el botón ni tapar contenido (el pie reserva su altura).
 */
export function StickyCta() {
  const t = useCopy().sticky
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('.hero__actions')
    const join = document.querySelector('[data-join]')
    if (!hero || !join) return
    let heroVisible = true
    let joinVisible = false
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroVisible = e.isIntersecting
        if (e.target === join) joinVisible = e.isIntersecting
      }
      setShow(!heroVisible && !joinVisible)
    })
    io.observe(hero)
    io.observe(join)
    return () => io.disconnect()
  }, [])

  return (
    <div className="sticky-cta on-night" data-show={show} inert={!show} aria-hidden={!show}>
      <WaitlistButton location="sticky">{t.cta}</WaitlistButton>
    </div>
  )
}
