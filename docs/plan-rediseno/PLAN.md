# CERCA · Plan de rediseño y cierre de la landing

Rama: `feat/landing-redesign`, creada desde `feat/landing-hilo` @ `5879a30` (árbol limpio, sin cambios por guardar). `feat/landing-hilo` queda intacta con el diseño anterior. No se ha hecho push, merge ni despliegue.

Etiquetas usadas en todo el documento:
- **[C] Confirmado:** está en el código, en el tablero del equipo o lo decidiste tú.
- **[P] Propuesta:** es mía y requiere tu aprobación.
- **[?] Pendiente:** depende de un dato o servicio externo.

Evidencia en esta carpeta:
- `actual-movil.jpg`: la landing actual a 390 px, con hero y 8 pasos de scroll, más 320 px en EN con movimiento reducido.
- `actual-escritorio.jpg`: la landing actual a 1440 × 900.
- `referencia-entrada-escritorio.jpg`: la entrada de ai.engineer, un cuadro cada 200 ms.
- `referencia-movil-scroll.jpg`: la referencia en móvil, durante la entrada y el scroll.

Las capturas se hicieron con Brave headless (Chromium 156) y emulación de dispositivo vía CDP. **No es un iPhone ni un Android reales.**

---

## 1. Diagnóstico de la landing actual

**Lo que funciona y conviene conservar**
- La arquitectura de idiomas: `copy.ts`, separado de `content.ts`; `LangProvider`; y el remontaje de `<Journey key={lang}>`.
- El nombre centralizado en `brand.ts` y el plugin `%BRAND_NAME%`.
- Honestidad: no hay cifras, fechas ni testimonios inventados, y la demostración lleva etiqueta de "datos de demostración".
- Accesibilidad de base: skip link, tabs con flechas, `inert` en la cara oculta, foco que vuelve tras el diálogo, `:focus-visible`, y contenido visible sin JS gracias a la clase `js-motion` con *timeout* de seguridad.
- `Thread.tsx` usa scroll nativo, una tabla longitud→altura y `ResizeObserver`. Es una base buena para el hilo nuevo.
- Compila (`tsc -b && vite build`) y `oxlint` pasa sin avisos.

**Problemas observados en el render (no solo en el código)**
1. **El producto no aparece.** Nunca se ve una pantalla de la app. La "postal" es una metáfora ilustrada. Quien llega entiende "app para compartir momentos", pero no *cómo* se ve ni qué hace (mapa, calendario, línea del tiempo).
2. **La estética se lee genérica.** Hay ilustraciones vectoriales planas tipo stock y 7 bandas saturadas sin jerarquía. Archivo Black y Caveat son la letra "manuscrita" de plantilla. Coordenadas, matasellos y bordes *airmail* son decoración sin función. Es justo lo que pides dejar atrás.
3. **El hilo choca con el texto en móvil.** Cruza «Esto me hizo pensar en ti.» y el párrafo puente (capturas s04 y s05). En escritorio quedan **anillos sueltos** de anclajes que el hilo todavía no alcanza y parecen errores (s03 y s05). La X final se encima con el matasellos «aquí se encuentran» (pendiente conocido).
4. **Zoom fijado con desenfoque.** Fija 110 % de la ventana en móvil y 150 % en escritorio, y anima `filter: blur()` sobre el texto. Durante el scroll el texto se ve borroso (s02). Es costoso y a medias es ilegible.
5. **CTA ambiguo.** "Quiero estar cerca" no dice qué pasa al tocarlo. En móvil, después del hero, la única acción disponible es el botón pequeño del header.
6. **El estado "en desarrollo" casi no se ve.** Aparece en 12 px al final del hero.
7. **Registro (detalle en §9 del checklist):**
   - El iframe es una *app* de Jotform ("Cerca Waiting List") en inglés.
   - La redirección de agradecimiento no está configurada, así que nunca se registra una inscripción.
   - `?registro=confirmado` es manipulable.
   - El iframe pide permisos de cámara, micrófono y ubicación que no necesita.
   - Falta un estado de error o un *timeout* de carga.
   - No hay aviso de privacidad.
8. **Medición inexistente en la práctica.** `track()` empuja a `window.dataLayer`, pero ninguna herramienta lo carga. Hoy no se mide nada.
9. **SEO de SPA.** `index.html` es solo `es-MX`; el inglés existe únicamente por JS. Faltan canonical, `hreflang`, `og:image`, `og:url`, `robots.txt`, `sitemap.xml`, página 404 y `apple-touch-icon`.
10. **Peso.** JS de 388 KB (132 KB gzip), Caveat de 51 KB, y grano SVG `fixed` sobre toda la página (`z-index: 40`).

## 2. Análisis de la referencia (ai.engineer/europe/2027)

### 2.1 Observado
Fuentes: 20 cuadros cada 200 ms con caché caliente, su CSS en línea y su bundle `2027-*.js`. Las duraciones y curvas vienen del CSS, no de la vista.

**Orden de entrada en escritorio**

| t aprox. | Qué aparece | Mecanismo (de su CSS) |
|---|---|---|
| 0–200 ms | Header, navegación y etiqueta vertical "3 DAYS — LONDON, UK" ya están. El hero está vacío. | Sin animación: el marco llega primero. |
| ~200 ms | Titular, palabra por palabra, subiendo desde una máscara. | `maskRise`: `translateY(110%)`→0 en el primer 35 % de 2.8 s, `cubic-bezier(.22,1,.36,1)`, +80 ms por palabra, delay 200 ms. |
| 0–1.6 s | Retícula de líneas de 1 px que se trazan desde el borde. | `scaleX`/`scaleY` de 0 a 1, 1.4–1.6 s, +90 ms por línea. |
| 300 / 500 ms | Fotos (Big Ben y una tira lateral) que se revelan de abajo hacia arriba. | `clip-path: inset(100% 0 0 0)`→0, 1.2 s, `--reveal-ease: cubic-bezier(.77,0,.18,1)`. La tira tiene `data-parallax`. |
| 450 / 600 ms | Dos cajas negras "cortina": la caja crece de izquierda a derecha y luego se retira hacia la derecha, descubriendo el texto. Parece que se escribe. | `curtain`: 1.1 s. La primera mitad hace `clip-path` del contenedor y la segunda, `scaleX(1→0)` de un `::after` con `transform-origin: right`. |
| 800–1000 ms | Párrafo, botón y logo del patrocinador. | `fade`, 900 ms `ease-out`. |
| cada 2 s | Las cajas alternan "ExCeL London ↔ Tickets Available" y "February 17-19 ↔ Buy Tickets →". | `setInterval` de 2000 ms. Sale el texto viejo hacia arriba y entra el nuevo desde abajo (700 ms). Solo se activa sin movimiento reducido. |

