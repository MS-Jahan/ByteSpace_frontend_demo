import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const samplesDir = path.join(root, 'figma-samples')
const assetsDir = path.join(root, 'public', 'assets')
const manifestPath = path.join(root, 'public', 'assets-manifest.json')
const mimeExtensions = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/jpg', 'jpg'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/svg+xml', 'svg'],
])
const assetPattern = /data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)/g
const manifest = { generatedAt: new Date().toISOString(), samples: {}, assets: {} }
const byHash = new Map()

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...(await collectFiles(fullPath)))
    else if (/\.(html?|svg)$/i.test(entry.name)) result.push(fullPath)
  }
  return result
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'asset'
}

const sourceFiles = await collectFiles(samplesDir)
await mkdir(assetsDir, { recursive: true })

for (const sourcePath of sourceFiles) {
  const relativeSource = path.relative(samplesDir, sourcePath).split(path.sep).join('/')
  const content = await readFile(sourcePath, 'utf8')
  const occurrences = []
  let match
  assetPattern.lastIndex = 0

  while ((match = assetPattern.exec(content)) !== null) {
    const mime = match[1].toLowerCase()
    const extension = mimeExtensions.get(mime)
    if (!extension) continue

    try {
      const bytes = Buffer.from(match[2].replace(/\s/g, ''), 'base64')
      if (bytes.length < 16) continue
      const hash = createHash('sha256').update(bytes).digest('hex')
      let asset = byHash.get(hash)
      if (!asset) {
        const layerMatch = content.slice(Math.max(0, match.index - 800), match.index).match(/data-layer=["']([^"']+)["'][^>]*$/i)
        const fallbackLayer = content.slice(Math.max(0, match.index - 800), match.index).match(/class(?:Name)?=["']([^"']+)["'][^>]*$/i)
        const layerName = layerMatch?.[1] ?? fallbackLayer?.[1] ?? path.basename(sourcePath, path.extname(sourcePath))
        const baseName = slugify(`${path.basename(sourcePath, path.extname(sourcePath))}-${layerName}`)
        const filename = `${baseName}-${hash.slice(0, 10)}.${extension}`
        await writeFile(path.join(assetsDir, filename), bytes)
        asset = { file: filename, mime, sha256: hash, bytes: bytes.length, sources: [] }
        byHash.set(hash, asset)
        manifest.assets[filename] = asset
      }

      const occurrence = {
        file: asset.file,
        layer: content.slice(Math.max(0, match.index - 800), match.index).match(/data-layer=["']([^"']+)["'][^>]*$/i)?.[1] ?? null,
        offset: match.index,
      }
      occurrences.push(occurrence)
      if (!asset.sources.some((source) => source.file === relativeSource && source.offset === match.index)) {
        asset.sources.push({ file: relativeSource, offset: match.index })
      }
    } catch (error) {
      console.warn(`Skipping malformed inline image in ${relativeSource} at ${match.index}: ${error.message}`)
    }
  }

  if (occurrences.length) manifest.samples[relativeSource] = occurrences
}

// Keep the `exports` section written by scripts/export-figma-assets.mjs.
try {
  const previous = JSON.parse(await readFile(manifestPath, 'utf8'))
  if (previous.exports) manifest.exports = previous.exports
  if (previous.derived) manifest.derived = previous.derived // written by scripts/make-cutouts.py
} catch {
  // First run: no manifest yet.
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Extracted ${byHash.size} unique image assets from ${sourceFiles.length} design files.`)
console.log(`Manifest: ${path.relative(root, manifestPath)}`)
