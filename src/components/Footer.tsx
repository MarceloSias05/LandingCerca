import { BRAND_NAME } from '../config'
import { useCopy } from '../i18n'
import { PHOTOS } from './Photo'

export function Footer() {
  const t = useCopy()
  const photos = Object.values(PHOTOS)
  const provisional = photos.some((p) => p.provisional)

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="wordmark">{BRAND_NAME}</p>
        <p>{t.footer}</p>
        <div className="credits">
          <p>
            <strong>{t.credits.title}.</strong> {provisional && t.credits.provisional}
          </p>
          <ul>
            {photos.map(
              (p) =>
                p.credit && (
                  <li key={p.credit.source}>
                    <a href={p.credit.source}>{t.quote(p.credit.title)}</a>, {p.credit.author},{' '}
                    <a href={p.credit.licenseUrl}>{p.credit.license}</a> ({t.credits.changes})
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
    </footer>
  )
}
