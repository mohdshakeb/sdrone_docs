# Implementation Plan: Prototype Update — workflows.md Alignment

**Status:** Approved — ready for implementation  
**Date:** 2026-06-13  
**Source:** `docs/workflows.md` v0.2

---

## Context

`docs/workflows.md` has been added as the authoritative spec for S-Drone's four documented workflows. A gap audit against the current prototype identified the following:

- **Incident Report form** — structurally incomplete. Missing multiple steps and field types (Witnesses, Reason & Loss, repeatable Injured Employees, Event Details, Investigation Team, ADR FIR Reference pre-fill, the two-question "Not Sure" inference flow, correct L1 FIR access).
- **Tool Audit form** — mostly aligned but missing 200-char limits on three Conclusion fields and uses "Audit Type" instead of "Check Sheet" terminology.
- **SOS (Workflow 2)** — entirely unbuilt. `/sdrone/alerts` is an empty-state placeholder.
- **Safety Alert (Workflow 3)** — entirely unbuilt.

---

## Phase 1: Incident Report Form — Step Architecture Overhaul

The largest body of work. Requires new step components, refactored repeatable field patterns, and type-specific step sequences.

### 1a. Update `app/sdrone/report/types.ts`

Extend `IncidentFormData` with:

```ts
// Repeatable structures (replace single fields)
injuredEmployees: InjuredEmployee[]      // replaces injuredEmployee, bodyPart, treatment
witnesses: Witness[]                     // new — FIR, ADR
correctiveActions: CorrectiveAction[]    // replaces correctiveAction string
investigationTeam: InvestigationMember[] // new — ADR only

// New scalar fields
firReference: string | null             // ADR optional pre-fill
exactPlace: string                      // FIR, ADR
machineryInvolved: boolean | null       // FIR, ADR
machineName: string
machineMoving: boolean | null
propertyLoss: string
chronologyOfEvents: string              // ADR (Event Details)
rootCause: string                       // Near Miss, ADR
contributingFactorsText: string         // Near Miss, ADR
whyAnalysis: string                     // ADR
recommendedSolution: string             // Near Miss

// Q2 inference field
treatmentLocation: 'on-site' | 'hospital' | null
```

New repeatable item types:

```ts
interface InjuredEmployee {
  id: string
  employeeId: string
  hourWorkStarted: string       // time — FIR, ADR
  activityAtTime: string        // free text — FIR, ADR
  injuryDescription: string     // nature/extent/location
  bodyPart: string              // predefined list
  treatment: string             // First Aid only
  doctorHospital: string        // FIR, ADR
  lossTime: boolean | null      // FIR, ADR
  lossTimeDays: number | null
}

interface Witness {
  id: string
  type: 'employee' | 'other'
  employeeId?: string
  name?: string
}

interface CorrectiveAction {
  id: string
  action: string
  responsibilityEmployeeId: string
  timeline: string   // date
}

interface InvestigationMember {
  id: string
  employeeId: string
}
```

### 1b. Fix L1 FIR Access — `types/roles.ts` + `StepEntry.tsx`

The spec allows L1 to submit FIR. Only ADR is L2/L3 restricted.

- Add `canSubmitADR: boolean` to the role permissions type (L1=false, L2=true, L3=true)
- Remove or repurpose `canSubmitAllIncidents` — it was incorrectly blocking FIR for L1
- Update `StepEntry.tsx` to disable only the ADR option for L1 users

### 1c. Restructure "Not Sure" Inference — Two Questions in `StepInjuryCheck.tsx`

**Spec defines:**
```
Q1: Did this incident result in any injury?
├── No  → Type: Near Miss
└── Yes ↓
Q2: Where was the person treated?
├── On-site → Type: First Aid
└── Hospital / doctor → Type: FIR
```

Both answers captured (`wasInjured`, `treatmentLocation`). Type inferred after Q2 and set in `useIncidentForm`. The Injury Details step no longer doubles as an inference gate.

### 1d. New Step Components

All go in `app/sdrone/report/components/steps/`.

