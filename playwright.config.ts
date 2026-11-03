import { defineConfig, devices } from '@playwright/test'

// Pruebas E2E sobre la compilación de producción (vite preview).
// WebKit aproxima Safari de iPhone; no sustituye a un dispositivo real.
const PORT = 4174

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'es-MX',
  },
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'iphone-webkit', use: { ...devices['iPhone 13'] } },
    { name: 'android-chromium', use: { ...devices['Pixel 7'] } },
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
})
