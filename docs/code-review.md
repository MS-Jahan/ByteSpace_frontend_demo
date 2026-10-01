# ByteSpace frontend: code review of the post-fix working tree (2026-09-29)

**Scope:** the uncommitted working tree on `feat/bytespace-frontend` (the `git diff HEAD` changes plus untracked files), checked against `docs/review.md`, including its "Status after fixes" section. This review covers correctness, behaviour, accessibility, tests, docs and maintainability. A separate review covers visual fidelity.

**Method**
- Read every file in `src/**`, `e2e/**`, `scripts/**`, the config files and the docs.
- Confirmed behaviour with throw-away Vitest probes in a scratch copy of the repo. The repo itself was not modified; the only side effect is that `npm run build` rewrote the git-ignored `dist/`.
- Tested one CSS behaviour in headless Chrome through Playwright.
- Host only. No Docker, and `agent-browser` was not used.

**Labels**
- **Severity:** P0 = broken or blocking; P1 = a real bug, an a11y failure or a test that cannot catch regressions; P2 = polish or hygiene.
- **CONFIRMED** = reproduced (probe test, browser check or arithmetic) or visible directly in the code. **PLAUSIBLE** = inferred by reasoning, not reproduced.

---

## 0. Check results

**In the repo (host):**

| Check | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run lint` | pass (no output) |
| `npm test` | 4 files, **41/41 pass** (8.4 s) |
| `npm run build` | pass; `dist/static/index-*.css` 50.11 kB (gzip 10.45), `index-*.js` 337.77 kB (gzip 106.59) |

**Clean-clone check.**
- Setup: copied `git ls-files -co --exclude-standard` without `figma-samples/`, and symlinked `node_modules`.
- `npm test` passes 41/41. `npm run build`, `typecheck` and `lint` all pass.
- **Nothing that runs at build or unit-test time depends on the git-ignored `figma-samples/`.** Only `e2e/visual.spec.ts` and the two scripts read it, and the visual spec skips itself when the folder is absent.
- Not checked: `npm run test:e2e`.

**Probe results** (scratch copy, `src/__tests__/probe.test.tsx`; not committed):
```
AUTH after switch: success heading = You're on your way! | form present = false
AUTH errors after switch: [ 'Enter a valid email address.', 'Use at least 8 characters.' ]
CREATOR h1 name = "PurePearl StudioCreator" | follow btn = Following
LEVEL select shows Level | articles 0          (/search?level=Expert)
GARBAGE tab 404 = true                          (/courses/build-digital-asset/garbage — OK)
SCOPE focus after Escape on item: BODY
FLASH notice 1.1s after 2nd click: ""           (message cleared ~3 s early)
REVIEWS fitness: hero Beginner 4.1 (52 reviews) | avg 4.7 | sidebar "10 Lessons (1 hour 15 mins)" "99 more videos"
```

**Browser check** (Chrome via Playwright, 390 px viewport, a 900 px wide `<div>`):
```
"html,body{overflow-x:clip}"  scrollWidth 390 / innerWidth 390   <- overflow invisible to the test
"body{overflow-x:hidden}"     900 / 390
""                            900 / 390
```

---

## 1. Findings, most severe first

### P1-1 Auth form state carries over between `/login` and `/signup`. CONFIRMED
- **Where:** `src/App.tsx:18-19`; state in `src/pages/AuthPage.tsx:100-103`.
- **Cause:** both routes render `<AuthPage>` at the same tree position, so React reuses the instance when the route changes.
- **Failure scenario:**
  - Sign in successfully, then click "Create an account". The signup page shows **"You're on your way!"** without anything being submitted.
  - Submit an empty login form, then switch. The signup page shows the login errors, and `showPassword` and `notice` carry over too.
- **Fix:** add `key="login"` / `key="signup"` to the two elements, or `key={mode}` inside a wrapper. Add a unit test for the switch.

### P1-2 The e2e overflow check cannot fail, and the plan tick "Responsive without masking overflow" is false. CONFIRMED
- **Where:**
  - `src/styles.css:46` sets `html, body { overflow-x: clip; }`;
  - `e2e/responsive.spec.ts:221` asserts `documentElement.scrollWidth === innerWidth`;
  - `docs/plan.md` Phase 7, second tick.
- **Cause:** `overflow-x: clip` on `body` removes clipped content from the document's scrollable overflow. With it, a 900 px element at 390 px still reports `scrollWidth 390` (browser check in §0). The check passes whatever the layout does.
- **Why it is a spec problem:** review.md §4.10 HR1 asked for both this safety net *and* the `scrollWidth` assertion. The two are mutually exclusive.
- **Fix:**
  - Remove the `body` clip. Keep per-section `overflow: clip` on the decorative containers: `.hero`, `.creator-cta` and `.home-frame` already have it.
  - Or keep the net and make the test measure without it: `document.body.style.overflowX = 'visible'; document.documentElement.style.overflowX = 'visible'` before measuring. Alternatively, assert that no element's `getBoundingClientRect().right` exceeds `innerWidth` outside a clipping ancestor.
  - Un-tick the plan item until the check can actually fail.

### P1-3 The visual-diff "gate" allows 35 % pixel change, and its comment is wrong. CONFIRMED
- **Where:** `e2e/visual.spec.ts:323-324` and `:393-394`.
- **Problem:** measured diffs are 1.4–9.9 %, but the threshold is `WARN_RATIO = 0.35`.
  - Home could regress from 2.2 % to 34 % and still pass.
  - The comment says it "only triggers a warning, not a failure". In fact `expect.soft` **does** fail the test at the end; it only keeps the test running.
- **Fix:** keep a per-route baseline, e.g. `{home: 0.022, search: 0.099, …}`, and fail at `baseline + 0.01`. Correct the comment. Optionally compare per band (header, hero, …) as review.md §8.1 suggested, so that a local regression is not averaged away over the full page.

### P1-4 Scaled stage text ignores browser zoom at 961–1440 CSS px (WCAG 1.4.4). CONFIRMED by code reasoning
- **Where:**
  - `src/components/Stage.tsx:31-34`;
  - `src/styles.css:162-171`;
  - the real text inside stages: the Hero h1, intro and search form (`Hero.tsx:71-95`), the CTA h2, paragraph and button (`CreatorCta.tsx:55-65`), and the revenue and students cards (`CreateManage.tsx:15-42`).
- **Cause:** `--s = clientWidth / designWidth` is measured in CSS px. Zooming in shrinks the CSS viewport, so `--s` falls by the same factor as the zoom.
- **Failure scenario:**
  - A 1440 px window at 125 % zoom has a 1152 CSS px viewport, so `--s = 0.8`. The h1 renders at 72 × 0.8 × 1.25 = 72 device px: zoom has **no effect** on hero or CTA text until the 960 px breakpoint.
  - With text-only zoom or a minimum font size, text grows inside a fixed 1024 × 488 design box that is clipped by `overflow: clip`, so it overlaps the art and gets cut off.
  - On phones, `CreateManage`'s stage is **not** `decorative` and scales to about 0.64 at 390 px. "July 1-28" then renders at about 6.4 px and "Total Revenue" at about 10 px.
- **Fix:**
  - Scale only the art. Move `.hero__content` and `.creator-cta__content` out of `<Stage>` into normal flow, positioned over the stage with a `position: relative` wrapper.
  - Mark the Create & Manage stage `decorative`: its numbers are illustrative. If they must be read, give them a text alternative outside the stage.

### P1-5 The Home page downloads about 7 MB of 2500 × 2500 PNGs eagerly, including shapes that are hidden on mobile. CONFIRMED (file sizes)
- **Where:** `src/sections/Hero.tsx:19-33` and `src/sections/CreatorCta.tsx:12-44`, via `Shape3D` (`src/components/Shape3D.tsx:52`, `loading="eager"`).
- **The files:** `home-home-92f21ffd63` (1.33 MB), `a96322e3c1` (1.93 MB), `021f81bfc4` (1.20 MB), `f5b5a7e7fe` (1.39 MB), `2b33854c48` (1.34 MB). Each is 2500² RGBA, about 25 MB decoded, and each is also used as a CSS `mask`.
- **Hidden shapes still download:** the `mobile.hidden` shapes are hidden with `display: none` (`--md`), but `<img>` elements still fetch in that state.
- **Why it matters:** slow LCP and memory pressure on phones. The rest of `public/assets` is 14 MB.
- **Fix:**
  - Pre-resize these renders to about 2× their largest displayed size (≤ 800 px) and convert to WebP or AVIF. Record the derivatives in the manifest through a script.
  - Or use baked exports for all of them.
  - Use `loading="lazy"` for the CTA shapes (below the fold).
  - Do not mount `mobile.hidden` shapes below 960 px: use a `matchMedia` check, or `<picture><source media="(max-width:960px)" srcset="data:,">`.

### P1-6 Course pages show one course's content for all 18 courses, with contradictory numbers on one screen. The §6.3 "Data model" and RV8 items were documented, not implemented. CONFIRMED
- **Where:**
  - global `courseModules`, `courseLessonPreview`, `courseIncludes`, `ratingBreakdown`, `courseReviews` and `moreVideosCount` (`src/data.ts:483-572`);
  - `src/pages/course/CourseLayout.tsx:126-138`;
  - `src/pages/course/CourseReviewsPage.tsx:5-7,29-31`.
- **Failure scenario** (`/courses/fitness-habits-for-busy-people/reviews`):
  - The hero says "4.1 (52 reviews)"; the summary says "4.7" from 889 ratings.
  - The sidebar says "10 Lessons (1 hour 15 mins)", previews "Introduction to Digital Assets…" and then "99 more videos".
  - The copy reads "…experience with 'Build Digital Assets: A Comprehensive Guide'".
- **Spec gap:**
  - §6.3 asked to nest this data under the course, with a default. It is not nested.
  - RV8 asked to move `ratingBreakdown` into the course and derive the average. Only the average is derived, and from a global histogram.
- **Docs are wrong:** `docs/questions.md:45` claims "the details page shows 4.7". It shows `details.rating` = **4.8** (`src/data.ts:236`).
- **Fix:**
  - Add an optional `details.curriculum` / `details.reviews` (`{ breakdown, items, intro }`) with the Build Digital Asset content as the default.
  - Derive the hero rating and `reviewCount` from the breakdown when present.
  - Compute "N more videos" as `totalLessons - preview.length`, keeping the design's 99 only for the demo course.
  - Interpolate the course title into the reviews intro.
  - Correct `questions.md:45`.

### P1-7 The Level, Category and Sort selects have no visible focus indicator (WCAG 2.4.7). CONFIRMED
- **Where:** `src/styles.css:587` (`.toolbar__select select { … outline: 0 }`).
- **Cause:** there is no `.toolbar__select:focus-within` rule. The only `:focus-within` rules are for `.hero-search__field` and `.newsletter-form` (`:69-71`).
- **Failure scenario:** a keyboard user tabs through the Search or Creator toolbar, and focus disappears on three controls.
- **Fix:** `.toolbar__select:focus-within { outline: 3px solid var(--blue); outline-offset: 3px; }`. Better, scope it to `:has(select:focus-visible)`.

### P1-8 Creator page state leaks between creators. CONFIRMED
- **Where:** `src/pages/CreatorPage.tsx:14-18`, which holds `following`, `category`, `level`, `featured` and `sort`.
- **Failure scenario:**
  - Follow Nova Labs, then click header "Creators": PurePearl shows "Following".
  - A selected category that the next creator doesn't have leaves the select showing "Category" while the list is empty. The same mismatch as P2-3.
- **Fix:** render `<CreatorProfile key={slug} creator={creator} />` from a thin route component. The same applies to `CourseLayout` share and video notices across course slugs (minor).

### P1-9 The creator `<h1>` accessible name is "PurePearl StudioCreator". CONFIRMED
- **Where:** `src/pages/CreatorPage.tsx:47-50`.
- **Cause:** JSX drops the newline between `{creator.name}` and the badge `<span>`.
- **Test gap:** the test uses `getByText('PurePearl Studio')` (own text nodes only), so it doesn't catch this.
- **Fix:** move the badge out of the `<h1>` (it is a label, not part of the name), or insert `{' '}` plus a visually-hidden separator. Test with `getByRole('heading', { level: 1, name: 'PurePearl Studio' })`.

---

### P2-1 The scope menu has incomplete menu keyboard behaviour and loses focus. CONFIRMED
- **Where:** `src/pages/SearchPage.tsx:95-97` and `:158-185`.
- **Problems:**
  - `role="menu"` / `menuitemradio` promises arrow-key navigation and focus moving into the menu. Neither happens: focus stays on the trigger.
  - Escape or a click on the item unmounts the focused item, so focus drops to `<body>` (probe).
  - There is no outside-click or Tab-away close.
- **Fix:**
  - Either drop the ARIA menu pattern: the trigger becomes a plain button with `aria-expanded` and the item a plain button.
  - Or implement the full pattern: focus the first item on open, handle ArrowUp/Down, Home/End and Escape, return focus to the trigger on close, and close on `focusout` outside or on a document `pointerdown`.

### P2-2 The visually-hidden submit button is in the tab order with no visible focus. CONFIRMED
- **Where:** `src/pages/SearchPage.tsx:186-188`; the `.sr-only` rule has no `:focus` reveal (`src/styles.css:74-82`).
- **Failure scenario:** tabbing from the scope button lands on an invisible control. The e2e tap-target test explicitly allow-lists it.
- **Fix:** add `tabIndex={-1}`. Implicit Enter submission still works, because the form still contains a submit button.

### P2-3 Unknown `?level`, `?category` and `?sort` values show the placeholder but filter everything out. CONFIRMED
- **Where:** `src/pages/SearchPage.tsx:22-24`.
- **Failure scenario:** `/search?level=Expert` shows "Level" in the select and 0 results (probe). `?category=Featured` behaves the same way.
- **Fix:** normalise against the lists, e.g. `levels.includes(v) ? v : LEVEL_LABEL`, and the same for `categories` and `sorts`. Optionally `setParams(…, { replace: true })` to drop invalid keys.

### P2-4 A fractional `?page` breaks slicing. CONFIRMED by code
- **Where:** `src/pages/SearchPage.tsx:26`.
- **Problem:** `Number('1.5')` survives `Math.max`. With two or more pages, `slice(9, 27)` shows a mixed page and no pager button gets `aria-current`.
- **Fix:** `Math.max(1, Math.floor(Number(params.get('page'))) || 1)`.

### P2-5 Notice timers clear newer messages early. CONFIRMED
- **Where:** `src/pages/course/CourseLayout.tsx:45-48`.
- **Problem:** each `flash` pushes a new 4 s timer without cancelling the previous one. Click Play at t = 0, then again at t = 3 s: the notice disappears at t = 4 s (probe). The `timers` array also grows without bound.
- **Fix:** keep one timer id per setter (`useRef<number>()`), and `clearTimeout` before setting a new one.

### P2-6 Status regions are `display: none` while empty, so announcements are unreliable. PLAUSIBLE (screen-reader dependent)
- **Where:**
  - `src/styles.css:154` and `:158`/`:849` (cart notices);
  - `:614` (share status);
  - `:633` (video notice).
- **Cause:** a live region must be in the accessibility tree before its content changes, and `display: none` takes it out. Safari/VoiceOver often skips such announcements.
- **Related problems:**
  - The cart notice (`src/components/Header.tsx:27-29`) is never cleared, so a second click doesn't announce anything.
  - The auth success card (`AuthPage.tsx:158`) mounts as a `role="status"` with content already inside, and focus drops to `<body>` when the form unmounts.
- **Fix:**
  - Keep the regions rendered and hide them visually with `:empty { visibility: hidden }` or `.sr-only`, or with zero padding.
  - Clear and re-set the cart text, or add a counter.
  - Move focus to the success heading (`tabIndex={-1}` plus `ref.focus()`).

### P2-7 Auth errors have no `role`, and the plan tick claims one. CONFIRMED
- **Where:** `src/pages/AuthPage.tsx:183,201,229`; `docs/plan.md` Phase 8 ("`aria-invalid`, `aria-describedby`, `role`").
- **Problem:** focus moves to the first invalid field, which works in most cases. But when that field already has focus (Enter pressed inside it), nothing is announced.
- **Fix:** give the error container `role="alert"`, or a form-level `aria-live` summary. Correct the plan text.
- **Nit:** login enforces the signup rule "at least 8 characters" (`:114`). A real login would only require a non-empty password.

### P2-8 Heading levels skip on Search and Creator. CONFIRMED
- **Where:** `SearchPage.tsx:142` and `CreatorPage.tsx:47`. On both pages the `<h1>` is followed directly by the course cards' `<h3>` (`CourseCard.tsx:37`).
- **Fix:** add `<h2 className="sr-only">Courses</h2>` above each grid. Alternatively, give `CourseCard` a `headingLevel` prop.

### P2-9 `aria-label` on a `<p>` for review stars. CONFIRMED
- **Where:** `src/pages/course/CourseReviewsPage.tsx:92`.
- **Problem:** `aria-label` is prohibited on the paragraph role, and many screen readers ignore it there.
- **Fix:** `<p role="img" aria-label="5 out of 5 stars">`, or visible `sr-only` text.

### P2-10 Text contrast below AA (WCAG 1.4.3) from design tokens. CONFIRMED (computed)
| Where | Colours | Ratio | Text |
|---|---|---|---|
| Section intros `styles.css:319`; `.float-card small` `:254`; `.empty-state p` `:399`; `.auth__success p` `:799` | `--muted #82868E` on white | ≈ 3.7:1 | 12–18 px regular |
| `.auth__happy small` `:752` | muted on lime | ≈ 3.1:1 | 10 px |
| Current pager number `:591` | `#CED0D3` on white | ≈ 1.5:1 | page number |

