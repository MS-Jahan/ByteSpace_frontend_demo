import { expect, test, type Page } from '@playwright/test'
import { routes } from './routes'

const MIN = 44

/**
 * Justified exceptions (selector -> reason). Everything else interactive must be
 * at least 44 x 44 CSS px on a coarse pointer at phone width.
 */
const allowList: Record<string, string> = {
  '.skip-link': 'off-screen until focused',
  '.sr-only': 'visually hidden submit button; Enter in the search field submits',
  '.course-card__media a': 'tabindex=-1 duplicate of the title link, aria-hidden',
}

test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })

async function undersized(page: Page) {
  return page.evaluate(
    ({ min, allowed }) => {
      const selector = 'a[href], button, select, input:not([type="hidden"]), [role="button"], summary'
      const hits: string[] = []
      for (const element of document.querySelectorAll<HTMLElement>(selector)) {
        if (allowed.some((rule) => element.matches(rule))) continue
        const style = getComputedStyle(element)
        if (style.display === 'none' || style.visibility === 'hidden') continue
        if (element.closest('[aria-hidden="true"], [inert]')) continue
        const rect = element.getBoundingClientRect()
        // sr-only controls are 1px on purpose and are not tappable.
        if (rect.width <= 1 || rect.height <= 1) continue
        if (rect.width < min - 0.5 || rect.height < min - 0.5) {
          const label = (element.getAttribute('aria-label') || element.textContent || element.className).trim().slice(0, 40)
          hits.push(`${element.tagName.toLowerCase()}.${element.className} "${label}" ${Math.round(rect.width)}x${Math.round(rect.height)}`)
        }
      }
      return hits
    },
    { min: MIN, allowed: Object.keys(allowList) },
  )
}

for (const route of routes) {
  test(`${route.name}: tap targets are at least ${MIN}px on touch @390`, async ({ page }) => {
    await page.goto(route.path)
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches), 'coarse pointer emulation').toBe(true)
    expect(await undersized(page)).toEqual([])
  })
}

test('the open mobile menu has a reachable cart and 44px targets', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Cart' })).toBeVisible()
  expect(await undersized(page)).toEqual([])
})
