# Feature: Progressive Incident Reporting Form

## Overview
A multi-step, system-led incident reporting form that intelligently determines the incident category (Near Miss, First Aid, FIR, ADR) based on user responses, eliminating the need for users to categorize incidents upfront.

## User Story
As a safety officer or employee, I want to report an incident without knowing its formal category, so that I can focus on describing what happened while the system correctly classifies the incident based on my responses.

---

## Requirements

### Must Have
- 8-step progressive form with conditional logic
- System-inferred categorization (Near Miss, First Aid, FIR, ADR)
- "Not sure" flow as the default user journey
- Full-screen dedicated creation page (no sidebar)
- Step-by-step navigation with Next/Review/Submit buttons
- Client-side validation for required fields
- Dark mode support
- Mobile responsive design
- Final review screen showing all entered data and system-determined category

### Should Have
- Form state persistence (if user navigates away accidentally)
- Field-level validation with helpful error messages
- Visual progress indicator showing current step
- Ability to go back to previous steps
- Auto-save draft functionality

### Must NOT Have
- Backend data submission (prototype only - mock the submission)
- Authentication or user management
- Real file upload (use file input UI only)
- Real employee lookup (use mock data or simple text input)
- Database persistence
- Email notifications

---

## Flow Structure

### Entry Point
**Trigger:** User clicks "Report Incident" button  
**Action:** Opens a model with for options. If "Not sure is selected "Navigate to dedicated form page at `/sdrone/incidentForm` (or similar route)

### Step Sequence

```
Step 0: Entry (Landing)
   ↓
Step 1: What happened? (Always shown)
   ↓
Step 2: When & where (Always shown)
   ↓
Step 3: Injury check (Only in "Not sure" flow)
   ↓
   ├─→ [No injury] → Infers "Near Miss" → Skip to Step 5
   └─→ [Yes injury] → Continue to Step 4
   
Step 4: Injury details (Conditional - only if injured)
   ↓
   System infers: First Aid / FIR / ADR based on treatment
   ↓
Step 5: Contributing factors (Always shown)
   ↓
Step 6: Evidence (Always shown)
   ↓
Step 7: Suggested corrective action (Always shown)
   ↓
Step 8: Review & submit (Always shown)
```

---

## Detailed Step Specifications

### Step 0: Entry
**UI State:**
- Full-screen overlay or dedicated page
- No AppSidebar visible
- Custom header with:
  - "Report Incident" title
  - Close button (×) - returns to previous page
  - Submit button (disabled at this stage)

**Display:**
- Welcome message or instructions
- Primary CTA: "Start Report" button

---

### Step 1: What happened?
**Title:** "What happened?"

**Fields:**
1. **Incident description** (required)
   - Component: Textarea
   - Placeholder: "Describe the incident in detail..."
   - Min length: 10 characters
   - Max length: 1000 characters
   - Validation: Required, min length

2. **Immediate action taken** (optional)
   - Component: Textarea
   - Placeholder: "What immediate actions were taken?"
   - Max length: 500 characters

**Actions:**
- "Next" button (enabled only when required fields valid)

**Validation:**
- Show error below field if required field is empty on Next click
- Use existing design system error states

---

### Step 2: When & where
**Title:** "When and where did this happen?"

**Fields:**
1. **Date of occurrence** (required)
   - Component: Date picker
   - Validation: Cannot be future date, required
   - Default: Today's date

2. **Time of occurrence** (required)
   - Component: Time picker (HH:MM format)
   - Validation: Required
   - Default: Current time

3. **Site** (required)
   - Component: Select dropdown
   - Options: Mock data ["Site A", "Site B", "Site C", "Warehouse 1", "Warehouse 2"]
   - Validation: Required

4. **Area / Zone** (optional)
   - Component: Text input or Select
   - Placeholder: "e.g., Loading Bay, Floor 2, Zone B"

5. **Asset / Equipment** (optional)
   - Component: Text input or Select
   - Placeholder: "e.g., Forklift #12, Conveyor Belt 3"