**Con scroll:** cada bloque `[data-reveal]` se revela una sola vez al entrar en vista (`IntersectionObserver`, `rootMargin: 0 0 -10% 0`, `unobserve` después). Los mismos cinco verbos se reutilizan en toda la página: `words`, `mask`, `mask-down`, `curtain` y `fade`. Hay *parallax* suave en algunas imágenes (0.05–0.12) y un *marquee* de logos.

**Móvil:**
- La composición se apila y se centra.
- El CTA se vuelve un botón a todo el ancho.
- La foto del hero sale del primer viewport.
- Entra la misma coreografía y la fila de logos queda al fondo.
- La retícula se mantiene.

**Movimiento reducido:** el estado final aparece desde el primer cuadro (lo verifiqué). Solo añaden la clase `motion-ready` si no se pide reducir movimiento, y el contenido nunca depende de JS para verse.

**Lo que no pude verificar:**
- Cargan un módulo con `new X({autoRaf: true, anchors: true})`. Por esas opciones *parece* Lenis (scroll suavizado), pero no lo confirmé.
- La suavidad del scroll en un dispositivo real.
- El comportamiento en Safari.
- Los cuadros en t = 0 están contaminados por la carga de red. El orden relativo sí es fiable.

### 2.2 Qué trasladar a CERCA (propuesta)
- **[P] El marco llega primero y el mensaje es lo primero que se mueve.** El texto es real desde el HTML y la animación solo lo "descubre". Puedes leer y tocar el CTA en t = 0.
- **[P] Un vocabulario corto y repetido:** máscara de palabras, máscara de foto y cortina, más el hilo como único gesto propio de CERCA. Eso da coherencia, en lugar de un efecto distinto por sección.
- **[P] Una sola curva de revelado** (`.77,0,.18,1`) y otra de salida (`.22,1,.36,1`), con duraciones de 0.7 a 1.2 s y desfases de 80 a 150 ms.
- **[P] El "cycle" con propósito:** en CERCA alterna *a quién* extrañas (mamá → tu hermano → tu pareja → tu mejor amiga). Así deja claro que la app no es solo para parejas.
- **[P] No adoptar:**
  - La retícula técnica de 1 px, que es estética de conferencia.
  - El scroll suavizado (Lenis), porque pides scroll nativo.
  - El *marquee* de logos, porque no hay socios que mostrar.

## 3. Dirección visual recomendada: «Dos horarios, un hilo»

**Idea.** Quien vive lejos tiene dos relojes. Cuando en Nápoles son las 9:20 p. m., en Monterrey es la 1:20 p. m. La extrañeza pega de noche. Por eso:
- La página **empieza de noche**: fondo oscuro, la luz de una ventana y luces suaves azul y violeta como iluminación de ciudad.
- **Amanece al bajar** hacia papel cálido y claro, donde están las fotos de lo cotidiano, el producto y el formulario.

El rojo del hilo es lo único que cruza ambos mundos. **[P]**

**Por qué una base mixta y no toda oscura:**
- La noche da atmósfera y hace que el hilo brille. Es tu referencia de iluminación (ver §9: la imagen adjunta no llegó).
- La lectura larga, las fotos de comida y calle (que se ven mejor sobre claro) y el formulario, donde el contraste y la confianza importan, viven en claro.

### Tokens [P]
| Token | Valor | Función | Contraste medido |
|---|---|---|---|
| `--night` | `#0F1124` | Fondo del hero y del agradecimiento | — |
| `--night-2` | `#181B36` | Superficies sobre la noche | — |
| `--on-night` | `#F4EFE6` | Texto sobre la noche | 16.3:1 |
| `--on-night-2` | `#A9A6C2` | Texto secundario sobre la noche | 7.9:1 |
| `--paper` | `#FAF6EF` | Fondo claro | — |
| `--ink` | `#1C1A1F` | Texto y CTA sobre claro | 16.0:1 |
| `--ink-2` | `#5E5966` | Texto secundario sobre claro | 6.3:1 |
| `--thread` | `#D8414A` | **Solo el hilo y sus nudos.** Nunca texto, botón ni fondo. | 4.2:1 sobre noche y 4.1:1 sobre papel (≥3:1 para gráficos) |
| `--thread-glow` | `rgb(216 65 74 / .35)` | Halo del hilo de noche y punta luminosa | — |
| `--glow-blue` | `#4B63FF` al 18–28 % | Luz ambiental en radiales grandes | Decorativo |
| `--glow-violet` | `#7A5CFF` al 14–22 % | Luz ambiental | Decorativo |

Reglas de color:
- Los degradados son solo **radiales de luz ambiental**, como máximo 2 por viewport y solo en las secciones de noche (hero, transición y gracias).
- El hilo nunca lleva degradado: es rojo sólido y, de noche, con un halo rojo tenue.
- El CTA es papel sobre noche o tinta sobre papel. **No es rojo**, para que el rojo siga significando el vínculo.

### Tipografía [P, decide en Fase 1]
Evaluación de la combinación actual:
- **Archivo Black** grita y se siente infantil frente al tono íntimo.
- **Caveat** finge una mano humana, que es uno de los tics más "generados".
- **Instrument Serif + Inter** es hoy la pareja por defecto de las landings hechas con IA. El hook de impeccable la marca, y aun así es la que usan tus videos.

Recomiendo:
- **Newsreader** (OFL, variable, con eje óptico 6–72). Es una serif editorial de lectura, con itálica de verdad y acentos del español bien dibujados. Funciona para el titular y para la "voz del mensaje" (las frases que alguien manda) en itálica. Se siente a carta, no a conferencia.
- **Inter se queda solo para la interfaz** (botones, formulario, etiquetas y textos de la app), por legibilidad en tamaños chicos y para coincidir con los videos. Se eliminan Archivo Black y Caveat.

