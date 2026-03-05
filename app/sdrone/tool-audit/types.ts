/**
 * Tool Audit Form Types
 */

// Audit type categories
export type AuditType = 'etb' | 'bcp-gci' | 'workshop' | 'others';

// Tool condition assessment
export type ToolCondition = 'okay' | 'damaged';

// Single tool in the checklist
export interface ToolChecklistEntry {
    toolId: string;
    toolName: string;
    specification: string;
    checkpoint: string;
    condition: ToolCondition | null;
    remarks: string;
    images: File[];
}

// Action item
export interface ActionItem {
    id: string;
    description: string;
    responsibility: string;
    targetDate: string;
}

// Form steps (0-5)
export type FormStep = 0 | 1 | 2 | 3 | 4 | 5;

// Full form data
export interface ToolAuditFormData {
    // Step 1: Audit Details
    auditType: AuditType | '';
    auditDate: string;
    auditTime: string;
    auditLocation: string;
    cseName: string;

    // Step 2: Tools Checklist
    toolsChecklist: ToolChecklistEntry[];

    // Step 3: Observations & Actions
    overallObservations: string;
    actions: ActionItem[];

    // Step 4: Attachments
    attachments: File[];
}

// Initial form state
export const initialFormData: ToolAuditFormData = {
    auditType: '',
    auditDate: '',
    auditTime: '',
    auditLocation: '',
    cseName: '',
    toolsChecklist: [],
    overallObservations: '',
    actions: [],
    attachments: [],
};

// Validation errors
export interface StepErrors {
    [key: string]: string;
}

// Form state
export interface FormState {
    data: ToolAuditFormData;
    currentStep: FormStep;
    errors: StepErrors;
    isSubmitted: boolean;
}

// Step configuration
export interface StepConfig {
    id: FormStep;
    title: string;
}
