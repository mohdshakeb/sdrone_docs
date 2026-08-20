# Documentation Context — SdroneDocs

> The repo previously hosted an in-app MDX **design-system documentation site** (`app/(docs)/`, `components/docs/`, `mdx-components.tsx`, `scripts/extract-props.mjs`). That site has been **removed**. This file now covers **project documentation** (handoff notes, README, changelog) — not an in-app docs site.

## Documentation Standards

- Write in plain, concise language; present tense ("The form infers the incident type…" not "will infer").
- Keep docs in sync with the code — update the relevant doc in the same change as the code.
- Prefer screenshots/GIFs for interaction-heavy prototype flows.
- The design system itself is documented in **code + context files**, not a separate site:
  - Tokens → `app/globals.css` (and the "Design Token System" section of the root `CONTEXT.md`)
  - Components → `components/ui/` (+ `index.ts` barrel)
  - Conventions → root `CONTEXT.md`

## Document Types and Audiences

### Handoff Documentation
- **Audience:** S-Drone dev team / future maintainers
- **Tone:** Clear and thorough — assume no prior context
- **Location:** `docs/handoff/` (create when needed)

### Prototype Walkthroughs
- **Audience:** Client stakeholders reviewing the prototype
- **Tone:** Task-oriented, non-technical
- **Location:** `docs/client/` (create when needed)

### Changelog
- **Audience:** Client and contributors
- **Format:** Keep a Changelog (keepachangelog.com) — group by Added, Changed, Fixed, Removed
- **Location:** `docs/CHANGELOG.md` (create when needed)

## How Docs Relate to Code

- Prototype behaviour is specified in `.claude/prds/` — keep those PRDs as the source of truth for flows (history, status system, incident form, tool audit, role visibility).
- When a flow changes, reconcile the matching PRD and any handoff docs.

## Skills

- **`doc-authoring-skill`** — Invoke when writing or updating user-facing documentation
