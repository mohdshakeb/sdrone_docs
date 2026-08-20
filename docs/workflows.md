# S-DRONE

Safety and Incident Management System

*Workflow & Data Documentation*

**Document Version:** v0.2 — Living Document
**Status:** In Progress — Workflows being documented iteratively
**Date:** June 2026

---

# 1. Introduction

S-Drone is a multi-tenant safety and incident management platform designed to manage the full lifecycle of workplace incident reporting, tool audits, compliance, and permit management across field operations. It serves as the single system through which incidents are reported, reviewed, escalated, and closed — for all employees, across all roles and locations.

The system is built around two independent concepts: permission levels, which control what actions a user can perform, and functional designations, which control routing and accountability. Both are configured per organisation by the App Admin. This makes S-Drone adaptable to any organisation's structure and role hierarchy without changes to the platform itself.

---

# 2. Workflow Map

Workflows are divided into two types:
- **Action** — triggered by an event, reactive in nature
- **Process** — planned activities, scheduled in advance

| # | Category | Workflow | Status |
|---|---|---|---|
| 1 | Action | Incident Report | Documented |
| 2 | Action | SOS | Documented |
| 3 | Action | Safety Alert | Documented |
| 4 | Audit | Tool Audit | Documented |
| 5 | Audit | Safety Audit | Pending |
| 6 | Risk Management | Job Hazard Analysis | Pending |
| 7 | Risk Management | Standard Work Procedure | Pending |
| 8 | Compliance | Compliance Audit | Pending |
| 9 | Compliance | Meetings | Pending |
| 10 | Compliance | Health Check | Pending |
| 11 | Process | Toolbox Talk | Pending |
| 12 | Process | Permit to Work | Pending |

---

# 3. Platform Overview

## Permission Levels

Permission levels are fixed by the platform. They control what actions a user can perform within their designated workflows. A user's effective capability is the intersection of their permission level (what actions) and their functional designation (which workflows).

| Level | Capability | Submit | Review / Close / Escalate | Oversight / Monitoring |
|---|---|---|---|---|
| L1 | Reporting only | ✅ | ❌ | ❌ |
| L2 | Reporting + Review + Limited Oversight | ✅ | ✅ own team | ✅ own team |
| L3 | Reporting + Review + Full Oversight | ✅ | ✅ system-wide | ✅ system-wide |

## Functional Designations

Functional designations are fixed by the platform. They control which workflows a user participates in and how routing and notifications are directed. Each organisation maps their own role titles to these designations. A user can hold multiple designations simultaneously.

| Workflow | Reporter | Reporting Manager | Safety Officer | Safety Head |
|---|---|---|---|---|
| Near Miss | ✅ | ✅ | ✅ | ✅ |
| First Aid | ✅ | ✅ | ✅ | ✅ |
| FIR | ✅ | ✅ | ✅ | ✅ |
| ADR | ❌ | ❌ | ✅ | ✅ |
| Tool Audit | ✅ | ✅ | ✅ | ✅ |
| Permit to Work | ✅ | ✅ | ✅ | ✅ |
| SOS | ✅ | ✅ | ✅ | ✅ |
| Safety Alert | ❌ | ❌ | ✅ | ✅ |
| Safety Audit | ❌ | ❌ | ✅ | ✅ |
| Job Hazard Analysis | ❌ | ❌ | ✅ | ✅ |
| Standard Work Procedure | ❌ | ❌ | ✅ | ✅ |
| Compliance Audit | ❌ | ❌ | ✅ | ✅ |
| Meetings | ❌ | ❌ | ✅ | ✅ |
| Health Check | ❌ | ❌ | ✅ | ✅ |
| Toolbox Talk | ❌ | ❌ | ✅ | ✅ |
| **Routing responsibility** | Submitter — records route to their RM | Primary reviewer — receives team submissions in inbox | Secondary reviewer — backup to RM, initiates Safety Alert, conducts audits | Oversight and monitoring — receives escalations, sends Safety Alerts |

## Combined Behaviour Rules

- A user's effective capability is the intersection of their designation (which workflows) and their permission level (what actions within those workflows)
- RM is the primary responsible party for records routed to them. Safety Officer can act as backup if RM is unavailable. All actions are logged with actor identity.
- If a user holds multiple designations, they gain the union of all workflow access across each designation
- RM cannot act beyond their designated workflow list unless they also hold Safety Officer or Safety Head designation

## User Setup Rules