| Component | Shown For | Key Fields |
|---|---|---|
| `StepFIRReference.tsx` | ADR only | FIR selector (optional); pre-fills shared fields if selected |
| `StepInjuredEmployee.tsx` | First Aid (single), FIR + ADR (repeatable) | employeeId, bodyPart, injuryDescription, hourWorkStarted, activityAtTime, doctorHospital, lossTime; First Aid shows simplified subset |
| `StepWitnesses.tsx` | FIR, ADR | Employee selector or "Other" (free-text name); add/remove rows |
| `StepReasonAndLoss.tsx` | FIR, ADR | machineryInvolved (Yes/No), machineName, machineMoving (Yes/No), propertyLoss |
| `StepObservations.tsx` | Near Miss, First Aid, ADR | Near Miss/First Aid: rootCause, contributingFactorsText, recommendedSolution; ADR: contributingFactorsText, rootCause, whyAnalysis |
| `StepEventDetails.tsx` | ADR only | chronologyOfEvents (free text), incident photos (file upload) |
| `StepCorrectiveActions.tsx` | First Aid (simple text), ADR (repeatable) | ADR: action + responsibilityEmployeeId + timeline; add/remove rows |
| `StepInvestigationTeam.tsx` | ADR only | employeeId selector; add/remove rows |

### 1e. Retire Superseded Steps

After new steps are wired up, delete:
- `StepInjuryDetails.tsx` → replaced by `StepInjuredEmployee.tsx`
- `StepFirstAidSpecifics.tsx` → medicine fields merged into `StepInjuredEmployee` (First Aid variant)
- `StepContributingFactors.tsx` → merged into `StepObservations.tsx`
- `StepCorrectiveAction.tsx` → replaced by `StepCorrectiveActions.tsx`

### 1f. Refactor `useIncidentForm.ts` — Type-Specific Step Sequences

Replace the universal conditional sequence with explicit per-type arrays:

```
Near Miss:   Entry → WhatHappened → WhenWhere → Observations → Evidence → Review
First Aid:   Entry → WhatHappened → WhenWhere → InjuredEmployee → Observations → CorrectiveActions → Evidence → Review
FIR:         Entry → WhatHappened → WhenWhere → InjuredEmployee → Witnesses → ReasonAndLoss → Evidence → Review
ADR:         Entry → FIRReference → WhatHappened → WhenWhere → InjuredEmployee → Witnesses → ReasonAndLoss → Observations → EventDetails → CorrectiveActions → InvestigationTeam → Evidence → Review
Not Sure:    Entry → WhatHappened → WhenWhere → InjuryCheck (Q1+Q2) → [inferred type tail]
```

After Q2 resolves, `setInferredType()` switches the active step list to the inferred type's tail sequence.

### 1g. Update `StepReview.tsx`

Add read-only sections for all new data: witnesses list, reason & loss, event details, corrective actions list, investigation team. Render conditionally (only if data is present).

### 1h. Update `validation.ts`

Add validators for each new step. Repeatable lists: at least one entry required where spec implies a list (e.g. at least one injured employee for FIR/ADR before proceeding).

---

## Phase 2: Tool Audit Form — Minor Fixes

All changes in `app/sdrone/tool-audit/`.

### 2a. 200-Character Limits on Conclusion Fields

Three fields in the Step 3 (Conclusion) component need `maxLength={200}` enforcement and live character counters ("142 / 200", turning red at limit):
- Overall Observations
- Action Required (per action item)
- Responsibility (per action item)

File to update: `components/steps/StepObservations.tsx` (or equivalent Step 3 component — confirm exact filename).

### 2b. Label: "Audit Type" → "Check Sheet"

The spec refers to this field as "Check Sheet" (from master data). Update the visible label in `StepAuditDetails.tsx` and any display text in `StepReview.tsx`. The underlying field key (`auditType`) can remain unchanged.

---

## Phase 3: SOS Workflow — New

New self-contained route module at `app/sdrone/sos/`.

### Files to create

```
app/sdrone/sos/
├── page.tsx                    # Page wrapper; uses useSOSForm
├── useSOSForm.ts               # State: description, photos, isSubmitted
├── types.ts                    # SOSFormData
└── components/
    ├── SOSForm.tsx             # Single-screen form (no stepper)
    └── SOSConfirmation.tsx     # Post-send screen
```

### Form design

Single screen — no stepper. Speed is the primary intent:
- Reporter context strip (read-only): name + auto-detected location
- **Emergency Description** — textarea, optional, clearly labelled optional
- **Photos** — file upload, max 4, optional
- **SEND SOS** — large, visually prominent primary action button

### Navigation

The SOS button **already exists** in `AppHeader.tsx` — it renders as a `variant="negative" iconOnly` button with the "sos" icon (line 360–364). No new nav items needed. The implementation work is:
- Wire the existing SOS button's `onClick` to `router.push('/sdrone/sos')`
- SOS history (past sent alerts with lifecycle states) lives in the **Alerts tab** (`/sdrone/alerts`)

