# Visual fidelity review (partial, 2026-09-30)

Status: about 70% done. Paused at the user's request. The preview server is stopped.
Repo: `/mnt/DABCEB02BCEAD851/Projects/ByteSpace_New_frontend_demo` (READ-ONLY; nothing in it was changed).
Workspace: `SCRATCH=/tmp/claude-1000/-mnt-DABCEB02BCEAD851-Projects-ByteSpace-New-frontend-demo/9daf46e8-0039-4209-b417-eb0b2e05de6b/scratchpad/review2/`

## 1. What this task is

Four Sonnet agents built the fixes in `docs/review.md`. They report low pixel-diffs against Figma (Home 2.2%, Login 1.4, Register 1.5, Search 9.9, Details 1.8, Lessons 3.6, Reviews 2.4, Creator 3.8, 404 2.5). This review checks what a user actually sees, because a low pixel-diff can hide wrong details. Another agent is reviewing the code separately; this review covers visuals only.

Deliverable: `SCRATCH/visual-review.md`. It should have:
- a table per route with the columns `# | issue | design | current | fix | sev | widths`
- an honest fidelity score per page
- a verdict on whether the diff metric can be trusted, and how to improve it
- a fix list in priority order (P0 = obvious defect or breakage, P1 = clearly visible difference, P2 = polish)

Rules: host only (no Docker). Don't use `agent-browser`. Don't modify the repo; only gitignored `test-results/` and SCRATCH may be written. Kill any server you start.

## 2. How to resume (tools already built in SCRATCH)

```
cd /mnt/DABCEB02BCEAD851/Projects/ByteSpace_New_frontend_demo
npm run build && npx vite preview --port 4174 --strictPort   # run in background; use http://localhost:4174 (127.0.0.1 is refused)
```

| Script | Purpose |
|---|---|
| `capture.mjs` | Full-page screenshots of every route at 1440/1280/1100/1024/768/390/320 into `shots/<page>-<w>.png`. Uses system Chrome, forces lazy images, waits for `document.fonts.ready`. Env vars `W=`/`R=` limit widths/routes. Already run, and the shots exist. |
| `capture3.mjs` | Same as `capture.mjs` at deviceScaleFactor 3 (1440 only), giving `shots/<page>-1440@3x.png` to compare 1:1 with the 3x design PNGs. Already run. |
| `bands.py [page]` | Stricter diff (a pixel counts if any channel differs by more than 24/255, no anti-alias forgiveness) plus a percentage per 450px band. Writes `crops/<page>-design.png` (the design downscaled to 1440). |
| `stack.py page y0 y1 [x0 x1]` | Design (top) above current (bottom) for a 1440 band, written to `crops/`. View it with Read. |
| `zoom.py page x0 y0 x1 y1 [dy] [scale]` | Zoomed 3x crop, design over current, for small text, icons and pills. |
| `probe.mjs <path> <width> <css selectors...>` | Prints the rect, font, colour and background of the matched elements. |
| `tiny.mjs` | Lists text whose rendered size is under 11.5px after `Stage` transforms, per width and route. |
| `sheet.py` / `strip.py` | Crops and contact sheets of the responsive shots. |
| `txt.py <html>` | Pulls text nodes and styles from the Figma HTML exports. Output is in `text-*.txt`, one file per page. |

Design values: `figma-samples/*.html` (`login.html` is actually the Search export). `figma-samples/imgs/*.png` are 3x renders; `exports/frame-*.png` are 1x renders.

## 3. Findings so far