- All users are created with L1 permission and Reporter designation by default
- Reporter is universal — every user holds it permanently regardless of other designations or permission level
- Any designation beyond Reporter requires L2 or L3 permission — the system prevents this combination at setup
- If a user is assigned L2 or L3 permission, at least one additional designation beyond Reporter must be assigned
- Every user has exactly one Reporting Manager assigned — no matrix reporting structures
- Escalation behaviour depends on the RM's permission level: if RM is L2 → can escalate to their own RM; if RM is L3 → final decision maker, no escalation available

## App Admin

App Admin is a separate system role outside the L1/L2/L3 permission structure. Responsible for configuring the platform per organisation — managing users, assigning permission levels and functional designations, and maintaining master data. To be documented separately.

---

# 4. System Setup

System Setup defines what the App Admin configures before the platform can be used by an organisation.

## System-captured Data (all report types)

The following fields are captured automatically at submission. Not entered manually by the reporter. Employee data is fetched from HRMS.

- Reported By: Name, Employee ID, Designation, Department, Division
- Location & Region
- Reporting Date & Time

---

# 5. Master Data

Master data is reference data that workflows depend on. It is created and maintained by the App Admin. New elements are added as workflows are confirmed — this section will be consolidated once all workflows are documented.

| # | Element | Description | Used In |
|---|---|---|---|
| 1 | Employees | Full employee directory synced from HRMS. Used for reporter identity, injured employee, witnesses, investigation team, corrective action responsibility | All workflows |
| 2 | Location / Region | Physical locations and associated regions | All workflows |
| 3 | Workstation | Specific workstations within a location | Near Miss |
| 4 | SBU / Location / Dept Head | Fetched from HRMS as part of employee details | FIR, ADR |
| 5 | Tool Check Sheets | Predefined tool checklists. Each contains a list of tools with specification and checkpoint criteria | Tool Audit |

---

# 6. Workflows

## Workflow 1: Incident Report

### Submission Types

| Type | Who Can Submit | Entry Method |
|---|---|---|
| Near Miss | L1, L2, L3 | Direct selection or "Not Sure" flow |
| First Aid | L1, L2, L3 | Direct selection or "Not Sure" flow |
| FIR (First Information Report) | L1, L2, L3 | Direct selection or "Not Sure" flow |
| ADR (Accident Detail Report) | L2, L3 | Direct selection only |

### "Not Sure" Flow

Reporter selects "Not Sure" at entry. The system determines the incident type through two progressive questions. Every answer is captured as form data — no question is answered in vain or repeated later.

**Inference logic:**

```
Q1: Did this incident result in any injury?
├── No  → Type: Near Miss
└── Yes ↓

Q2: Where was the person treated?
├── Treated on-site → Type: First Aid
└── Taken to hospital or doctor → Type: FIR
```

- Q1 answer captured as: wasInjured (boolean)
- Q2 answer captured as: treatmentLocation (on-site / hospital)
- ADR is never inferred — always explicit direct selection
- Once type is inferred, remaining type-specific steps load and reporter continues without repetition

### Form Architecture

One unified adaptive form. Steps shown depend on type — whether selected directly or inferred. No step is shown for an irrelevant type. No data is collected twice.

| Step | Not Sure | Near Miss | First Aid | FIR | ADR |
|---|---|---|---|---|---|
| 0. Entry & Type Selection | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1. FIR Reference (optional pre-fill) | ❌ | ❌ | ❌ | ❌ | ✅ |
| 2. What Happened | ✅ | ✅ | ✅ | ✅ | ✅ |
| 3. When & Where | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4. Injury Check (inference questions) | ✅ | ❌ | ❌ | ❌ | ❌ |
| 5. Injured Employee | ❌ | ❌ | ✅ single | ✅ repeatable | ✅ repeatable |
| 6. Witnesses | ❌ | ❌ | ❌ | ✅ | ✅ |
| 7. Reason & Loss | ❌ | ❌ | ❌ | ✅ | ✅ |
| 8. Observations | ❌ | ✅ | ✅ | ❌ | ✅ |
| 9. Event Details | ❌ | ❌ | ❌ | ❌ | ✅ |
| 10. Corrective Actions | ❌ | ❌ | ✅ simple | ❌ | ✅ repeatable |
| 11. Investigation Team | ❌ | ❌ | ❌ | ❌ | ✅ |
| 12. Evidence | ✅ | ✅ | ✅ | ✅ | ✅ |
| 13. Review & Submit | ✅ | ✅ | ✅ | ✅ | ✅ |

**"Not Sure" path:** Steps 0 → 2 → 3 → 4 (type inferred) → remaining type-specific steps → 12 → 13

**Direct selection path:** Steps 0 → type-specific steps in sequence → 12 → 13

**ADR path:** Step 0 → Step 1 (optional FIR pre-fill) → remaining ADR steps → 12 → 13

### Lifecycle

```
Submitted → Under Review → Closed
                        ↘ Escalated → Closed
```