These are design values. Record the trade-off in `questions.md`, or darken `--muted` to about `#6B6F77` (≈ 5:1). Lime on blue (≈ 6.5:1) and text on lime (≈ 13:1) pass.

### P2-11 Side effects of the `(pointer: coarse)` tap-target block. CONFIRMED by code
- **Where:** `src/styles.css:1119-1148`.
- **Side effects:**
  - `:1144`: `.course-card__title-row h3 a { display: block; line-height: 44px }` makes every card about 20 px taller on touch devices. This includes an iPad in the desktop layout, which the 1440 visual diff (fine pointer) never sees.
  - `:1145-1146`: footer links go from `gap 16` to `padding 11 / gap 0`, so the footer columns grow by about 6 px per link.
  - `:1137`: the byline's 44 px hit area (`margin-block: -13px`) overlaps the title link's 44 px box above it. Taps on the title's lower edge go to the creator link.
  - `pointer: coarse` misses touch laptops, whose primary pointer is fine; `any-pointer: coarse` catches them.
  - The magic negative margins (`-13/-8/-9/-15`) are derived from line-heights and will drift silently.
- **Fix:**
  - For the title, use `padding-block: 10px; margin-block: -10px` like the other inline links, so the layout doesn't move.
  - Compute the margins with `calc((44px - 1lh) / -2)`, or use a `::after { inset: -10px }` hit area instead.
  - Consider `(any-pointer: coarse)`.

