import { BRAND_NAME } from './brand'

// Todos los textos de la página, en español (México) e inglés. El inglés se
// escribe aparte, no se traduce palabra por palabra. La estructura (orden,
// fotos, fechas de ejemplo) vive en content.ts.
//
// Reglas: solo se anuncian funciones confirmadas (compartir momentos, línea
// del tiempo, mapa, calendario, perfil). Sin fechas, cifras ni testimonios.
// Monterrey no cambia de horario e Italia sí: 7 h de diferencia en invierno,
// 8 h en verano. Los ejemplos usan horario de invierno.

const es = {
  htmlLang: 'es-MX',
  quote: (text: string) => `«${text}»`,
  meta: {
    title: `${BRAND_NAME} · Para sentir cerca a quien está lejos`,
    description: `${BRAND_NAME} es una app para iPhone, en desarrollo, para compartir los pequeños momentos del día con las personas que quieres, aunque vivan lejos. Únete a la lista de espera.`,
  },
  lang: { label: 'Idioma', es: 'Español', en: 'English' },
  skip: 'Saltar al contenido',
  home: `${BRAND_NAME}, inicio`,
  headerCta: 'Lista de espera',

  hero: {
    eyebrow: 'App para iPhone · en desarrollo',
    title: '¿Extrañas tu casa?',
    /** Rota en pantalla; el lector de pantalla oye `whoLabel`. */
    who: ['¿A tu mamá?', '¿A tu hermano?', '¿A tu pareja?', '¿A tus amigos?'],
    whoLabel: '¿A tu mamá, a tu hermano, a tu pareja, a tus amigos?',
    lede: `${BRAND_NAME} es una app para compartir los pequeños momentos del día con las personas que quieres, aunque vivan lejos.`,
    cta: 'Unirme a la lista de espera',
    ctaNote: 'Te escribiremos solo para contarte novedades del lanzamiento.',
    placesLabel: 'Dos lugares unidos por el hilo',
    far: {
      city: 'Nápoles',
      time: '9:20 p. m.',
      alt: 'Nápoles de noche desde lo alto: azoteas y calles iluminadas',
    },
    near: {
      city: 'Monterrey',
      time: '2:20 p. m.',
      alt: 'Una tarde en Monterrey: el Cerro de la Silla detrás de árboles y edificios',
    },
    distance: '10,008 km y 7 u 8 horas de diferencia, según la temporada',
  },

  everyday: {
    title: 'No son grandes noticias.',
    text: 'Son las cosas que le contarías si estuviera aquí.',
    sample: 'Ejemplo: Valeria estudia en Nápoles; su mamá vive en Monterrey.',
    hint: '¿Para quién?',
    moments: {
      comida: {
        quote: 'Tienes que probar esto.',
        alt: 'Un plato de pasta con papa y queso provola',
        meta: 'Nápoles · 2:10 p. m.',
        to: 'De Valeria para Mamá',
        there: 'En Monterrey eran las 7:10 a. m.',
      },
      calle: {
        quote: 'Esto me hizo pensar en ti.',
        alt: 'Un callejón de Nápoles con ropa tendida entre los balcones',
        meta: 'Nápoles · 8:40 a. m., camino a clase',
        to: 'De Valeria para Mamá',
        there: 'En Monterrey era la 1:40 a. m.',
      },
      concha: {
        quote: 'Te guardé una concha.',
        alt: 'Una concha de pan dulce en un tazón sobre un mantel',
        meta: 'Monterrey · 6:30 p. m.',
        to: 'De Mamá para Valeria',
        there: 'En Nápoles era la 1:30 a. m.',
      },
    },
  },

  how: {
    title: 'Así funciona',
    steps: [
      { title: 'Toma una foto y escribe una línea.', text: 'Lo que estás viendo, en el momento en que pasa.' },
      { title: 'Le llega a tu persona.', text: 'No tienen que coincidir: lo ve cuando pueda, en su horario.' },
      {
        title: 'Se queda en lo de los dos.',
        text: 'Cada momento se guarda en su línea del tiempo, en el mapa y en el calendario que comparten.',
      },
    ],
    demoLabel: 'Prototipo en desarrollo · datos de ejemplo',
    views: 'Vistas de la app',
    tabs: { timeline: 'Línea del tiempo', map: 'Mapa', calendar: 'Calendario' },
    screen: {
      pair: 'Valeria y Mamá',
      mapTitle: 'Dónde pasó',
      month: 'Noviembre',
      weekdays: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      day: (d: number) => `${d} de noviembre`,
      moments: (n: number) => (n === 1 ? '1 momento' : `${n} momentos`),
      names: { valeria: 'Valeria', mama: 'Mamá' },
      describe: {
        timeline: 'Línea del tiempo de ejemplo: los tres momentos de Valeria y Mamá, del más reciente al más antiguo.',
        map: 'Mapa de ejemplo: un hilo une Monterrey, con un momento, y Nápoles, con dos.',
        calendar: 'Calendario de ejemplo de noviembre: hay momentos los días 12, 18 y 24.',
      },
    },
  },

  situations: {
    title: 'Para cuando…',
    items: [
      {
        title: '…sus horarios no coinciden.',
        text: 'Mandas el momento cuando pasa y tu persona lo ve cuando despierta. Nadie tiene que estar al pendiente del teléfono.',
      },
      { title: '…no sabes qué escribir.', text: 'Una foto y una línea bastan para decir «me acordé de ti».' },
      { title: '…quieres volver a ese día.', text: 'Lo que se mandan queda guardado por fecha y lugar, para los dos.' },
    ],
  },

  faq: {
    title: 'Preguntas',
    items: [
      {
        q: '¿Cuándo sale?',
        a: 'Todavía no tenemos fecha. Si te unes a la lista de espera, te escribimos cuando haya novedades.',
      },
      {
        q: '¿Es solo para parejas?',
        a: 'No. Es para tu familia, tus amistades o tu pareja: cualquier persona que quieras sentir cerca.',
      },
      { q: '¿Funciona en Android?', a: `Por ahora, ${BRAND_NAME} es solo para iPhone.` },
      { q: '¿En qué idiomas está?', a: 'En español y en inglés.' },
      { q: '¿Qué hacen con mi correo?', a: `Solo lo usamos para escribirte sobre el lanzamiento de ${BRAND_NAME}.` },
    ],
  },

  join: {
    title: 'Que lo próximo que compartan empiece aquí.',
    text: 'Únete a la lista de espera. Te escribiremos cuando haya novedades del lanzamiento; nada más.',
    cta: 'Unirme a la lista de espera',
    note: 'La app está en desarrollo y todavía no tiene fecha de lanzamiento.',
  },

  sticky: { cta: 'Unirme a la lista de espera', label: 'Lista de espera' },

  credits: {
    title: 'Fotos',
    provisional: 'Fotos provisionales.',
    changes: 'recortada',
  },
  footer: 'Una app para iPhone, en desarrollo, en español e inglés.',

  waitlist: {
    title: `Lista de espera de ${BRAND_NAME}`,
    close: 'Cerrar la lista de espera',
    loading: 'Cargando el formulario…',
    frameTitle: `Formulario de la lista de espera de ${BRAND_NAME}`,
    altQuestion: '¿No se ve bien?',
    altLink: 'Abre el formulario en una pestaña nueva',
    pending: `El formulario de registro todavía no está conectado. En cuanto esté listo, aquí podrás dejar tus datos para recibir novedades de ${BRAND_NAME}.`,
    backToPage: 'Volver a la página',
    thanksLead: '¡Listo!',
    thanks: `Ya estás en la lista de espera de ${BRAND_NAME}. Te escribiremos cuando haya novedades.`,
    dismiss: 'Cerrar aviso',
  },
  signupInFrame: `¡Listo! Ya estás en la lista de espera de ${BRAND_NAME}.`,
}

