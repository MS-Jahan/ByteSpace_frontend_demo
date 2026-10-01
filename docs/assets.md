# Design assets

## Extraction

Run `npm run extract:assets` while the local, git-ignored `figma-samples/` folder is present. `scripts/extract-assets.mjs` scans HTML and SVG sources for base64 raster data URIs, decodes supported image types, ignores tiny transparent Figma mask placeholders, hashes decoded bytes with SHA-256 and writes one stable named file per unique payload under `public/assets/`. It found **72 unique images in 18 scanned files** (the two 404 exports have none).

`public/assets-manifest.json` records each sample file's image occurrences and each asset's MIME type, hash, size and sources. Committing the manifest and the used files lets a clean clone build without the exports.

## Figma exports (`exports` in the manifest)

The raw extracted 3D shapes are untinted, and the design tints them with hard-light layers that the HTML/SVG do not preserve. Instead, the Figma Plugin API was used to export what the design actually shows. `node scripts/export-figma-assets.mjs` copies those from `figma-samples/exports/` and records the source node id of each (23 files):

- `public/assets/shapes/` — 10 baked PNGs with the tint applied, named `<page>-<section>-<tint>-<shape>` (hero, CTA, growth, create & manage, auth). Source list: `figma-samples/exports/shapes.json`.
- `public/assets/icons/` — 13 SVGs: the six category icons, the Facebook and Google marks and the five "Logoipsum" partner logos. Source list: `icons.json`.

`assets.test.ts` checks that every `/assets/…` reference in `src/**/*.{ts,tsx,css}` exists and is recorded in the manifest (`assets` or `exports`), so hand-made or stray files cannot creep in. The four hand-made PNGs that an earlier pass used for shapes were deleted.

## Used and unused

60 files under `public/assets/` are referenced by the app: 37 of the 72 extracted images plus all 23 exports.

Used extracted images (by role): hero learner (`home-image-15c3a6ff74`), Create & Manage woman (`home-image-7be5f04241`), the six course-card photos (`creator-profile-creator-profile-*.jpg`), card and Happy-Students avatars, testimonial avatars (`home-ellipse-*`), review avatars (`course-reviews-*`), course sneak-peek and video images (`course-details-*`), creator avatars.

Unused (35), kept in the manifest because the extractor is deterministic:

- `home-cone-01-2-*` (7) and `register-cone-01-2-*` — the untinted 3D shapes, superseded by `shapes/`.
- `home-home-*`, `home-frame-*`, `home-mask-*`, `home-image-*` leftovers, `register-frame-*`/`register-image-*` — layout fragments and duplicates.
- Six further `creator-profile-frame-*` and five `course-details-*` variants that the final designs do not show.

Course-card photos come from `creator-profile-creator-profile-*.jpg` (not `course-details-*.jpg`); `course-reviews-*` are review avatars, `home-ellipse-*` testimonial avatars.