**Actions:**
- "Back" button (returns to Step 1, preserves data)
- "Next" button (enabled only when required fields valid)

---

### Step 3: Injury check
**Title:** "Was anyone injured?"

**Critical:** This step only appears in the "Not sure" flow

**Fields:**
1. **Injury status** (required)
   - Component: Radio button group (large, clear selection)
   - Options:
     - ○ Yes, someone was injured
     - ○ No, no injuries occurred

**System Logic:**
- If user selects **"No"**:
  - System categorizes as: **Near Miss**
  - Skip Step 4 (Injury details)
  - Proceed directly to Step 5 (Contributing factors)
  
- If user selects **"Yes"**:
  - Continue to Step 4 (Injury details)

**Actions:**
- "Back" button
- "Next" button (enabled when selection made)

---

### Step 4: Injury details
**Title:** "Tell us about the injury"

**Display Condition:** Only shown if Step 3 = "Yes, someone was injured"

**Fields:**
1. **Injured employee** (required)
   - Component: Text input or Select (autocomplete if possible)
   - Placeholder: "Employee name or ID"
   - Validation: Required

2. **Injured body part** (required)
   - Component: Select dropdown or multi-select
   - Options: ["Head", "Eyes", "Face", "Neck", "Shoulder", "Arm", "Hand", "Fingers", "Back", "Chest", "Abdomen", "Leg", "Knee", "Foot", "Toes", "Multiple areas"]
   - Validation: Required

3. **Treatment provided** (required)
   - Component: Radio button group
   - Options:
     - ○ First aid only
     - ○ Medical treatment (clinic/doctor visit)
     - ○ Hospitalisation

**System Inference Logic:**
- **First aid only** → Categorize as: **First Aid**
- **Medical treatment** → Categorize as: **FIR** (First Injury Report) candidate
- **Hospitalisation** → Categorize as: **ADR** (Accident/Dangerous Occurrence Report) candidate

**Actions:**
- "Back" button
- "Next" button (enabled when all required fields valid)

---

### Step 5: Contributing factors
**Title:** "What contributed to this incident?"

**Fields:**
1. **Contributing factor** (required)
   - Component: Radio button group or Select
   - Options:
     - ○ Unsafe Act (UA)
     - ○ Unsafe Condition (UC)
     - ○ Both
   - Validation: Required

2. **Notes** (optional)
   - Component: Textarea
   - Placeholder: "Provide additional context about the contributing factors..."
   - Max length: 500 characters

**Actions:**
- "Back" button
- "Next" button

---

### Step 6: Evidence
**Title:** "Add supporting evidence"

**Fields:**
1. **Incident photos** (optional)
   - Component: File input (multiple)
   - Accepted formats: .jpg, .jpeg, .png, .heic
   - Max files: 5
   - Note: For prototype, just show file input UI - don't actually upload

2. **Attachments** (optional)
   - Component: File input (multiple)
   - Accepted formats: .pdf, .doc, .docx, .xls, .xlsx
   - Max files: 3
   - Note: For prototype, just show file input UI - don't actually upload

**UI Pattern:**
- Drag-and-drop zone or "Choose files" button
- Show file names after selection
- Allow removal of selected files

**Actions:**
- "Back" button
- "Next" button (always enabled, fields optional)

---

### Step 7: Suggested corrective action
**Title:** "Suggest a corrective action"

**Fields:**
1. **Suggested corrective action** (optional)
   - Component: Textarea
   - Placeholder: "What actions should be taken to prevent this from happening again?"
   - Max length: 1000 characters

**Actions:**
- "Back" button
- "Review" button (changes from "Next" to "Review")

---

### Step 8: Review & submit
**Title:** "Review your report"

**Display:**
A read-only summary of all entered information, organized into sections:

**Section 1: Incident Details**
- Description
- Immediate action taken

**Section 2: When & Where**
- Date of occurrence
- Time of occurrence
- Site
- Area/Zone (if provided)
- Asset/Equipment (if provided)

**Section 3: Injury Information** (if applicable)
- Injury status: Yes/No
- If Yes:
  - Injured employee
  - Body part affected
  - Treatment provided