Si prefieres romper con Inter por completo, la alternativa es Newsreader + Hanken Grotesk. Lo comparamos en el hero real en la Fase 1.

| Rol | Fuente | Móvil (320–430) | Escritorio (≥1024) | Interlínea |
|---|---|---|---|---|
| Display H1 | Newsreader 500, opsz 72 | `clamp(2.5rem, 9vw, 3.25rem)` | hasta 5.5rem | 1.02 |
| H2 | Newsreader 500 | 2rem | 3.25rem | 1.08 |
| Voz del mensaje | Newsreader *italic* 400 | 1.375rem | 1.75rem | 1.3 |
| Cuerpo | Inter 400 | 1.0625rem (17 px) | 1.125rem | 1.55 |
| UI y etiquetas | Inter 600 | 0.9375rem | 0.9375rem | 1.3 |

### Espacio y forma [P]
- Escala de 4 pt: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112.
- Margen lateral: 20 px en móvil, 40 px en tablet y columnas de 12 con un máximo de 1200 px en escritorio.
- Ritmo vertical entre secciones: 96 px en móvil y 160 px en escritorio.
- Radios: 4 px en las fotos (papel fotográfico, no tarjetas de app), 999 px en los botones y 28 px en el marco del teléfono.
- Sombras de una sola capa y suaves: fotos "apoyadas", no flotando.

### Movimiento [P]
| Token | Valor | Uso |
|---|---|---|
| `--ease-reveal` | `cubic-bezier(.77,0,.18,1)` | Máscaras de foto y cortinas (de la referencia) |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | Palabras, entradas y UI |
| `--dur-micro` | 160 ms | Presión de botón y cambio de estado |
| `--dur-ui` | 320 ms | Tabs, flip, apertura de recuerdo |
| `--dur-cycle` | 700 ms | Rotación de "a quién" |
| `--dur-reveal` | 1100 ms | Fotos y cortinas |
| `--stagger` | 80 ms por palabra, 150 ms entre piezas | — |

## 4. Recorrido y contenido

**Público [C + P].**
- *Confirmado* (Trello, "MVP Scope v1"): "familia y personas cercanas que viven en lugares distintos".
- *Principal propuesto:* quien se fue (estudiantes y personas que se mudaron de ciudad o de país, sobre todo hispanohablantes como tu caso Monterrey → Nápoles), que extraña y quiere sumar a su gente.
- *Secundario:* la familia o las amistades que se quedaron.
- La pareja aparece como un caso más, no como el centro.

**Funciones que se pueden anunciar [C]:** compartir momentos (foto y una línea) con tu gente, más **mapa**, **línea del tiempo**, **calendario** y **perfil y agregar personas**.

Con matices:
- "El mapa muestra dónde pasó cada momento" y "el calendario ordena los momentos por día" son *supuestos de trabajo* del equipo, todavía sin decisión cerrada. Los redacto de modo que sigan siendo ciertos si cambian.
- **No se anuncian** botella con entrega diferida, cartas, audio ni gestos.
- Ojo: el calendario de Alexa *se dibuja* como botellas en un estante (`CalendarBottlesView`). Si mostramos esa pantalla, es "calendario", no la función "botella".
- "Sin visto ni escribiendo…" es una decisión de diseño de Sketch y un supuesto de Trello, no un compromiso del equipo. No lo pongo como promesa hasta que lo confirmen.

**Recorrido [P]** (copy en es-MX; el inglés se escribe aparte, no se traduce literal).

| # | Sección | Objetivo | Contenido |
|---|---|---|---|
| 0 | **Hero · noche** | Qué es, para quién, valor, estado y acción en el primer viewport | Eyebrow: «App para iPhone · en desarrollo». H1: «¿Extrañas tu casa?». Bajada: «CERCA es una app para compartir los pequeños momentos del día con *[mamá ↻ tu hermano ↻ tu pareja ↻ tu mejor amiga]*, aunque vivan lejos.» CTA: **«Unirme a la lista de espera»**. Microcopy: «Solo tu correo. Te escribimos cuando haya novedades.» Dos fotos-ventana, Nápoles de noche y Monterrey de tarde, con la **hora real actual** de cada ciudad (`Intl`, no datos falsos) unidas por el hilo. |
| 1 | **Lo cotidiano** | Identificación | «No son grandes noticias. Es lo que le contarías si estuviera aquí.» Tres o cuatro fotos reales: la comida que no sabe igual, la calle de camino a clase, la vista desde tu ventana, el pan dulce en casa de mamá. Cada una con su frase en itálica («Tienes que probar esto.», «Esto me hizo pensar en ti.») y la hora en ambos lados. |
| 2 | **Así funciona** | Demostración comprensible | Tres pasos: *Toma la foto y escribe una línea* → *Le llega a tu persona* → *Se guarda en lo de los dos: línea del tiempo, mapa y calendario*. Teléfono con pantallas del **prototipo** y selector Línea del tiempo · Mapa · Calendario. Etiqueta fija: «Prototipo en desarrollo · datos de ejemplo». |
| 3 | **Para cuando…** | Beneficios en situaciones reales | «…hay ocho horas de diferencia»: el momento te espera, no hay que coincidir. «…no sabes qué escribir»: una foto basta. «…quieres volver a ese día»: todo queda guardado por lugar y fecha. Sin promesas técnicas. |
| 4 | **Preguntas** | Quitar fricción y fijar expectativas | ¿Cuándo sale? «Todavía no tenemos fecha; te avisamos por correo.» ¿Android? «Por ahora, solo iPhone.» ¿Qué hacen con mi correo? «Solo lo usamos para avisarte del lanzamiento. Puedes darte de baja cuando quieras.» ¿Cuánto cuesta? Solo si el equipo lo decide; si no, se omite. |
| 5 | **Registro (en la página)** | Conversión | Título: «Que lo próximo que compartan empiece aquí.» Formulario integrado (ver §9 del checklist): correo, nombre opcional, consentimiento y enlace al aviso de privacidad. El hilo llega hasta el botón. |
| 6 | **Gracias · amanece** | Cierre emocional y expectativas | El formulario se reemplaza en su sitio. El hilo hace un nudo: «Listo. Ya estás en la lista.» «Te escribiremos a m•••@gmail.com cuando haya novedades. Nada más.» Acción secundaria: «¿Conoces a alguien lejos de casa? Compártela», con `navigator.share` y "copiar enlace" como alternativa. |
| — | **Footer** | Confianza | Privacidad, contacto, créditos de fotos, «Las pantallas son de un prototipo; personas y mensajes son de ejemplo.» |

