# Role-Based Content Visibility - Design Decisions

This document captures the finalized decisions for what each role sees on every page of the S-Drone prototype.

---

## Role Personas

| | Level 1: Field Worker | Level 2: Safety Officer | Level 3: HSE Manager |
|---|---|---|---|
| **User** | Rahul Sharma | Priya Rao | Vikram Singh |
| **Email** | rahul@sdrone.com | priya@sdrone.com | vikram@sdrone.com |
| **Focus** | Reporter - submits and tracks own reports | Reviewer - manages day-to-day safety operations | Executive - oversight, escalations, closures |

### Permissions

| Action | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| Submit reports | Limited types only | All types | All types |
| Assign | No | Yes (to L1) | Yes (to L1 and L2) |
| Review | No | Yes | Yes |
| Close | No | Yes | Yes |
| Escalate | No | Yes (to L3) | No (already top) |

---

## Status System

### 7 Canonical Statuses (record lifecycle)

| Status | Meaning |
|---|---|
| **Draft** | Reporter started but hasn't submitted |
| **Submitted** | Filed, waiting for pickup |
| **Under Review** | Actively being reviewed |
| **Action Required** | Needs response from reporter or assignee |
| **Escalated** | Elevated to Level 3 management |
| **Scheduled** | Planned for a future date |
| **Closed** | Fully resolved |

### Role-Specific Status Labels

Each role sees the same canonical statuses but with labels appropriate to their perspective.

**Level 1 (Reporter Perspective):**

| Canonical Status | Level 1 Label | Shown in |
|---|---|---|
| Draft | Draft | Inbox, History |
| Submitted | Submitted | Inbox, History |
| Under Review | In Review | Inbox, History |
| Action Required | Needs Attention | Inbox, History |
| Closed | Completed | Inbox, History |
| Escalated | _(hidden)_ | -- |
| Scheduled | _(hidden)_ | -- |

**Level 2/3 (Reviewer Perspective) - Inbox:**

| Canonical Status | L2/L3 Inbox Label |
|---|---|
| Submitted | Awaiting Review |
| Under Review | In Progress |
| Action Required | Action Required |
| Escalated | Escalated |
| Scheduled | Scheduled |
| Closed | Completed |

**Level 2/3 - History:** Uses canonical status names as-is (Draft, Submitted, Under Review, Action Required, Escalated, Closed).

### Assignment

Assignment is an **action**, not a status. When someone assigns a report:
- L2 assigns L1 to provide info -> status becomes **Action Required**, owner = L1
- L3 assigns L2 to review -> status becomes **Under Review**, owner = L2
- L2/L3 reassigns -> owner changes, status may or may not change

### Attention Labels

Small badges/chips shown on task cards to surface what needs action (not status filters):

| Label | Meaning | L1 | L2 | L3 |
|---|---|---|---|---|
| **New** | Recently submitted, not yet picked up | -- | Yes | Yes |
| **Assigned to you** | Someone assigned this to you specifically | Yes | Yes | -- |
| **Updated** | Content changed since you last viewed | -- | Yes | Yes |
| **Overdue** | Past expected resolution date | -- | Yes | Yes |

---

## Level 1: Field Worker (Rahul Sharma)

### Dashboard

**Status: FINALIZED**

**Greeting:** "Good morning, Rahul" (already implemented)

**Stats Cards** (personalized - only records reported by Rahul Sharma):
- My Pending Reports -- count of non-closed records they reported
- My Critical -- count of their Needs Attention items
- My Under Review -- count of their reports under review
- My Resolved -- count of their closed reports

**Attention Required -> "My Items Needing Action":**
- Only items reported by Rahul Sharma with status Draft or Action Required
- Draft = "you started this, finish it"
- Action Required = "reviewer sent this back to you"

**Recent Activity:** REMOVED for Level 1

**Category Breakdown -> "My Recent Reports":**
- Replaces BOTH Recent Activity and Category Breakdown sections
- List of their last 4-5 submitted reports
- Each shows: title, type, status badge, submitted date
- Quick way to track where their reports are in the pipeline

### Inbox

**Status: FINALIZED**

**Task List:**
- Only tasks related to Incident types and Tool Audit (filter out Compliance, Permit, Toolbox Talk, Safety Audit items)

**Report Type Filter:**
- Incidents: Near Miss, First Aid (hide FIR, ADR)
- Audits: Tool Audit only
- Hide: Compliance, Permit to Work, Toolbox Talk sections entirely

**Status Filter** (simplified labels):
- Submitted (maps to Awaiting Review)
- In Review (maps to In Progress)
- Needs Attention (maps to Critical)
- Completed (maps to Completed)

### History

**Status: FINALIZED**

**Scope:** Only records reported by Rahul Sharma (personalized view)

