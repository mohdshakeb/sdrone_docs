# Tool Audit — Product Requirements Document (PRD)

## 1. Overview

Tool Audit is a **planned assessment workflow** used to evaluate the condition of tools against predefined specifications and checkpoints. It follows the **Assessment Report archetype** and is initiated intentionally via **Start New**.

This PRD defines only the **creation and submission scope**. Post-submission workflows (review, action tracking, closure) will be defined later as a shared system model.

---

## 2. Entry & Access

* Entry point: **Start New → Tool Audit**
* Creation opens in a **dedicated page**
* Sidebar hidden during creation
* Available to authorised roles only (configured via roles & permissions)

---

## 3. Creation Flow

* Linear, section-based form
* No discovery or branching logic
* Checklist-driven
* User can save draft at any point

---

## 4. Form Sections & Fields

### 4.1 Audit Details

* Audit Type *(required)*

  * ETB
  * BCP / GCI
  * Workshop
  * Others *(configurable)*
* Audit Date *(required)*
* Audit Time *(required)*
* Audit Location *(required)*
* CSE Name *(required)*

---

### 4.2 Tools Checklist

The tools checklist is **auto-generated based on the selected Audit Type**. Each audit type maps to a **predefined, fixed set of tools** maintained in the system. Auditors cannot add or remove tools from this list.

On selecting an Audit Type (e.g., BCP / GCI), the system loads all associated tools into the checklist.

---

**Example: Tool Set — BCP / GCI (Sample)**
*(Illustrative only; actual list comes from tool master data)*

* Pressure Gauge (2½")
* Quick Coupler with 4 MTS
* Test Hose
* Hydraulic Hose Assembly
* Socket Set (½" Sq Drive – Metric)
* Torque Wrench
* Safety Lock Pins
* Allen Key Set
* Measuring Tape (calibrated)
* Hand Sledge Hammer

---

**Checklist Behaviour (Per Tool)**

For each tool (pre-populated):

* Tool Name *(system-defined)*
* Tool Condition *(required)*

  * Okay Condition
  * Damaged

If **Tool Condition = Damaged**:

* Remarks *(required)*
* Images *(required, one or more)*

Reference (read-only):

* Tool Specification
* Checkpoint Criteria

---

### 4.3 Overall Observations

* Overall Observations *(optional, multiline)*

---

### 4.4 Actions Required

This section can be added if issues are identified.

Each action item includes:

* Action Description *(required)*
* Responsibility *(required – user or role)*
* Target Date *(required)*

Multiple action items allowed.

---

### 4.5 Attachments

* Attachments *(optional)*

---

### 4.6 Review & Submit

System displays a summary of:

* Audit details
* Tools checked
* Damaged tools (if any)
* Actions created (if any)

Actions:

* Submit
* Save Draft
* Cancel

On submission:

* Audit is created
* Status set to **Submitted**
* Action items (if any) are generated for responsible users

---


## 6. System-Captured Metadata

* Audit ID
* Created by
* Created on
* Last updated on
* Status
* Action ownership
* Audit trail (all changes)

---

