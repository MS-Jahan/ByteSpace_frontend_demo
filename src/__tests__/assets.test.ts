import { readdir, readFile, stat } from 'node:fs/promises'
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

  it('records the Figma exports the app uses (shapes and icons) with their source node', async () => {
    const manifestPath = path.resolve(process.cwd(), 'public/assets-manifest.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as {
      exports: Record<string, { file: string; nodeId: string; bytes: number }>
    }
    const records = Object.values(manifest.exports)
    expect(records.length).toBeGreaterThan(10)
    for (const record of records) {
      const details = await stat(path.resolve(process.cwd(), 'public/assets', record.file))
      expect(details.size).toBe(record.bytes)
      expect(record.nodeId).toMatch(/^\d+:\d+$/)
    }
  })

  it('only references /assets files that exist and are recorded in the manifest', async () => {
    const root = process.cwd()
    const manifest = JSON.parse(await readFile(path.resolve(root, 'public/assets-manifest.json'), 'utf8')) as {
      assets: Record<string, { file: string }>
      exports: Record<string, { file: string }>
      derived: Record<string, { file: string }>
    }
    const known = new Set([...Object.values(manifest.assets), ...Object.values(manifest.exports), ...Object.values(manifest.derived)].map((record) => record.file))

    const walk = async (dir: string): Promise<string[]> => {
      const entries = await readdir(dir, { withFileTypes: true })
      const nested = await Promise.all(
        entries.map((entry) => {
          const full = path.join(dir, entry.name)
          if (entry.isDirectory()) return entry.name === '__tests__' ? [] : walk(full)
          return /\.(ts|tsx|css)$/.test(entry.name) ? [full] : []
        }),
      )
      return nested.flat()
    }

    const references = new Map<string, string>()
    for (const file of await walk(path.resolve(root, 'src'))) {
      const source = await readFile(file, 'utf8')
      for (const match of source.matchAll(/\/assets\/([\w./-]+\.(?:png|jpe?g|svg|webp|avif|gif))/g)) {
        references.set(match[1], path.relative(root, file))
      }
    }

    expect(references.size).toBeGreaterThan(20)
    for (const [file, origin] of references) {
      await expect(stat(path.resolve(root, 'public/assets', file)), `${file} (${origin}) is missing`).resolves.toBeDefined()
      expect(known.has(file), `${file} (${origin}) is not in assets-manifest.json`).toBe(true)
    }
  })

  it('records downscaled derivatives for the 3D shape renders', async () => {
    const manifest = JSON.parse(await readFile(path.resolve(process.cwd(), 'public/assets-manifest.json'), 'utf8')) as {
      derived: Record<string, { file: string; bytes: number }>
    }
    const renders = Object.values(manifest.derived).filter((record) => record.file.startsWith('renders/'))
    expect(renders).toHaveLength(5)
    for (const record of renders) {
      const details = await stat(path.resolve(process.cwd(), 'public/assets', record.file))
      expect(details.size).toBe(record.bytes)
      expect(details.size).toBeLessThan(150_000)
    }
  })
})