**CTA persistente en móvil [P]:** barra inferior con `env(safe-area-inset-bottom)` que aparece cuando el CTA del hero sale de pantalla. Se oculta cuando el formulario está en vista o el teclado está abierto, y nunca tapa contenido: el `padding-bottom` del body es igual a su altura. Todos los CTA **desplazan al formulario y enfocan el correo**. Ya no hay modal.

## 5. Storyboard de entrada e interacciones

### 5.1 Entrada (sin movimiento reducido)
El HTML ya trae todo el texto. Un script en línea añade `motion-ready` antes del primer pintado y una salvaguarda la quita a los 2.5 s. **El CTA es clicable desde el primer cuadro.**

| t | Móvil (390 × 664 útil) | Escritorio (1440 × 900) |
|---|---|---|
| 0 | Noche, header y eyebrow visibles. Las luces ambientales están en opacidad 0. | Igual, con columnas de texto a la izquierda y fotos a la derecha. |
| 0–1200 | Las luces azul y violeta suben de 0 a 1 en opacidad (solo opacidad, sin `filter`). | Igual, con una deriva de 2 % en `transform` durante 20 s, solo en escritorio y pausada fuera de pantalla. |
| 150 | El H1 sube por palabras desde la máscara: 900 ms, `--ease-out`, +80 ms por palabra. | Igual. |
| 450 | Bajada, `fade` + 8 px, 700 ms. El "a quién" entra con la frase. | Igual. |
| 550 | CTA y microcopy, `fade` 500 ms (ya clicables). | Igual. |
| 650 | Foto Nápoles: máscara de abajo arriba, 1100 ms, `--ease-reveal`. | Foto Nápoles (grande) con máscara. |
| 800 | La foto Monterrey asoma bajo el pliegue con `mask-down`. | Foto Monterrey (más chica, desplazada) con `mask-down`. |
| 1000 | Hilo de Nápoles a Monterrey: `stroke-dashoffset`, 1000 ms. La punta brilla. | Igual, cruzando el canal entre fotos. |
| 1300 | Etiquetas de hora en cortina: «Nápoles · 9:20 p. m.», «Monterrey · 1:20 p. m.». | Igual. |
| 2600+ | El "a quién" rota cada 2.6 s (700 ms). Se detiene con foco o hover, cuando sale de pantalla y tras 3 vueltas. | Igual. |

Reglas de la entrada:
- Se entiende y se puede actuar sin esperar.
- Con **movimiento reducido** el estado final aparece desde t = 0: el hilo completo, sin rotación y con la frase completa «con las personas que quieres».
- Un lector de pantalla nunca oye la rotación: el texto rotativo es `aria-hidden` y hay un equivalente fijo.

### 5.2 Animaciones por sección
| Animación | Comunica | Disparador | Elemento y propiedades | Duración y easing | Móvil / escritorio | Movimiento reducido | Riesgo y verificación |
|---|---|---|---|---|---|---|---|
| Entrada del hero | Vínculo entre dos lugares | Carga | Palabras `translateY`; fotos `clip-path`; hilo `stroke-dashoffset`; luces `opacity` | Ver §5.1 | Igual; la deriva de luz solo en escritorio | Estado final | `clip-path` se pinta en el hilo principal pero es barato en áreas chicas. Verificar LCP (la foto **no** se oculta con `opacity` 0 para no retrasar el LCP) y grabar en Performance de DevTools que no haya *long tasks* > 50 ms. |
| Hilo por la página | Lo que vives le llega a alguien | Scroll nativo (rAF pasivo) | `stroke-dashoffset` y la punta | Inercia de 0.6 s, `power3.out` | Móvil: carril fijo en el margen izquierdo, a 12 px del borde y sin cruzar texto. Escritorio: curvas libres entre fotos. | Hilo completo y estático | Recalcular con fuentes, `img.decode()`, resize, orientación y cambio de idioma. Pruebas a 320, 390, 768 y 1440. |
| Fotos de lo cotidiano | Se descubre un momento | Entrar en vista (una vez) | `clip-path` + rotación de ±2° | 1100 ms `--ease-reveal`, 150 ms entre fotos | Móvil apiladas; escritorio en mosaico | Visibles | Ninguno relevante. |
| Rotación "a quién" | No es solo para parejas | Temporizador | `translateY` del ítem | 700 ms | Igual | Texto fijo | Pausar con `visibilitychange`. |
| Pantallas del teléfono | Cómo es la app | Tap en el selector | Fundido cruzado de capturas: `opacity` + `translateY` de 8 px | 320 ms `--ease-out` | Igual | Cambio instantáneo | Precargar las 3 capturas tras la primera interacción. |
| Pasos "Así funciona" | Secuencia de uso | Escritorio: scroll con teléfono `position: sticky` (CSS, ~3 pasos, sin *pin* de GSAP). Móvil: botones + *scroll-snap* horizontal. | Resaltado del paso: `opacity` | 320 ms | Sin sticky en móvil | Igual sin transición | El *sticky* debe medir menos de 2 viewports. |
| Nudo de gracias | Ya quedó unido | Respuesta 2xx del servidor | Trazo del nudo y `scale` 0.96→1 del mensaje | 900 ms | Igual | Nudo dibujado | Solo tras éxito real. |
| Transición noche → día | Paso del tiempo | Scroll scrub entre el hero y la sección 1 | `opacity` de una capa de papel sobre la noche (no animar `background-color` de toda la página) | Ligado al scroll | Igual | Corte limpio | Barato: es una sola capa compuesta. |

**Se elimina:**
- El zoom fijado.
- `filter: blur()` animado.
- El grano `fixed` a pantalla completa. Si se quiere grano, que sea estático en las secciones de noche.
- Rebotes `elastic` y `back`, que dan un tono infantil.