### Mock data

Add `MOCK_SOS_RECORDS` to `data/mock-data.ts` — a few entries covering all three lifecycle states: Sent, Acknowledged, Resolved.

---

## Phase 4: Safety Alert Workflow — New

New self-contained route module at `app/sdrone/safety-alert/`.

### Files to create

```
app/sdrone/safety-alert/
├── page.tsx                        # Page wrapper; role gate applied here
├── useSafetyAlertForm.ts           # State: message, targetAudience, attachments, isSubmitted
├── types.ts                        # SafetyAlertFormData
└── components/
    ├── SafetyAlertForm.tsx         # Single-screen form
    └── SafetyAlertConfirmation.tsx
```

### Role gate

Only Safety Officer and Safety Head designations can access. In `page.tsx`, read role from `RoleProvider`. L1 users get an access-denied state or redirect to dashboard.

Add `canSendSafetyAlert: boolean` to `types/roles.ts` (L1=false, L2=true, L3=true).

### Form design

Single screen, terminal on send:
- **Alert Message** — textarea, required
- **Target Audience** — multi-select, required; options drawn from existing location + employee mock data (by location, by designation, or group)
- **Attachments** — file upload, optional

### Navigation

Safety Alert is a process-oriented workflow — it belongs in the **"Start New" dropdown** in `AppHeader.tsx` (line 45–65), not the sidebar. Add a role-gated "Safety Alert" entry to the `getStartNewItems()` function, disabled when `!perms.canSendSafetyAlert`. No sidebar changes needed.

Past sent Safety Alerts (alongside SOS history) live in the **Alerts tab** (`/sdrone/alerts`). History of all workflows lives in the **History tab** (`/sdrone/history`). The existing sidebar navigation covers both — no new entries required.

---

## Phase 5: Seed Data

### 5a. Richer employee list — `data/mock-data.ts`

Add `MOCK_EMPLOYEES` alongside the existing `PERSON_OPTIONS`. The new employee selectors (Injured Employee, Witnesses, Investigation Team, Corrective Action Responsibility) need id, name, role, department, and email — not just a filter-pair. Derive from the existing 8 people; `PERSON_OPTIONS` stays as-is for filters.

```ts
export interface MockEmployee {
  id: string
  name: string
  role: string        // e.g. 'Field Worker', 'Safety Officer'
  department: string  // e.g. 'Warehouse Operations', 'HSE'
  email: string
}

export const MOCK_EMPLOYEES: MockEmployee[] = [
  { id: 'emp-001', name: 'Sanjay Mehta',    role: 'Warehouse Supervisor',  department: 'Warehouse Operations', email: 'sanjay@sdrone.com'  },
  { id: 'emp-002', name: 'Anita Desai',     role: 'Team Lead',             department: 'Logistics',            email: 'anita@sdrone.com'   },
  { id: 'emp-003', name: 'Rahul Sharma',    role: 'Field Worker',          department: 'Warehouse Operations', email: 'rahul@sdrone.com'   },
  { id: 'emp-004', name: 'Priya Rao',       role: 'Safety Officer',        department: 'HSE',                  email: 'priya@sdrone.com'   },
  { id: 'emp-005', name: 'Vikram Singh',    role: 'HSE Manager',           department: 'HSE',                  email: 'vikram@sdrone.com'  },
  { id: 'emp-006', name: 'Karan Johar',     role: 'Equipment Manager',     department: 'Maintenance',          email: 'karan@sdrone.com'   },
  { id: 'emp-007', name: 'Dr. Meera Patel', role: 'Occupational Health',   department: 'Medical',              email: 'meera@sdrone.com'   },
  { id: 'emp-008', name: 'Arjun Kumar',     role: 'Maintenance Lead',      department: 'Maintenance',          email: 'arjun@sdrone.com'   },
]
```

### 5b. FIR reference list — `app/sdrone/report/mockData.ts`

The ADR Step 1 "FIR Reference" selector needs a short list of existing FIR records. When selected, their shared fields pre-populate the ADR form (all fields remain editable). 3–4 entries covering different locations and states.

