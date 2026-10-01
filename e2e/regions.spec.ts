import { expect, test, type Page } from '@playwright/test'
import { routes } from './routes'

/**
 * Per-region regression checks for the fixes in docs/review.md. The full-page
 * visual diff catches gross drift; these pin the exact regions that were
 * repaired so a partial regression fails with a pointed message.
 */

/** Fonts ready, images decoded, lazy images forced eager. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => img.setAttribute('loading', 'eager'))
    await Promise.race([document.fonts.ready, wait(5000)])
    await Promise.race([Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => undefined)))), wait(8000)])
  })
}

const course = routes.find((route) => route.name === 'course-details')!.path

test('course play control is chrome-less and aligned over the baked art', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(course)
  await settle(page)
  const geo = await page.evaluate(() => {
    const btn = document.querySelector('.course-video__play')!
    const img = document.querySelector('.course-video img')!
    const b = btn.getBoundingClientRect(), i = img.getBoundingClientRect()
    return {
      buttons: document.querySelectorAll('.course-video__play').length,
      icons: btn.querySelectorAll('svg').length,
      transparent: getComputedStyle(btn).backgroundColor,
      relX: (b.x + b.width / 2 - i.x) / i.width,
      relY: (b.y + b.height / 2 - i.y) / i.height,
      overflow: Math.max(0, b.right - i.right, b.bottom - i.bottom),
    }
  })
  // The poster carries the visible play art; a second icon here means the
  // duplicate-control regression is back (docs/review.md D1).
  expect(geo.buttons, 'exactly one play control').toBe(1)
  expect(geo.icons, 'no icon drawn over the baked play art').toBe(0)
  expect(geo.transparent, 'chrome-less: transparent background').toBe('rgba(0, 0, 0, 0)')
  expect(geo.relX).toBeCloseTo(0.5208, 2)
  expect(geo.relY).toBeCloseTo(0.5355, 2)
  expect(geo.overflow, 'hit area stays inside the poster').toBe(0)
})

test('rating bars use the design fill widths', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(routes.find((route) => route.name === 'course-reviews')!.path)
  await settle(page)
  const widths = await page.evaluate(() =>
    [...document.querySelectorAll('.rating-summary__track > span')].map((el) => (el as HTMLElement).style.width),
  )
  // Fills are hand-set in the design (92/36/9/3/5), not proportional to the counts.
  expect(widths).toEqual(['92%', '36%', '9%', '3%', '5%'])
})

for (const authPath of ['/login', '/signup']) {
  test(`auth collage layers and colors match the design (${authPath})`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1024 })
    await page.goto(authPath)
    await settle(page)
    const m = await page.evaluate(() => {
      const box = (sel: string) => {
        const el = document.querySelector(sel)
        if (!el) return null
        const r = el.getBoundingClientRect()
        const stage = document.querySelector('.auth__collage')!.getBoundingClientRect()
        return { x: Math.round(r.left - stage.left), y: Math.round(r.top - stage.top), z: getComputedStyle(el).zIndex }
      }
      return {
        back: box('.auth__stack--back'),
        front: box('.auth__stack--front'),
        pyramid: box('.auth__shape--pyramid'),
        torus: box('.auth__shape--torus'),
        star: getComputedStyle(document.querySelector('.auth__collage .course-card__rating svg')!).fill,
        countChip: getComputedStyle(document.querySelector('.auth__collage .avatar-stack__count')!).backgroundColor,
      }
    })
    // Design z-order: back card < pyramid/squiggle < front card < torus < happy card.
    expect(Number(m.back!.z)).toBeLessThan(Number(m.pyramid!.z))
    expect(Number(m.pyramid!.z)).toBeLessThan(Number(m.front!.z))
    expect(Number(m.front!.z)).toBeLessThan(Number(m.torus!.z))
    // Lime star and dark chip on the collage cards (docs/review.md, auth items).
    expect(m.star).toBe('rgb(212, 251, 32)')
    expect(m.countChip).toBe('rgb(36, 37, 40)')
    // Design positions in stage pixels: back (27,114), front (138,25).
    expect(m.back!.x).toBe(27)
    expect(m.back!.y).toBe(114)
    expect(m.front!.x).toBe(138)
    expect(m.front!.y).toBe(25)
  })
}

test('404 numerals keep the olive gradient stop and a fluid mobile size', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(routes.find((route) => route.name === 'not-found')!.path)
  await settle(page)
  const m = await page.evaluate(() => {
    const code = document.querySelector('.not-found__code')!
    return { image: getComputedStyle(code).backgroundImage }
  })
  // The gradient must not fade to fully transparent: the design holds an
  // olive tone (lime at ~60% alpha) at the glyph bottoms.
  expect(m.image).toContain('rgba(212, 251, 32, 0.6)')
  await page.setViewportSize({ width: 390, height: 900 })
  await page.waitForTimeout(200)
  const phoneSize = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.not-found__code')!).fontSize))
  // Fluid clamp keeps the numerals from dominating small screens (NF2).
  expect(phoneSize).toBeLessThanOrEqual(150)
  expect(phoneSize).toBeGreaterThanOrEqual(130)
})

test('logo row stays inside the viewport when it wraps', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await settle(page)
  await page.setViewportSize({ width: 1024, height: 900 })
  await page.waitForTimeout(300)
  const m = await page.evaluate(() => {
    const ul = document.querySelector('.partner-logos')!
    const rows = new Set([...ul.querySelectorAll('li')].map((li) => Math.round(li.getBoundingClientRect().top / 8)))
    return { rows: rows.size, ulWidth: Math.round(ul.getBoundingClientRect().width) }
  })
  // Wrapped logos must fit their container instead of spilling past it
  // (html has overflow-x: clip, which would otherwise mask the bug).
  expect(m.ulWidth).toBeLessThanOrEqual(1024)
  expect(m.rows).toBeGreaterThan(1)
})

test('toolbar selects show a focus ring for keyboard users', async ({ page }) => {
  await page.goto('/search')
  const select = page.locator('.toolbar__select select').first()
  await select.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  const outline = await select.evaluate((el) => {
    const style = getComputedStyle(el.closest('.toolbar__select')!)
    return { style: style.outlineStyle, width: style.outlineWidth }
  })
  expect(outline.style).not.toBe('none')
  expect(outline.width).toBe('3px')
})