**Section 4: Analysis**
- Contributing factor (UA/UC/Both)
- Contributing factor notes

**Section 5: Evidence**
- Number of photos attached
- Number of documents attached
- File names (if any)

**Section 6: Corrective Action**
- Suggested corrective action (if provided)

**Section 7: System Classification**
- **Incident Type:** [Near Miss / First Aid / FIR / ADR]
  - Display as prominent Badge component
  - Use appropriate color: gray for Near Miss, yellow for First Aid, orange for FIR, red for ADR

**Actions:**
- "Back to edit" button (returns to previous step)
- "Submit Report" button (primary action)

**On Submit:**
1. Show loading state on button
2. Mock submission delay (1-2 seconds)
3. Show success message
4. Redirect to Inbox or show confirmation screen

---

## Design Specifications

### Layout
- **Full-screen form page**
  - No AppSidebar (hide completely)
  - Custom form header component
  - Content area centered, max-width: 640px
  - Generous padding and spacing

### Form Header Component
```
┌─────────────────────────────────────────┐
│  ×  Report Incident         [Submit]    │
└─────────────────────────────────────────┘
```
- Close button (×) - left aligned
- Title "Report Incident" - center or left after close button
- Submit button - right aligned, disabled until final review

### Progress Indicator
- Show current step / total steps (e.g., "Step 2 of 8")
- Optional: Visual progress bar or step dots
- Use subtle styling, don't overpower content

### Field Styling
- Use existing form component patterns from design system
- Labels: Use `.text-body-strong` or similar
- Required fields: Show asterisk (*) or "(required)" label
- Error states: Use `--fg-error` and `--border-error` tokens
- Spacing: Follow 4px grid, generous spacing between fields

### Button Layout
- Navigation buttons at bottom of each step
- "Back" button: Secondary style (ghost or outlined)
- "Next"/"Review"/"Submit" button: Primary style
- Align right or center based on design system pattern

### Validation & Errors
- Inline validation on blur (check field after user leaves it)
- Error messages below field in `--fg-error` color
- Disabled "Next" button until required fields are valid
- Clear, helpful error messages (e.g., "Please describe what happened")

### Mobile Responsive
- Stack all fields vertically on mobile
- Full-width inputs and buttons
- Reduce padding on smaller screens
- Ensure touch-friendly tap targets (min 44px height)

---

## Technical Specifications

### Routing
- Create new route: `/app/sdrone/report/page.tsx`
- Or use modal/overlay pattern if preferred

### State Management
- Use React state to manage:
  - Current step (1-8)
  - Form data object
  - Validation errors
  - System-inferred category
- Consider useReducer for complex state logic

### Form Data Structure
```typescript
interface IncidentFormData {
  // Step 1
  description: string;
  immediateAction?: string;
  
  // Step 2
  dateOccurred: string; // ISO date
  timeOccurred: string; // HH:MM
  site: string;
  area?: string;
  asset?: string;
  
  // Step 3 & 4
  wasInjured?: boolean;
  injuredEmployee?: string;
  bodyPart?: string;
  treatment?: 'first-aid' | 'medical' | 'hospital';
  
  // Step 5
  contributingFactor: 'UA' | 'UC' | 'both';
  contributingNotes?: string;
  
  // Step 6
  photos?: File[];
  attachments?: File[];
  
  // Step 7
  correctiveAction?: string;
  
  // System-determined
  incidentType?: 'near-miss' | 'first-aid' | 'fir' | 'adr';
  status: 'draft' | 'submitted';
}
```

### Components to Create
1. **`IncidentReportForm.tsx`** - Main form container
2. **`FormHeader.tsx`** - Custom header for form page
3. **`FormStep.tsx`** - Reusable step wrapper (optional)
4. **`ProgressIndicator.tsx`** - Shows current step
5. **Step components:**
   - `StepWhatHappened.tsx`
   - `StepWhenWhere.tsx`
   - `StepInjuryCheck.tsx`
   - `StepInjuryDetails.tsx`
   - `StepContributingFactors.tsx`
   - `StepEvidence.tsx`
   - `StepCorrectiveAction.tsx`
   - `StepReview.tsx`

