# ByteSpace New — frontend demo

A responsive React recreation of the ByteSpace Figma-exported learning-platform landing page, with optional visual `/login` and `/signup` demo routes. This is a frontend prototype, not a production learning platform: there is no API server, real authentication, account creation, or data persistence.

## Requirements and setup

- Node.js 20 or newer
- npm

```bash
npm install
npm run dev
```

Vite serves the site at `http://127.0.0.1:5173` by default. Create and locally preview the production bundle with:

```bash
npm run build
npm run preview
```

## Routes and local interactions

- `/` — landing page with local sample courses.
- `/login` — login-form design with browser validation and an explicit demo-only success state.
- `/signup` — registration-form design with browser validation, demo acknowledgement, and demo-only feedback.
- Any unmatched route — branded not-found page.

Course search, category filters, saved-course toggles, the mobile menu, password visibility, forgot-password notice, and testimonial selection operate locally. Newsletter and authentication forms do not send requests or store entered addresses/credentials; the UI tells users that they are demos.

## Project layout

- `src/App.tsx` — routed pages, course filtering, and page interactions.
- `src/components/` — reusable branding, navigation, footer, icons, and course-card UI.
- `src/data.ts` — local category, course, and testimonial content.
- `src/styles.css` — design tokens, page styles, responsive layouts, focus styling, and reduced-motion support.
- `public/assets/` — extracted image files used by the UI.
- `public/assets-manifest.json` — source paths, offsets/layers, MIME types, hashes, and sizes for extracted images.
- `scripts/extract-assets.mjs` — repeatable base64 image extractor. `figma-samples/` is ignored; retain it locally to rerun extraction.
- `docs/` — project documents; see [the original brief](init.md), [plan](plan.md), [asset notes](assets.md), and [decisions](questions.md).

Poppins, Satoshi, and Clash Display load from Google Fonts/Fontshare with local system fallbacks; exact typeface rendering needs network access to those services.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Automated tests cover routes, search/category behavior, auth validation and demo feedback, newsletter non-submission, and extracted asset/manifest integrity. GitHub Actions runs the same typecheck, lint, test, and production-build commands on pushes to `main` / `feat/bytespace-frontend` and pull requests to `main`. Browser review across desktop/tablet/mobile is separately tracked in `docs/plan.md`.
