# ByteSpace New — frontend demo

A responsive React recreation of the ByteSpace Figma designs: the landing page, login and signup, search, course details/lessons/reviews, a creator profile and a 404. This is a frontend prototype, not a production learning platform: there is no API server, real authentication, account creation or data persistence.

## Requirements and setup

- Node.js 20 or newer
- npm

```bash
npm install
npm run dev
```

Vite serves the site at `http://127.0.0.1:5173` by default. Build and preview the production bundle with:

```bash
npm run build
npm run preview
```

### Deployment: SPA fallback

Routing is client-side (`BrowserRouter`), so the host must serve `index.html` for every path that is not a real file, or deep links such as `/courses/build-digital-asset/reviews` return 404. `vite preview` and `vite dev` already do this. Examples:

- Netlify / Cloudflare Pages: `/*  /index.html  200` in `public/_redirects`.
- Vercel: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` in `vercel.json`.
- nginx: `location / { try_files $uri /index.html; }`.

The app itself renders the branded 404 for unknown routes, unknown course slugs and unknown creator slugs. Hashed bundles are emitted to `dist/static/` so they never collide with the design images in `public/assets/`.

## Routes

| Route | Page |
| --- | --- |
| `/` | Landing page (hero, logos, discover + category pills, learning paths, growth, create & manage, creator CTA, testimonials) |
| `/login`, `/signup` | Auth pages (no site header/footer, custom JS validation, demo-only success state) |
| `/search` | Search with `?q`, `?category`, `?level`, `?sort`, `?featured`, `?page` |
| `/courses/:slug` | Course details; nested tabs `/lessons` and `/reviews` |
| `/creators/:slug` | Creator profile with follow toggle and its courses |
| `/creators` | Redirects to `/creators/purepearl-studio` (demo shortcut for the header link) |
| `/legal` | Invented placeholder policies so footer links resolve (no design exists) |
| anything else, or an unknown slug | Not-found page |

Every route sets its own `document.title` (`usePageTitle`). Navigation keeps the scroll position when switching a course's tabs and on Back/Forward, and starts at the top for any other page. Hash links (`/#paths`) scroll to the target below the fixed header.

## Local interactions

Search, category pills, level/category/sort selects, quick chips, pagination, the review-rating filter, follow, the mobile menu (Escape closes it, focus returns to the toggle, the cart is inside the panel), password visibility, auth validation and the newsletter all work locally. Share copies the link (or uses the Web Share API); Play, social sign-in, the cart and the newsletter show explicit demo-only notices. Nothing is sent or stored.

## Project layout

- `src/App.tsx` — the route table only.
- `src/components/` — `Layout` (header, footer, scroll behaviour), `Header`, `Footer`, `Brand`, `CourseCard`, `CourseToolbar`, `AvatarStack`, `Shape3D`, `Stage`, `ProgressLine`, `Icons`.
- `src/pages/` — `HomePage`, `AuthPage`, `SearchPage`, `CreatorPage`, `LegalPage`, `NotFoundPage`; `src/pages/course/` holds the course layout and its three tabs.
- `src/sections/` — the landing-page sections.
- `src/data.ts` — courses (card fields separate from details), creators, categories, reviews, footer columns.
- `src/courseFilters.ts`, `src/usePageTitle.ts`, `src/validation.ts` — shared helpers.
- `src/styles.css` — tokens, page styles, responsive and touch rules.
- `public/assets/` — extracted design images, `icons/` and `shapes/` (Figma exports). `public/assets-manifest.json` records their sources and hashes.
- `public/fonts/` — self-hosted Satoshi (Regular, Medium, Bold) and Clash Display Bold (Fontshare free licence). Poppins loads from Google Fonts in `index.html`.
- `e2e/` — Playwright specs (see below). `docs/` — project documents.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` / `build` / `preview` | Vite |
| `npm run typecheck` / `lint` / `test` | TypeScript, ESLint, Vitest (jsdom) |
| `npm run test:e2e` | Playwright: overflow, broken images, console errors, fonts at 1440/768/390/320; 44 px tap targets on touch at 390; visual diff at 1440 |
| `npm run extract:assets` | `scripts/extract-assets.mjs` decodes base64 images from `figma-samples/` into `public/assets/` |
| `node scripts/export-figma-assets.mjs` | Copies the Figma-Plugin-API exports (`figma-samples/exports/`: baked 3D shapes, icon SVGs) into `public/assets/{shapes,icons}` and records them under `exports` in the manifest |

`scripts/design-copy.mjs` was removed: it was unreliable (parent-relative offsets, no `<span>` runs) and the visual-diff harness replaced it.

### Visual diff

`npm run test:e2e` starts the dev server on port 4173 (or reuses one), screenshots each route with a design at 1440 px and compares it with `figma-samples/imgs/<Page>.png` (downscaled 3x) using pixelmatch. It prints `route: N% pixels differ` and writes `design | actual | diff` sheets to `test-results/visual/`. The design PNGs are git-ignored, so this part is skipped when `figma-samples/` is absent. The system Chrome is used unless `PW_CHANNEL=` is set to force bundled Chromium.

Latest diffs (2026-09-30): Home 1.8 %, Login 1.3 %, Register 1.4 %, Search 9.7 %, Details 1.9 %, Lessons 2.8 %, Reviews 2.3 %, Creator 3.6 %, 404 1.8 %. These are lenient; see [status.md](status.md) for the stricter figures.

## Quality checks

```bash
npm run typecheck && npm run lint && npm test && npm run build && npm run test:e2e
```

GitHub Actions runs typecheck, lint, test and build (not e2e, which needs a browser and the ignored design PNGs).

## Project documents

- [init.md](init.md) — original brief and decisions
- [plan.md](plan.md) — phased plan
- [status.md](status.md) — what is done and what is next
- [review.md](review.md) — first fix spec; [code-review.md](code-review.md) and [visual-review.md](visual-review.md) — second-round reviews
- [assets.md](assets.md), [questions.md](questions.md)