### P2-12 `field-sizing: content` fallback. CONFIRMED (support is Chromium-only)
- **Where:** `src/styles.css:586-587`.
- **Problem:** Firefox, and Safari versions without support, size each select to its longest option. Category becomes about "Freelance & Entrepreneurship" wide and Sort "Price: high to low", so the toolbar wraps differently. It works, but it is visibly off-design.
- **Fix:** the "styled select" pattern: a visible `<span>` with the current label, and the `<select>` absolutely positioned over the pill with `opacity: 0`. Or an `@supports not (field-sizing: content)` fixed width.

### P2-13 Hash links: repeat clicks don't scroll, and Back overrides restored positions. PLAUSIBLE
- **Where:** `src/components/Layout.tsx:55`; the dependencies are `[hash, pathname, navigationType]`.
- **Problems:**
  - Clicking `/#paths` a third time after scrolling away changes none of these values, so nothing happens. React Router turns a same-URL link into REPLACE; the second click reruns the effect only because the type changed from PUSH.
  - On POP to a URL with a hash, the effect jumps to the hash instead of the saved position.
- **Fix:** depend on `location.key`, and skip the hash jump when `navigationType === 'POP'`.

### P2-14 The Back/Forward "keeps position" claim is unverified. PLAUSIBLE
- **Where:** `Layout.tsx:30`; README:45; plan Phase 6 ("unit-tested").
- **Problem:** the app relies on the browser's native scroll restoration after `popstate`. That runs before React renders the previous, often taller, route, so the position can be clamped. This is why React Router ships `<ScrollRestoration>`. The unit test only asserts that `scrollTo` wasn't called (jsdom).
- **Fix:** migrate to `createBrowserRouter` + `<ScrollRestoration getKey={…}>` using the same `scrollKey`. Or add an e2e test: scroll Home to 3000 px, open a course, press Back, and assert `scrollY ≈ 3000`.

