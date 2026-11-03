import { expect, test, type Page } from '@playwright/test'

const COPY = {
  es: { title: '¿Extrañas tu casa?', cta: 'Unirme a la lista de espera', eyebrow: 'en desarrollo', lang: 'es-MX' },
  en: { title: 'Feeling homesick?', cta: 'Join the waitlist', eyebrow: 'in development', lang: 'en' },
} as const

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
}

async function expectInViewport(page: Page, selector: ReturnType<Page['locator']>) {
  const box = await selector.boundingBox()
  const vh = page.viewportSize()!.height
  expect(box, 'el elemento debe existir').not.toBeNull()
  expect(box!.y + box!.height).toBeLessThanOrEqual(vh)
}

for (const lang of ['es', 'en'] as const) {
  test.describe(`primer viewport (${lang})`, () => {
    // Área útil de Safari en iPhone con barras visibles y el teléfono más chico soportado.
    for (const viewport of [
      { width: 390, height: 664 },
      { width: 320, height: 568 },
    ]) {
      test(`${viewport.width}×${viewport.height}: qué es, estado y CTA sin hacer scroll`, async ({ page }) => {
        await page.setViewportSize(viewport)
        await page.goto(`/?lang=${lang}`)
        const t = COPY[lang]
        await expect(page.getByRole('heading', { level: 1, name: t.title })).toBeVisible()
        await expect(page.locator('.hero__eyebrow')).toContainText(t.eyebrow)
        const cta = page.locator('.hero').getByRole('button', { name: t.cta })
        await expect(cta).toBeVisible()
        await expectInViewport(page, cta)
        const ctaBox = await cta.boundingBox()
        expect(ctaBox!.height).toBeGreaterThanOrEqual(44)
        await expectNoHorizontalOverflow(page)
        await expect(page.locator('html')).toHaveAttribute('lang', t.lang)
      })
    }
  })
}

test('cambiar de idioma actualiza texto, lang y título, y se recuerda', async ({ page }) => {
  await page.goto('/?lang=es')
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByRole('heading', { level: 1, name: COPY.en.title })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle(/Feel close/)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: COPY.en.title })).toBeVisible()
})

test('el CTA abre la lista de espera; Escape la cierra y el foco vuelve al botón', async ({ page }) => {
  await page.goto('/?lang=es')
  const cta = page.locator('.hero').getByRole('button', { name: COPY.es.cta })
  await cta.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: /Lista de espera/ })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(cta).toBeFocused()
})

test('con «reducir movimiento» todo se ve de inmediato y el hilo está completo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?lang=es')
  await expect(page.locator('html')).not.toHaveClass(/motion-ready/)
  const opacity = await page.locator('.hero__lede').evaluate((el) => getComputedStyle(el).opacity)
  expect(opacity).toBe('1')
  const line = page.locator('.hero-thread__line')
  await expect(line).toHaveAttribute('d', /^M/)
  const dash = await line.evaluate((el) => getComputedStyle(el).strokeDasharray)
  expect(dash).toBe('none')
  // La rotación de «a quién» no se mueve: sigue en el primer elemento.
  await page.waitForTimeout(3000)
  await expect(page.locator('.cycle__item.is-active')).toHaveText('¿A tu mamá?')
})

test('el título completo es legible por lectores de pantalla (no palabra por palabra)', async ({ page }) => {
  await page.goto('/?lang=es')
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(COPY.es.title)
})

test('las fotos tienen texto alternativo y los créditos están en el pie', async ({ page }) => {
  await page.goto('/?lang=es')
  for (const img of await page.locator('.places img').all()) {
    expect((await img.getAttribute('alt'))?.length ?? 0).toBeGreaterThan(10)
  }
  await expect(page.locator('.credits')).toContainText('CC BY 3.0')
  await expect(page.locator('.credits')).toContainText('CC BY-SA 4.0')
})
