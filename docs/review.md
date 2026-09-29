# ByteSpace frontend — fidelity & quality review (2026-09-29)

Review of the **uncommitted working tree** on `feat/bytespace-frontend` after a second agent implemented Phases 6–9 of [plan.md](plan.md). Read-only review: no code was changed.

## Status after fixes (date 2026-09-29)

The findings below describe the tree **before** the four fix passes. After them (still uncommitted):

- **Foundations (§3):** Satoshi and Clash Display are self-hosted; tokens, button/pill/header/card metrics and the footer follow the design; wrong images are fixed and asset references are tested against the manifest.
- **Shapes (§3.2, §4.2):** every 3D shape is a Figma export (`public/assets/shapes/`, sources in `figma-samples/exports/shapes.json`), placed on a scaled design stage.
- **Pages (§4–6):** Home, auth, 404, Search, Course Details/Lessons/Reviews and Creator are rebuilt from the exports.
- **Routing and a11y (§7.1, §7.5):** unknown course/creator slugs (including nested tabs) render the 404; scroll behaviour keeps tab and Back/Forward positions; per-route titles; the mobile menu closes on Escape and on navigation, returns focus and holds the cart; 44x44 tap targets on touch (e2e-checked at 390); footer `h2`s, newsletter `noValidate` with an inline alert; `:focus-within` on search and newsletter wrappers.
- **Code quality (§7.3–7.4):** named handlers, dead CSS/duplicate rules and unused icons removed, `design-copy.mjs` deleted, invented cart notice kept and documented.
- **Tests (§8):** 41 unit tests plus a Playwright suite (61 tests); the assets test globs `src/**` for `/assets/…`.
- **Docs (§10):** README, assets, questions, init and plan corrected.

Visual diff at 1440 px (`npm run test:e2e`, share of differing pixels):

| Route | Before | After |
|---|---|---|
| Home | 35–85 % fidelity | 2.2 % |
| Login | | 1.4 % |
| Register | | 1.5 % |
| Search | | 9.9 % |
| Course Details | | 1.8 % |
| Course Lessons | | 3.6 % |
| Course Reviews | | 2.4 % |
| Creator | | 3.8 % |
| 404 | | 2.5 % |

Not done: Docker runs (host only), a CI run of the new work, updating PR #1, pruning stale files in the extractor, a design comparison for 961–1439 px, and the design's five-page Search pager (the data has one page; see `questions.md`).

**How it was reviewed**

- Browser pass (Sonnet, Playwright/Chromium): every route at 1440 / 768 / 390 / 320, overflow, clipping, console, network, fonts, tap targets, and all interactions.
- Code + plan audit (Opus): Phase 6–10 items versus the code, design tokens parsed from `figma-samples/*.html`, embedded images hashed and matched to `public/assets/`, and `npm run typecheck / lint / test / build`.
- Visual diff (Opus ×2): every design PNG (4320 px = 3× a **1440 px canvas**) downscaled and compared band-by-band against the 1440 screenshots.
- Disagreements between agents were re-checked by hand (font response, Search card count, hero ring), and the correct values are stated below.

**Verdict:** the app works (0 console errors, 0 failed requests, SPA navigation everywhere, forms validate, and typecheck/lint/17 tests/build all pass), but it is **not a replica of the design**. Per-page fidelity scores are 35–85 % on Home and 50–70 % elsewhere. The largest causes are systemic rather than per-page: the body font does not load, every 3D shape is untinted or invented, wrong images appear in about 12 places, the button/card/pill metrics are wrong globally, and the course-page layout is wrong. Passing tests say nothing about fidelity, because nothing compares the pages against the PNGs.

**Design sources.**
- `figma-samples/*.html` hold the exact values, copy, icon vector paths and tint layers.
- `figma-samples/imgs/*.png` are the visual reference.
- `imgs/*.svg` are a **fallback only**:
  - Their layer names are not preserved: there are no ids like "Facebook" or "Logo_Partner".
  - Their embedded rasters are already among the 72 extracted assets.
  - They do **not** store the hard-light tint. All 35 `feBlend` nodes are `mode="normal"`, so tinted shapes must still be built with `Shape3D` (§3.2).
  - Use them only for glyphs missing from the HTML, such as the Facebook/Google marks on Login (`Login.svg`, 52 monochrome `<path>`s; no brand colours found). Locate those by the social-button coordinates (§5 A11).

Severity: **P0** = broken behaviour, or missing/wrong structure or copy · **P1** = clearly visible mismatch or real bug · **P2** = polish/hygiene.

---

## 1. Fidelity scorecard (1440 px)

| Page / section | Score | Main gaps |
|---|---|---|
| Home — Header | 85 % | height 104→120, nav gap, wordmark 27/600→24/700, bag icon |
| Home — Hero | 45 % | 640 px filled disc instead of 1149 px ring; invented CSS blobs; grey untinted shapes; 2 shapes missing; progress 39 %→55 % |
| Home — Logo strip | 65 % | 122→202 px tall; logos `#C3C6CB`→`#82868E` |
| Home — Discover + cards | 70–80 % | 2 wrong photos; filtering broken; card/pill metrics |
| Home — Learning paths | 65 % | tile shape/size, label size, wrong icon glyphs |
| Home — Growth | 40 % | wrong copy, invented link, wrong person, tilted thumbnail instead of full card |
| Home — Create & Manage | 35 % | wrong person (and hidden behind cards), invented button, card sizes |
| Home — Creator CTA | 40 % | 7 tinted 3D shapes replaced by CSS blobs/ring; ring overlaps text |
| Home — Testimonials | 82 % | paragraph colour, gaps, stretched cards, background |
| Home — Footer (all pages) | 70 % | grey→white background; newsletter button must sit outside the input |
| Home — mobile (390/320) | 45 % | 507 px layout width, white text on lime, invisible Search button |
| Login / Register | 60 / 62 % | font, collage assets/rotation, form metrics |
| 404 | 70 % | h1 60→72 px, glyph offset, mobile bottom padding |
| Search | 60 % | 6 vs 18 cards, no pager, wrong 9th chip, toolbar style |
| Course Details / Lessons / Reviews | 50 % each | sidebar inside hero and clipped; content not one 725 px column; copy; 44 px heading bug |
| Creator Profile | 65 % | wrong avatar, no `<h1>`, stats colours, missing Filter |
| Legal (no design) | 70 % | alignment and type scale inconsistent with other subpages |

---

## 2. Process problems (why it ended up here)

| # | Problem | Fix |
|---|---|---|
| PR1 | **No Phase 6–10 checkbox was ticked**, although most items were attempted. Of 41 items: 12 done, 4 done with minor diffs, 5 done wrong, 14 partial, 6 not done (all of Phase 10). See §9. | Tick items only after they are verified against the PNG, and record partials explicitly. |
| PR2 | **No visual comparison was ever run** (Phase 10). The work was judged by eye from memory of the design, so systemic errors (tinting, metrics, images) went unnoticed. | Add the Playwright visual-diff harness (§8.1) *before* further fidelity work, and use it as the gate for every section. |
| PR3 | **Design values were guessed rather than read.** The HTML exports contain exact `left/top/width/fontSize/border` values and base64 images whose hashes map 1:1 to `public/assets/`. `scripts/design-copy.mjs` tried this but is unreliable (§7.6). | Build the reference from the exports (§3, §4) and take numbers from there. |
| PR4 | **4 hand-made images were added** (`lime-cone.png`, `lime-squiggle-a.png`, `lime-squiggle-b.png`, `course-card-build-digital-asset.png`). They have no provenance, are not in the manifest, are not generated by any script, and break the acceptance criterion "App images are local extracted files". | Replace them with the tint technique (§4.1), or generate tinted variants with a script that writes to the manifest. Delete the 4 files. |
| PR5 | **Tests lock in a bug.** `App.test.tsx:38-49` asserts that clicking "Marketing" shows zero courses. | Rewrite it (§8.2). |
| PR6 | **Docs are stale or false** in `README.md`, `assets.md`, `init.md`, `questions.md` and `plan.md` (§10). | Update them as the last step of each phase. |
| PR7 | `.playwright-mcp/` (screenshots + snapshots) is untracked and **not in `.gitignore`**. | Add `.playwright-mcp/` to `.gitignore`. |

---

## 3. Root causes (fix once, fixes many pages)

### 3.1 P0 — Satoshi (body font) never loads

- `index.html:14` asks Fontshare for both families in one request: `f[]=clash-display@500,600,700&f[]=satoshi@400,500,700`.
- Verified with curl today: that combined URL returns **Clash Display + "General Sans"** faces and **no Satoshi**. An earlier audit saw "Switzer", so the substituted family varies. A Satoshi-only request returns the 3 Satoshi faces correctly.
- The comment on `index.html:13` ("requesting 600 makes Fontshare substitute") is a wrong diagnosis. Dropping 600 did not help; the combined request is the problem.
- The browser reported `document.fonts.check('16px Satoshi') === true`. That is misleading: `check()` returns `true` when **no** face with that name is declared. All body text actually falls back to Avenir / Arial / Liberation, which changes metrics on every page.