### P2-15 The header is `position: absolute`, not fixed, so the hash offset leaves a gap. CONFIRMED
- **Where:** `src/styles.css:139` (`.site-header { position: absolute }`) and `:47` (`scroll-padding-top: calc(var(--header) + 12px)`); README:45 says "below the fixed header".
- **Problem:** after a hash jump the header has scrolled away, and the target sits 132 px below an empty band.
- **Fix:** drop `scroll-padding-top`, or make the header sticky. Correct the README.

### P2-16 The mobile menu is only a partial disclosure. CONFIRMED
- **Where:** `src/components/Header.tsx`.
- **Problems:** focus isn't moved into the panel on open, and the menu doesn't close on an outside click or when Tab leaves it. The spec asked only for Escape, closing on navigation and focus return, which are all done, so this is polish.
- **Fix:** close on `focusout` outside the `<nav>` and on a document `pointerdown`.

### P2-17 "Filter" is ambiguous and "featured" means two things. CONFIRMED
- **Where:** `CourseToolbar.tsx:50-57`; `SearchPage.tsx:25,115-118`; `data.ts:43`.
- **Problems:**
  - The toolbar "Filter" toggles rating ≥ 4.5 (`?featured=1`). Its accessible name "Filter" says nothing about what it does.
  - The "Featured" chip means "no category".
  - `Course.featured` means "landing card".
