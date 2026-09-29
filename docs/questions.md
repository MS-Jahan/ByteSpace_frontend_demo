# Questions & decisions

## Resolved

| Topic | Decision |
| --- | --- |
| App code location | Application code/assets outside `docs/`; keep `docs/` for project references and notes. |
| Optional authentication | Add visual `/login` and `/signup` demo routes with client-side validation/feedback only; no service or real accounts. |
| GitHub visibility and name | Use `MS-Jahan/ByteSpace_New_frontend_demo`. Confirmed 2026-09-29: keep it **private for now** and make it public when all planned phases (6–10) are complete, which satisfies the brief's public-repo requirement. |
| Post-audit scope (2026-09-29) | The user approved updating the plan with Phases 6–10 (fidelity rebuild plus the extra design pages). Implemented in the working tree; not yet committed. |
| GitHub owner | Use the connected personal GitHub account `MS-Jahan`. |
| Original samples in Git | Ignore `figma-samples/`; keep originals local. Include extracted app assets and their manifest. |
| Typeface availability | Superseded: Satoshi and Clash Display are self-hosted in `public/fonts/` (Fontshare free licence); Poppins loads from Google Fonts. |

## Delivery status

- Private repository: [MS-Jahan/ByteSpace_New_frontend_demo](https://github.com/MS-Jahan/ByteSpace_New_frontend_demo).
- `main` contains the README/setup bootstrap commit; `feat/bytespace-frontend` contains the complete implementation and documentation.
- Both branches have been pushed. The fidelity work (Phases 6–10) is in the working tree and not yet committed, so PR #1 does not include it yet.
- Open pull request: [#1 — Build responsive ByteSpace learning frontend](https://github.com/MS-Jahan/ByteSpace_New_frontend_demo/pull/1), targeting `main`; GitHub reports a clean merge state.
- GitGuardian security check passes. Both PR-triggered and branch-push GitHub Actions runs pass on the latest feature commit; the deprecated action Node 20 runtime warning is resolved.
- The only remaining workflow annotation is GitHub's informational notice about the upcoming `ubuntu-latest` image migration.
- `.freebuff/` workspace metadata, original Figma exports, dependencies, build output, and credentials were not committed.

The 2026-09-29 audit found gaps that Phases 6–10 then addressed; see [review.md](review.md) ("Status after fixes") and [plan.md](plan.md).

## Open questions (audit 2026-09-29)

Recommended defaults are in bold. They were applied unless noted; correct any you disagree with.

1. **Extra pages scope.** Build Search, Course Details, Course Lessons, Course Reviews, and Creator Profile as routes (Phase 9)? The brief only requires the landing page, but the designs and assets were supplied. **Default: build them after Phases 6–8.**
2. **Invented interactions.** The build adds features not in the design: a save/bookmark toggle, "Popular" hero chips, a signup demo checkbox, and testimonial stars. **Default: remove anything not in the design, and keep the demo-only notices as small helper text.**
3. **Body typeface.** Fontshare's combined request resolved Satoshi to another family. **Applied: Satoshi and Clash Display are self-hosted under `public/fonts/`.**
4. **Logo strip.** The design uses placeholder "Logoipsum" marks. **Default: reproduce them as SVG to match the design, not real brands.**
5. **Course data.** The design shows six landing cards (two rows of three), all "Learn Figma from Basic" / $25. **Applied: the landing page uses the design copy exactly; Search adds 12 varied entries (18 courses in total) so sort and filter are demonstrable.**

## Decisions taken during the fixes (2026-09-29)

| Topic | Decision |
| --- | --- |
| "Lesson" vs "Lessons" | The design labels the tab "Lesson" in one place and "Lessons" in another. The tab reads **Lessons** everywhere, matching the card pills ("17 Lessons") and the sidebar heading. |
| Creator bio | The exported bio contained a placeholder typo; it is corrected in `data.ts`. |
| `/legal` | Invented. The footer's Privacy, Terms, Cookies, Contact and Help links needed a real target, so one page holds five short demo-only sections with ids. It is not in any design. |
| Demo content | The design shows one course, one creator and one review set. Lessons, modules and review text fall back to that content for every other course (`details.curriculum` / `details.reviews` can override it). The figures are per course: the rating histogram is derived from the course's rating and review count, and "N more videos" is `totalLessons - 3`. |
| Design rating inconsistencies | The design shows 4.5 on cards and 4.7 on the details page, and the histogram counts do not add up to the quoted review count. Cards keep 4.5 for the six landing courses. The demo course keeps the design's 4.8 (172 reviews) in its hero and its hand-set histogram (average 4.7); every other course shows its own rating and count in both places. |
| "99 more videos" | The sidebar reads "99 more videos" although 112 lessons minus 3 previewed would be 109. The design copy is kept for the demo course only (`curriculum.moreVideos`); other courses compute it. |
| Search pager | The design shows "‹ 1 2 3 4 5 ›" at 18 cards per page. The data has 18 courses, so one page. Padding the data to five pages would bloat it, and faking page numbers would be dishonest. The pager renders the **real page count** at 18 per page (a mocked-data test covers two pages); with today's data it shows one page. |
| Cart notice | The header cart shows "Your cart is empty — this demo has no checkout." Invented, but kept as a deliberate demo affordance. The mobile menu carries the same button. |
| `/creators` | Redirects to the featured creator; the design has no creators index. |
| Design references in Git | `figma-samples/` (HTML, PNGs, exports) stays git-ignored, so the pixel-diff gate is local-only. Committing 1440 px downscaled references would make it a CI gate. **Open: may the references be committed?** |
| Footer category links | They go to `/search?category=<Name>`. "IT" maps to the vocabulary's "IT & Software". A unit test checks that each name is in `categories` and yields results. |
| `scripts/design-copy.mjs` | Deleted (unreliable, no npm script); the visual-diff harness replaced it. |
