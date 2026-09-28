import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

type AssetRecord = {
  file: string
  mime: string
  sha256: string
  bytes: number
  sources: { file: string; offset: number }[]
}

describe('extracted design assets', () => {
  it('tracks each unique extracted image in a deduplicated manifest', async () => {
    const manifestPath = path.resolve(process.cwd(), 'public/assets-manifest.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as { assets: Record<string, AssetRecord>; samples: Record<string, unknown[]> }
    const assets = Object.values(manifest.assets)
    const hashes = new Set(assets.map((asset) => asset.sha256))

    expect(assets.length).toBeGreaterThan(10)
    expect(hashes.size).toBe(assets.length)
    expect(Object.keys(manifest.samples)).toContain('home.html')
    expect(Object.keys(manifest.samples)).toContain('imgs/Login.svg')

    for (const asset of assets) {
      const filePath = path.resolve(process.cwd(), 'public/assets', asset.file)
      const details = await stat(filePath)
      expect(details.size).toBe(asset.bytes)
      expect(asset.mime).toMatch(/^image\//)
      expect(asset.sources.length).toBeGreaterThan(0)
    }
  })
})
