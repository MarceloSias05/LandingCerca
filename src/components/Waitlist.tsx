import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { track } from '../analytics'
import { BRAND_NAME, JOTFORM_DIRECT_URL, JOTFORM_URL, SIGNUP_MESSAGE } from '../config'

type OpenWaitlist = (trigger: HTMLElement, location: string) => void

const WaitlistContext = createContext<OpenWaitlist>(() => {})

type ProviderProps = { children: ReactNode; initialConfirmed?: boolean }

export function WaitlistProvider({ children, initialConfirmed = false }: ProviderProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [confirmed, setConfirmed] = useState(initialConfirmed)

  const open = useCallback<OpenWaitlist>((trigger, location) => {
    triggerRef.current = trigger
    track('waitlist_cta_click', { location })
    if (!JOTFORM_URL) track('waitlist_form_unavailable', { location })
    setIsOpen(true)
    dialogRef.current?.showModal()
  }, [])

  const close = useCallback(() => dialogRef.current?.close(), [])

  // Inscripción confirmada: Jotform redirige su página de agradecimiento a esta
  // misma web con ?registro=confirmado; esa página, dentro del iframe, avisa aquí.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (event.source !== iframeRef.current?.contentWindow) return
      if (event.data?.type !== SIGNUP_MESSAGE) return
      track('waitlist_signup_confirmed', { via: 'modal' })
      setConfirmed(true)
      close()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [close])

  function onClose() {
    setIsOpen(false)
    setLoaded(false)
    triggerRef.current?.focus()
  }

  return (
    <WaitlistContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        className="waitlist"
        aria-labelledby="waitlist-title"
        onClose={onClose}
        onClick={(event) => {
          if (event.target === dialogRef.current) close()
        }}
      >
        <div className="waitlist__sheet">
          <header className="waitlist__header">
            <div>
              <p className="hand waitlist__kicker">nos vemos en la X</p>
              <h2 id="waitlist-title" className="waitlist__title">
                Lista de espera de {BRAND_NAME}
              </h2>
            </div>
            <button type="button" className="icon-btn" onClick={close} aria-label="Cerrar la lista de espera">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          {JOTFORM_URL ? (
            <>
              <div className="waitlist__frame" data-loaded={loaded}>
                {!loaded && <p className="waitlist__loading">Cargando el formulario…</p>}
                {isOpen && (
                  <iframe
                    ref={iframeRef}
                    src={JOTFORM_URL}
                    title={`Formulario de la lista de espera de ${BRAND_NAME}`}
                    allow="geolocation; microphone; camera; fullscreen"
                    onLoad={() => setLoaded(true)}
                  />
                )}
              </div>
              <p className="waitlist__alt">
                ¿No se ve bien?{' '}
                <a href={JOTFORM_DIRECT_URL ?? JOTFORM_URL} target="_blank" rel="noopener">
                  Abre el formulario en una pestaña nueva
                </a>
              </p>
            </>
          ) : (
            <div className="waitlist__pending" role="status">
              <p>
                El formulario de registro todavía no está conectado. En cuanto esté listo, aquí podrás dejar tus
                datos para recibir novedades de {BRAND_NAME}.
              </p>
              {import.meta.env.DEV && (
                <p className="waitlist__dev">
                  Para el equipo: agrega <code>VITE_JOTFORM_URL</code> en <code>.env</code> (ver{' '}
                  <code>.env.example</code>).
                </p>
              )}
              <button type="button" className="btn btn--ghost" onClick={close}>
                Volver a la página
              </button>
            </div>
          )}
        </div>
      </dialog>
      {confirmed && <SignupThanks onDismiss={() => setConfirmed(false)} />}
    </WaitlistContext.Provider>
  )
}

export function SignupThanks({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="thanks" role="status">
      <p>
        <strong>¡Listo!</strong> Ya estás en la lista de espera de {BRAND_NAME}. Te escribiremos cuando haya
        novedades.
      </p>
      <button type="button" className="icon-btn" onClick={onDismiss} aria-label="Cerrar aviso">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  )
}

type WaitlistButtonProps = {
  location: string
  children: ReactNode
  variant?: 'primary' | 'small'
}

export function WaitlistButton({ location, children, variant = 'primary' }: WaitlistButtonProps) {
  const open = useContext(WaitlistContext)
  return (
    <button
      type="button"
      className={`btn btn--${variant}`}
      aria-haspopup="dialog"
      onClick={(event) => open(event.currentTarget, location)}
    >
      {children}
    </button>
  )
}
