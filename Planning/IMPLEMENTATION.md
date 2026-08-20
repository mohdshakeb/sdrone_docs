# S-Drone — Implementation State

**Last updated:** 2026-06-13
**Project:** S-Drone safety and incident management — interactive prototype
**Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), CSS Modules + CSS variables, Vercel

This document is the single source of truth for what has been built. It is updated every time a feature ships. Use it to give Claude (or any AI) full context on the current state of the prototype before brainstorming next steps.

---

## Architecture Overview

The prototype has two surfaces:

| Surface | Route prefix | Status |
|---|---|---|
| Desktop (S-Drone) | `/sdrone/*` | Active |
| Mobile | `/mobile/*` | Active (parallel prototype) |
| Login / Mobile login | `/login`, `/mobile-login` | Active |

**No backend.** All data is mocked client-side. No auth, no database, no real file uploads.

### Code structure

```
app/
├── login/                  # Desktop login page
├── mobile-login/           # Mobile login page
├── mobile/                 # Mobile prototype surface
│   ├── layout.tsx          # MobileShell wrapper
│   ├── page.tsx            # Mobile dashboard
│   ├── history/            # Mobile history list + detail
│   ├── inbox/              # Mobile inbox
│   └── ...
└── sdrone/                 # Desktop prototype surface
    ├── layout.tsx          # AppSidebar + AppHeader wrapper
    ├── page.tsx            # Dashboard
    ├── history/            # History list + detail
    ├── inbox/              # Inbox
    ├── alerts/             # Alerts tab (SOS + Safety Alert feed)
    ├── report/             # Incident report form (multi-step, type-specific)
    ├── tool-audit/         # Tool audit form (multi-step)
    ├── sos/                # SOS emergency form (single-screen)
    └── safety-alert/       # Safety Alert broadcast form (single-screen, L2/L3 only)

components/
├── ui/                     # Design system primitives (Button, Badge, Select, etc.)
├── prototype/              # App-level components (AppSidebar, TaskCard, HistoryTable, etc.)
│   └── form/               # Shared form shell (ProgressBar, StepContainer, form types)
└── mobile/                 # Mobile-specific components

data/
└── mock-data.ts            # App-wide shared mock data (tasks, history records,
                            # MOCK_EMPLOYEES, MOCK_SOS_RECORDS, MOCK_SAFETY_ALERT_RECORDS)

types/
├── history.ts              # Record types, status types, tab config
├── roles.ts                # Role definitions and permissions
└── status.ts               # Status display utilities (getDisplayLabel, filter helpers)

utils/
├── role-filters.ts         # Role-based data filtering (getVisibleRecords, tabs, etc.)
└── formatters.ts           # Date/greeting utilities
```

---

## Design Token System

All styling uses CSS variables from `app/globals.css`. Two layers:

- **Primitive tokens** (`--color-*`): Raw color values. Never used directly in components.
- **Semantic tokens** (`--bg-*`, `--fg-*`, `--border-*`, `--space-*`): Always use these.

Both light and dark mode are supported via `[data-theme='dark']` on the root element.

---

## Feature Inventory

### Status System
**Shipped:** 2026-06-11

5 canonical statuses stored in data. Same for all roles — display is contextual.

| Status | Badge color |
|---|---|
| Pending | neutral |
| Under Review | notice |
| On Hold | negative |
| Escalated | negative |
| Closed | positive |

