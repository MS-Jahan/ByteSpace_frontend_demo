# ByteSpace New React Frontend Demo — Plan & Progress

> The approved application source and static assets live at the project root (for example, `src/` and `public/`). `docs/` contains project notes and documentation only.

## Approved scope and decisions

- Build a responsive, route-based React website from the supplied ByteSpace Figma-export designs.
- Recreate the complete landing page, plus demo `/login`, `/signup`, and not-found routes. Authentication is client-side demo feedback only: no backend, real account creation, credential submission, or persistence.
- Extract inline base64 raster images to `public/assets/`, deduplicate by content hash, and write `public/assets-manifest.json` mapping images to their source exports and layers.
- Rebuild the design rather than copying fixed-position export markup. Use the Home export and official screenshots as references; use `imgs/Login.svg`/`Login.png` for login because `login.html` is a Search Page export.
- Load Poppins, Satoshi, and Clash Display from Google Fonts/Fontshare with system fallbacks.
- Keep `figma-samples/` in the local checkout but ignored by Git.
- Delivery target (approved revision): private repository `MS-Jahan/ByteSpace_New_frontend_demo`, branch `feat/bytespace-frontend`, PR to `main`. The original user request for public visibility was superseded by their approved private-repository plan.

## Phase 1 — Bootstrap & assets

- [x] Create a root-level Vite + React + TypeScript project and configuration.
- [x] Add scripts for development, build, lint, typecheck, tests, and asset extraction.
- [x] Ignore dependencies, build output, environment files, and original `figma-samples/` exports.
- [x] Add a repeatable extractor for inline base64 images in HTML/SVG design sources.
- [x] Extract and SHA-256 deduplicate 72 unique assets across 18 source HTML/SVG files.
- [x] Add `public/assets-manifest.json` mapping source files, offsets, layers, and extracted asset hashes.

## Phase 2 — Landing page

- [x] Establish the ByteSpace blue/lime/neutral design system, type, buttons, and responsive containers.
- [x] Build reusable branding, navigation, course-card, icon, and footer components.
- [x] Recreate hero, local course search, partner/social-proof strip, category tiles, and featured course catalog.
- [x] Add learner-growth/statistics and creator-benefit sections using extracted art.
- [x] Add creator CTA, testimonials, and newsletter interface.
- [x] Implement tablet/mobile layouts, collapsible mobile navigation, visible focus states, and reduced-motion support.

## Phase 3 — Routes & interactions

- [x] Add client-side routes for `/`, `/login`, `/signup`, and unmatched paths.
- [x] Add course search, category filters, save toggles, and an empty-results state.
- [x] Add login/signup browser validation and explicit non-persistent demo-only feedback.
- [x] Add accessible password visibility toggle and demo-only forgot-password notice.
- [x] Add validated newsletter input; feedback explicitly confirms no network send or persistence.

## Phase 4 — Documentation & verification

- [x] Preserve the original task prompt and approved clarifications in `docs/init.md`.
- [x] Keep this detailed phased plan in `docs/plan.md`.
- [x] Document setup, routes, project structure, typefaces, and demo limitations in `docs/README.md`.
- [x] Document asset extraction and usage in `docs/assets.md`.
- [x] Record scope decisions and delivery status in `docs/questions.md`.
- [x] Run `npm run typecheck` — passed.
- [x] Run `npm run lint` — passed after aligning the flat ESLint config with the installed React Hooks plugin.
- [x] Run `npm test` — passed (2 test files, 8 tests).
- [x] Run `npm run build` — passed.
- [x] Inspect the live browser preview at 1440px desktop and 390px mobile widths; the landing and auth routes render without horizontal overflow.
- [x] Confirm all 12 referenced page images and the Poppins, Satoshi, and Clash Display web fonts load; no runtime console errors observed.
- [x] Inspect route headings, forms, accessible labels, mobile navigation state, and signup validation via the browser accessibility tree and page state.
- [ ] Optional screenshot artifact: the preview webview is not composited in this environment, so screenshot capture is unavailable despite the live page and browser-DOM checks succeeding.

## Phase 5 — Private GitHub delivery

- [x] Verify private repository `MS-Jahan/ByteSpace_New_frontend_demo` and authenticated CLI access.
- [x] Create the `main` bootstrap commit with the root README/setup and create `feat/bytespace-frontend` from that shared base.
- [ ] Create the feature-branch commit with app source, extracted assets/manifest, and docs; exclude `.freebuff/`, original samples, dependencies, and build output.
- [ ] Push both `main` and `feat/bytespace-frontend` to the configured private repository.
- [ ] Open PR `feat/bytespace-frontend` → `main` and include verification results.

## Acceptance criteria

- The landing page captures the supplied ByteSpace visual style and section order across screen sizes.
- Course controls and demo forms work without backend requests or sensitive-data persistence.
- App images are local extracted files under `public/assets/`, not inline base64 in React source.
- Source/assets stay outside `docs/`, and original samples remain ignored and unpublished.
- Prompt, plan, setup, asset, and decision documentation are present under `docs/`.
- Typecheck, lint, automated tests, and production build pass.
- GitHub delivery is complete only after the feature branch has been pushed and the PR exists.