### Diff metric (`e2e/visual.spec.ts`): under-reports
- pixelmatch runs with `threshold: 0.2` (a lenient YIQ threshold) and default AA detection, so anti-aliased and low-contrast differences such as grey text colour or weight are ignored.
- The gate is `WARN_RATIO = 0.35` and uses `expect.soft`, so it effectively never fails.
- The ratio is taken over the whole page, which is mostly flat background, so local defects are diluted.
- It does not crop to the shorter image; it pads with magenta, which is correct.
- Nothing is masked. The box downscale is fine.
- With my stricter metric the numbers are: Home 5.9%, Login 4.6, Register 4.8, Search 15.9, Details 5.0, Lessons 6.9, Reviews 5.3, Creator 8.1, 404 9.5. That is about 2-4x the reported values.
- Suggested fixes: threshold 0.1 with `includeAA: true`; report the worst band per page instead of a page-wide mean; fail hard on the worst band (say >15%); save per-band crops; add a DOM check of font weight and colour for key text.

### P0
1. **Course video shows a double play button** (Details, Lessons and Reviews at ≥961px). The poster `/assets/course-details-frame-c9df1e432b.png` already has a play button baked in, centred about 15px right of and 17px below the video's centre. `.course-video__play` is drawn a second time at 50%/50%, so a ghost square and circle show through. Fix: use a clean poster, or move the live button onto the baked one (`left: calc(50% + 15px); top: calc(50% + 17px)`, scaled with the width). (`src/styles.css:629`, `src/pages/course/CourseLayout.tsx:98`)

### P1
2. **Growth and Create & Manage (home): the person's drop shadow is clipped into a hard rectangle.** `.growth__person { overflow: hidden; filter: drop-shadow }` gives visible straight right and bottom edges around 1368px and 3790px at 1440. The same happens in the Create & Manage art (edge at about x=583, y≈4466). The design shadow fades out softly. Fix: move the clip to an inner wrapper and put the filter on the outer box, or use `clip-path: inset(0 -60px -60px 0)`. (`styles.css:462`)
3. **Auth collage (Login/Register):** the pyramid should sit in front of the back card but is behind it (`.auth__shape--pyramid z-index:1`; it should go above `.auth__stack--back`). The card rating star should be lime `#D4FB20` and is grey. The card "26+" count should be black with white text (design `#242528`/white) and is lime/dark. The Happy Students "(240)" should be `#424348`.
4. **Search pagination** shows a single disabled "1" with both arrows disabled. The design shows "1 2 3 4 5" with the arrows enabled. `PAGE_SIZE = 18` and 18 courses gives 1 page. Fix: add catalog data, or render the design's 5 pages. (`src/pages/SearchPage.tsx:11`)
5. **Review rating bars** are proportional to share of total (about 81/13/2/1/2%). The design widths are about 92/36/9/3/5%. Fix: use the design widths or scale against the max count.
6. **Logo strip overflows at 961–1200px:** logos are cut off at both edges, and the full-page shot is 1078px wide at 1024 and 1116px at 1100. Fix: `gap: clamp(24px, 4vw, 72px)` or wrap below 1200. (`styles.css:304`)
7. **Course-card media pills clip "59 Comm…"** at 1024–1100 (home, search, creator). The 1103px media query does not cover this range. Fix: shrink padding and gap from 1200px down, or hide the third pill.
8. **Home category pills at 1100/1024:** labels wrap inside pills ("Drawing &/Painting", "Social/Media"). Fix: `white-space: nowrap` and let the row wrap. **Search chips at 1024:** the second row is `space-between`, which leaves "Creative Marketing" at the left and "Cooking" at the right with a big gap. Fix: `justify-content: flex-start`.
9. **Stage-scaled text becomes unreadable** (from `tiny.mjs`): the home hero cards drop to 8.5px at 1024 and 9.2px at 1100. Auth collage card text is 9.4px at 1024. The Growth art is 6.6px at 390 and 4.8px at 320. At 390 and 320 the float cards cover the hero person's face. Fix: set a minimum Stage scale, or swap in a simplified mobile layout (hide the text-heavy cards) below 600px.
10. **Hero "Happy Students" avatars:** design 43px with −8px overlap; current 32px with −6px (`styles.css:298`). "4.5" should be weight 400 (current 700, `styles.css:254`). The star should be 14×13 with gap 0. The UI/UX card bullet needs about 10px of space on each side and a raised, smaller dot.
11. **Header alignment:** the nav group is about 7px left of centre and the right cluster about 15px left, because the cart button is 40px wide with a 24px icon, so it is inset 8px. The brand is about 3px low. Fix: centre the nav absolutely at 50%, and give the cart `margin-right: -8px`.
12. **Auth card eyebrow** ("Sign In"/"Create an Account") should be weight 400 and line-height 28.8; it is 600 (`styles.css:763`).