### 5.3 Interacciones táctiles
| Interacción | Propósito | Gesto | Alternativa visible y accesible |
|---|---|---|---|
| Tocar una foto de lo cotidiano | Descubrir un recuerdo | La foto se voltea y muestra quién lo mandó, la frase y «allá eran las 3:40 p. m.» | Es un `<button aria-expanded>`. Funciona con Enter o Espacio, se cierra con Escape y muestra la indicación «Toca para ver a quién se lo mandó». Nada depende de *hover*. |
| Selector Línea del tiempo · Mapa · Calendario | Explorar el producto | Tap; *swipe* horizontal opcional | Tabs con flechas de teclado y objetivos ≥ 44 × 44 px. El *swipe* nunca es la única vía. |
| Arrastrar el hilo entre las dos ventanas del hero **[P, opcional]** | Ver cómo el hilo une dos momentos | Arrastrar la cuenta del hilo de una ciudad a la otra cambia qué hora se resalta | Hay dos botones «Ver Nápoles» y «Ver Monterrey». Si no aporta en las pruebas, se descarta. |
| CTA y barra inferior | Registrarse | Tap | Enlace a `#lista` con un *scroll* que respeta el movimiento reducido y enfoca el campo de correo. |
| Compartir en Gracias | Difusión | `navigator.share` | Botón «Copiar enlace» con confirmación `aria-live`. |

## 6. Plan de fotografías y recursos

**Criterio.** Fotos reales de cosas y lugares, con manos como mucho. Sin retratos posados ni caras de "personas" que no lo son. Que no parezcan banco de imágenes: luz real, algo de desorden, hora del día visible.

| ID | Foto | Función | Origen recomendado | Encuadre | Alt (es) |
|---|---|---|---|---|---|
| H1 | Ventana de noche en Nápoles, con luz cálida dentro y la ciudad o el mar fuera | Hero, el lado de quien se fue | **Tuya**: vives ahí y es lo más auténtico | Móvil 4:5, ventana centrada. Escritorio 3:4 con aire a la izquierda. | «Vista nocturna desde una ventana en Nápoles» |
| H2 | Tarde en Monterrey: cocina, patio o Cerro de la Silla desde una calle | Hero, el lado de casa | Familia en Monterrey (con permiso). Alternativa: Wikimedia CC BY o Unsplash. | 4:5 y 3:2 | «Tarde en Monterrey con el Cerro de la Silla al fondo» |
| M1 | Un plato de comida en la mesa de un depa de estudiante | «Tienes que probar esto.» | Tuya | 4:5 | Descriptivo del plato real |
| M2 | Calle de camino a clase o mercado | «Esto me hizo pensar en ti.» | Tuya | 4:5 | — |
| M3 | Pan dulce o café en casa de mamá | Respuesta desde casa | Familia | 1:1 | — |
| M4 | Vista desde tu ventana de día | «Ojalá pudieras estar aquí.» | Tuya | 4:5 | — |
| P1–P3 | Capturas de **Línea del tiempo, Mapa y Calendario** del simulador de iOS | Demostración | Ramas SwiftUI del equipo: calendario en `main`, perfil en `origin/feat/Profile_addContacs` (Nancy, 2 nov). Mapa y línea del tiempo **todavía no están en el repo**. | Captura a 1179 × 2556 dentro de un marco CSS (sin marco de Apple) | «Prototipo de CERCA: calendario con momentos de ejemplo» |
| OG | Imagen social 1200 × 630 por idioma | Compartir | Composición propia: H1 + hilo + nombre | — | — |

**Disponible hoy:**
- `~/ECC/Cerca-Keynote/assets/naples_vesuvius.jpg`, de Wikimedia. Es un *placeholder*: hay que revisar su licencia en el frame de créditos de Sketch antes de usarlo.
- Las pantallas Sketch en `assets/*.png`. Según tu propia regla **no son la UI final**, así que no las presento como la app.
- Las capturas reales del calendario y del perfil están por generar en el simulador.
- Hay fotos HEIC tuyas en `~/Downloads` (`IMG_0417…IMG_0808`). No las abrí; dime si son candidatas.

**Falta:** H1, H2, M1–M4 reales; capturas de mapa y línea del tiempo; OG.

**Licencias:**
- Fotos propias: sin atribución, aunque se puede poner crédito "Foto: Marcelo Sias".
- Unsplash: licencia propia, sin atribución obligatoria; igual pondremos crédito.
- Wikimedia CC BY o BY-SA: atribución obligatoria (autor, licencia y enlace) en el footer.
- Ninguna foto con caras identificables sin consentimiento escrito.

**Optimización [P]:**
- `scripts/images.mjs` con **`sharp`** como devDependency, solo en *build*. Se justifica porque genera AVIF + WebP + JPEG con anchos 480/800/1200/1600 y recortes 4:5 y 3:2.
- `<picture>` con dirección de arte por *breakpoint*, `width`/`height` explícitos (CLS 0), `fetchpriority="high"` y sin `loading="lazy"` en H1.
- El resto con `loading="lazy"` y `decoding="async"`.
- Presupuesto: H1 móvil ≤ 120 KB AVIF; cada foto de momento ≤ 80 KB.
- Se eliminan EXIF y GPS (privacidad: tus fotos llevan tu ubicación).

## 7. Fases de implementación
Cada fase termina con capturas para que las revises antes de seguir.

### Fase 0 · Preparación (½ día)
- Rama creada ✔.
- Medir la línea base de rendimiento con Lighthouse móvil sobre `vite preview`.
- Añadir **`@playwright/test`** (devDependency). Se justifica por las pruebas E2E de registro, idioma y navegación y por las capturas en Chromium y **WebKit**, que es la aproximación a Safari.
- Guardar el script de capturas en `scripts/shots.mjs`.
- **Criterio de aceptación:** `npm run test:e2e` corre una prueba de humo en Chromium y WebKit.

### Fase 1 · Dirección visual, hero móvil y mensaje (2–3 días)
- **Archivos:**
  - `src/index.css` se reescribe en `src/styles/tokens.css`, `base.css` y `sections/*.css`.
  - Fuentes en `src/assets/fonts/`: se añade Newsreader variable y se eliminan Archivo Black y Caveat.
  - `copy.ts`: hero ES/EN y nuevas claves para eyebrow, *who-cycle* y microcopy.
  - Nuevo `src/components/Hero.tsx`.
  - `App.tsx` provisional con solo el hero y el resto ocultos tras una bandera.