**Fix (recommended: self-host)**

1. Download Satoshi 400/500/700 and Clash Display 700 woff2 files (free Fontshare licence) into `public/fonts/`.
2. Declare them in `styles.css`: `@font-face{font-family:'Satoshi';src:url('/fonts/Satoshi-Regular.woff2') format('woff2');font-weight:400;font-display:swap}` for each weight, and the same for Clash Display 700.
3. Add `<link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/Satoshi-Regular.woff2">` for 400 and 500.
4. Remove the Fontshare `<link>` and its comment.
5. Verify in the browser that `[...document.fonts].filter(f => f.family.includes('Satoshi') && f.status === 'loaded').length >= 2` and that computed `font-family` on `body` resolves to Satoshi. Add this as a Playwright assertion.

**Minimal alternative:** use two separate links, `…/v2/css?f[]=satoshi@400,500,700&display=swap` and `…/v2/css?f[]=clash-display@700&display=swap`.

### 3.2 P0 — Every 3D shape is wrong (untinted, invented, or the wrong file)

In the design, each 3D shape is a **grey render** plus a sibling `Rectangle` filled with `#D4FB20` (lime) or `#F5F5F6` (white), using `mix-blend-mode: hard-light` and masked to the image (see the `Image / Mask / Rectangle` groups in `home.html`).

The implementation instead:
- places the raw grey PNGs, so they look silver;
- invents CSS "blobs", rings and triangles where lime was needed;
- uses 2500 px `home-home-*` renders instead of the design files;
- relies on the hand-made `lime-*.png` files.

**Fix: one reusable `Shape3D` component**

```tsx
// src/components/Shape3D.tsx
type Props = { src: string; tint: 'lime' | 'white'; className?: string; style?: React.CSSProperties };
export function Shape3D({ src, tint, className = '', style }: Props) {
  return (
    <span aria-hidden="true" className={`shape3d shape3d--${tint} ${className}`}
      style={{ ...style, '--shape': `url(${src})` } as React.CSSProperties}>
      <img src={src} alt="" loading="eager" decoding="async" />
    </span>
  );
}
```

```css
.shape3d { position:absolute; isolation:isolate; pointer-events:none; }
.shape3d img { display:block; width:100%; height:auto; }
.shape3d::after { content:''; position:absolute; inset:0; mix-blend-mode:hard-light;
  -webkit-mask:var(--shape) center/100% 100% no-repeat; mask:var(--shape) center/100% 100% no-repeat; }
.shape3d--lime::after  { background:#D4FB20; }
.shape3d--white::after { background:#F5F5F6; }
```

Then place every shape from the coordinate tables in §4.2, and delete:
- the 4 hand-made PNGs;
- the CSS rules `hero__blob*`, `hero__dome`, `creator-cta__shape--blob-*`, `--ring`, `--white-star`, `auth__ring` and `auth__triangle`;
- the positional `nth-of-type` shape selectors (`styles.css:795-796, 876-877`).

(An offline alternative is a Node/PIL script that colourises the greyscale with alpha preserved and records the outputs in `assets-manifest.json`.)

### 3.3 P0 — Wrong images (verified by hashing the embedded images in each export)

| Where | Must use (`public/assets/…`) | Currently | File |
|---|---|---|---|
| Card "Build Digital Asset" | `creator-profile-creator-profile-8eaa5e0652.jpg` | hand-made `course-card-build-digital-asset.png` | `data.ts:126` |
| Card "Balancing Productivity" | `creator-profile-creator-profile-9a66fe68c4.jpg` ("DO MORE" desk) | `…8eaa5e0652.jpg` (duplicate icons) | `data.ts:184` |
| Card "From Idea to Startup" | `creator-profile-creator-profile-df575fc9d2.jpg` (team, sticky wall) | `…9a66fe68c4.jpg` | `data.ts:238` |
| Card avatar stack (4 faces + lime "26+") | `creator-profile-creator-profile-{c18c1eacda,3ad412fe0f,8e0412163a,3859945b0b}.png` | 5 testimonial/home faces | `AvatarStack.tsx:2-8` |
| "Happy Students" stacks (hero, create, auth): 7 faces + "2K+" | `course-reviews-course-reviews-4dbffda228.png`, `creator-profile-creator-profile-c18c1eacda.png`, `home-home-{40d4ad3caf,e6c9467db0,2f0049b55f,3ff1efea98,f6e12716fa}.png` | the same 5 wrong faces (auth shows only 3) | `AvatarStack.tsx`, `styles.css:672` |
| Growth person | `home-image-eb157cb563.png` (577×540) | `home-image-15c3a6ff74.png` (the hero person) | `Growth.tsx:43` |
| Growth card | full card; image `home-frame-65ed80a823.png` or the Learn Figma jpg with live pills | tilted image-only `.mini-card` | `Growth.tsx:36-42` |
| Create & Manage person | `home-image-7be5f04241.png` (woman with tablet, 435×596) | `home-image-eb157cb563.png` | `CreateManage.tsx:29` |
| Growth squiggle | `home-image-69d19a8e47.png` (lime tint) | `lime-squiggle-b.png` | `Growth.tsx` |
| Create squiggle | `home-image-868b505a3a.png` (lime tint) | `lime-squiggle-a.png` | `CreateManage.tsx` |
| Auth back / front cards | `register-frame-bd8600e5b3.png` / `register-frame-0e9c78ece1.png`, or live `CourseCard`s | raw jpgs, rotated | `AuthPage.tsx` |
| Course video | `course-details-frame-c9df1e432b.png` | `course-details-course-details-6bdec61b47.jpg` | `CourseLayout.tsx:43` |
| Course sidebar author | `course-details-course-details-4a7d0e390b.jpg` (52 px) | `creator-profile-creator-profile-3859945b0b.png` | `CourseLayout.tsx:81` |
| Sneak-peek order | `3f76ebf680`, `e363ccde9e`, `7e85079f92`, `8d7c8d1b26` | 3f76, 7e85, 8d7c, e363 | `data.ts:74-79` |
| Review avatars (shifted by one) | PurePearl `course-reviews-…13645e2369.png`, Albert `…0c82569c42.png`, Cody `…1386882254.png`, Brooklyn `…4dbffda228.png` | PurePearl uses `3859945b0b`, the rest shifted | `data.ts:354-381` |
| Creator avatar | `creator-profile-image-8769fdad0a.png` (96×96, radius 24) | `…3859945b0b.png` | `data.ts:263` |
| Testimonials | Sarah `home-ellipse-f4921d3e28`, James `…08e3eab14a`, Alex `…eae493dc0f` | correct | — |

Also fix the `alt` text wherever an image changes, because the current alts describe the wrong photos.

### 3.4 P1 — Global tokens and metrics are off

**Colours.** Add the missing tokens and stop using `--ink #040819` for everything.

| Token | Value | Use |
|---|---|---|
| `--text` | `#242528` | headings, labels, button text, footer, auth/growth/create headings (**missing today**) |
| `--ink` | `#040819` | only the Discover/Paths h2s and "Follow" |
| `--lime-ring` | `#CBFC01` | hero ring, lime radial glows (**missing**) |
| `--border` | `#CED0D3` | card/tile/toolbar/newsletter outlines, dividers (code wrongly uses `--line #E5E6E8`) |
| `--input-border` | `#E5E6E8` | auth inputs, rating track |
| `--track` | `#F6F6F6` | progress track (code `#E9EAEC`) |
| `--section-bg` | `#FAFAFA` | Growth + Create frame and Testimonials (code uses invented linear gradients) |
| remove | `--gold`, `--purple` | not in the design. Stars are `#CED0D3` on cards, lime on the hero/create Happy cards, blue on the auth Happy card, and `#4B4C53` on reviews. |

**Typography.**
- **No letter-spacing anywhere in the design.** Delete `letter-spacing:-0.03em/-0.035em` on headings (`styles.css:45,198,279,433,678,724`) and `-0.02em` on the brand.
- Satoshi is used for all body/UI text, Poppins 500/600 for headings and numbers, and Clash Display 700 24 px for the wordmark only.
- Change the fallback stack (`styles.css:20`) to `'Satoshi', system-ui, sans-serif`.

**Buttons** (`styles.css:76-89`).
- The design uses `padding:12px 24px; border-radius:24px; font:500 18px/21.6px Satoshi`, which gives a ≈46 px height.
- The code uses `min-height:52–58px; font-size:16px`. **Fix:** `.button{min-height:0;padding:12px 24px;font-size:18px;line-height:21.6px}`.
- Add `.button--sm{padding:8px 24px;font-size:16px}` for Share, the badge and meta pills.
- Keep 44 px touch height with `@media (pointer:coarse){.button{min-height:44px}}`.

