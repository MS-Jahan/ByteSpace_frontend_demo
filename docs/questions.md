# Questions & decisions

## Resolved

| Topic | Decision |
| --- | --- |
| App code location | Application code/assets outside `docs/`; keep `docs/` for project references and notes. |
| Optional authentication | Add visual `/login` and `/signup` demo routes with client-side validation/feedback only; no service or real accounts. |
| GitHub visibility and name | The original prompt requested a public repository. The later approved plan superseded it: use private `MS-Jahan/ByteSpace_New_frontend_demo`. |
| GitHub owner | Use the connected personal GitHub account `MS-Jahan`. |
| Original samples in Git | Ignore `figma-samples/`; keep originals local. Include extracted app assets and their manifest. |
| Typeface availability | Load Poppins, Satoshi, and Clash Display from hosted font services with system fallbacks. |

## Delivery status

- Private repository: [MS-Jahan/ByteSpace_New_frontend_demo](https://github.com/MS-Jahan/ByteSpace_New_frontend_demo).
- `main` contains the README/setup bootstrap commit; `feat/bytespace-frontend` contains the complete implementation and documentation.
- Both branches have been pushed; the current feature branch has a clean working tree after its pending CI/documentation changes are committed.
- Open pull request: [#1 — Build responsive ByteSpace learning frontend](https://github.com/MS-Jahan/ByteSpace_New_frontend_demo/pull/1), targeting `main`; GitHub reports a clean merge state.
- GitGuardian security check passes. GitHub Actions verification was added in the latest feature update and is awaiting its first run.
- `.freebuff/` workspace metadata, original Figma exports, dependencies, build output, and credentials were not committed.

No unresolved design decisions remain. The latest CI workflow result and optional screenshot capture are the only verification follow-ups.