- **Fix:** rename the parameter and prop to `topRated` / `?rated=4.5`, and add `aria-label="Top rated only"` or an sr-only suffix.

### P2-18 Dead code and duplicate CSS remain; the status claim "dead CSS/duplicate rules removed" is only partly true. CONFIRMED
- **Duplicated rules:**
  - `.filter-pill--stars svg` at `styles.css:346` and `:698` (the second overrides the first);
  - `.section { padding: 72px 0 }` at `:853` and `:1000`;
  - `.section { padding: 56px 0 }` at `:884` and `:1049`;
  - `@media (max-width: 960px | 720px | 1180px)` each split into two blocks (`:835/954`, `:839/961`, `:880/1042`).
- **Unused or duplicate tokens:**
  - `--blue-deep` and `--lime-deep` (`:12,14`) are never used;
  - `--line` equals `--input-border` (`:20,22`);
  - `--surface-soft` equals `--section-bg` (`:24,27`);
  - `--radius-card` is used once.
- **Dead markup and specificity hacks:**
  - `.course-hero > .grid-overlay` is rendered (`CourseLayout.tsx:71`) but `display: none` on desktop (`:616`), while the page also renders `.course-page__band .grid-overlay`;
  - `.course-sidebar__includes { margin-top: 24px !important }` (`:649`) is a specificity workaround; use `.course-sidebar .course-sidebar__includes`;
  - empty lines at `:553-555`.