### Validation Logic
```typescript
const validateStep = (step: number, data: IncidentFormData): boolean => {
  switch(step) {
    case 1:
      return data.description.length >= 10;
    case 2:
      return !!(data.dateOccurred && data.timeOccurred && data.site);
    case 3:
      return data.wasInjured !== undefined;
    case 4:
      if (!data.wasInjured) return true; // Skip if no injury
      return !!(data.injuredEmployee && data.bodyPart && data.treatment);
    case 5:
      return !!data.contributingFactor;
    case 6:
      return true; // All optional
    case 7:
      return true; // Optional
    default:
      return true;
  }
};
```

### Category Inference Logic
```typescript
const inferIncidentType = (data: IncidentFormData): string => {
  // If no injury, it's a near miss
  if (data.wasInjured === false) {
    return 'near-miss';
  }
  
  // If injured, check treatment level
  if (data.wasInjured === true) {
    switch(data.treatment) {
      case 'first-aid':
        return 'first-aid';
      case 'medical':
        return 'fir';
      case 'hospital':
        return 'adr';
      default:
        return 'first-aid';
    }
  }
  
  // Default fallback
  return 'near-miss';
};
```

---

## Design Tokens & Styling

### Colors
- Use semantic tokens only
- Error states: `--fg-error`, `--border-error`, `--bg-error-subtle`
- Success (on submit): `--fg-success`, `--bg-success-subtle`
- Disabled states: `--fg-disabled`, `--bg-disabled`
- Badge colors for incident types:
  - Near Miss: Use existing gray badge
  - First Aid: Use existing yellow/warning badge
  - FIR: Use existing orange badge (or create if needed - **ask first**)
  - ADR: Use existing red/error badge

### Typography
- Form labels: `.text-body-strong`
- Field values: `.text-body`
- Helper text: `.text-caption`
- Error messages: `.text-caption` with `--fg-error`
- Section headings (review): `.text-heading` or appropriate size

### Spacing
- Between fields: `--space-4` or `--space-6`
- Between sections: `--space-8` or `--space-12`
- Button spacing: `--space-3` gap between buttons

---

## Accessibility Requirements

### Keyboard Navigation
- All form fields must be keyboard accessible
- Tab order follows visual flow
- Enter key submits current step (triggers Next/Review/Submit)
- Escape key closes form (triggers Close button)

### ARIA Labels
- Form landmark: `<form role="form" aria-label="Incident Report">`
- Progress indicator: `aria-label="Step 2 of 8"`
- Required fields: `aria-required="true"`
- Error messages: `aria-invalid="true"` + `aria-describedby="error-id"`

### Focus Management
- Focus first field when step loads
- Focus first error on validation failure
- Focus management when navigating back

### Screen Reader Support
- Announce step changes
- Announce validation errors
- Announce success on submission

---

## User Experience Considerations

### Error Handling
- Show validation errors only after user attempts to proceed
- Clear, actionable error messages
- Highlight invalid fields
- Prevent form submission if validation fails

### Loading States
- Show loading spinner on Submit button during mock submission
- Disable Submit button while processing

### Success State
- Show success message after submission
- Provide clear next action (e.g., "View in Inbox")
- Option: Show incident ID or reference number

### Data Loss Prevention
- Warn user if they try to close with unsaved data
- Optional: Save draft to localStorage

---

## Acceptance Criteria

- [ ] All 8 steps render correctly with proper field types
- [ ] Required field validation works on each step
- [ ] Cannot proceed to next step without completing required fields
- [ ] "Back" button navigates to previous step and preserves data
- [ ] Step 3 (Injury check) only shows in "Not sure" flow
- [ ] If "No injury" selected, form skips Step 4
- [ ] If "Yes injury" selected, Step 4 shows with all fields
- [ ] System correctly infers incident type based on responses:
  - No injury → Near Miss
  - First aid → First Aid
  - Medical → FIR
  - Hospital → ADR