- **Dependencias:** Newsreader OFL, alojada localmente. Fotos H1 y H2 o *placeholders* reales temporales marcados.
- **Criterios de aceptación:**
  - A 390 × 664 y a 320 × 568, en ES y EN, sin scroll, se ven: qué es, para quién, valor, «en desarrollo» y el CTA.
  - Contraste AA en todo el texto.
  - CTA ≥ 48 px de alto.
  - Sin desbordamiento horizontal a 320 px.
  - Escritorio con composición propia (texto en 5 columnas, fotos en 7 columnas desplazadas).
  - Comparativa tipográfica en el hero real y **tu aprobación de la dirección**.

### Fase 2 · Recorrido y contenido (2–3 días)
- **Componentes nuevos:**
  - `Everyday.tsx` (fotos de lo cotidiano)
  - `HowItWorks.tsx` + `PhoneFrame.tsx` (demostración)
  - `Situations.tsx`
  - `Faq.tsx` (`<details>` nativo)
  - `WaitlistSection.tsx`
  - `StickyCta.tsx`
  - `Footer.tsx` con créditos
- **Se retiran:** `Stamp`, `Postmark`, `Terrain`, `Art` y `Postcard`, salvo `MiniMap` si sirve como respaldo del mapa.
- `content.ts` pasa a un modelo de fotos (`src`, `srcset`, `alt` ES/EN, crédito).
- **Criterios de aceptación:**
  - Todo el copy en ES y EN revisado como texto nativo, no traducción.
  - Ninguna función no confirmada.
  - Etiqueta de prototipo visible en el teléfono.
  - Estructura semántica: un `h1`, `h2` por sección y `landmarks`.

### Fase 3 · Interacciones y animación (2–3 días)
- **Archivos:**
  - `motion.ts` reescrito con los cinco verbos más el hilo, `gsap.matchMedia` y ScrollTrigger solo para revelados *once* y el *scrub* noche → día.
  - `Thread.tsx`, con:
    - carril móvil;
    - anclajes que solo existen donde hay nudo visible, para que no queden anillos sueltos;
    - recálculo con `img.decode()`, `orientationchange` y `visualViewport`;
    - final en el botón de envío y nudo en Gracias.
  - Script en línea `motion-ready` en `index.html`.
- **GSAP:** se mantienen ScrollTrigger y SplitText. El hero puede hacerse con CSS para no esperar al JS; GSAP queda para el hilo y el scroll.
- **Criterios de aceptación:**
  - El hilo nunca cruza texto a 320, 390, 768, 1024 y 1440 px, en ES y EN.
  - Llega al formulario.
  - Con movimiento reducido todo es visible y estático.
  - Si el JS falla, todo el contenido se ve (prueba con JS desactivado).
  - Sin *long tasks* > 50 ms durante el scroll en la grabación con CPU ×4.

### Fase 4 · Registro y agradecimiento completos (2 días + configuración externa)
- **[P] Opción recomendada:** formulario propio en la página + función *serverless* `POST /api/waitlist`. La función:
  - valida;
  - aplica un *honeypot* y un límite por IP;
  - envía a la **API de Jotform** (`POST /form/{formId}/submissions`, con la clave en una variable de entorno del servidor);
  - responde 2xx solo si Jotform confirma.

  Con eso se resuelven a la vez el diseño propio, ES/EN, todos los estados y la **conversión verificada** (el evento sale de la respuesta del servidor, no de la URL). Jotform sigue siendo la base de datos, que es la herramienta que ya eligieron.
- **Opción B:** si no habrá *serverless*, se queda el iframe de Jotform con estas mejoras:
  - formulario traducido en Jotform;
  - *timeout* de 8 s con reintento y enlace;
  - sin permisos de cámara, micrófono ni ubicación;
  - redirección de agradecimiento con `{id}` de envío.

  Aun así, la conversión sería **"confirmación visual"**, no verificada. El conteo real se reconcilia con el total de envíos en Jotform.
- **Archivos:** `WaitlistSection.tsx`, `api/waitlist.ts` (según el hosting), `analytics.ts`, `copy.ts` (errores y estados) y las páginas `privacidad`.
- **Criterios de aceptación:** checklist §8.1 en verde con pruebas Playwright que simulan 2xx, 4xx, 5xx y *timeout*.

### Fase 5 · SEO, idiomas y publicación (1–2 días, parte bloqueada por dominio y hosting)
- **Ahora:**
  - Prerender por idioma **sin dependencias nuevas**: `vite build --ssr src/entry-server.tsx` + `scripts/prerender.mjs`, usando `react-dom/server` → `dist/es/index.html` y `dist/en/index.html` con `lang`, `title`, `description`, OG y JSON-LD `MobileApplication` (sin reseñas ni precio).
  - Hidratación con `hydrateRoot`.
  - El idioma pasa de `?lang=` a la ruta; `?lang=` sigue funcionando como redirección.
  - Raíz `/` = `x-default`.
  - `404.html` bilingüe.
  - Favicon SVG + `apple-touch-icon` 180 px + `site.webmanifest` desde el icono de `~/ECC/CercaIcon`.
  - Generadores de `sitemap.xml` y `robots.txt` parametrizados por `SITE_URL`.
- **Cuando haya dominio:** canonical absolutas, `hreflang` recíprocos (`es-MX`, `en`, `x-default`), `og:url`, `og:image` absolutos, *sitemap* con alternates y Search Console.
- **Cuando haya hosting:**
  - HTTPS y HSTS.
  - Redirección `/`→`/es/` o `/en/` por `Accept-Language`, con `Vary` (solo si el host lo soporta; si no, `/` muestra contenido y enlaces).
  - Cabeceras de caché inmutable en `/assets/*`.
  - `X-Robots-Tag: noindex` en previews.
  - CSP básica.
- **Criterios de aceptación:**
  - `curl /es/` y `curl /en/` devuelven el contenido completo en HTML.
  - El validador de `hreflang` no da errores.
  - La vista previa de OG es correcta (opengraph.xyz).
  - Las rutas directas y el 404 funcionan.

### Fase 6 · Medición, accesibilidad, rendimiento y QA (2 días)
- Analítica *cookieless* (ver §9) y esquema de eventos (§8.4).
- Auditoría con axe en Playwright.
- Pruebas con VoiceOver (macOS y, si se puede, iOS) y teclado completo.
- Pruebas en dispositivos: iPhone Safari real y Android Chrome real si hay uno disponible; si no, se documenta como emulación.
- Lighthouse móvil ×3 (mediana).
- **Criterio de aceptación:** checklist §8 completo y documentado en `docs/plan-rediseno/QA.md`.