- **Magic numbers:**
  - `.course-page__share { right: calc(34px - max(32px, (100vw - 1200px) / 2)) }` (`:612`) and `.course-hero h1 { max-width: calc(100vw - 214px) }` (`:617`): `100vw` includes the scrollbar, so these are about 15 px off on Windows and Linux with classic scrollbars;
  - `.auth__collage { left: -25px; right: 35px }` (`:741`).
- **TypeScript and data:**
  - `export const CURRENCY` (`src/data.ts:60`) is unused;
  - `AuthPage.tsx:37,40` depends on array positions (`courses[1]`, `courses[2]`); use `findCourse('build-digital-asset')`;
  - `detailsFor(...)` repeats `title/level/rating/lessons/duration` by hand for every featured course (`data.ts:208,259,285,316,341`); pass the course object instead.
- **Formatting:** there is no Prettier setup. Indentation is broken after the wrapper removal in `CourseLessonsPage.tsx:8-44` and `CourseReviewsPage.tsx:27-103`, and in `data.ts:242-245`. Add `prettier` with a `format:check` script in CI.

### P2-19 Small data-consistency issues. CONFIRMED
- `CourseCard.tsx:39-40` reads "4.5 out of 5 from 172 reviews". It combines the card rating with the details review count; for Build Digital Asset the details say 4.8.
- `courseReviews[0].quote` (`data.ts:543`) embeds literal quotes; the other three don't.
- `isValidEmail` (`src/validation.ts:3`) accepts `a@b..c`. This is acceptable for a demo; `Footer.tsx:19` doesn't trim before storing, but the validator trims.

### P2-20 E2E configuration hazards. CONFIRMED by config
- **Stale-server risk:** `playwright.config.ts:399-417` runs the **dev** server on port **4173**, Vite's `preview` default, with `reuseExistingServer: true`. A leftover `npm run preview` of an old `dist/` is silently tested instead.
- **Browser default:** `channel: process.env.PW_CHANNEL ?? 'chrome'` requires a system Chrome, and CI or Docker images with only the bundled Chromium fail.
- **README overstates coverage:** it says the font check runs "at 1440/768/390/320" (`docs/README.md:70`). The font test runs once, at the default viewport.
- **Fix:** use a dedicated port (e.g. 4317), or `reuseExistingServer: !process.env.CI`; default to the bundled Chromium; correct the README row.