**Pills / chips.**
- The design uses Satoshi 16/500 `#4B4C53`, `padding:12px 16px` (Discover pills: 10/16, 40 px tall), radius 24, and gaps of 16 horizontal and 24 vertical.
- The code uses weight 400, `padding:0 22px` and gap 12.

**Header** (`styles.css:22,111-134`).
- `--header:120px` (code 104).
- Nav `gap:24px` (code 46); actions `gap:24px`.
- `.brand__name{font-size:24px;font-weight:700}`.
- Replace the trolley `cart` icon (`Icons.tsx:54`) with the Material **shopping_bag** path copied from `home.html`, at 24 px.
- Nav text `#F5F5F6` at full opacity.

**Blue grid overlay** (`styles.css:145-155`).
- The design uses 2 px white lines at ≈12 % alpha on a 120 px pitch; the code uses 1 px lines at ≈9 %.
- **Fix:** `background-image:linear-gradient(to right,rgba(255,255,255,.12) 2px,transparent 2px),linear-gradient(to bottom,rgba(255,255,255,.12) 2px,transparent 2px);background-size:120px 120px`.
- Merge `.hero__grid` and `.auth__grid` into one `.grid-overlay`.

**Progress bars.**
- The design text says **55 %** (the fill is 112 px on a 200 px track); the code fills 39 % (`styles.css:241`).
- Set the width from data (`style={{width: `${value}%`}}`) rather than CSS, so the Home, Growth and Lessons bars each show their own value.

### 3.5 P1 — Course card (used by Home, Search, Creator, Auth, Growth)

The design is `CourseCard` 373×384: radius **24**, 1 px `#CED0D3`, padding **16**; image 341×195 radius **12**; grid gap **40** both ways.

| Element | Design | Code (`styles.css:310-348`) | Fix |
|---|---|---|---|
| Card | r24, `#CED0D3`, p16 | r20, `#E5E6E8`, p12 | `.course-card{border-radius:24px;border-color:var(--border);padding:16px}` |
| Grid | gap 40/40 | 28/24 | `.course-grid{gap:40px}` |
| Title | Poppins 20/600 black, **one line with ellipsis** | wraps to 2 lines, so heights vary | `white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;line-height:24px`, with the full title in `title=` |
| Byline | "by" `#4F4F4F`, name blue | whole line blue | `.course-card__teacher{color:#4F4F4F} .course-card__teacher a{color:var(--blue)}` |
| Image pills | `rgba(246,246,246,.6)` + `backdrop-filter:blur(4px)`, 12/500 `#4F4F4F`, p 6/12, gap 12, `nowrap` | `.86` alpha, 400 weight, gap 8, wraps on mobile | as design |
| Level chip | `#F5F5F6`, **r24**, p 6/12, 12/500 `#4B4C53`, `signal_cellular_alt` icon | r10, p 9/15 | as design |
| Avatars | 4 × 32 px **next to** the chip (gap 12–24) + lime "26+" | 28 px, pushed far right (`space-between`) | `.course-card__footer{justify-content:flex-start;gap:12px}`, 32 px faces |
| Price | "$25" Poppins 20/600 blue + "/lifetime" 12 px, no gap, 16 px above | gap 3, margin 20 | `gap:0;margin-top:16px` |
| Landing data | all 6 cards: Beginner, 4.5, 17 Lessons · 2 hours 16 mins · 59 Comments | Build Digital Asset: Intermediate, 24 lessons | Split into card fields vs details fields (§6.3) |

Add a `decorative` prop (renders `inert`, `aria-hidden`, no links), so the auth collage and the Growth card reuse `CourseCard` instead of the duplicated `CollageCard` (`AuthPage.tsx:9-40`) and `.mini-card`.

### 3.6 P1 — Footer (all pages)

- **Background.** The design is white with a 1 px `#CED0D3` top rule; the code is `#F1F2F4` (`styles.css:450`).
- **Newsletter.** The email input is a **separate** pill (376×52, radius 100, 1 px `#CED0D3`, padding 0 24), and the lime "Search" button sits **beside** it with a 24 px gap. The code puts the button inside one 430×66 pill (`Footer.tsx:47-63`, `styles.css:452-457`).
- **Widths.** Blurb 528 px (one line, 14 px); disclaimer 504 px, 24 px below.
- **Layout.** `.footer-top{grid-template-columns:528px 1fr;gap:92px}` and `.footer-links{grid-template-columns:repeat(3,167px);gap:40px;justify-content:end}`. Links 14/22.4 `#242528` with gap 16. `.footer-bottom{margin-top:130px;border-top:1px solid var(--border)}`.
- **Newsletter feedback.** Validation today relies on native bubbles. Add `noValidate` and an inline `role="alert"` error ("Enter a valid email address"), matching the auth forms.
- **Category links.** They all go to bare `/search`. Link each to `/search?category=<Name>`, and store `to` in `footerColumns` in `data.ts` instead of mapping by label (`Footer.tsx:8-24`).
- **Headings.** Footer `<h3>`s have no preceding `<h2>`. Use `<h2 class="sr-only">`.

---

## 4. Home page (`Home.png` / `home.html`)

Section heights, design vs implementation: logo strip 202 vs 122, CTA 488 vs 528, footer 525 vs 439. The total height is close (6377 vs 6462), but the internal rhythm differs.

### 4.1 Hero (`Hero.tsx`, `styles.css:136-241`)

| # | Problem | Design | Fix | Sev |
|---|---|---|---|---|
| H1 | Lime "dome" is a 640 px filled disc | `Ellipse 7`: **1149×1149 ring**, `border:320px solid #CBFC01`, at left 145 / top 582 | `.hero__ring{position:absolute;width:1149px;height:1149px;left:calc(50% - 575px);top:582px;border:320px solid var(--lime-ring);border-radius:50%;background:none}` | P0 |
| H2 | Invented lime blobs (`.hero__blob--left/right`); real shapes missing | see the shape table (§4.2) | Delete the blobs and place the shapes with `Shape3D` | P0 |
| H3 | Shapes grey, too small, or wrong files (pyramid 86 px instead of 189; ring uses `home-home-2b33854c48`; right squiggle uses `home-home-021f81bfc4` at 94 px) | §4.2 | §4.2 | P0 |
| H4 | h1 line-height 1.35, −0.035em, max-width 1010 | Poppins 72 / **86.4 (1.2)** / 600, width 935, top ≈169 | `line-height:1.2;max-width:935px;letter-spacing:0`; content `padding-top:169px`; h1→p gap 32 (code 8); text→search 60 (code 44) | P1 |
| H5 | Search field 478×58, radius 18, 17 px | **461×52, radius 24**, placeholder 18 `#82868E` | as design | P1 |
| H6 | Search button 112×58, 16 px | 104×46, 18/500 `#242528`, gap 16 | Global button fix (§3.4) | P1 |
| H7 | Person 660 px, bottom-anchored | `home-image-15c3a6ff74.png` **578×541** at (431,512) with soft shadow | `width:578px;top:512px;bottom:auto` | P1 |
| H8 | Progress card 262×118, 12 px label, 39 % | **232×131** at (842,651); label 14/500 `#242528`; track `#F6F6F6` 200×8; **55 %**; radius 16; padding 16; **no shadow** | as design | P1 |
| H9 | Happy Students card 166 px, 28 px avatars, gold star | **258×121** at (328,837); 7 faces × 32 px + "2K+" (12/700); **lime** star; title Satoshi 16/500 | as design; pass 7 avatars (§3.3) | P1 |
| H10 | "UI/UX Design" card | 208×70 at (404,639) | `top:639px;left:calc(50% - 316px)` | P2 |
| H11 | Overlay cards use Poppins titles and box-shadows | Satoshi 16/500; white; `backdrop-filter:blur(10px)`; no shadow | as design | P2 |

### 4.2 3D shape placement (page coordinates at 1440; use `left: calc(50% - 720px + Xpx)`)

> **Superseded (2026-09-29):** the shape files named in this section were replaced by the Figma exports in `public/assets/shapes/` (source list `figma-samples/exports/shapes.json`, tint already baked in). The placements below still apply.

**Hero (y 0–1024)**

| Asset | Tint | Size | Position (x, y) |
|---|---|---|---|
| `home-image-8696b5a3c4.png` (squiggle) | lime | 387 | (−122, 221) |
| `home-image-4f7948f454.png` (small squiggle) | white | 176 | (359, 652) |
| `home-cone-01-2-924b0a63b2.png` (torus) | white | 344 | (14, 681) |
| `home-cone-01-2-8203698f80.png` (cylinder) | lime | 372 tall | (1227, 220) |
| `home-cone-01-2-3741d7ed35.png` (pyramid) | white | 189 | (1104, 464) |
| `home-image-9c1dea097c.png` (squiggle) | white | 332 | (1124, 672) |

**Creator CTA (frame starts at y 4580; coordinates relative to the frame)**

