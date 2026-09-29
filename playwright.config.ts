import { defineConfig } from '@playwright/test'

const port = 4173

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results/artifacts',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    // Use the system Chrome when the bundled Chromium is not installed.
    // PW_CHANNEL= (empty) means no channel, so --browser=firefox/webkit use
    // the bundled builds and PW_CHANNEL=chrome forces system Chrome.
    channel: process.env.PW_CHANNEL === '' ? undefined : (process.env.PW_CHANNEL ?? 'chrome'),
  },
  webServer: {
    command: `npm run dev -- --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
})
