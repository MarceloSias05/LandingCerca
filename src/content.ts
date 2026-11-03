import type { PhotoId } from './components/Photo'
import type { Copy } from './copy'

// Estructura de la demostración. Personas, horas y mensajes son ejemplos para
// explicar la app (se marcan como tales en la página). La distancia
// Monterrey–Nápoles (≈10,008 km) es la del resto del material de la marca.

export type MomentId = keyof Copy['everyday']['moments']
export type CityId = 'napoles' | 'monterrey'

export type Moment = {
  id: MomentId
  photo: PhotoId
  city: CityId
  /** Día de noviembre (calendario de ejemplo). */
  day: number
  from: 'valeria' | 'mama'
}

/** En orden de la historia (lo cotidiano); la línea del tiempo los muestra al revés. */
export const MOMENTS: Moment[] = [
  { id: 'comida', photo: 'moment-comida', city: 'napoles', day: 12, from: 'valeria' },
  { id: 'calle', photo: 'moment-calle', city: 'napoles', day: 18, from: 'valeria' },
  { id: 'concha', photo: 'moment-concha', city: 'monterrey', day: 24, from: 'mama' },
]

export const CITIES: Record<CityId, { lonLat: [number, number] }> = {
  monterrey: { lonLat: [-100.31, 25.67] },
  napoles: { lonLat: [14.27, 40.85] },
}

/** Noviembre de 2026 empieza en domingo (con la semana de lunes a domingo, 6 huecos). */
export const CALENDAR = { leadingBlanks: 6, days: 30 }