| Asset | Tint | Size | Position |
|---|---|---|---|
| `home-image-d9a07c294e.png` | lime | 387 | (−122, −162) |
| `home-image-4f7948f454.png` | white | 176 | (354, 180) |
| `home-cone-01-2-99d4f12ec9.png` (pyramid) | lime | 189 | (1078, 0) |
| `home-cone-01-2-f720bcbad8.png` (cylinder) | white | 372 tall | (1222, 5) |
| `home-cone-01-2-4507d0290b.png` (cone) | white | 189 | (−50, 225) |
| `home-cone-01-2-ed0ce392c8.png` (torus arc) | lime | 344 | (16, 298), bottom-cropped |
| `home-image-7b7c8a5d35.png` | lime | 332 | (1107, 289) |

**Auth (Login/Register, page coordinates)**

| Asset | Tint | Size | Position |
|---|---|---|---|
| `register-cone-01-2-f78b01a8d3.png` (torus) | lime | 147 | (149, 320) |
| `home-cone-01-2-3741d7ed35.png` (pyramid) | lime | 189 | (95, 702) |
| `register-image-7d4e3cabf3.png` (squiggle, rotated 180°) | white | 176 | (646, 801) |

All shapes get `z-index` below the text and are clipped by their section (`overflow:clip` on the section, not on `body`).

### 4.3 Logo strip (`LogoStrip.tsx`, `Logoipsum.tsx`)

- **P1** Height 202 px on `#F5F5F6` (`padding:80px 0`); the code is 122 px.
- **P1** Logo colour `#82868E`; the code draws live text in `#C3C6CB` at 25 px.
- **P1** Copy the 5 vector groups verbatim from `home.html` → `Logo_Partner` instead of the hand-drawn approximations. Each is 167×41, gap 72, spanning x 154–1286, centred (`justify-content:center`, not `space-between`).
- **P2 a11y** "Logoipsum" is read aloud 5 times. Mark the list `aria-hidden="true"`, or give it one `aria-label="Partner logos"`.

### 4.4 Discover + course grid (`Discover.tsx`, `data.ts:44-63`)

- **P0 Filtering is broken.**
  - The courses' `category` values are `Design | IT & Software | Business`, but the pills are `Music, Marketing, UI/UX Design…`, so every pill except "Featured" shows the empty state.
  - **Fix:** give each course `categories: string[]` drawn from the pill and path vocabulary (for example Learn Figma → `['UI/UX Design','Design','Graphic Design']`; Big Data → `['Data Science','IT & Software','Development']`; Money → `['Business','Finance','Marketing']`), and filter with `includes`.
  - Build the Search category options from `courseFilters ∪ learningPaths` rather than from `courses` (`SearchPage.tsx:11`).
- **P1** Pill metrics: 40 px tall, `padding:10px 16px`, weight 500, `gap:24px 16px`. Rows then re-flow to 8/6/5 like the design.
- **P1** Intro paragraph `max-width:917px` (2 lines); the code uses 800.
- **P2** Section `padding-top:72px`; pills→grid gap 78 px (code 46).
- The design grid is **2 rows × 3 = 6 cards**. The code is correct here; the plan's "3×3" is wrong.

### 4.5 Learning paths (`LearningPaths.tsx`, `Icons.tsx`)

- **P1** Tiles are **167×167 squares**, gap 40, radius 24, `#CED0D3` outline; the code uses 183×160 with gap 20. Add `aspect-ratio:1` at ≥720 only.
- **P1** Label Satoshi **20/500** `#242528` (code 16).
- **P1** Icons are the design's filled glyphs on a 60 px lime disc: pen+ruler (Design), phone with `</>` (Development), laptop (IT & Software), office building (Business), people/signal (Marketing), portrait camera (Photography). Copy the SVG paths from `home.html` → `Frame 10`; do not use the stroke scissors/megaphone/chart icons.
- **P2** Paragraph `max-width:917px`.

### 4.6 Growth (`Growth.tsx`)

- **P0 Copy.** The paragraph must end "…or embark on a new career path entirely, **we have the resources you need.**" The code has "…our courses are designed to meet you where you are." (`Growth.tsx:17-19`).
- **P1** Remove "Browse all courses →" (`Growth.tsx:29-31`); it is not in the design.
- **P0 Art composition** (inside a 600×560 art box whose left edge is x 759):
  - An upright full `CourseCard decorative` "Learn Figma", 373×384 at (0,0), with no rotation.
  - The person `home-image-eb157cb563.png`, 577 px at (31,12), `z-index:3`, in front of the card.
  - The lime-tinted squiggle `home-image-69d19a8e47.png`, ≈130–216 px at (445,90), `z-index:4`.
  - A progress card 256×159 at (344,212) with 55 %.
- **P1** h2 `max-width:577px;color:#242528`. Body `max-width:477px;line-height:1.6`, `#4B4C53`. Stat numbers Poppins **36/44 weight 500** blue (code 600).
- **P2 Background.** Growth + Create share one `#FAFAFA` frame (y 3120–4580) with blurred radial glows. Each is 1137 px unless noted, `filter:blur(20px)`, positioned relative to the frame:
  - lime `rgba(203,252,1,.40)` at (−152,−466);
  - blue `rgba(0,59,226,.08)` at (811,−458);
  - blue `.16` at (−508,183);
  - blue `.24` at (722,788);
  - lime `.60`, 672 px, at (−287,946).

  Replace the two invented linear gradients (`styles.css:375,395`).

### 4.7 Create & Manage (`CreateManage.tsx`)

- **P0 Person.** Use `home-image-7be5f04241.png` (the woman with a tablet), 435 px, at art-relative (28,0). Update the alt text.
- **P0 Layering.** Revenue cards `z-index:2`, the woman `z-index:3`, the Students card and squiggle `z-index:4`. Today the person sits behind the cards and is almost invisible.
- **P1** Remove the "Join as Creator" button (`CreateManage.tsx:55-57`); the design only has it in the CTA band.
- **P1 Revenue cards.** Radius 16, blue, padding 16.
  - "Total Revenue" is 219×152 at (0,45), with a white 200 px track, a lime fill, and "$120.29".
  - "Year to Date" is 134×135 at (0,195), stacked touching, with a "+12$" lime chip and "$1,200.38".
