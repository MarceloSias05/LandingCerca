import type { ArtName } from './components/Art'

// Datos de demostración: personas, horas y mensajes son ejemplos para explicar
// la app. La distancia Monterrey–Nápoles (≈10,008 km, 8 h de diferencia en
// horario de invierno) es la que usa el resto del material de la marca.

export type Tone = 'sky' | 'butter' | 'sage' | 'pink'

export type Station = {
  id: string
  art: ArtName
  tone: Tone
  kicker: string
  phrase: string
  meta: string
}

export const STATIONS: Station[] = [
  {
    id: 'ensenar',
    art: 'conchas',
    tone: 'butter',
    kicker: 'algo que querías enseñarle',
    phrase: 'Tienes que probar esto.',
    meta: 'Domingo, 9:12 a. m.',
  },
  {
    id: 'recordar',
    art: 'flores',
    tone: 'pink',
    kicker: 'un lugar que te recordó a alguien',
    phrase: 'Esto me hizo pensar en ti.',
    meta: 'Mercado, de camino a casa',
  },
  {
    id: 'compartir',
    art: 'lluvia',
    tone: 'sky',
    kicker: 'un momento pequeño',
    phrase: 'Ojalá pudieras estar aquí.',
    meta: 'Martes, 11:40 p. m.',
  },
]

export type Person = { name: string; city: string; country: string }

export const PEOPLE: Record<'valeria' | 'mama', Person> = {
  valeria: { name: 'Valeria', city: 'Nápoles', country: 'Italia' },
  mama: { name: 'Mamá', city: 'Monterrey', country: 'México' },
}

export const DISTANCE = { km: '10,008', hours: 8 }

export type Moment = {
  id: string
  art: ArtName
  tone: Tone
  from: keyof typeof PEOPLE
  label: string
  time: string
  message: string
  /** Para la versión con fotos reales: ruta a una imagen optimizada (webp/avif). */
  image?: string
}

export const MOMENTS: Moment[] = [
  {
    id: 'cafe',
    art: 'cafe',
    tone: 'butter',
    from: 'valeria',
    label: 'El desayuno',
    time: '8:10 a. m.',
    message: 'Aquí ya amaneció. Te guardé el primer sorbo.',
  },
  {
    id: 'panaderia',
    art: 'panaderia',
    tone: 'pink',
    from: 'mama',
    label: 'La panadería',
    time: '6:30 p. m.',
    message: 'Pasé por la panadería de siempre y me acordé de ti.',
  },
  {
    id: 'ventana',
    art: 'napoles',
    tone: 'sky',
    from: 'valeria',
    label: 'Mi ventana',
    time: '9:45 p. m.',
    message: 'La vista desde mi cuarto. Ya casi me duermo.',
  },
  {
    id: 'cerro',
    art: 'monterrey',
    tone: 'sage',
    from: 'mama',
    label: 'El atardecer',
    time: '7:05 p. m.',
    message: 'Así se veía el Cerro de la Silla hoy. Te lo mando.',
  },
]
