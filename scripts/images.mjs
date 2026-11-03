// Genera las variantes web de las fotos: AVIF + WebP + JPEG por ancho, recortadas a la
// proporción pedida y sin metadatos (sharp no copia EXIF/GPS salvo que se le pida).
// Uso: npm run images   (fuente: assets-src/photos/photos.json)
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const srcDir = path.join(root, 'assets-src/photos')
const outDir = path.join(root, 'public/photos')
const { photos } = JSON.parse(await readFile(path.join(srcDir, 'photos.json'), 'utf8'))

const FORMATS = {
  avif: (img) => img.avif({ quality: 52, effort: 6 }),
  webp: (img) => img.webp({ quality: 74 }),
  jpg: (img) => img.jpeg({ quality: 76, mozjpeg: true, progressive: true }),
}

await mkdir(outDir, { recursive: true })
const manifest = {}

for (const photo of photos) {
  const [aw, ah] = photo.aspect
  const input = path.join(srcDir, photo.file)
  const meta = await sharp(input).metadata()
  const maxW = Math.min(meta.width, Math.floor((meta.height * aw) / ah))
  const widths = photo.widths.filter((w) => w <= maxW)
  if (widths.length < photo.widths.length) widths.push(maxW)

  const sets = {}
  for (const [fmt, encode] of Object.entries(FORMATS)) {
    sets[fmt] = []
    for (const w of widths) {
      const h = Math.round((w * ah) / aw)
      const name = `${photo.id}-${w}.${fmt}`
      const info = await encode(
        sharp(input).rotate().resize({ width: w, height: h, fit: 'cover', position: photo.position }),
      ).toFile(path.join(outDir, name))
      sets[fmt].push(`/photos/${name} ${w}w`)
      console.log(name.padEnd(32), `${(info.size / 1024).toFixed(0)} KB`)
    }
  }
  const largest = widths.at(-1)
  manifest[photo.id] = {
    width: largest,
    height: Math.round((largest * ah) / aw),
    src: `/photos/${photo.id}-${widths[Math.min(1, widths.length - 1)]}.jpg`,
    avif: sets.avif.join(', '),
    webp: sets.webp.join(', '),
    jpg: sets.jpg.join(', '),
    provisional: Boolean(photo.provisional),
    credit: photo.credit ?? null,
  }
}

await writeFile(path.join(root, 'src/photos.generated.json'), `${JSON.stringify(manifest, null, 2)}\n`)
console.log('→ src/photos.generated.json')
