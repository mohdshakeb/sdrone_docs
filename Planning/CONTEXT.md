# Planning Context — SdroneDocs

> **Rule for every session:** Before starting any work, read `Planning/IMPLEMENTATION.md` to understand what's already been built. After every feature ships, update `Planning/IMPLEMENTATION.md` — add a changelog entry, update the Feature Inventory, and correct any stale code structure notes.

## What Is SdroneDocs

SdroneDocs is an interactive prototype for the S-Drone safety and incident management application. It demonstrates the product's flows (incident reporting, tool audits, history/records, role-based views) on a shared design-token system, for client review and developer handoff. It is not a production app — there is no backend; all data is mocked client-side.

> History note: the repo originally also shipped an MDX design-system documentation site (`app/(docs)/`, `components/docs/`). That site has been removed; the repo is now prototype-only. The design system lives in the code (`components/ui` + `app/globals.css`).

**Client:** S-Drone
**Engagement type:** Prototype / design handoff
**Target delivery:** TBD

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript (strict)
- **Target:** Web — desktop (`/sdrone`) primary, mobile (`/mobile`) included
- **Styling:** CSS Modules + CSS variables. No Tailwind — all tokens defined in `app/globals.css`
- **Icons:** react-icons (Remixicon set), centralised in `components/ui/Icon.tsx`
- **Storage:** None — prototype. All data mocked client-side (`data/mock-data.ts` + route-private `mockData.ts`)
- **Deploy:** Vercel

## Deliverables

1. **S-Drone desktop prototype** — Interactive client-side prototype (Dashboard, Inbox, History + record detail, Alerts, Insights, Settings, Report incident form, Tool audit form). Uses `components/prototype/` + `app/sdrone/`.
2. **S-Drone mobile prototype** — Mobile layout of the app (Dashboard, Inbox, History + detail, Alerts, Insights, Settings, Menu). Uses `components/mobile/` + `app/mobile/`.
3. **Shared design system** — Token system (`app/globals.css`) + reusable components (`components/ui/`) underpinning both prototypes.

## Current Priorities

All items from `Planning/workflows-alignment-plan.md` are complete as of 2026-06-13. No outstanding priorities. Next steps are TBD pending client review.

## Architectural Principles

- **Single token system** — `components/ui/` and `components/prototype/`/`components/mobile/` all follow the semantic token system in `app/globals.css`. There is no separate docs styling anymore.
- **Route-private feature modules** — Large form flows (`app/sdrone/report/`, `app/sdrone/tool-audit/`) are self-contained; shared form primitives live in `components/prototype/form/`.
- **No production functionality** — No database, auth, API calls, or real data fetching. Every interaction is mocked client-side.
- **Token-first styling** — All visual properties flow through CSS variables. Semantic tokens only in components; primitive tokens only in `globals.css`.
- **Dark mode first-class** — Every component must work in both light and dark modes. Dark variants defined in `[data-theme='dark']` in `globals.css`.

## User Flow

### Desktop Prototype (`/sdrone`)

```
Login (/login)
  └── Dashboard (/sdrone)
        ├── Inbox (/sdrone/inbox) — primary action workspace
        │     └── Task detail panel (slide-in)
        │           ├── Report incident form (/sdrone/report) — multi-step, conditional
        │           └── Tool audit form (/sdrone/tool-audit) — multi-step
        ├── History (/sdrone/history) — system of record
        │     └── Record detail (/sdrone/history/[id]) — full page
        ├── SOS (/sdrone/sos) — single-screen emergency form
        ├── Safety Alert (/sdrone/safety-alert) — broadcast alert form, L2/L3 only
        ├── Alerts (/sdrone/alerts) — unified SOS + Safety Alert feed, sorted by time
        ├── Insights (/sdrone/insights)
        └── Settings (/sdrone/settings)
```

### Mobile Prototype (`/mobile`)

```
Mobile Login (/mobile-login)
  └── Mobile Dashboard (/mobile)
        ├── Inbox (/mobile/inbox)
        ├── History (/mobile/history)
        │     └── Record detail (/mobile/history/[id])
        ├── Alerts (/mobile/alerts)
        ├── Insights (/mobile/insights)
        ├── Menu (/mobile/menu)
        └── Settings (/mobile/settings)
```

## Role System

Three personas with distinct permissions and content visibility:

| Role | User | Focus |
|---|---|---|
| Level 1: Field Worker | Rahul Sharma | Reporter — submits and tracks own reports |
| Level 2: Safety Officer | Priya Rao | Reviewer — manages day-to-day safety operations |
| Level 3: HSE Manager | Vikram Singh | Executive — oversight, escalations, closures |