export type Copy = typeof es

const en: Copy = {
  htmlLang: 'en',
  quote: (text) => `“${text}”`,
  meta: {
    title: `${BRAND_NAME} · Feel close to the people far away`,
    description: `${BRAND_NAME} is an iPhone app in development for sharing the small moments of your day with the people you love, even when they live far away. Join the waitlist.`,
  },
  lang: { label: 'Language', es: 'Español', en: 'English' },
  skip: 'Skip to content',
  home: `${BRAND_NAME}, home`,
  headerCta: 'Waitlist',

  hero: {
    eyebrow: 'iPhone app · in development',
    title: 'Feeling homesick?',
    who: ['Missing your mom?', 'Missing your brother?', 'Missing your partner?', 'Missing your friends?'],
    whoLabel: 'Missing your mom, your brother, your partner, your friends?',
    lede: `${BRAND_NAME} is an app for sharing the small moments of your day with the people you love, even when they live far away.`,
    cta: 'Join the waitlist',
    ctaNote: 'We’ll only write to tell you about the launch.',
    placesLabel: 'Two places joined by the thread',
    far: {
      city: 'Naples',
      time: '9:20 PM',
      alt: 'Naples at night from above: rooftops and lit streets',
    },
    near: {
      city: 'Monterrey',
      time: '2:20 PM',
      alt: 'An afternoon in Monterrey: Cerro de la Silla behind trees and buildings',
    },
    distance: '10,008 km and 7 or 8 hours apart, depending on the season',
  },

  everyday: {
    title: 'It’s not big news.',
    text: 'It’s the things you’d tell them if they were here.',
    sample: 'Example: Valeria studies in Naples; her mom lives in Monterrey.',
    hint: 'Who’s it for?',
    moments: {
      comida: {
        quote: 'You have to try this.',
        alt: 'A plate of pasta with potatoes and provola cheese',
        meta: 'Naples · 2:10 PM',
        to: 'From Valeria to Mom',
        there: 'It was 7:10 AM in Monterrey',
      },
      calle: {
        quote: 'This made me think of you.',
        alt: 'A Naples alley with laundry hanging between the balconies',
        meta: 'Naples · 8:40 AM, on the way to class',
        to: 'From Valeria to Mom',
        there: 'It was 1:40 AM in Monterrey',
      },
      concha: {
        quote: 'I saved you a concha.',
        alt: 'A concha, Mexican sweet bread, in a bowl on a tablecloth',
        meta: 'Monterrey · 6:30 PM',
        to: 'From Mom to Valeria',
        there: 'It was 1:30 AM in Naples',
      },
    },
  },

  how: {
    title: 'How it works',
    steps: [
      { title: 'Take a photo and write one line.', text: 'Whatever you’re looking at, right when it happens.' },
      { title: 'It reaches your person.', text: 'No need to be awake at the same time: they see it when they can.' },
      {
        title: 'It stays in what you share.',
        text: 'Every moment is saved to your shared timeline, map and calendar.',
      },
    ],
    demoLabel: 'Prototype in development · sample data',
    views: 'App views',
    tabs: { timeline: 'Timeline', map: 'Map', calendar: 'Calendar' },
    screen: {
      pair: 'Valeria & Mom',
      mapTitle: 'Where it happened',
      month: 'November',
      weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      day: (d) => `November ${d}`,
      moments: (n) => (n === 1 ? '1 moment' : `${n} moments`),
      names: { valeria: 'Valeria', mama: 'Mom' },
      describe: {
        timeline: 'Sample timeline: Valeria and Mom’s three moments, newest first.',
        map: 'Sample map: a thread joins Monterrey, with one moment, and Naples, with two.',
        calendar: 'Sample November calendar: there are moments on the 12th, 18th and 24th.',
      },
    },
  },

  situations: {
    title: 'For when…',
    items: [
      {
        title: '…your schedules don’t line up.',
        text: 'You send the moment as it happens and they see it when they wake up. Nobody has to stay glued to their phone.',
      },
      { title: '…you don’t know what to say.', text: 'A photo and one line are enough to say “I thought of you.”' },
      { title: '…you want to go back to that day.', text: 'What you send each other stays saved by date and place, for both of you.' },
    ],
  },

  faq: {
    title: 'Questions',
    items: [
      { q: 'When is it coming out?', a: 'We don’t have a date yet. Join the waitlist and we’ll write when there’s news.' },
      {
        q: 'Is it just for couples?',
        a: 'No. It’s for your family, your friends or your partner: anyone you want to feel close to.',
      },
      { q: 'Does it work on Android?', a: `For now, ${BRAND_NAME} is iPhone only.` },
      { q: 'What languages is it in?', a: 'English and Spanish.' },
      { q: 'What do you do with my email?', a: `We only use it to write to you about the ${BRAND_NAME} launch.` },
    ],
  },

  join: {
    title: 'The next thing you share could start here.',
    text: 'Join the waitlist. We’ll write when there’s launch news, and that’s it.',
    cta: 'Join the waitlist',
    note: 'The app is in development and doesn’t have a launch date yet.',
  },

  sticky: { cta: 'Join the waitlist', label: 'Waitlist' },

  credits: {
    title: 'Photos',
    provisional: 'Placeholder photos.',
    changes: 'cropped',
  },
  footer: 'An iPhone app in development, in English and Spanish.',

  waitlist: {
    title: `${BRAND_NAME} waitlist`,
    close: 'Close the waitlist',
    loading: 'Loading the form…',
    frameTitle: `${BRAND_NAME} waitlist form`,
    altQuestion: 'Not displaying right?',
    altLink: 'Open the form in a new tab',
    pending: `The sign-up form isn’t connected yet. Once it is, you’ll be able to leave your details here to get ${BRAND_NAME} news.`,
    backToPage: 'Back to the page',
    thanksLead: 'Done!',
    thanks: `You’re on the ${BRAND_NAME} waitlist. We’ll write when there’s news.`,
    dismiss: 'Close notice',
  },
  signupInFrame: `Done! You’re on the ${BRAND_NAME} waitlist.`,
}

export const COPY = { es, en }
