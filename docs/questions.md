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

- The private repository `https://github.com/MS-Jahan/ByteSpace_New_frontend_demo` exists and is accessible to the authenticated GitHub CLI account.
- Local branch: `feat/bytespace-frontend` (created from the checkout's empty `main` branch).
- Local `main` now has a README/setup bootstrap commit; `feat/bytespace-frontend` is based on that same commit. The private GitHub repo itself remains empty and has no branches/default branch yet; the approved PR target is `main`.
- GitHub CLI access is available. Next: commit the implementation on `feat/bytespace-frontend`, push both branches to the private remote, and open the feature-to-main PR.
- `.freebuff/` workspace metadata, the ignored Figma source exports, dependencies, build output, and credentials must not be committed.

No unresolved design decisions remain. Remaining tasks are the documented main-branch initialization, feature commit, push, and PR.