**Total estimado:** 11–15 días de trabajo. Es una estimación, no un compromiso.

## 8. Checklist final

### 8.1 Registro
- [ ] Campos:
  - Correo (obligatorio, `type=email`, `autocomplete=email`, `inputmode=email`).
  - Nombre (opcional).
  - Consentimiento con texto claro y enlace a privacidad.
  - Ocultos: `lang` y `source` (ubicación del último CTA y UTM). **[?]** Pregunta opcional «¿con quién la usarías?» (familia, pareja, amistades).
- [ ] Validación al salir del campo y al enviar. El mensaje de error está ligado con `aria-describedby`, el foco va al primer error y el texto es claro: «Revisa el correo: falta la @».
- [ ] Estados: *idle*, enviando (botón deshabilitado + `aria-busy` + «Enviando…»), éxito, error de red («No pudimos enviarlo. Revisa tu conexión e inténtalo de nuevo.» + reintento conservando lo escrito) y error del servidor (con enlace alternativo).
- [ ] **Nunca** se muestra éxito sin 2xx del servidor. Un clic no es registro. `?registro=confirmado` deja de existir o solo muestra un aviso sin contar conversión.
- [ ] Doble envío bloqueado; *honeypot*; límite de envíos.
- [ ] Teclado virtual: el campo enfocado queda visible (`scrollIntoView` + `visualViewport`), la barra fija se oculta, `enterkeyhint="send"` y sin zoom en iOS (fuente ≥ 16 px).
- [ ] Aviso de privacidad ES/EN publicado. **[?]** Responsable, contacto y base legal: GDPR por Italia y LFPDPPP por México.

### 8.2 Agradecimiento
- [ ] Reemplaza el formulario en su sitio con `role="status"` y el foco en el título.
- [ ] Dice qué ocurrió («Ya estás en la lista»), a qué correo (enmascarado) y qué esperar («te escribimos cuando haya novedades; nada más»).
- [ ] Compartir es opcional. No hay promesas de acceso anticipado ni de fecha.
- [ ] Al recargar no reaparece un éxito falso. Puede quedar «Ya te registraste en este navegador» con `localStorage`, solo como aviso.

### 8.3 Responsive y táctil
- [ ] 320, 360, 390, 430, 768, 1024, 1280 y 1440 px. Horizontal en móvil. Sin desbordamiento.
- [ ] Objetivos ≥ 44 × 44 px. `safe-area-inset-*`. `100svh`/`dvh` donde aplique. Nada esencial por *hover*.
- [ ] Ningún *pin* en móvil. *Sticky* solo en escritorio y corto.

### 8.4 Medición
| Evento | Cuándo | Parámetros | Deduplicación |
|---|---|---|---|
| `cta_click` | Tap en un CTA | `location` (`hero`, `sticky`, `how`, `faq`, `header`), `lang` | Ninguna (son clics) |
| `waitlist_view` | El formulario entra en vista | `lang` | Una vez por sesión |
| `waitlist_start` | Primer foco en el correo | `lang` | Una vez por sesión |
| `waitlist_submit` | Envío válido | `lang` | — |
| `waitlist_signup_verified` | Respuesta 2xx del servidor | `lang`, `last_cta` | Una vez por sesión |
| `waitlist_error` | Fallo | `lang`, `kind` (`network`, `server`, `validation`) | — |
| `demo_view_change`, `moment_open` | Interacción | `view` / `moment` | — |

- Nunca se envían correo, nombre ni texto libre.
- El conteo real de registros sale de Jotform, el total de envíos. La analítica sirve para el embudo.

### 8.5 Accesibilidad
- [ ] Contraste AA (tokens ya medidos). Foco visible sobre noche y sobre papel (anillo papel/tinta de 3 px).
- [ ] Un `h1`, orden lógico, `lang` correcto por página y `lang` en el botón del otro idioma.
- [ ] VoiceOver: imágenes con `alt` útil y decorativas `alt=""`. El hilo es `aria-hidden`. La rotación de "a quién" tiene equivalente fijo.
- [ ] Movimiento reducido: todo visible y estático. Sin JS: todo visible.

### 8.6 Rendimiento
Objetivos de **laboratorio** (Lighthouse móvil, Moto G Power simulado, 4G lenta):
- LCP ≤ 2.5 s
- CLS ≤ 0.05
- TBT ≤ 200 ms
- JS inicial ≤ 140 KB gzip
- Fuentes ≤ 90 KB en total

Objetivos de **campo**, cuando haya datos reales (CrUX o la herramienta de analítica, p75): LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.

Se reportan por separado; el laboratorio no sustituye al campo.

### 8.7 SEO e idiomas
- [ ] `/es/` y `/en/` con HTML completo, `title` y `description` propios, canonical a sí mismos y `hreflang` recíprocos + `x-default`.
- [ ] OG y Twitter con imagen por idioma. Favicon, `apple-touch-icon` y *manifest*.
- [ ] `sitemap.xml`, `robots.txt`, 404 y previews con `noindex`.
- [ ] El cambio de idioma lleva a la URL equivalente y conserva la sección (`#lista`).
- [ ] El nombre provisional es coherente en el título, OG, el *wordmark* y el formulario.

### 8.8 Calidad
- [ ] `npm run build`, `npm run lint` y `npm run test:e2e` en verde: registro en todos sus estados, cambio de idioma, navegación y anclas, movimiento reducido y JS desactivado.
- [ ] Revisión visual con capturas antes/después por fase.

## 9. Decisiones pendientes y bloqueos externos reales

**Decisiones tuyas que cambian el resultado**
1. **Dirección «Dos horarios, un hilo»:** noche en el hero, que amanece hacia papel. ¿Sí, o prefieres una base clara con solo acentos de luz?
2. **Tipografía:** Newsreader + Inter (conserva la coherencia con los videos) o Newsreader + Hanken Grotesk (ruptura total).
3. **Registro:** formulario propio con función *serverless* y API de Jotform (recomendado; requiere elegir hosting), o mantener el iframe con conversión no verificada.
4. **Fotos:** ¿puedes tomar H1, M1, M2 y M4 en Nápoles, y tu familia H2 y M3 en Monterrey? ¿Las HEIC de `~/Downloads` son candidatas?
5. **CTA:** propongo «Unirme a la lista de espera» / "Join the waitlist" por claridad, y llevar lo emocional al titular. ¿De acuerdo?