### P2-21 Test gaps (behaviour that is claimed but not exercised). CONFIRMED
- **`?q` draft sync:** `App.test.tsx:327-333` checks only the initial value, which `useState(params.get('q'))` already provides. The `useEffect` sync (the actual §6.2 bug) is never exercised. Add: render `/search?q=figma`, click header "Courses", and expect `''`.
- **Share branches:** `App.test.tsx:303-312` accepts either message, so no branch is pinned. Stub `navigator.share` (resolve, `AbortError`, other rejection) and `navigator.clipboard.writeText` (resolve, reject) separately.
- **Missing tests:**
  - `/login` ↔ `/signup` state reset (P1-1);
  - a creator slug switch (P1-8);
  - invalid query parameters (P2-3, P2-4);
  - `/courses/<slug>/garbage` → 404 (works today; lock it in);
  - keyboard focus visibility, with an e2e `:focus-visible` outline check per interactive element;
  - Back/Forward scrolling (P2-14).
- **Tap targets:** `e2e/tap-targets.spec.ts` checks only the initial state at 390. The open scope menu, the auth social buttons after a notice, and 320 px are not covered.
- **Asset hashes:** `assets.test.ts` checks the manifest byte size but not `sha256`, so a same-size replacement file passes. It is cheap to hash the files in the test.

### P2-22 Scripts and provenance. CONFIRMED
- **No npm script for the export copier:** `scripts/export-figma-assets.mjs` is not wired into npm. This was the same complaint about `design-copy.mjs` in §7.6. Add `"export:assets": "node scripts/export-figma-assets.mjs"`.
- **Node version:** the script uses `import.meta.dirname`, which needs Node ≥ 20.11; README says "Node 20 or newer". State ≥ 20.11, or use `fileURLToPath(new URL('..', import.meta.url))`.
- **Undocumented provenance:** `figma-samples/exports/{shapes,icons}.json` and the PNG/SVG exports come from a manual Figma Plugin API run, and no committed script or doc explains how to regenerate them. Add the plugin snippet, or document the steps, in `docs/assets.md`.
- **Pruning:** `extract-assets.mjs` still doesn't prune stale files. This is acknowledged in `plan.md`.

### P2-23 Doc inaccuracies. CONFIRMED
| File:line | Claim | Actual |
|---|---|---|
| `docs/assets.md:115` | `home-home-*` are unused "layout fragments and duplicates" | 10 `home-home-*` files are used: 5 raw shape renders (`Hero.tsx`, `CreatorCta.tsx`) and 5 Happy-Students avatars (`data.ts:135-139`) |
| `docs/questions.md:45` | "the details page shows 4.7" | 4.8 (`data.ts:236`); only the Reviews summary shows 4.7 |
| `docs/plan.md` Phase 7 | "Responsive without masking overflow … (e2e)" | masked by `html, body { overflow-x: clip }`, and the e2e check cannot fail (P1-2) |
| `docs/plan.md` Phase 8 | validation uses a `role` | no `role` on auth errors (P2-7) |
| `docs/plan.md` Phase 6 | scroll behaviour "unit-tested" | Back/Forward is not tested (P2-14) |
| `docs/README.md:45` | "below the fixed header" | the header is `position: absolute` (P2-15) |
| `docs/README.md:70` | fonts checked at four widths | checked at one (P2-20) |
| `docs/review.md` status | "dead CSS/duplicate rules … removed" | partly (P2-18) |
| `docs/review.md` status, §7.2 | card vs details split and per-course data | split done; per-course curriculum and reviews not done (P1-6) |

The rest of the docs match the code: the route table, SPA fallback, scripts, the 41-test and 61-e2e counts, `static/` `assetsDir`, the self-hosted fonts, the cart-notice decision, and `/creators`.

---

## 2. Spec compliance (review.md §3–§8, verified in code)

Visual metrics (px sizes, positions, colours) are left to the parallel visual review. "✓" means the structural or behavioural part is implemented.