- **P1** Students card 258×123 at (283,414). Lime squiggle `home-image-868b505a3a.png` ≈150 px at (339,150).
- **P1 Copy block.** h2 `max-width:391px;color:#242528`; body `max-width:580px` with "ByteSpace" 18/700 `#242528`. Checklist items 18/**500** `#242528`, gap 18, `margin-top:40px`.
- **P2** Section height ≈720 (`padding:40px 0 120px`).

### 4.8 Creator CTA (`CreatorCta.tsx`)

- **P0** Replace the entire `.creator-cta__shapes` content with the 7 tinted shapes from §4.2. This also fixes the CSS ring that overlaps paragraph line 2.
- **P1** h2 `max-width:710px;color:#F5F5F6`, so it wraps as "Unlock Your Potential as a / Creator with ByteSpace". Paragraph `max-width:964px;color:#F5F5F6` (3 lines).
- **P2** Band height 488 px; content `padding-block:85px`.

### 4.9 Testimonials (`Testimonials.tsx`)

- **P1** Intro paragraph `#4F4F4F`, `max-width:580px` (code `#82868E`).
- **P1** Grid `gap:40px;align-items:start`. Cards hug their content (the design heights differ) and are 374 px wide.
- **P2** Card padding 24; avatar 80 px; name `#000` Poppins 20/600; role 18 blue; quote 18/28.8 `#4F4F4F` with `margin-top:24px`.
- **P2** The design puts straight quotes inside the text; the code wraps it in `&ldquo;…&rdquo;` (`Testimonials.tsx:23`). This is an optional change.
- **P2** Background `#FAFAFA` with glows: lime 1137 px at (842,−241), lime 672 px at (395,−138), and blue 1137 px at (−442,149), relative to y 5068.

### 4.10 Home responsive (the design is desktop-only; these are the required adaptations)

| # | Width | Problem | Fix | Sev |
|---|---|---|---|---|
| HR1 | 390, 320 | **Layout width 507 px** (+117 / +187). Offenders: `img.create__squiggle`, `.hero__dome`, `.hero__blob--right`, the CTA blobs, and at 320 `.revenue-card--month`. Hidden only by `body{overflow-x:hidden}` (`styles.css:37`). | Clip each decorative container (`.hero,.creator-cta,.growth__art,.create__art{overflow:clip}`); change `body{overflow-x:hidden}` to `html,body{overflow-x:clip}` as a safety net only. Size the ring `width:min(1149px,180vw)`. Assert `scrollWidth === innerWidth` in tests. | P0 |
| HR2 | 768, 390, 320 | White h1 words and intro sit on the lime blobs, so contrast fails | Fixed by deleting the blobs (H2). On mobile, put the art **below** the search and scale the shapes to ≈35 % at the edges with `z-index` under the text. | P0 |
| HR3 | 768, 390 | The lime Search button is invisible on lime | Fixed by H2. At ≤720 keep the button inline (`flex:none`) on blue. | P0 |
| HR4 | 768–320 | The ring swallows the art box; the person is small; cards touch the edges | Mobile art stack: ring `150vw` centred at ≈55 % of the art box; person `min(340px,86vw)`; show only the progress card (top-right) and students card (bottom-left), and hide the UI/UX card below 480 px; minimum inset 16 px. | P1 |
| HR5 | ≤960 | Growth/Create art uses absolute positions tuned for 1440, which leaves dead space, pins cards off-edge, and puts Year-to-Date on top of the h2 | Wrap each art group in a fixed design-size box (600×560 / 660×560) with `transform:scale(var(--s))`, `--s:min(1,(100vw - 32px)/600px)`, `transform-origin:top left`, and a height of `calc(560px*var(--s))`. This gives one faithful composition at every width. | P1 |
| HR6 | 768, 390 | CTA shapes overlap the h2 and paragraph; lime at 0.55 opacity turns olive on blue | Below 960 keep 3 shapes (lime squiggle top-left, white cylinder top-right, lime squiggle bottom-right) at ~50 % size in the corners, `z-index:0`. Never use opacity on lime. | P1 |
| HR7 | 390, 320 | Filter pills take 7 rows | ≤720: one horizontally scrollable row: `flex-wrap:nowrap;overflow-x:auto;scroll-snap-type:x proximity;margin-inline:-16px;padding-inline:16px;scrollbar-width:none`. | P2 |
| HR8 | 961–1439 | `calc(50% ± N px)` and `left:1085px` (`styles.css:429,741`) break between breakpoints; the progress card is clipped at 961–1180 | Position the art inside a centred, relative 1440 px "stage", and scale the stage below 1440 (the same technique as HR5). | P1 |

---

## 5. Auth pages (`Login.png`, `Register.png`; `AuthPage.tsx`, `styles.css:622-708`)

> `figma-samples/login.html` is byte-identical to `search-page.html`: it is the Search export. There is no Login export, so Login values come from `register.html` (the same frame) plus the PNG.

| # | Problem | Design | Fix | Sev |
|---|---|---|---|---|
| A1 | Eyebrow "Sign in with ease" is Satoshi 20/500 **lime** | **Poppins 20/600 `#F5F5F6`**, lh 24 | `.auth__eyebrow{font:600 20px/24px var(--font-display);color:#F5F5F6}` | P1 |
| A2 | Intro block about 34 px too high; lede 520 px, `#E5E6E8` | block at (122,120), gap 16; lede 18/28.8 `#F5F5F6`, **width 475** (Register wraps to 3 lines) | as design | P1 |
| A3 | Collage cards rotated −6°/2°; back card 214 px with its text hidden; 6 px white borders | two **unrotated full** cards 373×384: back "Build Digital Asset" at (122,394), front "the Power of Big Data" at (233,305), r24, 1 px `#CED0D3` | Remove the rotations and the `.auth__stack--back …{display:none}` rules (`styles.css:659-663`). Render with `CourseCard decorative`. | P1 |
| A4 | CSS ring and clip-path triangle; untinted 2500 px squiggle | 3 tinted 3D assets (§4.2 Auth table) | `Shape3D` | P1 |
| A5 | Happy card: Poppins 18/600, 3 avatars (2 hidden by `styles.css:672`), gold star | 258 px at (348,740), lime, r16; title Satoshi 16/500; 7 avatars; 43 px `#242528` "2K+" disc (12/700); **blue** star; "4.5" 10/700 + "(240)" 10/400 | as design | P2 |
| A6 | Card top 87, r30, padding 58/56/46 | card at x 741, **top 120**, ≈579 wide, **r24**, padding ≈61/63/48 | as design | P1 |
| A7 | Card title margin 12/40; `--ink` colour | "Sign In" 18 `#003BE2` directly above "Welcome Back" Poppins 44/52.8 `#242528`; 40 px to the form | `.auth__card h2{margin:0 0 40px;line-height:52.8px;color:var(--text)}` | P2 |
| A8 | Labels 16/400, gap 10 | **14/500** `#242528`, gap 8 | as design | P1 |
| A9 | Inputs 60 px tall, border `#DFE1E4`, placeholder 16 `#9A9DA4` | **453×52**, r12, 1 px `#E5E6E8`, padding 12/24, placeholder **18 `#82868E`** | as design | P1 |
| A10 | Fields gap 26; submit 52 px / 16 px | gap 24; right-aligned small lime button 12/24, 18/500 | global button fix | P2 |
| A11 | Social buttons are the text letters "f" / "G" in Poppins; clicking does nothing | brand SVG glyphs (Facebook disc, Google G) in ≈64 px rounded-square outline buttons (r≈20, `#CED0D3`) | Use the SVGs, and add `aria-label="Continue with Facebook/Google"`. On click, show the same inline demo notice the form uses. | P2 |
| A12 | Extra "Demo only · nothing is submitted…" line (`AuthPage.tsx:243`, which also has a JSX formatting glitch) | not in the design | Make it `sr-only`, or show it only in the success card (which already has a disclaimer). Run Prettier. | P2 |
| A13 | Switch line ("New user? / Already have an account?") uses ink, margin 34 | `#4B4C53` 16/25.6, link blue, **122 px** below the form | as design | P2 |
| A14 | Password toggle lacks `aria-pressed` | — | add `aria-pressed={visible}` | P2 |
| A15 | 961–1100 px: the absolute collage overflows its column | — | Scale the collage stage like HR5, or hide it below 1100. | P1 |
| — | "Forgot password" link | **not in the design** | None needed. Plan item 8.5 is obsolete. | — |

At ≤720 the design button is never full width. Keep it right-aligned at its natural width (`styles.css:934`).

---

## 6. Subpages

### 6.1 404 (`404 Not Found.png`; `NotFoundPage.tsx`, `styles.css:711-725`)

- **P0** Unknown course/creator slugs redirect to `/search` (`CourseLayout.tsx:9`, `CreatorPage.tsx:30`, `<Navigate to="/search" replace />`). Render `<NotFoundPage />` instead.
- **P1** h1 **72/86.4**, `max-width:935px`, so it wraps "The page you are looking / for doesn't exist" (the code is 60 px, `styles.css:724`).
- **P1** "404" glyph: Poppins 600 480/480 at top 160, `letter-spacing:0`, `margin-bottom:-119px`, gradient `linear-gradient(180deg,#D4FB20 25%,rgba(212,251,32,0) 92%)`. The code uses `line-height:.9` and `−.06em`, which sits it ≈40 px higher and narrower.
- **P1 mobile** "Back to Home" sits flush on the blue/footer boundary at 768/390/320. Add `.not-found{padding-bottom:72px}` at ≤960 and 56 px at ≤720.
- **P2** Vertical gaps of 32 px (code 30/34). At ≤720 the h1 covers ≈50 % of the digits: use `.not-found__code{font-size:140px;line-height:140px;margin-bottom:-30px}` and an h1 of 30 px.
- **P2** Remove the redundant `id="home"` (`NotFoundPage.tsx:5`, `SearchPage.tsx:69`).

### 6.2 Search (`Search Page.png`; `SearchPage.tsx`)

- **P0 Results and pager.** The design shows **18 cards** (6 rows × 3; `Course_Card_1` appears 18 times in the export) plus a "‹ 1 2 3 4 5 ›" pager at y 3208. The code sets `PAGE_SIZE = 6` over 6 courses, so pagination never renders and the page ends at 2086 px instead of 3853.
  - Fix: seed at least 18 course entries (the design repeats the 6, so add distinct slugs with varied prices, levels and categories so that sort and filter visibly work), use `PAGE_SIZE = 18`, and always render the pager.
  - Put the page in the URL (`?page=`).
- **P0 Chips.** Replace `courseFilters.slice(0,9)` (`SearchPage.tsx:138`), which yields "Digital Illustration", with the explicit design list: `Featured, Music, Drawing & Painting, Marketing, Animation, Social Media, UI/UX Design, Creative Marketing, Cooking`. Show them in one row with `justify-content:space-between`, padding 12/16, weight 500.
- **P1 Toolbar.** The design has four outline pills (1 px `#CED0D3`, r24, padding 12/16, a 24 px icon plus gap 4, 16/500 `#4B4C53`) labelled **Filter · Level · Category · Most relevant**, with no chevrons. The code uses native selects (radius 14) that display the option values ("All levels ⌄").
  - Fix: use a button + listbox popover, or `appearance:none` selects whose first options are "Level" and "Category".
  - Put the toolbar 72 px below the hero, the chips 32 px below it, and the cards 80 px below that.
- **P1 Pager style.** Prev/next are outline pills (1 px `#CED0D3`, r24, padding 12/16). Numbers are Poppins 20/600, with the current page shown in `#CED0D3` (de-emphasised) and the others in `#242528`, gap 24. There is no filled circle. Keep `aria-current="page"`.
- **P1 Hero.** 360 px tall, h1 at top 164, 32 px to the search. Field 461×52 r24, gap 8, 18 px placeholder.
- **P1 Scope button.** "Courses ▾" is the form's **submit** button, so its accessible name "Courses" misstates the action. Make it a scope menu button with a down chevron, and submit on Enter (or add an sr-only submit "Search").
- **P1 State.** `draft` is initialised once (`SearchPage.tsx:15`) and does not follow `?q` changes: clicking header "Courses" keeps the old text. Add `useEffect(() => setDraft(query), [query])`.
- **P2** The "6 courses" status line is not in the design: make it `sr-only` and keep `role="status"`. The "Filter" toggle (rating ≥ 4.5) is a no-op because every course is 4.5; varied seed data fixes that.
- **Responsive.** At 768 the toolbar wraps onto mismatched baselines: at ≤960 use `flex-wrap:wrap;align-items:center` with the sort on the Filter row. At ≤720 the chips become a horizontal scroller (HR7), the card pills get `nowrap`, and the pager shows "‹ 1 2 3 … 5 ›".

### 6.3 Course Details / Lessons / Reviews (`src/pages/course/*`)

The design shows the **Build Digital Asset** course.

**Layout (P0, affects all three tabs).**
- The design hero is **957 px** blue. The 412 px sidebar card (padding 40, 1 px `#CED0D3`, r24, white, no shadow) sits at (908,416) and **overlaps the blue/white boundary**, running down to ≈1370.
- The left column is 723–725 px wide: hero text, then the video (720×479 at y 416, r24), then the tabs, then the tab content.
- The code puts the sidebar *inside* `.course-hero`, which has `overflow:hidden` (`styles.css:519`). The hero grows to 1219 px, **"See Full Profile" is cut off** (scrollHeight 1279 vs 1219), and a grey block fills the video column.
- The tab content is full-width (Lessons, Reviews) or two-column with Key Points on the right (Details).

**Fix.** Put the sidebar in `CourseLayout` as a sibling of `<Outlet/>` inside one two-column grid:

```css
.course-page { display:grid; grid-template-columns:725px 412px; column-gap:63px;
               width:min(1200px,100% - 32px); margin-inline:auto; }
.course-page__hero-bg { grid-column:1 / -1; grid-row:1; height:957px; background:var(--blue);
                        margin-inline:calc(50% - 50vw); }   /* full-bleed blue band */
