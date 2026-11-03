import photos from '../photos.generated.json'

export type PhotoId = keyof typeof photos
export const PHOTOS = photos

type Props = {
  id: PhotoId
  alt: string
  /** Ancho mostrado, para que el navegador elija el archivo adecuado. */
  sizes: string
  /** La foto principal del primer viewport: sin lazy y con prioridad alta. */
  priority?: boolean
  /** Visible al cargar pero secundaria: sin lazy, prioridad normal. */
  eager?: boolean
}

/** Foto real en AVIF/WebP/JPEG con dimensiones explícitas (sin saltos de diseño). */
export function Photo({ id, alt, sizes, priority = false, eager = false }: Props) {
  const p = photos[id]
  return (
    <picture>
      <source type="image/avif" srcSet={p.avif} sizes={sizes} />
      <source type="image/webp" srcSet={p.webp} sizes={sizes} />
      <img
        src={p.src}
        srcSet={p.jpg}
        sizes={sizes}
        width={p.width}
        height={p.height}
        alt={alt}
        loading={priority || eager ? 'eager' : 'lazy'}
        decoding={priority ? 'auto' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
      />
    </picture>
  )
}