```ts
export interface FIRReference {
  id: string
  title: string
  date: string
  location: string
  // Pre-fill values for shared ADR fields
  description: string
  exactPlace: string
  injuredEmployees: InjuredEmployee[]
  witnesses: Witness[]
  machineryInvolved: boolean
  machineName: string
  machineMoving: boolean
  propertyLoss: string
}

export const MOCK_FIR_REFERENCES: FIRReference[] = [
  {
    id: 'fir-001',
    title: 'Equipment malfunction — Conveyor Section, Warehouse A',
    date: '2026-03-10',
    location: 'Warehouse A',
    description: 'Conveyor belt malfunction resulted in worker injury. Emergency stop activated. Worker transported to hospital.',
    exactPlace: 'Conveyor Section, Bay 2',
    injuredEmployees: [{ id: 'ie-1', employeeId: 'emp-003', hourWorkStarted: '07:00', activityAtTime: 'Operating conveyor belt', injuryDescription: 'Laceration to right hand from moving belt', bodyPart: 'hand', doctorHospital: 'City General Hospital', lossTime: true, lossTimeDays: 5 }],
    witnesses: [{ id: 'w-1', type: 'employee', employeeId: 'emp-001' }],
    machineryInvolved: true,
    machineName: 'Conveyor Belt CB-04',
    machineMoving: true,
    propertyLoss: 'Belt drive mechanism damaged — estimated repair cost ₹45,000',
  },
  {
    id: 'fir-002',
    title: 'Chemical spill — Lab 3',
    date: '2026-01-12',
    location: 'Lab 3',
    description: 'Mild acidic solution spilled during container transfer. Area decontaminated. No injuries.',
    exactPlace: 'Chemical Storage Transfer Station',
    injuredEmployees: [],
    witnesses: [{ id: 'w-2', type: 'employee', employeeId: 'emp-008' }],
    machineryInvolved: false,
    machineName: '',
    machineMoving: false,
    propertyLoss: 'Flooring tiles in transfer area corroded — replacement required',
  },
  {
    id: 'fir-003',
    title: 'Oil spill — Fueling Station',
    date: '2026-01-16',
    location: 'Fueling Station',
    description: 'Hydraulic oil leak from cracked transfer pump line. Approximately 5 litres spilled on concrete pad.',
    exactPlace: 'Tank Farm, Pump Station 2',
    injuredEmployees: [],
    witnesses: [],
    machineryInvolved: true,
    machineName: 'Fuel Transfer Pump FTP-02',
    machineMoving: true,
    propertyLoss: 'Hydraulic line and pump seal replacement — estimated ₹12,000',
  },
]
```

### 5c. SOS records — `data/mock-data.ts`

For the Alerts tab history view. Covers all three lifecycle states: Sent, Acknowledged, Resolved.

```ts
export interface SOSRecord {
  id: string
  sentBy: { name: string; role: string }
  location: string
  sentAt: string
  description?: string
  photoCount: number
  status: 'Sent' | 'Acknowledged' | 'Resolved'
  acknowledgedBy?: { name: string; role: string; timestamp: string }
  resolvedBy?: { name: string; role: string; timestamp: string }
}

export const MOCK_SOS_RECORDS: SOSRecord[] = [
  {
    id: 'sos-001',
    sentBy: { name: 'Rahul Sharma', role: 'Field Worker' },
    location: 'Warehouse A',
    sentAt: '2026-06-10T14:32:00Z',
    description: 'Worker collapsed near Bay 3 — possible heat exhaustion. Need medical assistance immediately.',
    photoCount: 0,
    status: 'Resolved',
    acknowledgedBy: { name: 'Priya Rao', role: 'Safety Officer', timestamp: '2026-06-10T14:34:00Z' },
    resolvedBy: { name: 'Priya Rao', role: 'Safety Officer', timestamp: '2026-06-10T15:10:00Z' },
  },
  {
    id: 'sos-002',
    sentBy: { name: 'Anita Desai', role: 'Team Lead' },
    location: 'Loading Dock 2',
    sentAt: '2026-06-12T09:15:00Z',
    description: 'Fire detected in electrical cabinet near dock entrance. Extinguisher used but smoke still present.',
    photoCount: 2,
    status: 'Acknowledged',
    acknowledgedBy: { name: 'Vikram Singh', role: 'HSE Manager', timestamp: '2026-06-12T09:17:00Z' },
  },
  {
    id: 'sos-003',
    sentBy: { name: 'Karan Johar', role: 'Equipment Manager' },
    location: 'Generator Room',
    sentAt: '2026-06-13T11:50:00Z',
    photoCount: 1,
    status: 'Sent',
  },
]
```

### 5d. Safety Alert records — `data/mock-data.ts`