**Contextual display labels** (override the canonical label based on viewer's relationship to the record):

| Label | Replaces | When |
|---|---|---|
| Assigned to you | Pending | Viewer is the assignee |
| Awaiting Review | Under Review | Viewer is the reviewer (L2/L3) |
| Overdue | Any active | Record open > 14 days (highest priority) |
| Updated | Any active | Content changed since viewer last viewed |

Display priority: `Overdue > Updated > Contextual label > Canonical status`

Implemented in `types/status.ts` → `getDisplayLabel()`.

---

### Role System
**Shipped:** 2026-06-11 | **Updated:** 2026-06-13

Three role personas stored in `types/roles.ts`. Role is persisted in `localStorage` and managed via `RoleProvider`.

| Level | Persona | Email |
|---|---|---|
| 1 | Rahul Sharma (Field Worker) | rahul@sdrone.com |
| 2 | Priya Rao (Safety Officer) | priya@sdrone.com |
| 3 | Vikram Singh (HSE Manager) | vikram@sdrone.com |

**Permission matrix:**

| Action | L1 | L2 | L3 |
|---|---|---|---|
| Submit Near Miss / First Aid | ✅ | ✅ | ✅ |
| Submit FIR | ✅ | ✅ | ✅ |
| Submit ADR | ❌ | ✅ | ✅ |
| Submit audits | ✅ | ✅ | ✅ |
| Submit compliance, permits, toolbox | ❌ | ✅ | ✅ |
| Send Safety Alert | ❌ | ✅ | ✅ |
| Assign | ❌ | ✅ | ✅ |
| Review | ❌ | ✅ | ✅ |
| Close | ❌ | ✅ | ✅ |
| Escalate to L3 | ❌ | ✅ | ❌ |

Role-based data filtering is centralised in `utils/role-filters.ts`.

---

### Dashboard
**Shipped:** 2026-06-11

Route: `/sdrone/page.tsx`. All stats and sections adapt per role.

**Stat cards:**

| Stat | L1 label | L2 label | L3 label |
|---|---|---|---|
| Pending work | Assigned to Me | Awaiting Review | Awaiting Review |
| Critical | On Hold | On Hold | Escalated |
| Under Review | Under Review | Under Review | Under Review |
| Resolved | Closed | Closed | Closed |

**Sections by role:**

| Section | L1 | L2 | L3 |
|---|---|---|---|
| Attention Required | "Items Needing Action" (Pending + On Hold, own records only) | "Attention Required" (On Hold + Escalated) | "Attention Required" (Escalated first, then On Hold) |
| Recent Activity feed | ❌ Hidden | ✅ Shown | ✅ Shown |
| Category Breakdown | ❌ Hidden | ✅ Shown | ✅ Shown |
| My Recent Reports | ✅ Shown (last 5 own records) | ❌ Hidden | ❌ Hidden |

---

### Inbox
**Shipped:** 2026-06-11

Route: `/sdrone/inbox`

Primary action workspace — where reviewers pick up tasks and reporters track their submissions.

**Layout:** Two-column split when a task is selected — task list on the left, `TaskDetailPanel` slides in on the right.

**Filters (always visible):**

| Filter | Type | Notes |
|---|---|---|
| Report Type | Single dropdown | Role-filtered (L1 sees Near Miss, First Aid, Tool Audit only) |
| Status | Single dropdown | Role-filtered options (see below) |

**Status filter options per role:**

| Status option | L1 | L2/L3 |
|---|---|---|
| Pending | ✅ | ✅ |
| Under Review | ✅ | ✅ |
| On Hold | ✅ | ✅ |
| Closed | ✅ | ✅ |

**Data scope per role:**
- L1: own tasks, Incident (Near Miss, First Aid) + Tool Audit subtypes only.
- L2/L3: all tasks.

**Task card:** Displays title, subtitle (report type), status badge (contextual label via `getDisplayLabel`), reported by, reported on, location, category icon.

**Task Detail Panel (`TaskDetailPanel`):**
- Slides in from the right, Escape key closes it.
- Shows full task record: status, incident detail fields, review comments, audit trail.
- Review comments: L2/L3 can add comments inline (mock — state-only, not persisted).
- Role-gated actions: Review, Approve, Close buttons shown based on `role.permissions`.
- Audit trail: collapsible (collapsed by default).

**Empty state:** "No tasks found" / "Try adjusting your filters to see more results."

---

### History Page
**Shipped:** 2026-06-11

Route: `/sdrone/history`

System of record — retrieve, inspect, and audit all past and ongoing records.

**Segmented tabs — visible per role:**

| Tab | L1 | L2 | L3 |
|---|---|---|---|
| All | ✅ | ✅ | ✅ |
| Incident | ✅ | ✅ | ✅ |
| Audit | ✅ | ✅ | ✅ |
| Compliance | ❌ | ✅ | ✅ |
| Toolbox Talk | ❌ | ✅ | ✅ |
| Permit to Work | ❌ | ✅ | ✅ |

**Filters:**

| Filter | Type | Notes |
|---|---|---|
| Search | Text | Searches title, description, record ID |
| Type | Multi-select dropdown | Role-filtered; hidden on Toolbox Talk tab |
| Status | Multi-select | L1: 4 options; L2/L3: 5 options (includes Escalated) |
| Location | Single dropdown | |
| Date Range | Date range picker | |
| Advanced | Modal | See below |

**Advanced filter visibility per role:**

| Filter | L1 | L2 | L3 |
|---|---|---|---|
| Reported by | ❌ | ✅ | ✅ |
| Owner | ❌ | ✅ | ✅ |
| Closed by | ❌ | ❌ | ✅ |
| Severity | ❌ | ✅ | ✅ |
| SLA breached | ❌ | ✅ | ✅ |
| Record ID | ✅ | ✅ | ✅ |

**Table:** Title, Type, Status, Location, Owner/Closed By, Last Updated.
- Owner column hidden for L1.
- Default sort: Last Updated descending. All columns sortable.
- Row click → full-page record detail. No inline actions.

**Data scope per role:**
- L1: own records only, Incident + Audit categories, Escalated hidden.
- L2/L3: all records system-wide.

**Empty state:** "No records found" / "Try adjusting filters or search."

**Not implemented (prototype scope):** Pagination, skeleton loading states.

---

### History Record Detail
**Shipped:** 2026-06-11

Route: `/sdrone/history/[id]`

- Full-page layout with inner-page header (breadcrumb + back + Export PDF mock).
- **Next Step Banner** — shown when record is not Closed; contextual message based on status and viewer role.
- **Record Actions** — role-gated buttons (Review, Approve, Close, Escalate).
- **Record Detail Content** — structured display of all record fields.
- **Audit Trail** — collapsible timeline (collapsed by default). Includes status changes, ownership changes, escalations with timestamp and actor (name + role).

---

### Incident Report Form
**Shipped:** 2026-06-11 | **Overhauled:** 2026-06-13

Route: `/sdrone/report`. Full-screen, sidebar hidden during creation.

**Type selection at entry (`StepEntry`):**

| Type | Who can select |
|---|---|
| Not Sure (progressive inference) | All roles |
| Near Miss | All roles |
| First Aid | All roles |
| FIR | All roles (L1 included) |
| ADR | L2 / L3 only |

**Type-specific step sequences (exact order per type):**

| Type | Step sequence |
|---|---|
| Near Miss | Entry → What Happened → When & Where → Observations → Evidence → Review |
| First Aid | Entry → What Happened → When & Where → Injured Employee → Observations → Corrective Actions → Evidence → Review |
| FIR | Entry → What Happened → When & Where → Injured Employee → Witnesses → Reason & Loss → Evidence → Review |
| ADR | Entry → FIR Reference → What Happened → When & Where → Injured Employee → Witnesses → Reason & Loss → Observations → Event Details → Corrective Actions → Investigation Team → Evidence → Review |
| Not Sure | Entry → What Happened → When & Where → Injury Check (Q1 + Q2) → [inferred type tail] |

**"Not Sure" inference (two-question flow):**

| Q1: Injury? | Q2: Treatment | Inferred type |
|---|---|---|
| No | — | Near Miss |
| Yes | On-site (first aid) | First Aid |
| Yes | Hospital / doctor | FIR |

**Repeatable fields (add/remove rows):**

| Field | Used by |
|---|---|
| Injured Employees | First Aid (single), FIR + ADR (repeatable) |
| Witnesses | FIR, ADR |
| Corrective Actions | First Aid (simple text), ADR (repeatable with responsibility + timeline) |
| Investigation Team | ADR only |

**ADR FIR Reference pre-fill:** ADR step 1 shows a selector of existing FIR records. Selecting one pre-populates shared fields (description, exact place, injured employees, witnesses, machinery details) — all fields remain editable.

**State management:** `useIncidentForm.ts`. Per-type step arrays computed at type-selection time. `inferTypeFromQ1Q2()` resolves Not Sure after Q2 and splices the inferred type's tail onto the active step list.

**Validation:** `validation.ts` — per-step validators including repeatable list minimums (at least one injured employee for FIR/ADR).

**Step components** (all in `app/sdrone/report/components/steps/`):
- `StepEntry`, `StepWhatHappened`, `StepWhenWhere` — shared across all types
- `StepInjuryCheck` — Not Sure path (Q1 + Q2)
- `StepFIRReference` — ADR only
- `StepInjuredEmployee` — First Aid / FIR / ADR (variant-aware)
- `StepWitnesses` — FIR / ADR
- `StepReasonAndLoss` — FIR / ADR
- `StepObservations` — Near Miss / First Aid / ADR
- `StepEventDetails` — ADR only
- `StepCorrectiveActions` — First Aid (simple) / ADR (repeatable)
- `StepInvestigationTeam` — ADR only
- `StepEvidence`, `StepReview` — shared across all types

---

### Tool Audit Form
**Shipped:** 2026-06-11 | **Updated:** 2026-06-13

Route: `/sdrone/tool-audit`. Full-screen, sidebar hidden during creation.

**Steps:**

| Step | Title |
|---|---|
| 0 | Entry (landing) |
| 1 | Audit Details |
| 2 | Tools Checklist |
| 3 | Observations & Actions |
| 4 | Attachments |
| 5 | Review & Submit |

**Audit Details:** "Check Sheet" selector (ETB / BCP GCI / Workshop / Others), Date, Time, Location, CSE Name.

**Tools Checklist:** Auto-populated based on Check Sheet type. Per tool: condition (Okay / Damaged), remarks (required if Damaged), images (required if Damaged). Read-only: Tool Specification, Checkpoint Criteria.

**Observations & Actions:** Free-text Overall Observations + repeating action items (Action Required, Responsibility, target date). All three text fields enforce a **200-character limit** with a live counter ("142 / 200", turns red at limit).

**Mock submission:** Shows `ConfirmationScreen` on submit.

---

### SOS Workflow
**Shipped:** 2026-06-13

Route: `/sdrone/sos`. Full-screen, accessed via the SOS button in `AppHeader` (top-right, red, always visible to all roles).

**Single-screen form — no stepper:**
- Reporter context strip (auto-detected: name + location, read-only)
- Emergency Description — textarea, optional
- Photos — file upload, up to 4, optional
- **SEND SOS** — full-width, `variant="negative"` button

**Post-send:** Confirmation screen ("SOS Sent — Awaiting acknowledgement") with links to View Alert Status and Send Another SOS.

**History:** Past SOS records (all lifecycle states) appear in the **Alerts tab** (`/sdrone/alerts`).

**Lifecycle states:** Sent → Acknowledged → Resolved.

**Mock data:** `MOCK_SOS_RECORDS` in `data/mock-data.ts` — 3 entries covering all three states.

---

### Safety Alert Workflow
**Shipped:** 2026-06-13

Route: `/sdrone/safety-alert`. Full-screen, accessed via "Safety Alert" in the "Start New" dropdown in `AppHeader`.

**Role gate:** L2 (Safety Officer) and L3 (HSE Manager) only. L1 users see an access-denied state. Entry point in "Start New" dropdown is disabled for L1.

**Single-screen form — terminal on send:**
- Alert Message — textarea, required
- Target Audience — grouped checkbox multi-select (Groups: All Staff, All Field Workers, All Reporting Managers, All Safety Officers; By Location: all 9 site locations), required
- Attachments — file upload, optional
- **Send Safety Alert** — primary button, disabled until message + at least one audience selection

**Post-send:** Confirmation screen showing selected recipients as tags.

**History:** Past Safety Alerts appear in the **Alerts tab** alongside SOS records.

**Mock data:** `MOCK_SAFETY_ALERT_RECORDS` in `data/mock-data.ts` — 3 entries.

---

### Alerts Tab
**Shipped:** 2026-06-13

Route: `/sdrone/alerts`.

Unified chronological feed of SOS alerts and Safety Alerts, sorted newest-first. Two distinct card designs:
- **SOS card** — red icon, lifecycle status badge (Sent / Acknowledged / Resolved), timeline showing acknowledger and resolver.
- **Safety Alert card** — yellow icon, "Safety Alert" badge, message body, recipient audience tags.

---

### Seed Data
**Shipped:** 2026-06-13

| Dataset | Location | Contents |
|---|---|---|
| `MOCK_EMPLOYEES` | `data/mock-data.ts` | 8 employees with id, name, role, department, email — used by employee selectors in report form |
| `MOCK_FIR_REFERENCES` | `app/sdrone/report/mockData.ts` | 3 FIR records with pre-fill values for ADR — Warehouse A conveyor, Lab 3 chemical spill, Fueling Station oil spill |
| `MOCK_SOS_RECORDS` | `data/mock-data.ts` | 3 SOS records covering Sent / Acknowledged / Resolved |
| `MOCK_SAFETY_ALERT_RECORDS` | `data/mock-data.ts` | 3 Safety Alert records |

---

## Known Gaps (Prototype Scope)

Intentionally out of scope — worth noting for the real product:

- No real backend, auth, or database
- No real file uploads (file input UI only)
- No pagination on History table
- No skeleton loading states
- No draft auto-save for forms
- Mobile surface is a separate parallel prototype — no shared logic with desktop
- Mobile surface does not yet reflect the SOS / Safety Alert / incident form overhaul shipped on the desktop

---

## Changelog

| Date | What shipped |
|---|---|
| 2026-06-11 | Initial implementation log. Status system, role system, dashboard, inbox, history page + detail, incident report form (early version), tool audit form. |
| 2026-06-13 | Incident report form overhaul (type-specific sequences, 8 new step components, repeatable fields, two-question Not Sure inference, ADR FIR reference pre-fill, L1 FIR access fix). Tool Audit: 200-char limits on conclusion fields, "Check Sheet" label. SOS workflow. Safety Alert workflow (with role gate). Alerts tab (unified SOS + Safety Alert feed). Seed data (MOCK_EMPLOYEES, MOCK_FIR_REFERENCES, MOCK_SOS_RECORDS, MOCK_SAFETY_ALERT_RECORDS). |
