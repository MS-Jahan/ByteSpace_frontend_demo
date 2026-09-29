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
- [x] Extract and SHA-256 deduplicate 72 unique assets from 18 scanned HTML/SVG files (16 contain images; the two 404 exports have none).
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
- [x] Re-run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` after restoring dependencies from the npm lockfile — passed (8 tests).
- [x] Inspect the live browser preview at 1440px desktop, 768px tablet, and 390px/320px mobile widths; landing and auth routes render without horizontal overflow.
- [x] Confirm all 12 referenced page images load; no runtime console errors observed.
- [ ] ~~Satoshi web font loads~~ — **incorrect claim (audit 2026-09-29):** Poppins and Clash Display load, but the Fontshare request for Satoshi returns the "Switzer" face, so body text falls back to a system sans-serif. Tracked in Phase 6.
- [x] Inspect route headings, forms, accessible labels, mobile navigation state, and signup validation via the browser accessibility tree and page state.
- [x] Screenshot artifact: captured with Playwright/headless Chrome during the 2026-09-29 audit at 1440/768/390/320px (`.playwright-mcp/`, local only). The earlier Preview webview could not composite frames.
- [ ] ~~No horizontal overflow at any width~~ — **partly incorrect (audit 2026-09-29):** about 15px horizontal scroll at 320px on `/`, `/login`, `/signup` (hero/CTA rings, auth glow); category tile text clips at 320/768; hero orbit collides with search and growth card clips at 768. Tracked in Phase 7.

## Phase 5 — Private GitHub delivery

- [x] Verify private repository `MS-Jahan/ByteSpace_New_frontend_demo` and authenticated CLI access.
- [x] Create the `main` bootstrap commit with the root README/setup and create `feat/bytespace-frontend` from that shared base.
- [x] Commit app source, extracted assets/manifest, and docs on the feature branch; exclude `.freebuff/`, original samples, dependencies, and build output.
- [x] Push `main` and `feat/bytespace-frontend` to the private GitHub repository.
- [x] Open PR `feat/bytespace-frontend` → `main`: [#1 — Build responsive ByteSpace learning frontend](https://github.com/MS-Jahan/ByteSpace_New_frontend_demo/pull/1).
- [x] Add a GitHub Actions CI workflow to run `npm ci`, typecheck, lint, tests, and the production build on pushes and PRs.
- [x] Verify both PR-triggered and branch-push workflow runs pass on the updated feature commit, alongside GitGuardian; PR #1 reports a clean merge state.
- [x] Upgrade checkout/setup-node actions to current major releases; the deprecated Node 20 action-runtime warning is resolved.
- [x] Confirm the maintenance run passes. GitHub's only remaining workflow annotation is an informational notice about the future `ubuntu-latest` image migration.

## Audit 2026-09-29 — gaps against the brief (historical)

The audit found that Phases 1–5 delivered a working app but not the brief's "100% replicate the design": invented layouts and art, wrong fonts and shapes, and five unbuilt design pages. The full findings are in [review.md](review.md); the phases below were then implemented in the working tree (uncommitted). Ticks below mean **verified** (unit test, e2e check or visual diff at 1440 px); partial items say what is missing. The repository stays private until the work is committed and merged (see `questions.md`).

## Phase 6 — Foundation & navigation

- [x] Fix body typeface: Satoshi and Clash Display are self-hosted in `public/fonts/`; an e2e test asserts the Satoshi faces are loaded and used by `body`.
- [x] Split `App.tsx` into `src/pages/`, `src/pages/course/` and `src/sections/`; `App.tsx` is only the route table.
- [x] Shared `Layout` route (header, footer, scroll behaviour); auth routes sit outside it.
- [x] Router `<Link>`s everywhere; hash links scroll below the header; footer categories go to `/search?category=…`.
- [x] `Brand` uses `<Link to="/">`.
- [x] Remove duplicates and unused code (unused icons `arrow`, `sparkle`, `mail`, `plus`, `signal`, `play`; dead CSS; duplicate rules).
- [x] Stable slugs and numeric prices in `data.ts`; card fields separate from details fields.
- [x] Named handlers instead of inline arrows in every component.
- [x] Scroll restoration: tab switches keep position, Back/Forward keep the browser's position, other pages start at the top (instant); unit-tested.
- [x] Unknown course/creator slugs (including `/courses/bad/lessons`) render the 404; per-route `document.title`.

## Phase 7 — Landing page fidelity rebuild (`Home.png`)

Home differs from `Home.png` by **2.2 %** of pixels at 1440 px.

- [x] Header, hero (ring, tinted 3D shapes, floating cards), partner logos, Discover pills and 2x3 grid, learning paths, course card, Growth, Create & Manage, Creator CTA, testimonials, footer (see [review.md](review.md) §3–4 for the spec).
- [x] Responsive without masking overflow: `html`/`body` no longer clip; each decorative section clips its own art, and the e2e asserts `scrollWidth === innerWidth` at 1440/1280/1024/768/390/320 on every route (the check failed at 1024 before the Discover pills and the Growth art were fixed).
- [x] Tap targets of at least 44x44 px on touch at 390 on every route (e2e allow-list: the visually hidden search submit and the aria-hidden duplicate card image link).
- [ ] Partial: the 961–1439 px range uses the scaled design stage but is not compared against a design; only 1440 is diffed. Hero and CTA copy still lives inside the scaled stage (body copy is floored at ~16px rendered size); moving it into normal flow over the art is not done.

## Phase 8 — Auth & 404 fidelity

Login 1.4 %, Register 1.5 %, 404 2.5 % of pixels differ at 1440 px.

- [x] Collage, "Happy Students" card and shapes; "or" divider and Facebook/Google buttons (visual demo only); small lime button.
- [x] Inline accessible validation (`aria-invalid`, `aria-describedby`, `role`), `aria-pressed` on the password toggle.
- [x] Newsletter feedback: `noValidate`, inline `role="alert"` error for an empty or invalid email, and a success message (unit-tested).
- [x] 404 with header and footer and the gradient "404".
- [ ] Forgot-password: obsolete, the design has no such link (removed).

## Phase 9 — Additional design pages

Search 9.9 %, Details 1.8 %, Lessons 3.6 %, Reviews 2.4 %, Creator 3.8 %.

- [x] `/search`, `/courses/:slug` (+ `/lessons`, `/reviews`), `/creators/:slug`, `/legal`, with links from cards, bylines and results.
- [x] Correct images per page (asset test: every reference exists and is in the manifest).
- [x] SPA fallback documented in `docs/README.md`.
- [ ] Partial: Search differs by 9.9 % (the largest); the pager shows the real page count (one page with 18 courses) instead of the design's "1 2 3 4 5" (see `questions.md`).

## Phase 10 — Verification & docs

- [x] Playwright suite (`npm run test:e2e`): visual diff at 1440, overflow/broken images/console errors at four widths, fonts, tap targets at 390. Run on the **host**, not in Docker.
- [x] Unit tests (41): routes, filters, sort, pager (mocked two pages), 404 slugs, scroll, hash, titles, menu, newsletter, notices, footer targets, asset manifest.
- [x] `build.assetsDir: 'static'` keeps Vite output apart from `public/assets/`.
- [x] `docs/README.md`, `assets.md`, `questions.md`, `init.md`, `review.md` updated.
- [ ] Not done: the extractor does not prune stale files on re-run.
- [ ] Not done: Docker runs of typecheck/lint/test/build, a CI run of the new work, and updating PR #1 (nothing is committed).

## Acceptance criteria

- Every page with a supplied design (Home, Login, Register, 404, Search, Course Details, Lessons, Reviews, Creator Profile) matches its PNG in layout, copy, section order, and art at 1440px, and degrades cleanly at 768/390/320px with no horizontal scroll.
- Header and footer navigation works from every route.
- The body typeface actually loads, verified in the browser.
- The landing page captures the supplied ByteSpace visual style and section order across screen sizes.
- Course controls and demo forms work without backend requests or sensitive-data persistence.
- App images are local extracted files under `public/assets/`, not inline base64 in React source.
- Source/assets stay outside `docs/`, and original samples remain ignored and unpublished.
- Prompt, plan, setup, asset, and decision documentation are present under `docs/`.
- Typecheck, lint, automated tests, and production build pass.
- GitHub delivery is complete: the feature branch is pushed and an open PR targets `main`.
- The repository is made public once all phases are complete.
