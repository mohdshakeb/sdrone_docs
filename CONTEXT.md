# Codebase Context — SdroneDocs

> This is the relocated codebase map (the scaffolding template puts it in `src/CONTEXT.md`; this Next.js project keeps code at the root, so it lives here). There is **no `src/` folder** — application code is at the project root.

## Code Structure

```
/ (project root)
├── app/
│   ├── globals.css              # ALL design tokens, utility classes, global styles
│   ├── layout.tsx               # Root layout — <html>/<body>, Inter font, ThemeProvider
│   ├── page.tsx + page.module.css   # Landing page (/) — entry links to web + mobile prototypes
│   ├── login/                   # Desktop login (/login)
│   ├── mobile-login/            # Mobile login (/mobile-login)
│   ├── sdrone/                  # DESKTOP prototype
│   │   ├── layout.tsx           # App shell (AppSidebar + AppHeader, RoleProvider)
│   │   ├── page.tsx             # Dashboard (/sdrone)
│   │   ├── inbox/               # Inbox (primary action workspace)
│   │   ├── history/            # History (system of record)
│   │   │   └── [id]/            # Full-page record detail
│   │   ├── alerts/  insights/  settings/
│   │   ├── report/              # Incident-report form (route-private module)
│   │   │   ├── page.tsx + page.module.css
│   │   │   ├── useIncidentForm.ts   # Form state hook — type-specific step arrays, Q1/Q2 inference
│   │   │   ├── validation.ts        # Per-step validators incl. repeatable list minimums
│   │   │   ├── types.ts             # IncidentFormData, InjuredEmployee, Witness,
│   │   │   │                        # CorrectiveAction, InvestigationMember
│   │   │   ├── mockData.ts          # Form-local options + MOCK_FIR_REFERENCES
│   │   │   └── components/
│   │   │       ├── ConfirmationScreen.tsx
│   │   │       └── steps/           # StepEntry, StepWhatHappened, StepWhenWhere,
│   │   │                           # StepInjuryCheck (Q1+Q2), StepFIRReference,
│   │   │                           # StepInjuredEmployee, StepWitnesses,
│   │   │                           # StepReasonAndLoss, StepObservations,
│   │   │                           # StepEventDetails, StepCorrectiveActions,
│   │   │                           # StepInvestigationTeam, StepEvidence, StepReview
│   │   ├── tool-audit/          # Tool-audit form (route-private module, same shape)
│   │   │   ├── page.tsx + page.module.css
│   │   │   ├── useToolAuditForm.ts  # Form state hook (6 linear steps, tool/action CRUD)
│   │   │   ├── validation.ts
│   │   │   ├── types.ts             # ToolAuditFormData + re-exports shared form types
│   │   │   ├── mockData.ts          # getToolChecklistForType(), audit options
│   │   │   └── components/
│   │   │       ├── ConfirmationScreen.tsx
│   │   │       └── steps/           # StepEntry, StepAuditDetails (label: "Check Sheet"),
│   │   │                           # StepToolsChecklist, StepObservationsActions
│   │   │                           # (200-char limits), StepAttachments, StepReview,
│   │   │                           # ActionItem, ToolChecklistItem
│   │   ├── sos/                 # SOS emergency form (route-private, single-screen)
│   │   │   ├── page.tsx + page.module.css
│   │   │   ├── useSOSForm.ts        # description, photos, isSubmitted
│   │   │   ├── types.ts
│   │   │   └── components/          # SOSForm, SOSConfirmation
│   │   └── safety-alert/        # Safety Alert form (L2/L3 only, single-screen)
│   │       ├── page.tsx + page.module.css   # Role gate: L1 → access-denied state
│   │       ├── useSafetyAlertForm.ts        # message, targetAudience[], attachments, isValid
│   │       ├── types.ts                     # SafetyAlertFormData, TARGET_AUDIENCE_GROUPS
│   │       └── components/                  # SafetyAlertForm, SafetyAlertConfirmation
│   └── mobile/                  # MOBILE prototype
│       ├── layout.tsx + layout.module.css   # Mobile shell + bottom tab bar
│       ├── page.tsx             # Mobile dashboard (/mobile)
│       ├── inbox/  insights/  alerts/  settings/
│       ├── history/  +  history/[id]/       # Mobile history list + detail
│       └── menu/               # Mobile menu (/mobile/menu)
├── components/
│   ├── ui/                      # Core design system (token-driven, reusable)
│   │   ├── index.ts             # Barrel export — register new ui components here
│   │   ├── Icon.tsx             # All icons; exports IconName type — check before adding icons
│   │   ├── Badge.tsx            # Exports BadgeColor type
│   │   ├── Button, FilterChip, FilterChipDropdown, FormField, TextInput, Textarea,
│   │   │   Select, SelectBottomSheet, RadioGroup, FileInput, DropdownMenu, Dropdown,
│   │   │   Modal, BaseModal, ModalVariants, ScrollArea,
│   │   │   DatePickerDropdown, CalendarPanel, TimeInput
│   │   ├── ThemeProvider.tsx    # useTheme() — light/dark via [data-theme]
│   │   └── hooks/               # useClickOutside, useDropdownState, useFocusTrap, useModal
│   ├── prototype/               # DESKTOP prototype components
│   │   ├── index.ts             # Barrel export
│   │   ├── AppSidebar, AppHeader, RoleProvider (role switching)
│   │   ├── TaskCard, TaskDetailPanel, HistoryTable, EmptyState, SearchInput, SegmentedTabs
│   │   ├── FilterBar, ComposableFilterBar, AdvancedFiltersModal
│   │   ├── RecordDetailContent, RecordActions, AuditTrail, NextStepBanner, UserMenu
│   │   ├── Dashboard{StatCard,CategoryCard,ActivityItem,ActivityLogItem}
│   │   └── form/                # SHARED form primitives
│   │       ├── ProgressBar.tsx
│   │       ├── StepContainer.tsx
│   │       └── types.ts         # Generic FormState<TData,TStep>, BaseStepConfig, StepErrors
│   └── mobile/                  # MOBILE prototype components
│       ├── index.ts
│       ├── MobileShell, MobileHeader, BottomTabBar, StatusBar
│       ├── BottomSheet, FilterBottomSheet
│       └── MobileHistoryList, MobileTaskDetail, MobileUserProfile
├── data/
│   └── mock-data.ts             # App-wide shared mock records, tasks, users,
│                                # MOCK_EMPLOYEES (8), MOCK_SOS_RECORDS (3),
│                                # MOCK_SAFETY_ALERT_RECORDS (3)
├── types/
│   ├── history.ts               # RecordStatus, RECORD_STATUSES, STATUS_BADGE_COLORS
│   ├── status.ts                # getDisplayLabel(), filter helpers, visibility constants
│   └── roles.ts                 # Role types + permission helpers
├── utils/
│   ├── formatters.ts
│   └── role-filters.ts
├── public/                      # Static assets (logos, SVGs)
├── next.config.mjs              # Plain Next.js config
├── tsconfig.json                # Path alias: @/* → ./* (resolves from ROOT)
└── .claude/prds/                # Feature specs / PRDs
```

