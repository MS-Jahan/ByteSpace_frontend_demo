// Copies the Figma-Plugin-API exports the app uses out of the git-ignored
// `figma-samples/exports/` into `public/assets/` and records them (with the
// source node id) under `exports` in `public/assets-manifest.json`.
//
//   node scripts/export-figma-assets.mjs
//
// Baked shapes are 3D renders with their lime/white tint already applied; the
// icon SVGs are the design's own vectors.
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const exportsDir = path.join(root, 'figma-samples/exports')
const publicDir = path.join(root, 'public/assets')
const manifestPath = path.join(root, 'public/assets-manifest.json')

if (!existsSync(exportsDir)) {
  console.error('figma-samples/exports is not available (it is git-ignored); nothing to do.')
  process.exit(1)
}

const shapes = JSON.parse(readFileSync(path.join(exportsDir, 'shapes.json'), 'utf8'))
const icons = JSON.parse(readFileSync(path.join(exportsDir, 'icons.json'), 'utf8'))

/** Baked (tint included) shapes used as plain images: `<page>-<section>-<tint>-<shape>`. */
const BAKED_SHAPES = [
  'home-hero-white-squiggle-b',
  'home-hero-white-torus',
  'home-hero-white-pyramid',
  'home-growth-lime-squiggle-a',
  'home-create-lime-squiggle-b',
  'home-cta-lime-pyramid',
  'home-cta-white-squiggle-b',
  // Login and Register carry identical auth art, so one export serves both.
  'login-auth-white-squiggle-b',
  'login-auth-lime-torus',
  'login-auth-lime-pyramid',
]
const ICON_FILES = [
  ...[1, 2, 3, 4, 5].map((n) => `logo-partner-${n}`),
  ...['design', 'development', 'it-software', 'business', 'marketing', 'photography'].map((n) => `icon-category-${n}`),
  // The monochrome brand glyphs in the auth pages' social buttons.
  'icon-facebook',
  'icon-google',
]

const records = {}
function record(destDir, sourceRel, destName, extra) {
  mkdirSync(path.join(publicDir, destDir), { recursive: true })
  const dest = path.join(publicDir, destDir, destName)
  copyFileSync(path.join(exportsDir, sourceRel), dest)
  const bytes = readFileSync(dest)
  records[`${destDir}/${destName}`] = {
    file: `${destDir}/${destName}`,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: statSync(dest).size,
    ...extra,
  }
}

for (const key of BAKED_SHAPES) {
  const shape = shapes.find((entry) => entry.file.startsWith(`shapes/${key}-`))
  if (!shape) throw new Error(`shape ${key} not found in shapes.json`)
  record('shapes', shape.file, `${key}.png`, {
    kind: 'shape',
    nodeId: shape.nodeId,
    tint: shape.tint,
    frame: { x: shape.x, y: shape.y, w: shape.w, h: shape.h, rotation: shape.rotation },
    renderBounds: shape.renderBoundsInTopFrame,
  })
}
for (const name of ICON_FILES) {
  const icon = icons.find((entry) => entry.file === `icons/${name}.svg`)
  if (!icon) throw new Error(`icon ${name} not found in icons.json`)
  record('icons', icon.file, `${name}.svg`, { kind: 'icon', nodeId: icon.nodeId, size: icon.size })
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
manifest.exports = records
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Exported ${Object.keys(records).length} files.`)