- All records are terminal at Closed. Cannot be reopened.
- Independent FIR or ADR may be initiated after closure if required. No linking between records.

### Routing

- On submission: routes to submitter's direct Reporting Manager inbox
- Visible to (read-only from History): Safety Head at incident location + RM's Reporting Manager
- On escalation: routes to RM's Reporting Manager inbox

### Actions

| Action | L1 | L2 | L3 |
|---|---|---|---|
| Submit | ✅ | ✅ | ✅ |
| Close | ❌ | ✅ | ✅ |
| Escalate | ❌ | ✅ | ❌ |

- L3 can act on any record visible to them, not only escalated records
- After escalation, only Close is available. No further escalation.

### Fields by Incident Type

#### Near Miss

**Incident Details**

| Field | Type |
|---|---|
| Incident Date & Time | Date/time picker |
| Location | Predefined list |
| Workstation | Predefined list |
| Photos | File upload (multiple) |

**Observations**

| Field | Type |
|---|---|
| Root Cause for the Incident | Free text |
| Contributing Factors | Free text |
| Recommended Solution | Free text |

---

#### First Aid

**Injured Employee Details**

| Field | Type |
|---|---|
| Injured Employee | Employee selector (self or another employee) |
| Injured Body Part | Predefined list with "Other — specify" option |
| Treatment | Free text |
| Has used medicines from First Aid Box or visited Hospital? | Free text |
| Medicine Details | Free text |

**Incident Details**

| Field | Type |
|---|---|
| Incident Location | Predefined list |
| Incident Date & Time | Date/time picker |
| Incident Description | Free text |
| Root Cause | Free text |
| Corrective Action | Free text |
| Photos | File upload (multiple) |

---

#### FIR (First Information Report)

**Incident Details**

| Field | Type |
|---|---|
| SBU / Location / Dept Head | Fetched from HRMS |
| Incident Date & Time | Date/time picker |
| Incident Location | Predefined list |
| Exact place in company (branch, department, etc.) | Free text |
| Description of how accident occurred | Free text |
| Witnesses | Employee selector with "Other" option for non-employee witnesses |

**Injured Employee** *(repeatable — multiple persons)*

| Field | Type |
|---|---|
| Injured Employee | Employee selector |
| Hour work started on day of accident | Time picker |
| What the person was doing at time of accident | Free text |
| Nature, extent, location of injury | Free text |
| Doctor / Hospital name and address | Free text |
| Loss Time: did accident lead to absence from work? | Yes/No toggle; if Yes — number of days (numeric) |

**Reason & Loss**

| Field | Type |
|---|---|
| Was accident caused by machinery? | Yes/No |
| Machine name and part | Free text |
| Was machine moved by mechanical power at that time? | Yes/No |
| Loss to property details | Free text |

---

#### ADR (Accident Detail Report)

At entry, reporter may optionally select an existing FIR. If selected, all shared FIR fields are pre-filled and remain editable. If no FIR is selected, form starts blank. ADR and any referenced FIR remain independent records with no linked lifecycle. ADR is generally initiated after the FIR is closed.

Shares the following sections with FIR: Incident Details, Injured Employee (repeatable), Reason & Loss.

Additional sections unique to ADR:

**Event Details**

| Field | Type |
|---|---|
| Chronology of Events | Free text |
| Incident Photos | File upload (multiple) |

**Root Cause Identification**

| Field | Type |
|---|---|
| Contributing Factors and Root Cause Identification | Free text |
| Various factors which led to the accident | Free text |
| Why Analysis Report | Free text |

**Corrective Actions** *(repeatable)*

| Field | Type |
|---|---|
| Action | Free text |
| Responsibility | Employee selector |
| Timeline | Date picker |

**Investigation Team** *(repeatable)*

| Field | Type |
|---|---|
| Team Member | Employee selector |

### Open Questions — Incident Report

- Predefined list for Injured Body Part to be provided

---

## Workflow 2: SOS

### Purpose

SOS allows any user to quickly report an urgent situation or emergency by sending an alert with an optional description and photos. Designed for speed — the primary action is sending the alert immediately, with additional details optional.

### Who Can Trigger

All users regardless of permission level or functional designation.

### Fields

| Field | Type | Required |
|---|---|---|
| Emergency Description | Free text (short) | Optional |
| Photos | File upload (up to 4) | Optional |

Location and reporter details are captured automatically at the time of sending.

### Routing & Notifications

| Recipient | Designation | Basis | Responsibility |
|---|---|---|---|
| Reporting Manager | Reporting Manager | Reporter's assigned RM — always notified | Primary — takes necessary actions |
| Safety Officer | Safety Officer | Safety Officer designation at reporter's location | Secondary — supports response |
| Safety Head | Safety Head | All Safety Head designation users | Monitoring only |

