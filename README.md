# ByteSpace New

A responsive, route-based React recreation of ByteSpace's course-discovery design. Includes the complete landing page plus local demo login and signup screens.

## Review

- **Pull request:** [#1 Build responsive ByteSpace learning frontend](https://github.com/MS-Jahan/ByteSpace_New_frontend_demo/pull/1). The full implementation lives on the `feat/bytespace-frontend` branch, which this PR merges into `main`. Review the code and the changes there.
- **Live demo:** [bytespace-frontend-demo.vercel.app](https://bytespace-frontend-demo.vercel.app/)
- **Where to look:** the landing page at `/`, then the bonus `/login` and `/signup`, then `/search` (five-page pager).

## Quick start

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

The Vite development server is available at `http://127.0.0.1:5173`.

## Routes

- `/` — landing page, local course search, category filters, testimonials, creator and learner sections.
- `/login`, `/signup` — frontend-only form demos with browser validation.
- Unmatched paths — branded not-found page.

There is no backend or authentication provider. Login/signup never create accounts or transmit/store credentials. Newsletter feedback is local and does not transmit/store an address.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Documentation

See [`docs/README.md`](docs/README.md) for project setup and structure, [`docs/plan.md`](docs/plan.md) for phases and progress, [`docs/assets.md`](docs/assets.md) for extracted design assets, and [`docs/questions.md`](docs/questions.md) for decisions and delivery status. Original Figma exports are local reference material and are intentionally ignored by Git.
