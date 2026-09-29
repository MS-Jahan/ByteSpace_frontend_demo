import { expect, test, type Page } from '@playwright/test'
import { routes, widths } from './routes'

/** Loads a page like a visitor would: fonts ready and lazy images scrolled into view. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    const step = Math.max(400, window.innerHeight)
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await wait(60)
    }
    window.scrollTo(0, 0)
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => img.setAttribute('loading', 'eager'))
    // Bounded waits: an offline font host must not hang the whole run.
    await Promise.race([document.fonts.ready, wait(5000)])
    await Promise.race([
      Promise.all(
        [...document.images].map((img) => (img.complete ? null : img.decode().catch(() => undefined))),
      ),
      wait(8000),
    ])
  })
}

for (const route of routes) {
  for (const width of widths) {
    test(`${route.name} @${width}: no overflow, broken images or console errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', (message) => {
        if (message.type() !== 'error') return
        // Engine-internal, self-healing next frame; not an app defect. WebKit
        // emits it during load; Chromium and Firefox do not surface it.
        if (message.text().includes('ResizeObserver loop completed with undelivered notifications')) return
        errors.push(message.text())
      })
      page.on('pageerror', (error) => {
        // Same engine-internal notice, surfaced as an uncaught exception on WebKit.
        if (error.message.includes('ResizeObserver loop completed with undelivered notifications')) return
        errors.push(error.message)
      })

      await page.setViewportSize({ width, height: 900 })
      await page.goto(route.path)
      await settle(page)

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        // Elements poking past the viewport outside any clipping ancestor, to name the culprit when scrollWidth fails.
        wide: [...document.body.querySelectorAll('*')]
          .filter((el) => {
            if (el.getBoundingClientRect().right <= window.innerWidth + 1) return false
            for (let up = el.parentElement; up && up !== document.body; up = up.parentElement) {
              if (getComputedStyle(up).overflowX !== 'visible') return false
            }
            return true
          })
          .slice(0, 8)
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}@${Math.round(el.getBoundingClientRect().right)}`),
        broken: [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
      }))

      expect.soft(metrics.scrollWidth, `horizontal overflow (${metrics.wide.join(', ')})`).toBe(metrics.innerWidth)
      expect.soft(metrics.broken, 'broken images').toEqual([])
      expect.soft(errors, 'console errors').toEqual([])
    })
  }
}

test('Satoshi is loaded and used by the body', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const result = await page.evaluate(() => ({
    // `document.fonts.check()` is true when no face is declared, so count loaded faces instead.
    loaded: [...document.fonts].filter((face) => face.family.replace(/['"]/g, '') === 'Satoshi' && face.status === 'loaded')
      .length,
    family: getComputedStyle(document.body).fontFamily,
  }))
  expect(result.loaded).toBeGreaterThanOrEqual(2)
  expect(result.family).toMatch(/^"?Satoshi"?/)
})