- [ ] Review screen shows all entered data accurately
- [ ] Review screen displays correct incident type badge
- [ ] Form works in light mode
- [ ] Form works in dark mode
- [ ] Form is responsive on mobile (375px+)
- [ ] Form is responsive on tablet (768px+)
- [ ] All buttons have proper hover/focus/active states
- [ ] Keyboard navigation works throughout form
- [ ] Error messages are clear and helpful
- [ ] Submit shows loading state
- [ ] Submit shows success message
- [ ] No TypeScript errors
- [ ] No console errors or warnings
- [ ] Follows existing component patterns
- [ ] Uses only semantic tokens (no hardcoded colors)

---

## Files to Create/Modify

### New Files
```
app/sdrone/report/
├── page.tsx                          # Main form page route
└── components/
    ├── IncidentReportForm.tsx        # Form container with step logic
    ├── FormHeader.tsx                # Custom header (Close/Submit)
    ├── ProgressIndicator.tsx         # Step progress UI
    └── steps/
        ├── StepWhatHappened.tsx      # Step 1
        ├── StepWhenWhere.tsx         # Step 2
        ├── StepInjuryCheck.tsx       # Step 3
        ├── StepInjuryDetails.tsx     # Step 4
        ├── StepContributingFactors.tsx # Step 5
        ├── StepEvidence.tsx          # Step 6
        ├── StepCorrectiveAction.tsx  # Step 7
        └── StepReview.tsx            # Step 8
```

### Potential Shared Components
```
components/ui/
├── FormField.tsx              # Reusable form field wrapper (if needed)
├── FileUpload.tsx             # File upload UI component (if needed)
└── DateTimePicker.tsx         # Date/time picker (if needed)
```

### Files to Modify
- `app/sdrone/inbox/page.tsx` - Add "Report Incident" button that links to `/sdrone/report`
- Update routing/navigation as needed

---

## Mock Data

### Sites (Step 2)
```typescript
const mockSites = [
  "Site A - Manufacturing",
  "Site B - Warehouse",
  "Site C - Distribution Center",
  "Warehouse 1",
  "Warehouse 2",
  "Head Office"
];
```

### Body Parts (Step 4)
```typescript
const mockBodyParts = [
  "Head", "Eyes", "Face", "Neck", 
  "Shoulder", "Arm", "Elbow", "Hand", "Fingers",
  "Back", "Chest", "Abdomen",
  "Hip", "Leg", "Knee", "Ankle", "Foot", "Toes",
  "Multiple areas"
];
```

---

## Future Enhancements (Out of Scope for V1)

- Auto-save draft functionality
- Ability to save as draft and resume later
- Real-time collaboration (multiple users on same report)
- Attachment preview before upload
- Integration with employee directory for injured person lookup
- Analytics on incident types and patterns
- Email notifications on submission
- Workflow routing based on incident severity
- Witness information section
- Risk assessment matrix

---

## Notes

### Implementation Priority
1. Build basic step navigation shell first (all 8 steps, minimal fields)
2. Add field validation logic
3. Implement conditional logic (injury check branching)
4. Add category inference
5. Build review screen
6. Polish UI/UX and error handling
7. Add accessibility features
8. Mobile responsive refinements

### Design Questions to Resolve
- Should form be a full page or modal overlay?
- Preferred progress indicator style (dots, bar, text only)?
- File upload component design (drag-drop, button, or both)?
- Success confirmation: stay on page or redirect to inbox?

### Technical Considerations
- Consider using a form library like React Hook Form for validation
- LocalStorage for draft saving (optional enhancement)
- Consider multi-step form state management patterns
- Ensure smooth transitions between steps (avoid jarring layout shifts)

---

## References

- Original spec: `form.md`
- Related components: Button, Badge, FilterChip, Icon components in design system
- Existing forms/inputs in S-Drone prototype (if any)

---

**Last Updated:** [Date]  
**Status:** Draft  
**Priority:** High  
**Estimated Complexity:** High (multi-step form with complex conditional logic)