**Tabs:**
- All (their reports across all types)
- Incident (their incident reports)
- Audit (their audit reports)
- Hide: Compliance, Permit to Work, Toolbox Talk tabs

**Type Filter:**
- Incidents: Near Miss, First Aid only (hide FIR, ADR)
- Audits: Tool Audit only

**Status Filter** (simplified labels, same as Inbox):
- Draft
- Submitted
- In Review
- Needs Attention
- Completed

**Table Columns:**
- Title, Type, Status, Location, Updated
- Hide "Owner" column (not relevant -- they only see their own reports)

**Advanced Filters:**
- Hide: reportedBy (always themselves), owner, closedBy
- Keep: date range, location
- Keep: recordId (for tracking specific records)

---

## Level 2: Safety Officer (Priya Rao)

### Dashboard

**Status: FINALIZED**

**Greeting:** "Good morning, Priya"

**Stats Cards** (system-wide -- operational overview):
- Pending Tasks -- count of all non-Completed tasks
- Critical Items -- count of all Action Required + Escalated records
- Under Review -- count of all Under Review records
- Resolved -- count of all Closed records

**Attention Required:**
- Show Action Required + Escalated records (items Priya needs to act on or triage)

**Recent Activity:**
- Keep as-is (company-wide feed)

**Category Breakdown:**
- Keep existing 5 category cards (Incident, Audit, Compliance, Permit to Work, Toolbox Talk)
- Shows total + open counts per category -- useful for workload planning

### Inbox

**Status: FINALIZED**

**Task List:**
- Show all task types (full access to all report categories)

**Report Type Filter:**
- Full list: all incident types (Near Miss, First Aid, FIR, ADR), all audit types, all compliance types, Permit to Work, Toolbox Talk

**Status Filter** (reviewer labels):
- Awaiting Review, In Progress, Action Required, Escalated, Scheduled, Completed

### History

**Status: FINALIZED**

**Scope:** All records system-wide (not filtered to own reports)

**Tabs:**
- All 6 tabs available (All, Incident, Audit, Compliance, Permit to Work, Toolbox Talk)

**Type Filter:**
- Full list of all subtypes per category

**Status Filter:**
- All statuses: Draft, Submitted, Under Review, Action Required, Closed, Escalated

**Table Columns:**
- All columns: Title, Type, Status, Location, Owner, Updated

**Advanced Filters:**
- All available: reportedBy, owner, severity, date range, location, recordId
- Hide: closedBy (Level 2 can close but this filter is less relevant for their workflow)

---

## Level 3: HSE Manager (Vikram Singh)

### Dashboard

**Status: FINALIZED**

**Greeting:** "Good morning, Vikram"

**Stats Cards** (system-wide -- executive overview):
- Pending Tasks -- count of all non-Completed tasks
- Escalated -- count of Escalated records (needs management attention)
- Under Review -- count of all Under Review records
- Resolved -- count of all Closed records

**Attention Required:**
- Show Escalated records first (these need L3 action), then Action Required items
- Escalated items are the primary reason L3 checks the dashboard

**Recent Activity:**
- Keep as-is (company-wide feed)

**Category Breakdown:**
- Keep existing 5 category cards (same as Level 2)

### Inbox

**Status: FINALIZED**

**Task List:**
- Show all task types (full access)

**Report Type Filter:**
- Full list (same as Level 2)

**Status Filter** (reviewer labels):
- Awaiting Review, In Progress, Action Required, Escalated, Scheduled, Completed

### History

**Status: FINALIZED**

**Scope:** All records system-wide

**Tabs:**
- All 6 tabs available

**Type Filter:**
- Full list of all subtypes

**Status Filter:**
- All statuses: Draft, Submitted, Under Review, Action Required, Closed, Escalated

**Table Columns:**
- All columns: Title, Type, Status, Location, Owner, Updated

**Advanced Filters:**
- ALL available including closedBy (Level 3 closes records, so this filter is relevant for tracking their own closures)

---

## Summary: Key Differences Between Levels

| Feature | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| **Data scope** | Own reports only | System-wide | System-wide |
| **Status labels** | Simplified (5 labels) | Reviewer labels | Reviewer labels |
| **Report types visible** | Incidents (limited) + Tool Audit | All types | All types |
| **Dashboard stats** | Personalized "My" counts | System-wide counts | System-wide (Escalated instead of Critical) |
| **Dashboard bottom** | My Recent Reports list | Category Breakdown cards | Category Breakdown cards |
| **History tabs** | All, Incident, Audit | All 6 tabs | All 6 tabs |
| **Advanced filters** | Minimal (date, location, recordId) | Most (hide closedBy) | All filters |
| **Can close** | No | Yes | Yes |
| **Can escalate** | No | Yes (to L3) | No (already top) |
