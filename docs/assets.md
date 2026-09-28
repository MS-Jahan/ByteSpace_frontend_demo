# Design assets

## Extraction

Run `npm run extract:assets` while the original, locally available `figma-samples/` folder is present. `scripts/extract-assets.mjs` scans HTML and SVG sources for base64 raster data URIs, decodes supported image types, ignores tiny transparent Figma mask placeholders, hashes decoded bytes with SHA-256, and writes one stable named file per unique payload under `public/assets/`.

The generated `public/assets-manifest.json` records each sample file's image occurrences (file name, layer when available, source offset) and each extracted asset's MIME type, SHA-256, byte size, and source locations. The current checked-out samples yielded **72 unique images across 18 HTML/SVG files**. The extractor does not modify the original samples.

`figma-samples/` is in `.gitignore` per the user's request. Committing the generated manifest and app asset files lets a clean clone build the app without the original Figma exports; rerunning extraction requires bringing those references back locally.

## App asset references

Landing-page/course artwork uses images from the supplied designs, including:

- `home-image-15c3a6ff74.png` — hero learner illustration.
- `course-details-course-details-1dd4796eb5.jpg`, `course-details-course-details-4a7d0e390b.jpg`, `course-details-course-details-6bdec61b47.jpg` and other `course-details-*.jpg` files — course-card imagery.
- `home-image-eb157cb563.png` and `home-image-7be5f04241.png` — extracted learner/creator feature art.
- `course-reviews-*.png` — testimonial avatars.
- `creator-profile-*.png` — additional profile/course sample artwork.

Only page-content images needed for the recreation are referenced directly in the React app. Other unique extracted payloads remain available for future routes or refinements.
