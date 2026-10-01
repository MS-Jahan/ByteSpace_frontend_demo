# ByteSpace New — initial task brief

## Original prompt

> TASK: Build the "ByteSpace New" website Design
>
> WHAT TO BUILD 1. Landing page (required): complete the full landing page from the design. 2. Login and Signup pages (bonus): optional, counts as extra credit. CODE AND GIT - Push your code to a PUBLIC GitHub repository. - Follow proper Git branching: work on a separate branch, not directly on main or master. - Create a Pull Request (PR) for your work. - Write clean, well-structured code with reusable components.
>
> you'll find sample code (figma to code auto export very poor quality; not final ouput), png and svg if they are relevent.
>
> you task is to grep and find base64 images and save them to a folder. then create a react projects (proper route-based). then try to check the html and the images and try to 100% replicate the design. if needed you can check the svg files also if needed for specific part of the design like curves lines etc.
>
> make sure to doc everything in the docs folder. also save this prompt as init.md in docs folder. create planned phased doc with detailed task list and then execute. do not stop for my comments, do what;s recommended and just append your questions in a doc which I'll review after everything's done.
>
> Now go.

## Clarifications and approved decisions

- Application source and static assets live at the project root, outside `docs/`; `docs/` is reserved for notes and project references.
- The user approved the phased implementation plan recorded in [plan.md](plan.md).
- Include `/login` and `/signup` as visual demo routes with browser-side validation and feedback only. There is no backend, real account creation, authentication, or credential/newsletter submission or persistence.
- The original request said public GitHub. The repository `MS-Jahan/ByteSpace_New_frontend_demo` (PR targeting `main`) stays **private until all planned work is done**, then it is made public (confirmed 2026-09-29).
- 2026-09-29 audit: "100% replicate the design" was not yet met, and five designs were unbuilt. The plan was extended with Phases 6–10 and implemented and committed on the feature branch. Status: every design route is built and compared against its PNG at 1440 px (e2e diffs 1.3–3.6 %, Search 9.7 %); see [status.md](status.md) for what is done and next, plus [review.md](review.md) and [plan.md](plan.md).
- Keep `figma-samples/` local and ignored by Git; include only the extracted, app-used assets and manifest.
- Typefaces: Poppins from Google Fonts; Satoshi and Clash Display self-hosted under `public/fonts/` (Fontshare's combined request resolved Satoshi to another family), with system fallbacks.

## Design-reference note

`figma-samples/login.html` is a Search Page export, not a login mockup. Use `figma-samples/imgs/Login.svg` / `Login.png` for the login design reference, and the registration export/images for signup. Treat the fixed-position Figma HTML as a design/content reference, not production markup.
