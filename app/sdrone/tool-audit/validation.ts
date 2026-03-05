/**
 * Tool Audit Form Validation
 */

import type { FormStep, ToolAuditFormData, StepErrors } from './types';

export function validateStep(step: FormStep, data: ToolAuditFormData): StepErrors {
    const errors: StepErrors = {};

    switch (step) {
        case 0:
            // Entry step — no validation
            break;

        case 1:
            // Audit Details
            if (!data.auditType) {
                errors.auditType = 'Audit type is required';
            }
            if (!data.auditDate) {
                errors.auditDate = 'Audit date is required';
            } else {
                const selectedDate = new Date(data.auditDate);
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                if (selectedDate > today) {
                    errors.auditDate = 'Date cannot be in the future';
                }
            }
            if (!data.auditTime) {
                errors.auditTime = 'Audit time is required';
            }
            if (!data.auditLocation) {
                errors.auditLocation = 'Location is required';
            }
            if (!data.cseName) {
                errors.cseName = 'CSE name is required';
            }
            break;

        case 2:
            // Tools Checklist
            for (const tool of data.toolsChecklist) {
                if (tool.condition === null) {
                    errors[`tool_${tool.toolId}_condition`] = 'Condition assessment is required';
                }
                if (tool.condition === 'damaged') {
                    if (!tool.remarks.trim()) {
                        errors[`tool_${tool.toolId}_remarks`] = 'Remarks are required for damaged tools';
                    }
                    if (tool.images.length === 0) {
                        errors[`tool_${tool.toolId}_images`] = 'At least one image is required for damaged tools';
                    }
                }
            }
            break;

        case 3:
            // Observations & Actions — observations optional
            // Validate action items if any exist
            for (const action of data.actions) {
                if (!action.description.trim()) {
                    errors[`action_${action.id}_description`] = 'Action description is required';
                }
                if (!action.responsibility.trim()) {
                    errors[`action_${action.id}_responsibility`] = 'Responsibility is required';
                }
                if (!action.targetDate) {
                    errors[`action_${action.id}_targetDate`] = 'Target date is required';
                }
            }
            break;

        case 4:
            // Attachments — optional, no validation
            break;

        case 5:
            // Review — no additional validation
            break;

        default:
            break;
    }

    return errors;
}

export function stepHasErrors(errors: StepErrors): boolean {
    return Object.keys(errors).length > 0;
}

export function getFieldError(errors: StepErrors, field: string): string | undefined {
    return errors[field];
}

export function validateForm(data: ToolAuditFormData): StepErrors {
    const allErrors: StepErrors = {};

    for (let step = 1; step <= 4; step++) {
        const stepErrors = validateStep(step as FormStep, data);
        Object.assign(allErrors, stepErrors);
    }

    return allErrors;
}