| § | Item | Status |
|---|---|---|
| 3.1 | Self-hosted Satoshi 400/500/700 and Clash 700; preload; Fontshare link removed; fallback stack | ✓ `styles.css:5-8,30`, `index.html:12-13` |
| 3.2 | `Shape3D` tint component; blobs and hand-made PNGs deleted | ✓ Also a `BakedShape` for Figma exports. The hand-made PNGs are gone and were never committed. The raw shapes are the 2500 px renders (P1-5). |
| 3.3 | Image map | ✓ All references exist and are in the manifest (test). Avatar, video and sneak-peek order match the table. |
| 3.4 | Tokens, no letter-spacing, `.button--sm`, coarse 44 px, progress width from data, `--gold` / `--purple` removed | ✓ (only `letter-spacing: 0` remains). New tokens exist, with some duplicates (P2-18). |
| 3.5 | `CourseCard decorative` (inert, aria-hidden, no links), `title=` on the title, "by" in grey | ✓ `CourseCard.tsx:17-23,37,43` |
| 3.6 | Footer `h2.sr-only`, `noValidate`, `role="alert"`, `to` stored in data, category links | ✓ `Footer.tsx`, `data.ts:577-608` |
| 4.3 | Logo strip `aria-hidden`, Figma SVGs | ✓ `LogoStrip.tsx:14` |
| 4.4 | `categories[]` vocabulary; Search options = pills ∪ paths | ✓ (plus Finance and Sport for the footer) |
| 4.6 / 4.7 | Growth copy fixed; invented link and "Join as Creator" removed; correct people | ✓ |
| 4.9 | Straight quotes | ✓ `Testimonials.tsx:23` |
| 4.10 | HR1 clip | Partly done: per-section clip is in, but the body safety net masks overflow and defeats the assertion (P1-2) |
| 4.10 | HR5 / HR8 stage scaling | ✓ `Stage`, with an a11y regression (P1-4) |
| 4.10 | HR7 pill scroller at ≤720 px | ✓ `styles.css:1061-1075` |
| 5 | A11 `aria-label` and notice; A12 sr-only demo line; A14 `aria-pressed`; `CollageCard` removed | ✓ |
| 6.1 | 404 for bad slugs (incl. nested tabs); stray `id="home"` removed | ✓ (tested). The `id="home"` on the Hero is legitimate. |
| 6.2 | 18 per page, pager always rendered, `?page`, explicit chip list, toolbar with "Level" / "Category" first options, scope button + sr-only submit, draft sync, sr-only status | ✓ All present. Keyboard and focus issues: P2-1, P2-2, P1-7. |
| 6.3 | Sidebar as a sibling of `<Outlet/>`; D1, D2, D3, D9, D12, D15 (Share), D8 (play notice); RV1 heading; RV7 eager avatars | ✓ |
| 6.3 | RV8 derived rating, "Data model" nested per course | Not done: global data, only documented (P1-6) |
| 6.4 | `<h1>`, avatar, shared `CourseToolbar` with Filter, sr-only count, inline mobile stats | ✓ but the h1 name is glued to "Creator" (P1-9) |
| 6.5 | Legal type scale and alignment | ✓ `styles.css:824-832` |
| 7.1 | Scroll: tabs keep position, POP skipped, instant; 404; titles; mobile menu with Escape, route close, focus return and cart in panel; `/creators` and SPA fallback documented | ✓ with caveats P2-13 to P2-16 |
| 7.2 | `Intl.NumberFormat`; creator asserted → 404; card vs details split; 18 seeds | ✓ |
| 7.3 | Tokens; overflow; stage; duplicates and dead rules; ≤480 px rules; focus palette | Partly: duplicates remain (P2-18), overflow masked (P1-2), toolbar focus missing (P1-7) |
| 7.4 | `decorative` prop; `AvatarStack` props; unused icons removed; named handlers; cart notice documented; `assetsDir` | ✓ (all 25 icon names are used; no inline arrow handlers remain) |
| 7.5 | a11y table items | ✓ except the regressions listed above |
| 7.6 | `design-copy.mjs` deleted | ✓ |
| 8.1 | Visual harness plus overflow, image, console, font and tap checks | Present but weak: overflow check vacuous (P1-2), 35 % threshold (P1-3) |
| 8.2 | Rewritten Marketing test; all new tests listed | ✓ except the weak `?q` sync test (P2-21) |
| 10 | Doc corrections | Mostly done. Remaining errors: P2-23. |

---

## 3. What is solid

- **Routing:** the route table is clean. Nested unknown tabs fall to `*`, and unknown slugs render `NotFoundPage` while the hooks still run in a stable order.
- **Share:** `shareCourse` handles `AbortError` quietly and falls back to the clipboard. A missing `navigator.clipboard` is caught.
- **Search:** URL-driven state with `replace` keeps history clean. Filter changes reset the page.
- **Components:** `Stage` cleans up its `ResizeObserver` and resize listener, and has no feedback loop (width drives `--s`, and `--s` drives only the height). The mobile menu's Escape listener is registered only while the menu is open.
- **Assets test:** globbing `src/**` against the manifest is a good guard against stray files.
- **Clean clone:** tests and the build pass without `figma-samples/`.
- **Reduced motion:** covers transitions and `scroll-behavior`.
