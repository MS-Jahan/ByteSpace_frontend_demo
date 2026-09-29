import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { routes } from './routes'

const designDir = path.resolve('figma-samples/imgs')
const outDir = path.resolve('test-results/visual')
const CANVAS = 1440
/** The design PNGs are 3x renders of a 1440px canvas. */
const SCALE = 3
/**
 * Measured diff (fraction of differing pixels) per route. A route fails once it
 * exceeds its baseline by MARGIN, so a regression cannot hide behind a loose
 * global threshold. Search's baseline is high by design: the app shows 18
 * distinct courses where the mock repeats six (see docs/review.md).
 * After an intentional change, update the baseline from the printed value.
 */
const BASELINES: Record<string, number> = {
  home: 0.0181,
  login: 0.0134,
  register: 0.0142,
  search: 0.0972,
  'course-details': 0.0186,
  'course-lessons': 0.0284,
  'course-reviews': 0.0233,
  creator: 0.036,
  'not-found': 0.018,
}
/** Allowed growth over a baseline: covers font and anti-aliasing noise, not layout changes. */
const MARGIN = 0.005
/** Routes added to `routes.ts` without a baseline get a loose ceiling until one is measured. */
const DEFAULT_BUDGET = 0.06

/** Box-filter downscale by an integer factor. */
function downscale(src: PNG, factor: number) {
  const width = Math.floor(src.width / factor)
  const height = Math.floor(src.height / factor)
  const out = new PNG({ width, height })
  const area = factor * factor
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sum = [0, 0, 0, 0]
      for (let dy = 0; dy < factor; dy++) {
        for (let dx = 0; dx < factor; dx++) {
          const i = ((y * factor + dy) * src.width + (x * factor + dx)) * 4
          for (let c = 0; c < 4; c++) sum[c] += src.data[i + c]
        }
      }
      const o = (y * width + x) * 4
      for (let c = 0; c < 4; c++) out.data[o + c] = Math.round(sum[c] / area)
    }
  }
  return out
}

/** Copy into a fixed-size canvas, padding with magenta so height differences are obvious. */
function pad(src: PNG, width: number, height: number) {
  const out = new PNG({ width, height })
  for (let i = 0; i < out.data.length; i += 4) out.data.set([255, 0, 255, 255], i)
  PNG.bitblt(src, out, 0, 0, Math.min(src.width, width), Math.min(src.height, height), 0, 0)
  return out
}

test.skip(!existsSync(designDir), 'figma-samples/imgs is not available (it is git-ignored)')

for (const route of routes.filter((entry) => entry.design)) {
  test(`${route.name} matches the design at ${CANVAS}px`, async ({ page }, testInfo) => {
    mkdirSync(outDir, { recursive: true })
    await page.setViewportSize({ width: CANVAS, height: 900 })
    await page.goto(route.path)
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => img.setAttribute('loading', 'eager'))
      const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
      await Promise.race([document.fonts.ready, wait(5000)])
      await Promise.race([
        Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => undefined)))),
        wait(8000),
      ])
    })
    const shot = PNG.sync.read(await page.screenshot({ fullPage: true, animations: 'disabled' }))
    const design = downscale(PNG.sync.read(readFileSync(path.join(designDir, route.design!))), SCALE)

    const width = CANVAS
    const height = Math.max(shot.height, design.height)
    const actual = pad(shot, width, height)
    const expected = pad(design, width, height)
    const diff = new PNG({ width, height })
    const changed = pixelmatch(expected.data, actual.data, diff.data, width, height, { threshold: 0.2 })
    const ratio = changed / (width * height)

    // design | actual | diff, side by side.
    const sheet = new PNG({ width: width * 3, height })
    PNG.bitblt(expected, sheet, 0, 0, width, height, 0, 0)
    PNG.bitblt(actual, sheet, 0, 0, width, height, width, 0)
    PNG.bitblt(diff, sheet, 0, 0, width, height, width * 2, 0)
    writeFileSync(path.join(outDir, `${route.name}.png`), PNG.sync.write(sheet))

    const budget = route.name in BASELINES ? BASELINES[route.name] + MARGIN : DEFAULT_BUDGET
    const summary = `${route.name}: design ${design.height}px, actual ${shot.height}px, ${(ratio * 100).toFixed(2)}% pixels differ (budget ${(budget * 100).toFixed(1)}%)`
    console.log(summary)
    testInfo.annotations.push({ type: 'visual-diff', description: summary })
    if (ratio >= budget) {
      testInfo.annotations.push({
        type: 'visual-budget',
        description: `If this change is intentional, set BASELINES['${route.name}'] to ${ratio.toFixed(4)} and note why in docs/review.md.`,
      })
    }
    expect(ratio, `${summary} (see test-results/visual/${route.name}.png)`).toBeLessThan(budget)
  })
}
