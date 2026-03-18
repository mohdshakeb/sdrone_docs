# Status System PRD

## Overview

This document defines the S-Drone record lifecycle status system. It replaces the previous system that had per-role label mappings with a simpler, unified approach using contextual display labels.

---

## 5 Canonical Statuses

These are the statuses stored in the data layer. They are the same for all users regardless of role.

| Status | Meaning | Badge Color |
|---|---|---|
| **Pending** | Task assigned, work not yet submitted | `neutral` |
| **Under Review** | Submitted, in the review pipeline | `notice` |
| **On Hold** | Reviewed and sent back for action | `negative` |
| **Escalated** | Elevated to L3 management | `negative` |
| **Closed** | Resolved | `positive` |

### What was dropped

| Old Status | Replaced by | Reason |
|---|---|---|
| Draft | Pending | Redundant — "not yet submitted" is captured by Pending |
| Submitted | Under Review | Redundant — once submitted it enters the review pipeline |
| Action Required | On Hold | Clearer name — all scenarios involve being "sent back after review" |
| Scheduled | Pending | Redundant — a scheduled task is simply pending until it happens |

---

## Contextual Display Labels

These replace the canonical status label when the viewer has a specific relationship to the record. They provide more actionable information than the raw status.

| Label | Replaces | For whom | When |
|---|---|---|---|
| **Assigned to you** | Pending | The assignee | They've been assigned work to complete and submit |
| **Awaiting Review** | Under Review | The reviewer | A submission needs their review |

### Important distinction

- "Assigned to you" is ONLY for pre-submission task assignment (e.g., Mr X assigns an audit to Mr Y — Mr Y sees "Assigned to you")
- It does NOT apply to review assignments or returned reports
- After submission, the submitter sees "Under Review" and the reviewer sees "Awaiting Review"

---

## Attention Labels

These override both canonical status and contextual labels when they carry more critical information.

| Label | Condition | Badge Color |
|---|---|---|
| **Overdue** | Record open > 14 days and not Closed | `negative` |
| **Updated** | Content changed since viewer last looked, not Closed | `neutral` |

### What was dropped

| Old Label | Reason |
|---|---|
| New | Redundant with "Awaiting Review" — both signal "needs first look" |

---

## Display Priority Stack

When determining what label to show, the system evaluates from highest to lowest priority. The first match wins.

```
1. Overdue         -> replaces any active status (negative badge)
2. Updated         -> replaces any active status (neutral badge)
3. Assigned to you -> replaces Pending for the assignee (notice badge)
   Awaiting Review -> replaces Under Review for the reviewer (information badge)
4. Canonical status -> fallback (uses status badge color)
```

This is implemented in `getDisplayLabel()` in `types/status.ts`.

---

## Record Lifecycle Scenarios

### Scenario A: Standard report flow

```
Reporter submits report
  -> Status: Under Review
     Reporter sees: Under Review
     Reviewer sees: Awaiting Review
  -> Reviewer completes review, closes
  -> Status: Closed
```

### Scenario B: Report sent back

```
Reporter submits report
  -> Status: Under Review
  -> Reviewer sends back for more info
  -> Status: On Hold
     Owner sees: On Hold
     Reviewer sees: On Hold
  -> Owner responds, resubmits
  -> Status: Under Review
  -> Reviewer closes
  -> Status: Closed
```

### Scenario C: Assigned audit

```
Manager assigns audit to worker
  -> Status: Pending
     Worker sees: Assigned to you
     Manager sees: Pending
  -> Worker completes audit, submits
  -> Status: Under Review
     Worker sees: Under Review
     Manager sees: Awaiting Review
  -> Manager reviews and closes
  -> Status: Closed
```

### Scenario D: Escalation

```
Report is under review
  -> Status: Under Review
  -> L2 reviewer escalates to management
  -> Status: Escalated
     All roles see: Escalated
  -> L3 manager reviews and closes
  -> Status: Closed
```

---

## Stat Card Labels (Dashboard)

Stat cards on the dashboard use contextual names based on the viewer's role level.

| Stat | L1 (Field Worker) | L2 (Safety Officer) | L3 (HSE Manager) |
|---|---|---|---|
| Pending | Assigned to Me | Awaiting Review | Awaiting Review |
| Critical | On Hold | On Hold | Escalated |
| Under Review | Under Review | Under Review | Under Review |
| Resolved | Closed | Closed | Closed |

---

## Visibility Rules

- **L1 users** cannot see records with status `Escalated` (hidden via `L1_HIDDEN_HISTORY_STATUSES`)
- **L2 and L3 users** see all statuses

---

## Filter Options

### History page filters

All roles see the same filter options (L1 hides Escalated via visibility rules, not by removing the option):

- Pending
- Under Review
- On Hold
- Escalated (L2/L3 only — added dynamically)
- Closed

### Inbox page filters

- Pending
- Under Review
- On Hold
- Closed

---

## Implementation Reference

| File | What it defines |
|---|---|
| `types/history.ts` | `RecordStatus` type, `RECORD_STATUSES` array, `STATUS_BADGE_COLORS` map |
| `types/status.ts` | `getDisplayLabel()`, filter option helpers, visibility constants |
| `data/mock-data.ts` | Mock records and tasks with canonical status values |
| `components/prototype/NextStepBanner.tsx` | Status-specific banner messages |
| `components/prototype/RecordActions.tsx` | Status-specific action buttons |