## Naming Conventions

- **Components/files:** PascalCase (`TaskCard.tsx`); utilities camelCase (`formatters.ts`)
- **CSS Modules:** match the component name (`TaskCard.module.css`)
- **Hooks:** camelCase, `use` prefix (`useTheme`, `useIncidentForm`)
- **Types/Interfaces:** PascalCase, exported (`RecordStatus`, `BadgeColor`, `IconName`)
- **Constants (maps/arrays):** SCREAMING_SNAKE_CASE (`STATUS_BADGE_COLORS`, `RECORD_STATUSES`)
- **CSS custom properties:** kebab-case, semantic prefix (`--bg-surface`, `--fg-default`)

## Key Conventions / Patterns to Follow

- **`@/*` resolves from the project root** (tsconfig `paths`). Import as `@/components/ui/Button`, `@/components/prototype/form/types`, etc.
- **Route-private feature modules:** self-contained form flows live under their route (`app/sdrone/report/`, `app/sdrone/tool-audit/`) with co-located `components/`, `steps/`, hook, `validation.ts`, `types.ts`, `mockData.ts`. Keep new form features in this shape.
- **Shared form primitives** live in `components/prototype/form/` — `ProgressBar`, `StepContainer`, and the generic `types.ts` (`FormState<TData,TStep>`, `BaseStepConfig<TStep>`, `StepErrors`). Each feature's `types.ts` re-exports these and adds its data types; the feature hook holds the runtime logic.
- **Mock data:** route-private `mockData.ts` for form-only data; `data/mock-data.ts` for app-wide shared data.
- **CSS Modules for component styles; CSS variables for all visual values.** Barrel-export new `ui`/`prototype`/`mobile` components via their `index.ts`.
- **Server Components by default;** add `'use client'` only for state/effects/browser APIs.
- **TypeScript strict** — no `any`; export prop interfaces.

## Patterns to Avoid

- Primitive tokens (`--color-*`) in components — use semantic tokens (`--bg-*`, `--fg-*`, `--border-*`).
- Hardcoded colors or inline styles — always a CSS variable.
- Color changes without a dark-mode variant in `[data-theme='dark']`.
- Backend behaviour — no `fetch`, no real persistence, no auth.
- New tokens or npm packages without asking first.
- `!important` (use specificity).

## Design Token System

Defined entirely in `app/globals.css`:
```
Primitive tokens  → --color-*, --space-*          (raw; only in globals.css)
Semantic tokens   → --bg-*, --fg-*, --border-*     (usage-based; used in components)
Status tokens     → --bg-{status}-soft|solid, --fg-{status}-soft|solid
Dark mode         → [data-theme='dark'] { … }      (overrides semantic tokens)
```
- **Backgrounds:** `--bg-canvas|base|surface|subtle|emphasis|hover|accent|accent-soft|accent-hover`
- **Foreground:** `--fg-default|secondary|subtle|muted|accent|accent-emphasis|accent-soft|on-accent`
- **Borders:** `--border-default|subtle|emphasis`
- **Status** (information, negative, neutral, notice, positive, primary): `-soft` (light bg/dark text) and `-solid` (strong bg/light text)
- **Typography utility classes** (className, not vars): `.text-heading`, `.text-body-strong`, `.text-body`, `.text-caption-strong`, `.text-caption`, `.text-caption-small`
- **Spacing:** 4px grid via `--space-*`.

### Token addition policy
Before adding any color/typography token: (1) check for an existing one; (2) STOP and ASK with a proposed semantic name; (3) on approval, add to `globals.css` + a `[data-theme='dark']` variant.

## Testing / Validation

- `npx tsc --noEmit` — primary gate (ESLint config is known-broken).
- Manually verify light + dark modes, and responsive at 375 / 768 / 1024px.
- Keyboard navigation + ARIA on interactive elements; WCAG AA contrast.

## Key Libraries

- `next` 15.5.9 (App Router), `react`/`react-dom` 19 — runtime
- `react-icons` 5 (Remixicon set) — all icons centralised in `Icon.tsx`

## Skills

- **`emil-design-eng`** — components with interaction, animation, motion
- **`impeccable`** — visual design (typography, color, spacing, layout)
- **`interface-design`** — `/interface-design:init` at start; `/interface-design:audit` before shipping UI
- **`ui-skills`** — final compliance check before UI is done