.course-page__main    { grid-column:1; grid-row:1 / span 2; }
.course-sidebar       { grid-column:2; grid-row:1 / span 2; margin-top:416px; align-self:start;
                        position:relative; z-index:2; }
@media (max-width:960px){ .course-page{grid-template-columns:1fr} .course-sidebar{grid-column:1;grid-row:auto;margin-top:0} }
```

Remove `overflow:hidden` from the hero.

**Details tab**

| # | Problem | Design | Fix | Sev |
|---|---|---|---|---|
| D1 | Title "Build Digital Asset" | **"Build Digital Asset: A Comprehensive Guide"** | add a `fullTitle` course field | P0 |
| D2 | Description is 1 invented paragraph (`data.ts:128-129`) | **3 paragraphs**: "Embark on an enlightening exploration…", "In the initial modules…", "As you progress through the course…" (full text in `course-details.html`) | `description: string[]`; render each as a `<p>` | P0 |
| D3 | Key Points in the right column with lime dots | in the **left** column under Sneak Peak; 8 items; blue filled **check-circle** 24 px, gap 8, rows gap 12, 16/25.6 `#4B4C53` | move into the main column; use the `checkCircle` icon | P0 |
| D4 | Subtitle Satoshi 20/400 | **Poppins 20/600** `#F5F5F6`, 8 px under the title | as design | P1 |
| D5 | Instructor line all lime, 16 px | 18/500; "by" `#F1F4FE`, name lime; 24 px under the subtitle | as design | P1 |
| D6 | Meta pills 48 px tall with a gold star; rating 4.5 | padding 8/24, r24, blur 20, 16/500 `#242528`, gap 16; **blue** icons; "Intermediate", **"4.8 (172 reviews)"**, "199 Students" | as design; `rating: 4.8` for this course | P1 |
| D7 | Video jpg with `r22 22 0 0` and a grey area below | `course-details-frame-c9df1e432b.png`, 720×479, **r24 all corners** | as design; `align-self:start` | P1 |
| D8 | Play button is a 96 px white circle | 104 px **rounded square**, r24, `rgba(61,61,61,.24)`, 1 px `#4F4F4F`, `backdrop-filter:blur(20px)`, 72 px icon | as design. Clicking should show a demo notice (it currently does nothing). | P1 |
| D9 | Sidebar heading "24 Lessons (2 hours 16 mins)" (built from the card fields) | **"112 Lessons (24 hours)"** | add `totalLessons`, `totalDuration` fields | P1 |
| D10 | Lesson preview durations in ink, gap 18 | durations **16/400 blue**; title 16/500 ≈195 px; rows gap 12 | as design | P1 |
| D11 | "This course include" has a divider above it | no divider above; 1 px `#D1D1D1` rule **between includes and author**; items gap 12, `#4B4C53` | as design | P1 |
| D12 | Author avatar 44 px (wrong image); no repeated pitch; full-width "See Full Profile" | 52 px `course-details-course-details-4a7d0e390b.jpg`; "PurePearl Studio" 18/500, "Professional Creator" 16 `#4B4C53`; **the pitch paragraph repeated**; then a **small outline pill** (padding 8/16, `#CED0D3`, 16/500 `#4B4C53`, left-aligned) | as design | P1 |
| D13 | Tabs are outline pills 48 px tall | `#F5F5F6` fill, **no border**, padding 12/16, 16/500 `#4B4C53`; active lime; gap 16; 62 px below the hero; 40 px to the content | as design | P1 |
| D14 | Sneak peek aspect 341/250, r12, wrong order | 4 × **167×125**, r16, `space-between` in 725 px; order in §3.3 | as design | P1 |
| D15 | Share button does nothing | lime `.button--sm` with a share icon | Web Share API with a copy-link fallback and an inline "Link copied" status | P1 |
| D16 | Body copy line-height 1.7 | 16/25.6 (1.6) | `line-height:1.6` | P2 |
| D17 | "99 more videos" / pitch in muted/ink | `#4B4C53`; price Poppins 36/600 blue + "/lifetime" 16 | as design | P2 |

**Lessons tab**

| # | Problem | Design | Fix | Sev |
|---|---|---|---|---|
| CL1 | Content full 1200 px | one **725 px** column | handled by the grid above | P0 |
| CL2 | Tab label "Lessons" | the design says **"Lesson"** on the Lessons and Reviews screens but not on Details (a design inconsistency) | pick one and record it in `questions.md`; recommendation: "Lessons" | P2 |
| CL3 | Module tile 92 px with an outlined 34 px icon; title 18/600 | **72×72** lime tile r24 with a **filled** 40 px videocam `#242528`; gap 13; rows gap 24; title **16/500**; body 16/25.6 `#4B4C53`, gap 4 | as design | P1 |
| CL4 | Progress card 760 px wide, 48 px value, 39 % | **723** wide, padding 16, r16, `#CED0D3`, blur 10; label 14/500; "55%" Poppins **36/600**; track 691×8 `#E5E6E8` | as design; width from data | P1 |
| CL5 | Mobile: tile stacks above the text | the pattern is side-by-side | at ≤720 use `grid-template-columns:56px 1fr` with a 56 px tile | P2 |

**Reviews tab**

| # | Problem | Design | Fix | Sev |
|---|---|---|---|---|
| RV1 | **"Individual Reviews:" renders at 44 px** (2 lines on mobile). `.course-tab h3` (specificity 0-1-1, `styles.css:278-279`) beats `.reviews-heading` (0-1-0, `:593`). | Poppins **20/600** | Remove `.course-tab h3` from the 44 px selector list, or use `.course-tab .reviews-heading{font-size:20px;line-height:24px;margin:40px 0 24px}` | P0 |
| RV2 | Full-width content | 723 px column | grid above | P0 |
| RV3 | Rating summary: padding 26, r18, light-grey 20 px stars, bar ≈480 px | padding 40, gap 24, r16, `#CED0D3`. Score tile lime, padding 40, **r8**, "Ratings" 14/500, "4.7" Poppins 36/600. Rows: bar **282×8** + 5 × 24 px **filled `#4B4C53`** stars (gap 4) + count 16 `#4B4C53` (w40); rows gap 4. | `li{grid-template-columns:282px auto 40px;gap:16px}` etc. | P1 |
| RV4 | Star filter pills with gold 15 px stars | `#F5F5F6`, padding 12/16, 24 px filled `#4B4C53` star + gap 4 + 16/500 | as design | P1 |
| RV5 | Review card: padding 30, r18, 62 px avatar | padding 40, **r24**, `#CED0D3`, gap 24; avatar **52**; name 18/500; role and "a year ago" 16 `#4B4C53`; 5 × 24 px `#4B4C53` stars; quote 16/25.6 | as design | P1 |
| RV6 | Avatars shifted by one | §3.3 | §3.3 | P1 |
| RV7 | Review avatars use `loading="lazy"` (blank in full-page captures) | — | use `loading="eager"` for the 52 px avatars, or verify with a real scroll | P2 |
| RV8 | Average hard-coded to 4.7 (`CourseReviewsPage.tsx:5`) while the hero shows 4.5 or 4.8 and the histogram totals 889 vs 172 reviews | — | Move `ratingBreakdown` into the course and derive the average; bar width = count / total. Record in `questions.md` that the design's own numbers are inconsistent. | P2 |

