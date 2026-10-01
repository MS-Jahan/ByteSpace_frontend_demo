import { expect, test, type Page } from '@playwright/test'

const requested = (page: Page) => {
  const urls: string[] = []
  page.on('request', (request) => urls.push(new URL(request.url()).pathname))
  return urls
}

const scrollThrough = (page: Page) =>
  page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
  })

test('home never fetches the 2500px shape renders', async ({ page }) => {
  const urls = requested(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await scrollThrough(page)
  await page.waitForLoadState('networkidle')
  expect(urls.filter((url) => /\/assets\/home-home-(92f21ffd63|a96322e3c1|021f81bfc4|f5b5a7e7fe|2b33854c48)\.png$/.test(url))).toEqual([])
  expect(urls.filter((url) => url.startsWith('/assets/renders/')).length).toBeGreaterThanOrEqual(5)
})

test('shapes hidden on the stacked layout are not fetched below 960px', async ({ page }) => {
  const urls = requested(page)
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto('/')
  await scrollThrough(page)
  await page.waitForLoadState('networkidle')
  // The Hero and CTA hide the two smaller renders (f5b5a7e7fe, 2b33854c48) and several baked shapes.
  expect(urls.filter((url) => /f5b5a7e7fe|2b33854c48/.test(url))).toEqual([])
  expect(urls.filter((url) => url.startsWith('/assets/shapes/'))).toEqual(
    expect.not.arrayContaining(['/assets/shapes/home-hero-white-torus.png', '/assets/shapes/home-cta-lime-pyramid.png']),
  )
})
