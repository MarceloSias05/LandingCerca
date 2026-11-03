import { expect, test } from '@playwright/test'

test('estructura: un h1, un h2 por sección y landmarks', async ({ page }) => {
  await page.goto('/?lang=es')
  await expect(page.locator('h1')).toHaveCount(1)
  for (const name of ['No son grandes noticias.', 'Así funciona', 'Para cuando…', 'Preguntas', 'Que lo próximo que compartan empiece aquí.']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeAttached()
  }
  await expect(page.getByRole('banner')).toHaveCount(1)
  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.getByRole('contentinfo')).toHaveCount(1)
})

test('lo cotidiano: tocar una foto descubre a quién se mandó', async ({ page }) => {
  await page.goto('/?lang=es')
  const photo = page.getByRole('button', { name: /^¿Para quién\? «Tienes que probar esto\.»$/ })
  await photo.scrollIntoViewIfNeeded()
  await expect(photo).toHaveAttribute('aria-expanded', 'false')
  await photo.click()
  await expect(photo).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#moment-note-comida')).toContainText('De Valeria para Mamá')
  await photo.click()
  await expect(page.locator('#moment-note-comida')).toBeHidden()
})

test('así funciona: pestañas con teclado y la etiqueta de prototipo siempre visible', async ({ page }) => {
  await page.goto('/?lang=es')
  await expect(page.getByText('Prototipo en desarrollo · datos de ejemplo')).toBeAttached()
  const timeline = page.getByRole('tab', { name: 'Línea del tiempo' })
  await expect(timeline).toHaveAttribute('aria-selected', 'true')
  await page.getByRole('tab', { name: 'Mapa' }).click()
  await expect(page.getByRole('tabpanel')).toHaveAttribute('id', 'demo-map')
  await page.getByRole('tab', { name: 'Mapa' }).press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Calendario' })).toBeFocused()
  await expect(page.getByRole('img', { name: /Calendario de ejemplo/ })).toBeVisible()
  await page.keyboard.press('Home')
  await expect(timeline).toBeFocused()
})

test('preguntas: se abren con teclado (details nativo)', async ({ page }) => {
  await page.goto('/?lang=es')
  const q = page.locator('summary', { hasText: '¿Funciona en Android?' })
  await q.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('es solo para iPhone')).toBeVisible()
})

test('no se prometen cosas sin confirmar', async ({ page }) => {
  for (const lang of ['es', 'en']) {
    await page.goto(`/?lang=${lang}`)
    const text = (await page.locator('body').innerText()).toLowerCase()
    for (const banned of ['botella', 'carta', 'audio', 'bottle', 'letter', 'acceso prioritario', 'early access', 'testimonio', 'usuarios', 'plazas', 'spots left']) {
      expect(text, `«${banned}» no debe aparecer (${lang})`).not.toContain(banned)
    }
  }
})

test.describe('CTA fijo en teléfono', () => {
  test.skip(({ isMobile }) => !isMobile, 'solo en teléfono')

  test('aparece al pasar el inicio, se esconde en el registro y no tapa el pie', async ({ page }) => {
    await page.goto('/?lang=es')
    const bar = page.locator('.sticky-cta')
    await expect(bar).toHaveAttribute('data-show', 'false')
    await page.locator('.how').scrollIntoViewIfNeeded()
    await expect(bar).toHaveAttribute('data-show', 'true')
    const btn = bar.getByRole('button')
    expect((await btn.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    await page.locator('#lista').scrollIntoViewIfNeeded()
    await expect(bar).toHaveAttribute('data-show', 'false')
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