Role switching is handled by `components/prototype/RoleProvider.tsx`. Each role sees different data scopes, status labels, and available actions. Full role-content decisions are in `.claude/prds/role-content-decisions.md`.

## Feature Specs

Detailed PRDs live in `.claude/prds/`. The workflows document and implementation plan are the primary references for all active work:

| Feature | File | Status |
|---|---|---|
| **Workflow spec (authoritative)** | `docs/workflows.md` | v0.2 — living doc |
| **Prototype alignment plan** | `Planning/workflows-alignment-plan.md` | ✅ Fully implemented — 2026-06-13 |
| **Implementation state** | `Planning/IMPLEMENTATION.md` | Living doc — **update after every feature ships** |
| History page | `.claude/prds/history-page.md` | Locked |
| Role-based content visibility | `.claude/prds/role-content-decisions.md` | Finalized |
| Status system | `.claude/prds/status-system.md` | Finalized |
| Progressive incident form | `.claude/prds/progressive-incident-form.md` | Superseded by workflows.md |
| Incident form field specs | `.claude/prds/forms.md` | Superseded by workflows.md |
| Tool audit | `.claude/prds/tool-audit.md` | Superseded by workflows.md |

### Status System Summary

5 canonical statuses: **Pending**, **Under Review**, **On Hold**, **Escalated**, **Closed**.
Contextual display labels override canonical labels based on viewer role:
- "Assigned to you" (replaces Pending for the assignee)
- "Awaiting Review" (replaces Under Review for the reviewer)
Attention labels (highest priority): **Overdue**, **Updated**.
Implemented in `types/status.ts` → `getDisplayLabel()`.

### History Page Summary

- System of record, not a task list
- Segmented tabs: All, Incident, Audit, Compliance, Toolbox Talk, Permit to Work
- Table layout with columns: Title, Type, Status, Location, Owner/Closed By, Last Updated
- Row click opens full-page Record Detail with Next Step banner and Audit Trail
- L1 (Field Worker) sees only their own reports with simplified tabs and status labels

### Progressive Incident Form Summary

**Status: ✅ Implemented 2026-06-13**

- Multi-step form with **type-specific step sequences** — Near Miss (6 steps), First Aid (8), FIR (8), ADR (14), Not Sure (inference path)
- "Not Sure" uses two questions: Q1 (injury?) → Q2 (treatment location?) → infers Near Miss / First Aid / FIR
- ADR: optional FIR Reference pre-fill as step 2 (pre-populates shared fields, all editable)
- Repeatable fields: Injured Employees (First Aid: single; FIR/ADR: multiple), Witnesses (FIR/ADR), Corrective Actions (ADR: repeatable), Investigation Team (ADR)
- L1 can submit Near Miss, First Aid, FIR. ADR restricted to L2/L3.
- Full-screen at `/sdrone/report`, AppSidebar hidden
- See `Planning/IMPLEMENTATION.md` for full step listing per type

### SOS Workflow Summary

**Status: ✅ Implemented 2026-06-13**

- Single-screen form (no stepper) at `/sdrone/sos/`
- Fields: Emergency Description (optional), Photos (up to 4, optional)
- Reporter context strip auto-shows name + location (read-only)
- SOS button in AppHeader (red, always visible, all roles) routes here
- Post-send: confirmation screen + link to Alerts tab
- History in Alerts tab. Lifecycle: Sent → Acknowledged → Resolved

### Safety Alert Workflow Summary

**Status: ✅ Implemented 2026-06-13**

- Single-screen form (terminal on send) at `/sdrone/safety-alert/`
- Role-gated: L2/L3 only. L1 sees an access-denied state. "Safety Alert" in Start New dropdown disabled for L1.
- Fields: Alert Message (required), Target Audience (grouped checkbox multi-select, required — Groups + By Location), Attachments (optional)
- Post-send: confirmation shows selected recipient tags
- History in Alerts tab alongside SOS records

### Tool Audit Summary

**Status: ✅ Implemented 2026-06-11 | Minor fixes 2026-06-13**

- 200-character limits (with live counters) enforced on: Overall Observations, Action Required, Responsibility
- Label: "Check Sheet" (was "Audit Type") — underlying field key `auditType` unchanged

---

## Decisions & Client Sign-offs

### 2026-01-19 — Token export
**Decision:** Primitive and semantic colour tokens exported from Figma as CSV files.
**Rationale:** Used as reference for implementing `app/globals.css` token structure.
Files: `temp/VariablesExport_Primitive_Colours_2026-01-19.csv`, `temp/VariablesExport_Semantic_colours_2026-01-19.csv`