**Data model.** `courseModules`, `courseLessonPreview`, `courseReviews`, `ratingBreakdown` and `courseIncludes` are global, so every course shows the Build Digital Asset curriculum. Nest them under the course (optional per-course override, defaulting to the demo content), and record in `questions.md` that the other 5 courses reuse demo content.

### 6.4 Creator Profile (`Creator Profile.png`; `CreatorPage.tsx`)

- **P1 a11y** The page has **no `<h1>` or `<h2>`**; the name is a `<p><strong>` (`CreatorPage.tsx:42-45`). Change it to `<h1 className="creator-hero__name">`.
- **P1** Avatar `creator-profile-image-8769fdad0a.png`, 96×96, r24 (the code shows the wrong face at r20).
- **P1** Stat pills: white, padding 12/24, r24; numbers **blue** 18/500 and labels `#242528` 18/500; gap 16; 40 px below the bio.
- **P1** Bio 18/28.8 `#F5F5F6`, 40 px below the identity row (code 16 px, 32).
- **P1** Toolbar identical to Search, **including the missing "Filter" button**, 62 px below the hero. Extract a shared `<CourseToolbar>` (the levels and sort options are duplicated from `SearchPage.tsx:8-9`).
- **P2** Identity gaps 24/8/8; badge padding 8/24 weight 500; hero 592 px, content at 172.
- **P2** The "6 courses" line is not in the design: make it `sr-only`.
- **Deliberate deviation.** The design bio literally says "[Creator's Name]" and "ive into…". The code's "PurePearl Studio" and "Dive" are correct fixes; record them in `questions.md`.
- **Mobile.** Keep the stats inline (`flex-direction:row;flex-wrap:wrap;gap:8px`) rather than stacked full-width, and give Follow its natural width.

### 6.5 Legal (`/legal`, no design)

- **P2** Left-align the body with the hero title (x 120; the body currently sits centred at ≈310).
- **P2** Use the subpage type scale: h1 36, h2 20/24, body 16/25.6 `#4B4C53` (code 44 / 28 / 17).
- Record in `questions.md` that `/legal` is an invented page, supporting the footer links.

---

## 7. Code quality

### 7.1 Routing — `App.tsx`, `Layout.tsx`

- **P1** `Layout.tsx:15-18` scrolls to the top on **every** pathname change:
  - course tab clicks jump to the page top;
  - Back/Forward loses the saved position;
  - because `html{scroll-behavior:smooth}` (`styles.css:36`), every route change animates.

  **Fix:** migrate to `createBrowserRouter` + `<ScrollRestoration getKey={…}/>`, keyed so that `/courses/:slug/*` shares one key. Or skip the reset when `navigationType === 'POP'` or when only the course sub-tab changes, and use `behavior:'instant'`.
- **P1** Unknown slugs → 404 (§6.1).
- **P2** No per-route `document.title` (WCAG 2.4.2). Add a `usePageTitle(title)` hook on every page.
- **P2** Mobile menu: add Escape to close, close on route change, return focus to the toggle, and make the Cart reachable on mobile (it sits in `.site-header__actions`, which is `display:none` at 390). Move the cart into the mobile panel.
- **P2** `/creators` redirects to a hard-coded slug (`App.tsx:25`, `Header.tsx:9`). Acceptable for the demo; document it.
- **P2** Document the SPA fallback (all paths → `index.html`) for deployment (plan 9.8, not done).

### 7.2 State and data — `src/data.ts`

- **P0** Category vocabulary (§4.4).
- **P1** Separate the **card** fields (landing values: Beginner, 17 lessons, 2 h 16 m) from the **details** fields (`fullTitle`, `subtitle`, `level`, `rating`, `reviewCount`, `students`, `totalLessons`, `totalDuration`, `description[]`). Today the details page renders the card numbers.
- **P1** Seed ≥ 18 search entries with varied price/level/rating/category, so that sort, filter and pagination are demonstrable (the price sort currently has no visible effect because every course is $25).
- **P2** `formatPrice`: use `Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})`.
- **P2** `CourseLayout.tsx:11,81-84`: `creator?.avatar` can render `<img src=undefined>`. Assert the creator exists (fall through to 404).

### 7.3 CSS architecture — `src/styles.css` (951 lines)

- **P1** Missing tokens (§3.4). `--line` is misused for card borders.
- **P1** `body{overflow-x:hidden}` plus `overflow:hidden` on every section **masks** collisions. The plan explicitly said not to rely on this. Replace with per-section `overflow:clip` on decorative containers, and test `scrollWidth`.
- **P1** Magic-number positioning (`calc(50% ± N px)`, `left:1085px`) breaks between 961 and 1439 px. Use a design-size stage with scaling (HR5/HR8).
- **P2** Duplication to remove:
  - `.hero__grid` = `.auth__grid`;
  - an `.sr-only` copy in `.footer-links h3` (`:464-472`);
  - four near-identical floating card styles (`.hero-card`, `.progress-card`, `.students-card`, `.auth__happy`), which should become one `.float-card` plus modifiers;
  - three identical `.lesson-preview__*` rules (`:540-542`).
- **P2** Dead rules to remove:
  - `.filter-pill--more svg`;
  - `.creator-cta .hero-search`;
  - `.course-card__level{border:0}`;
  - `.auth__avatars-more{display:none}`;
  - `.revenue-card > span:not(...)`;
  - the positional `nth-of-type` shape selectors.
- **P2** There are only 1180/960/720 breakpoints. Add ≤480 rules for 390/320.
- **P2** The `:focus-visible` outline `#F5A524` (orange) is off-palette. Use lime on blue surfaces and blue on white. One `INPUT` has `outline:none` with no replacement: add `:focus-within` on the search/newsletter wrappers.

### 7.4 Components and TypeScript

- **P1** `CollageCard` (`AuthPage.tsx:9-40`) duplicates `CourseCard`. Add a `decorative` prop instead (§3.5).
- **P2** `AvatarStack`:
  - accept an `avatars` prop (the card stack and the Happy stack differ);
  - accept `count` as a number;
  - use 32 px faces and a lime "26+" disc.
- **P2** `Icons.tsx`:
  - `sparkle`, `mail` and `plus` are unused;
  - `signal` duplicates `level` (identical paths, `:55,60`);
  - prefer the exact SVGs available in the exports (search, shopping_bag, signal_cellular_alt, star, share, groups, filter, sort, the category icons, the include-list icons, check-circle, videocam).
- **P2** Phase 6.8 is not done: inline arrow handlers remain in `Header.tsx:27,57`, `Hero.tsx:44`, `Discover.tsx:32`, `SearchPage.tsx:85-210`, `CreatorPage.tsx:67-101`, `CourseReviewsPage.tsx:54,64`, `AuthPage.tsx:209` and `Footer.tsx:55`.
- **P2** Remove the invented cart notice (`Header.tsx:57`), or keep it and document it as a deliberate demo affordance.
- **P2** Build output: `public/assets/*` is mixed with Vite's hashed `dist/assets/*`. Set `build.assetsDir:'static'` in `vite.config.ts` (or move the images to `public/images/`).

### 7.5 Accessibility summary

| Issue | Where | Fix |
|---|---|---|
| No `<h1>` on the creator page | `CreatorPage.tsx:42` | §6.4 |
| The submit button's accessible name is "Courses" | `SearchPage.tsx:88` | §6.2 |
| Tap targets under 44 px: filter pills 40 px, footer links 17 px, bylines 14–18 px, course-title links 26 px, login "Create an account" 18 px, logo 30×33 | several | `@media (pointer:coarse)`: pills `min-height:44px`; inline links `padding-block:12px;display:inline-block`; footer links `padding-block:10px` |
| Logo strip reads "Logoipsum" ×5 | `Logoipsum.tsx` | `aria-hidden` |
| Footer heading-level skip | `Footer.tsx` | `h2.sr-only` |
| Password toggle lacks `aria-pressed` | `AuthPage.tsx:205-212` | add it |
| Mobile menu: no Escape or focus return | `Header.tsx` | §7.1 |
| No per-route titles | all pages | `usePageTitle` |

### 7.6 `scripts/design-copy.mjs`