### P2 (so far)
- Poppins display headings render about 1.5–2.5% wider than Figma everywhere (hero H1, section H2s, 404 H1, card titles). The values match the spec, so this is a font rendering difference. Consider `letter-spacing: -0.01em` on h1/h2 ≥36px after measuring.
- Course-card level pill: icon gap should be 4px (8px now). The "26+" count should be weight 500 (700 now).
- Home "+ More" pill has about 16px of extra left padding, so row 3 is shifted 13px left.
- On the Lessons and Reviews pages the tabs sit about 14px too high (lessons page is 21px shorter overall). The Lessons "55%" is ink `#040819`; the design uses `#242528`.
- Footer brand text is `#040819`; the design uses `#242528`.
- Copy: curly quotes and apostrophes where the design has straight ones. The tab reads "Lessons" where the lessons/reviews design says "Lesson". The design's "[Creator's Name]"/"ive" were fixed to real copy. These are intentional; mention them only.
- The active nav follows the route; the design always shows Home active. Intentional.
- Search shows 12 real catalog cards where the design repeats the landing 6; photos don't match titles. This is most of the Search diff (bands 1350–3150 at about 30%).
- Details: the Share icon is smaller than the design's (about 16px vs 20px). The "Courses" dropdown chevron is thinner and smaller. The toolbar pills are 3–6px wider (icon gap).
- Password field has an eye toggle that is not in the design (acceptable affordance).
- 404: the glyphs are wider, sit 11px higher, and the gradient fades to blue earlier (design fades to olive `#8aaa70`).
- Mobile: hero search placeholder truncates at 390/320. Awkward heading wraps ("Passion, Build / Your Skills" at 768); use `text-wrap: balance`. The logo strip at 768 is 4+1. The creator toolbar wraps to 3 rows at 320. The Search page at 390 is 8768px tall (18 single-column cards). Lime and white shape fragments show at the edges at 768/390. "Welcome Back" wraps at 1024.

## 4. What is left for the next agent
1. Restart the preview server (see section 2).
2. Finish the 1440 band review for pages not fully zoomed: Search bands 2000–2500 and the footer, Details 2000+, Creator 1500+, 404 bottom band. Zoom into the sidebar icons, the review filter pills and the pagination.
3. Finish the responsive pass: 1280/1100/1024 for details, lessons, reviews, creator, legal, 404; 768 for all routes; 390/320 for lessons, reviews (star filter pills overflow, which may be an intended horizontal scroller, so check), legal, 404.
4. Check the interactive states visually with Playwright scripts (write them in SCRATCH):
   - hover and focus rings (Tab through header, pills, cards, form fields; blue and lime surfaces use different ring colours)
   - active pill states
   - mobile menu open (390: click `.site-header__toggle`)
   - auth error state (submit an empty or invalid form)
   - newsletter error (submit an invalid email in the footer)
   - share status (click Share on details and read the `role=status` text)
   - cart notice
   - video play notice
5. Score each page. Provisional scores at 1440: Home 8/10, Login 7.5, Register 7.5, Search 7 (content plus pagination), Details 6.5 (the P0), Lessons 7, Reviews 7, Creator 8.5, 404 8. Responsive, provisional: 6/10 at 961–1100 (overflow, clipping, tiny text) and 7/10 on mobile.
6. Write `SCRATCH/visual-review.md` in the format in section 1, using the findings above plus the new ones. Point to the crop images in `SCRATCH/crops/` as evidence.
7. Kill the preview server when done.
