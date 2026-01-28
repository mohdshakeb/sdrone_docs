# Product Requirements Document (PRD)

## Safety Management SaaS — History Page (v1)

---

## 1. Purpose

This PRD defines the **History page** for the Safety Management SaaS. It is intended for **frontend engineering implementation** and includes:

* Page structure
* UI elements
* Data requirements
* Interaction behaviour
* Edge cases

This document **replaces the previous PRD content** and focuses **only** on the History page, based on locked decisions.

---

## 2. Role of the History Page

**History is the system of record.**

It is used to:

* Retrieve past and ongoing records
* Inspect reports and processes across time
* Support audits, investigations, and compliance

It is **not**:

* A task list
* A primary action surface
* A creation entry point

Inbox remains the primary action workspace.

---

## 3. Page Placement & Frame

* History is a **primary navigation destination** (sidebar)
* No internal page header
* Page title **“History”** appears in the global app header

---

## 4. Segmented Tabs (Type Filters)

### Purpose

Provide high-level filtering by domain without fragmenting data.

### Tabs (left to right)

* All (default)
* Incident
* Audit
* Compliance
* Toolbox Talk
* Permit to Work

### Behaviour

* Tabs apply predefined filters only
* Tabs do **not** change table structure or columns
* Switching tabs resets pagination but preserves other filters

---

## 5. Top Control Bar

### 5.1 Search

* Global text search
* Searches across:

  * Title
  * Description
  * Record ID
* Debounced input
* Works in combination with all filters

---

### 5.2 Primary Filters (Always Visible)

* **Type (Multi select)**

  * Incident: Near Miss, First Aid, FIR
  * Audit: Safety Audit, Tool Audit
  * Compliance: Meetings, Health Check, Audit
  * Permit: General Work, Cold Work, Hot Work, Height Work
  * Toolbox Talk: Hide Type filter
  * All: All sub under appropriate sections

* **Status**

  * Draft
  * Submitted
  * Under Review
  * Action Required
  * Closed
  * Escalated

* **Location**

  * Site / Location entity

* **Date Range**

  * Created date
  * Last updated date

---

### 5.3 Advanced Filters (Drawer / Popover)

* Reported by
* Owner
* Closed by
* Severity (if available)
* SLA breached (boolean)
* Record ID (exact match)

---

## 6. Table Layout

### 6.1 Layout Choice

* Table / table-list (not cards)
* Optimised for density, scanning, and comparison

---

### 6.2 Columns (Left → Right)

#### 1. Title

* Human-readable title
* Single line, truncated
* Tooltip shows full title

#### 2. Type

* Record type label
* Examples: Near Miss, FIR, Safety Audit, Permit
* Optional subtle icon

#### 3. Status

* Current lifecycle state
* Text-only, neutral colour

#### 4. Location

* Primary location name
* Optional secondary line (area / zone)

#### 5. Owner / Closed By

* If record is open → current owner
* If record is closed → user who closed it
* Tooltip shows:

  * Role
  * Timestamp (for closed records)

#### 6. Last Updated

* Relative timestamp (e.g. “2 days ago”)
* Absolute timestamp on hover

###

---

## 7. Sorting

* Default sort: **Last Updated (descending)**
* User may change sort per column
* Sorting persists during session

---

## 8. Row Interaction

### 8.1 Click Behaviour

* Entire row is clickable
* Opens **full-page Record Detail view**

### 8.2 Inline Actions

* No inline actions in table
* No approve / comment / close buttons in rows

Rationale: Prevent accidental actions and keep History read-focused.

---

## 9. Record Detail View (From History)

### 9.1 Layout

* Opens as a **dedicated full page**
* Same content structure as Inbox detail panel
* Wider layout for inspection

---

### 9.2 Next Step Section

If the record is **not closed**:

* Display a contextual **Next step** banner at top
* Examples:

  * “Awaiting your review”
  * “Action required from Safety Officer”

If user has permission:

* Show primary CTA (e.g. Review, Approve)

If user does not have permission:

* Show responsible role/person

---

### 9.3 Audit Trail (Mandatory)

* Always available in detail view
* Collapsed by default

Includes:

* Status changes
* Ownership changes
* Escalations (e.g. FIR → ADR)
* Timestamp
* Actor (user + role)

---

## 11. Empty & Loading States

### Empty State

* Message: “No records found”
* Helper text: “Try adjusting filters or search”
* No creation CTA

### Loading State

* Skeleton rows
* Column headers visible

---

## 12. Non-Goals (Explicit)

* No record creation from History
* No inline editing

##

This PRD reflects **final, locked requirements** for the History page and is safe for frontend implementation.
