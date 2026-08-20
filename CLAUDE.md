# SdroneDocs

SdroneDocs — Interactive prototype for the S-Drone safety and incident management application. Desktop (`/sdrone`) and mobile (`/mobile`) flows built on a shared design-token system, for client review and developer handoff.

**Client:** S-Drone

> This repo previously also hosted an MDX design-system documentation site. That site has been removed; the repo is now prototype-only. The design system lives in the code (`components/ui` + `app/globals.css`), not in a separate docs site.

## Tech Stack
- Frontend: Next.js 15 (App Router), React 19, TypeScript (strict)
- Styling: CSS Modules + CSS variables (no Tailwind)
- Icons: react-icons (Remixicon set), centralised in `components/ui/Icon.tsx`
- Storage: None — prototype only, all data is mocked client-side
- Deploy: Vercel

## Workspaces
Application code lives at the **project root** (`app/`, `components/`, `data/`, `types/`, `utils/`) — idiomatic Next.js. The scaffolding overlay folders hold context docs only:
- `CONTEXT.md` (root) — **Codebase map** (code structure, conventions, token system). *This is the relocated "src" context — there is no `src/` folder.*
- /Planning — Specs, architecture, decisions, deliverables
- /docs — Project documentation standards (handoff, README, changelog)
- /ops — Build, deploy, infrastructure
- /Communication — Client-provided files, references, and assets

## Routing
| Task | Go to | Read | Skills |
|------|-------|------|--------|
| Spec a feature or deliverable | /Planning | CONTEXT.md | — |
| Write code | project root | `CONTEXT.md` (root) | — |
| Build UI / frontend | project root | `CONTEXT.md` (root) | emil-design-eng, impeccable, interface-design, ui-skills |
| Write project docs | /docs | CONTEXT.md | doc-authoring-skill |
| Deploy or debug | /ops | CONTEXT.md | — |
| Review client assets or references | /Communication | CONTEXT.md | — |

## Rules
- CONTEXT.md files are living documents. Update the relevant CONTEXT.md when making decisions, adding features, changing patterns, or shifting priorities — before finishing the task.
- When the client shares new files, images, or references, log them in `Communication/CONTEXT.md`.
- When doing any UI work, load and apply all four UI design skills: `emil-design-eng`, `impeccable`, `interface-design`, `ui-skills`.
- **STOP and ASK** before adding any new color or typography token — check for an existing token first.
- **STOP and ASK** before installing any new npm package.
- Never use hardcoded colors or inline styles — always use CSS variables from `app/globals.css`.
- Always use semantic tokens (`--bg-*`, `--fg-*`, `--border-*`), never primitive tokens (`--color-*`), in components.
- Every color change must have both light and dark mode variants via `[data-theme='dark']`.
- This is NOT a production app — no backend, auth, database, or real data. All interactions are client-side with mocked data only.

## Conventions worth knowing
- **Route-private feature modules:** large form flows live self-contained under their route (`app/sdrone/report/`, `app/sdrone/tool-audit/`) with their own `components/`, `steps/`, hook, `validation.ts`, `types.ts`, and `mockData.ts`.
- **Mock data:** route-private `mockData.ts` = data used only by that form; `data/mock-data.ts` = app-wide shared mock data.
- **Shared form primitives:** `components/prototype/form/` holds `ProgressBar`, `StepContainer`, and the generic form `types.ts` consumed by both form flows.
- **Validation:** use `npx tsc --noEmit` (the ESLint config is known-broken).
