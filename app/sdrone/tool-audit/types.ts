/**
 * Tool Audit Form Types
 */

import type {
    StepErrors,
    FormState as BaseFormState,
    BaseStepConfig,
} from '@/components/prototype/form/types';

export type { StepErrors };

// Audit type categories (maps to predefined check sheets)
export type AuditType = 'etb' | 'bcp-gci' | 'workshop' | 'rigging';

// Tool condition assessment
export type ToolCondition = 'good' | 'damaged';

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

// String-keyed step IDs
export type StepId =
    | 'entry'
    | 'audit-details'
    | 'tools-checklist'
    | 'conclusion'
    | 'review';

// Full form data
export interface ToolAuditFormData {
    // Entry: Check Sheet type (set before step 1)
    auditType: AuditType | '';

    // Step 1: Audit Details
    auditDate: string;
    auditTime: string;
    auditLocation: string;
    cseName: string;

    // Step 2: Tools Checklist
    toolsChecklist: ToolChecklistEntry[];

    // Step 3: Conclusion
    observations: string;
    actionRequired: string;
    responsibility: string;
    targetDate: string;
    attachments: File[];
}

export const initialFormData: ToolAuditFormData = {
    auditType: '',
    auditDate: '',
    auditTime: '',
    auditLocation: '',
    cseName: '',
    toolsChecklist: [],
    observations: '',
    actionRequired: '',
    responsibility: '',
    targetDate: '',
    attachments: [],
};

export type FormState = BaseFormState<ToolAuditFormData, StepId>;
export type StepConfig = BaseStepConfig<StepId>;