If no Safety Officer is assigned at the reporter's location, the SOS still reaches the RM. No fallback required.

### Lifecycle

```
Sent → Acknowledged → Resolved
```

- **Sent** — alert triggered, notifications dispatched immediately
- **Acknowledged** — RM or Safety Officer acknowledges. Record displays who acknowledged and when. Reporter is notified.
- **Resolved** — RM marks as resolved at their discretion. Reporter is notified.

### Actions

| Action | Reporter | Reporting Manager | Safety Officer | Safety Head |
|---|---|---|---|---|
| Send SOS | ✅ | ✅ | ✅ | ✅ |
| Acknowledge | ❌ | ✅ | ✅ | ❌ |
| Mark Resolved | ❌ | ✅ | ❌ | ❌ |
| View / Monitor | ✅ own | ✅ team | ✅ location | ✅ all |

### Open Questions — SOS

- None

---

## Workflow 3: Safety Alert

### Purpose

Safety Alert allows authorised users to communicate critical safety information to a selected target audience. It is a one-way broadcast — not a report requiring review or closure. A full history of all sent alerts is maintained in the system.

### Who Can Trigger

Users with Safety Officer or Safety Head designation, regardless of permission level.

### Fields

| Field | Type | Required |
|---|---|---|
| Alert Message | Free text | Required |
| Target Audience | Multi-select (by location, designation, or group) | Required |
| Attachments | File upload | Optional |

### Lifecycle

```
Sent → (logged in history)
```

Terminal on send. No acknowledgement, review, or closure required.

### Actions

| Action | Safety Officer | Safety Head | Others |
|---|---|---|---|
| Send Alert | ✅ | ✅ | ❌ |
| View sent history | ✅ | ✅ | ✅ received only |

### Open Questions — Safety Alert

- Read receipt behaviour to be confirmed — simple seen/unseen indicator, or explicit acknowledgement from recipients?

---

## Workflow 4: Tool Audit

### Purpose

Tool Audit allows users to inspect tools against a predefined checklist and record their condition. Audits can be self-initiated or assigned.

### Initiation

| Method | Initiated By | Assigned To |
|---|---|---|
| Self-initiated | Any user | Themselves |
| Assigned | L2 or L3 | Any user under them |

### Form Structure

**Step 1 — Audit Details**

| Field | Type |
|---|---|
| Check Sheet | Selection from predefined list |
| Date | Date picker |
| Time | Time picker |
| Location | Predefined list |

**Step 2 — Tools Checklist**

Auto-populated based on selected check sheet. For each tool:

| Field | Type |
|---|---|
| Tool Condition | Selection — Good / Damaged |
| Comment | Free text (optional; required if Damaged) |
| Image | File upload (optional; required if Damaged) |

Read-only reference fields shown per tool:
- Tool Specification
- Checkpoint Criteria

**Step 3 — Conclusion**

| Field | Type | Limit |
|---|---|---|
| Observations | Free text | 200 characters |
| Action Required | Free text | 200 characters |
| Responsibility | Free text | 200 characters |
| Target Date | Date picker | Required |
| Attachments | File upload (multiple) | — |

### Lifecycle

```
Submitted → Under Review → Closed
                        ↘ Escalated → Closed
```

All records terminal at Closed. Cannot be reopened.

### Routing

Routes to submitter's direct Reporting Manager inbox on submission. Same as Incident Report.

### Actions

| Action | L1 | L2 | L3 |
|---|---|---|---|
| Submit | ✅ | ✅ | ✅ |
| Add Remark | ❌ | ✅ | ✅ |
| Close | ❌ | ✅ | ✅ |
| Escalate | ❌ | ✅ | ❌ |

### Open Questions — Tool Audit

- None

---

# 7. Post-Prototype Considerations

The following items are intentionally deferred and must be addressed before production.

### 1. Data Scoping — Team Visibility
L2 oversight is defined as "own team" but the precise boundary is unresolved. Does L2 see direct reports only, or their entire reporting hierarchy? What happens with multiple levels of L2 managers?

### 2. Time-based and Conditional Permissions
The current model is static. Enterprise HSE systems often require: permits authorisable only during working hours, automatic escalation after inaction, actions that activate based on record state.

### 3. Location Scoping
There is no formal model for assigning users to locations. This will become critical for Safety Audit, Compliance, and other location-bound workflows.

### 4. Delegation Model
No mechanism exists for an RM to delegate responsibilities when unavailable. A formal delegation model — temporary, time-bound, traceable — is needed before production.

---

*Document continues as workflows are confirmed — v0.2*