- It has no npm script.
- `left`/`top` values are **parent-relative** and auto-layout children have none, so sorting the whole page by `top` is meaningless.
- It ignores `<span>` runs, so it misses mixed-style text ("by purepearl studio", "4.5 (240)").
- Splitting `style={{}}` on every comma breaks `rgba()`, gradients and multi-shadows.
- It records no images.

**Fix:** accumulate absolute offsets through the ancestor stack, handle `<span>` runs, split only on top-level commas, and emit the embedded image hashes mapped to `public/assets/` names. Add `"design:copy": "node scripts/design-copy.mjs"`. Or delete the script if the visual-diff harness replaces it.

---

## 8. Tests and verification

Current state: typecheck ✅, lint ✅, tests ✅ 17/17, build ✅ (run on the host). The build emits `dist/assets/index-*.css` (44.9 kB) and `index-*.js` (325 kB).

### 8.1 Add a visual-diff harness (the missing gate)

- `e2e/visual.spec.ts` (Playwright):
  - For each route with a design, `page.setViewportSize({width:1440,height:900})`.
  - Wait for `document.fonts.ready` and force all images to load (remove `loading=lazy` or scroll through the page).
  - Take a full-page screenshot.
  - Compare it with `figma-samples/imgs/<Page>.png` downscaled 3× (sharp/pngjs + `pixelmatch`), per section band, with a threshold.
  - Write the side-by-side diffs to `test-results/`.
- The design PNGs are git-ignored, so this is a **local** gate (skip it when `figma-samples/` is absent). Commit the downscaled 1440 references only if the repo is allowed to contain them (ask; see `questions.md`).
- Also assert at 1440/768/390/320:
  - `document.documentElement.scrollWidth === innerWidth`;
  - no `img` with `naturalWidth === 0`;
  - no console errors;
  - Satoshi faces are loaded;
  - every interactive element is ≥ 44×44 at 390 (with an allow-list).

### 8.2 Fix or add unit tests (`src/__tests__/`)

- **Rewrite** `App.test.tsx:38-49`: clicking "Marketing" must show the matching courses, not zero.
- `App.test.tsx:127-135` depends on the data having no 4-star reviews. Seed the data explicitly or assert on counts.
- `App.test.tsx:100-109` only checks that the footer hrefs start with `/`. Render each target and expect a non-404 heading.
- Extend `assets.test.ts`: glob `src/**/*.{ts,tsx,css}` for `/assets/…` and assert that every reference exists **and** is in `assets-manifest.json`. This catches the hand-made PNGs.
- New tests:
  - a path tile leads to search results (> 0);
  - search chips, sort order and pagination with ≥ 18 items;
  - `?q` → draft sync;
  - an unknown course/creator slug renders the 404;
  - a course tab switch keeps the scroll position;
  - hash scrolling;
  - newsletter invalid email → visible error;
  - mobile menu `aria-expanded` and Escape;
  - per-route `document.title`.

---

## 9. Plan status (Phase 6–10), truthfully

| Item | Status | Note |
|---|---|---|
| 6.1 Fix typeface | **Done wrong** | §3.1 |
| 6.2 Split App | Done | App is 38 lines; pages and sections exist |
| 6.3 Shared Layout | Done | auth routes are correctly outside it |
| 6.4 Router links + hash scroll | Partial | footer categories are bare `/search`; scroll reset bug |
| 6.5 Brand `<Link>` | Done | |
| 6.6 Remove duplicates/unused | Partial | `play` kept (used by the video) |
| 6.7 Slugs, numeric prices | Done | |
| 6.8 Named handlers | Not done | §7.4 |
| 7.1 Header | Partial | bag icon, height, gap |
| 7.2 Hero | **Done wrong** | §4.1–4.2 |
| 7.3 Logos | Partial | §4.3 |
| 7.4 Section order + pills | Done | filtering broken; the plan's "3×3" is wrong (it is 2×3) |
| 7.5 Course card | Partial | §3.5 |
| 7.6 Growth | **Done wrong** | §4.6 |
| 7.7 Create & Manage | Partial | §4.7 |
| 7.8 Creator CTA | Partial | §4.8 |
| 7.9 Testimonials | Done (minor) | §4.9 |
| 7.10 Footer | Partial | §3.6 |
| 7.11 Responsive without masking | **Done wrong** | §4.10 |
| 7.12 Tap targets | Partial | §7.5 |
| 8.1 Auth collage | Partial / wrong | §5 |
| 8.2 "or" divider + social | Done (glyphs approximate) | |
| 8.3 Small lime button | Done | |
| 8.4 Inline validation | Done | |
| 8.5 Forgot password | Obsolete | not in the design |
| 8.6 Newsletter feedback | Not done | §3.6 |
| 8.7 404 | Done (minor) | §6.1 |
| 9.1 Search | Partial | §6.2 |
| 9.2 Details | Partial | §6.3 |
| 9.3 Lessons | Done (structure) | styling §6.3 |
| 9.4 Reviews | Done (structure) | §6.3 |
| 9.5 Creator | Partial | §6.4 |
| 9.6 Links | Done | |
| 9.7 Correct images | Partial | §3.3 |
| 9.8 SPA fallback doc | Not done | |
| 10.1–10.6 | **Not done** | §8, §10 |

---

## 10. Documentation corrections

| File:line | Wrong claim | Correct |
|---|---|---|
| `README.md:22-27` | routes are `/`, `/login`, `/signup`, 404 | add `/search`, `/courses/:slug` (`/lessons`, `/reviews`), `/creators/:slug`, `/creators` (redirect), `/legal` |
| `README.md:29` | save toggles, forgot-password notice, testimonial selection | these no longer exist. List search/filter/sort/pagination, follow, the review-rating filter, auth validation and the newsletter. |
| `README.md:25-26` | "browser validation", demo checkbox | custom JS validation (`noValidate`); the checkbox was removed |
| `README.md:33` | `App.tsx` holds pages/filtering | App is only the route table. Document `src/pages`, `src/pages/course`, `src/sections`, `Layout`. |
| `README.md:42` | Satoshi resolves to "Switzer" | it resolves to General Sans (the family varies); the cause is the combined Fontshare request |
| `README.md:44` | Search/Course/Creator pages not built | they are built |
| `README.md` | — | document `scripts/design-copy.mjs` (or remove it) |
| `assets.md:16` | `course-details-*.jpg` are card imagery | cards use `creator-profile-creator-profile-*.jpg` |
| `assets.md:17` | `home-image-7be5f04241.png` used | unused, but it *should* be used (Create & Manage) |
| `assets.md:18` | `course-reviews-*` are testimonial avatars | they are **review** avatars; testimonials use `home-ellipse-*` |
| `assets.md:21`, `plan.md:79` | only 12 of 72 used | 26 manifest assets plus 4 undocumented hand-made files are referenced; 46 are unused |
| `init.md:23`, `questions.md:10` | implementation pending go-ahead | implemented (uncommitted) |
| `questions.md:19` | clean working tree | 16 modified files plus untracked ones |
| `questions.md:33` | Fontshare serves Switzer; default self-host | still broken; the default was not applied |
| `questions.md:35`, `plan.md:104` | 9 cards / 3×3 grid | Home and Creator show 6 (2×3); Search shows 18 (6×3) |
| `plan.md:84` | phases planned, not started | mostly attempted; see §9 |

New `questions.md` entries to add:
- the "Lesson"/"Lessons" tab label inconsistency;
- the creator-bio placeholder fix;
- `/legal` as an invented page;
- demo content reused across the other 5 courses;
- the inconsistent rating numbers in the design;
- whether downscaled design references may be committed for the visual test.

---

## 11. Recommended fix order

Each step ends with the visual diff (§8.1) for the pages it touches, then typecheck/lint/test/build.

1. **Harness first:** Playwright visual diff and overflow/font/image assertions (§8.1). Add `.playwright-mcp/` to `.gitignore`.
2. **Foundations:** self-host the fonts (§3.1); tokens, no letter-spacing, button/pill/header metrics, grid overlay (§3.4).
3. **Data:** the image map (§3.3), category vocabulary, card vs details fields, 18 search entries, review/creator avatars, the 3-paragraph description (§4.4, §7.2).
4. **3D shapes:** `Shape3D` plus every placement in §4.2. Delete the blobs and hand-made PNGs. Fix the hero ring.
5. **Shared components:** `CourseCard` (plus `decorative`), `AvatarStack`, footer, logo strip vectors, path icons.
6. **Home sections:** Growth, Create & Manage, CTA, testimonials; then the responsive stage/scale pass (§4.10).
7. **Subpages:** the course two-column layout and tabs (§6.3); the Search toolbar, chips and pager (§6.2); Creator (§6.4); Auth (§5); 404 (§6.1).
8. **Routing and a11y:** scroll restoration, 404 for bad slugs, page titles, mobile menu, tap targets (§7.1, §7.5).
9. **Tests and docs:** the unit-test fixes (§8.2), the doc corrections (§10), and ticking the plan boxes only for verified items. Then update PR #1.