For the Alerts tab alongside SOS records. Terminal on send — no lifecycle states.

```ts
export interface SafetyAlertRecord {
  id: string
  sentBy: { name: string; role: string }
  sentAt: string
  message: string
  targetAudience: string[]
  attachmentCount: number
}

export const MOCK_SAFETY_ALERT_RECORDS: SafetyAlertRecord[] = [
  {
    id: 'sa-001',
    sentBy: { name: 'Priya Rao', role: 'Safety Officer' },
    sentAt: '2026-06-11T08:00:00Z',
    message: 'MANDATORY: All personnel must wear heat-resistant gloves when operating in the Generator Room and Fueling Station effective immediately. Recent incident has prompted this requirement. PPE available from the safety store.',
    targetAudience: ['Generator Room', 'Fueling Station', 'All Field Workers'],
    attachmentCount: 1,
  },
  {
    id: 'sa-002',
    sentBy: { name: 'Vikram Singh', role: 'HSE Manager' },
    sentAt: '2026-06-09T07:30:00Z',
    message: 'Emergency muster drill scheduled for tomorrow 13 June at 10:00 AM. All staff must participate. Report to designated assembly points. This drill is mandatory and will be recorded.',
    targetAudience: ['All Locations', 'All Staff'],
    attachmentCount: 0,
  },
  {
    id: 'sa-003',
    sentBy: { name: 'Priya Rao', role: 'Safety Officer' },
    sentAt: '2026-06-05T13:15:00Z',
    message: 'Slip hazard alert: water ingress reported in Warehouse B Aisle 4 and Loading Dock entrance due to drainage issue. Caution tape placed. Avoid area until repair is complete. Report any additional hazards immediately.',
    targetAudience: ['Warehouse B', 'Loading Dock', 'All Reporting Managers'],
    attachmentCount: 0,
  },
]
```

---

## Files Modified Summary

| File | Change |
|---|---|
| `app/sdrone/report/types.ts` | New repeatable types, new scalar fields |
| `app/sdrone/report/useIncidentForm.ts` | Type-specific step sequences, Q2 inference, new step IDs |
| `app/sdrone/report/validation.ts` | Validators for new steps and repeatable items |
| `app/sdrone/report/components/steps/StepEntry.tsx` | L1 FIR fix — disable ADR only |
| `app/sdrone/report/components/steps/StepInjuryCheck.tsx` | Add Q2 (treatmentLocation) |
| `app/sdrone/report/components/steps/StepReview.tsx` | New display sections for all new data |
| `app/sdrone/tool-audit/components/steps/StepObservations.tsx` | 200-char limits + counters |
| `types/roles.ts` | Add `canSubmitADR`, `canSendSafetyAlert`; fix `canSubmitAllIncidents` → split FIR/ADR |
| `data/mock-data.ts` | Add `MOCK_EMPLOYEES`, `MOCK_SOS_RECORDS`, `MOCK_SAFETY_ALERT_RECORDS` |
| `app/sdrone/report/mockData.ts` | Add `MOCK_FIR_REFERENCES` |
| `components/prototype/AppHeader.tsx` | Wire SOS button onClick to `/sdrone/sos`; add Safety Alert to `getStartNewItems()` |

## New Files

See Phase 3 and Phase 4 file trees above, plus new step components listed in §1d.

## Files to Delete (Phase 1 cleanup)

- `app/sdrone/report/components/steps/StepInjuryDetails.tsx`
- `app/sdrone/report/components/steps/StepFirstAidSpecifics.tsx`
- `app/sdrone/report/components/steps/StepContributingFactors.tsx`
- `app/sdrone/report/components/steps/StepCorrectiveAction.tsx`

---

## Verification Checklist

- [ ] `npx tsc --noEmit` passes after each phase
- [ ] Walk all five incident type flows in browser: Near Miss (direct), First Aid (direct), FIR (direct + via Not Sure), ADR (with and without FIR reference), Not Sure (both inference paths)
- [ ] Role test: L1 (Rahul) — FIR available, ADR locked, Safety Alert absent from Start New dropdown, SOS header button routes to form
- [ ] SOS history and Safety Alert history appear in the Alerts tab; all workflow history in History tab
- [ ] Tool Audit: typing past 200 chars in Conclusion fields shows counter in red and blocks submission
- [ ] SOS: submit as any user — confirmation screen renders
- [ ] Safety Alert: L1 blocked; L2/L3 can submit successfully
