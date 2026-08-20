# Operations Context — SdroneDocs

## Infrastructure

- **Platform:** Vercel (Next.js first-party hosting); deploy on push to main
- **Build system:** Next.js 15 build pipeline (plain `next build`)
- **CI:** `.github/workflows/draftbook.yml` — a manual (`workflow_dispatch`) Playwright **screenshot-capture** workflow for Draftbook; not a build/deploy gate
- **Runtime:** Node.js (no backend — static + edge rendering only)

## Dev Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Next.js production build (plain `next build`)
npm run start        # Serve production build locally
npx tsc --noEmit     # Type-check (use this instead of lint — ESLint config has known issues)
```

## Deploy Process

### Development
1. `npm install` — install dependencies
2. `npm run dev` — starts dev server at http://localhost:3000
3. Landing at `/`, desktop prototype at `/sdrone`, mobile prototype at `/mobile`

### Release Build
1. `npm run build` — plain `next build` (no pre-build steps)
2. `npm run start` — verify production build locally before deploying
3. Push to main branch — Vercel auto-deploys

### Pre-release Checklist
- [ ] `npx tsc --noEmit` passes (no TypeScript errors)
- [ ] `npm run build` succeeds
- [ ] Manual test of `/sdrone` and `/mobile` core flows (incl. report + tool-audit forms)
- [ ] Both light and dark modes tested
- [ ] No console errors or warnings
- [ ] Responsive tested at 375px, 768px, 1024px+
- [ ] No hardcoded colors or new unapproved tokens
- [ ] No debug code or print statements

## Known Issues

- **ESLint config is broken** — `npm run lint` will fail. Use `npx tsc --noEmit` for code validation instead.

## Runbook Conventions

- Runbooks go in `ops/runbooks/`
- Each runbook covers one operational task
- Format: numbered steps, copy-pasteable commands, "Verify" step at the end

## Monitoring

- No monitoring currently configured — prototype only
- Vercel deployment logs available via Vercel dashboard

## Scripts

| Script | Purpose |
|---|---|
| `cleanup.sh` | Repo-root helper — review before running |

> The `scripts/extract-props.mjs` props-extraction step was removed along with the design-system docs site; the build is now plain `next build`.

## Skills

- No specific skills required for ops work on this project