**Bloqueos externos**
- **Nombre definitivo:** "Cerca" está ocupado y sigue la investigación. Afecta al dominio, OG, el *wordmark* y el formulario. Seguimos con `brand.ts` como variable.
- **Dominio y hosting:** sin ellos no hay canonical, `hreflang` absolutos, *sitemap* final, HTTPS, redirección por idioma ni función *serverless*. No invento ninguno.
- **Jotform:**
  - el `formId` real detrás de la *app* 263007192678866;
  - la clave de API (solo en el servidor);
  - la traducción ES;
  - quitar "almost here" si no se puede sostener.
- **Analítica:** elegir herramienta. Recomiendo una sin cookies (Plausible o Umami) para evitar el banner de consentimiento en la UE. GA4 requeriría consentimiento.
- **Privacidad:** responsable, correo de contacto y si el equipo o la escuela tienen un aviso de privacidad modelo.
- **Equipo:**
  - confirmar los supuestos de mapa (dónde pasó cada momento) y calendario (momentos por día);
  - confirmar "sin visto ni escribiendo";
  - obtener capturas reales de mapa y línea del tiempo cuando existan en el repo.
- **Imagen de referencia de iluminación:** la mencionas como adjunta, pero **no llegó en el mensaje**. La paleta de luz se basa en tu descripción (fondo oscuro, forma central de color y luces suaves); compártela para ajustarla.

---

## Registro de avance

### 2026-11-03 · Fases 0 y 1 (en revisión)
Se aplicaron las recomendaciones por defecto de §9:
- Hero nocturno que amanece.
- Newsreader + Inter.
- CTA «Unirme a la lista de espera».

Todo es reversible.

**Fase 0:**
- Línea base, Lighthouse móvil sobre la versión anterior: rendimiento 87, accesibilidad 96, SEO 91; LCP 2.8 s, TBT 270 ms, CLS 0.
- `@playwright/test`, con proyectos iPhone/WebKit, Pixel/Chromium y escritorio, y `npm run test:e2e`.
- `sharp` y `npm run images` (`scripts/images.mjs`, fuente en `assets-src/photos/photos.json`).

**Fase 1:**
- `src/styles/{tokens,base,hero,waitlist}.css` (se retira `src/index.css`).
- `Hero.tsx`, `Photo.tsx` y `Footer.tsx`. `App.tsx` muestra solo el encabezado, el inicio y el pie.
- Newsreader recortado a 44 KB (`scripts/subset-newsreader.py`). Se retiran Archivo Black, Caveat e Instrument Serif.
- Fotos provisionales de Wikimedia (CC BY 3.0 y CC BY-SA 4.0), con créditos en el pie.
- El iframe de Jotform ya no pide cámara, micrófono ni ubicación.

**Resultado (Lighthouse móvil, laboratorio):**
- Rendimiento 96, accesibilidad 100; LCP 2.6 s, TBT 0 ms, CLS 0.023.
- El LCP no llega al objetivo de 2.5 s porque el HTML todavía es una SPA: el primer pintado espera al JS. Se resuelve con el prerender de la Fase 5.
- 27/27 pruebas E2E en verde.

**Desvíos frente a la propuesta:**
- **Hora real actual descartada.** Contradecía las fotos (una noche fija con la hora real de otro momento). Las etiquetas muestran la hora de la escena: 9:20 p. m. / 1:20 p. m.
- **El hilo une las dos etiquetas de hora**, no la parte superior de las fotos, porque cortaba la foto de Nápoles en diagonal. Pasa por detrás de Monterrey cuando el espacio es estrecho.
- **Las fotos se revelan a los 300/450 ms**, no a los 650/800 ms, para no retrasar el LCP.
- **La rotación de «a quién» es una línea propia** («¿A tu mamá?», «¿A tu hermano?»…) y no una palabra dentro de la frase. Así no deja huecos al cambiar de largo.

**Pendiente de la Fase 1:** tu aprobación de la dirección. Las fotos definitivas (H1 y H2) siguen pendientes.

### 2026-11-03 · Fase 2 (recorrido y contenido)

Hecho:
- Secciones nuevas: `Everyday` (3 momentos; al tocar la foto se ve a quién se mandó y la hora del otro lado), `HowItWorks` (3 pasos + teléfono con pestañas Línea del tiempo · Mapa · Calendario, etiqueta «Prototipo en desarrollo · datos de ejemplo»), `Sections.tsx` (Para cuando…, Preguntas con `<details>`, cierre `#lista` en noche), `StickyCta` (aparece al dejar atrás el CTA del inicio y se esconde en `#lista`; en escritorio es un botón flotante).
- Copy ES/EN completo en `copy.ts`; `content.ts` pasa a modelo de fotos y fechas de ejemplo. Retirados `Art`, `Postcard`, `Postmark`, `Stamp`, `Terrain`, `Thread` y `motion.ts`.
- Fotos provisionales nuevas (Commons, CC0/CC BY 2.0): pasta en Nápoles, callejón con ropa tendida, concha de pan dulce. Créditos en el pie.
- Pruebas: 44 E2E (3 proyectos) en verde, incluido «no se prometen cosas sin confirmar». Lighthouse móvil: rendimiento 98, accesibilidad 100, buenas prácticas 100, LCP 2.4 s, CLS 0.029.
- Capturas: `fase2-390.jpg`, `fase2-1440.jpg`, `fase2-demo.jpg`.

Desviaciones y decisiones:
- Diferencia horaria corregida: Monterrey no cambia de horario e Italia sí → 7 h en invierno, 8 h en verano. El inicio ahora muestra 9:20 p. m. / 2:20 p. m. y dice «7 u 8 horas de diferencia, según la temporada».
- Se añadió la pregunta «¿Es solo para parejas?» para no encasillar la app.
- El registro sigue siendo el diálogo de Jotform hasta la Fase 4; el CTA de cierre lo abre.
- Pendiente para Fase 3: animaciones de entrada por sección e hilo de página. Las pantallas del teléfono son una maqueta HTML, no capturas de la app; reemplazar por capturas reales cuando existan.
