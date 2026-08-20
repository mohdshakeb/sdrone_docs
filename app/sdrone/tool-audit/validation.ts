/**
 * Tool Audit Form Validation
 */

import type { StepId, ToolAuditFormData, StepErrors } from './types';

export function validateStep(step: StepId, data: ToolAuditFormData): StepErrors {
    const errors: StepErrors = {};

    switch (step) {
        case 'entry':
            if (!data.auditType) {
                errors.auditType = 'Please select a check sheet type';
            }
            break;

        case 'audit-details':
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
                errors.cseName = 'CSE Name is required';
            }
            break;

        case 'tools-checklist':
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

        case 'conclusion':
            if (!data.targetDate) {
                errors.targetDate = 'Target date is required';
            }
            break;

        case 'review':
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

export function isStepFullyComplete(stepId: StepId, data: ToolAuditFormData): boolean {
    if (stepHasErrors(validateStep(stepId, data))) return false;

    switch (stepId) {
        case 'conclusion':
            return !!(
                data.observations.trim() &&
                data.actionRequired.trim() &&
                data.responsibility.trim()
            );
        default:
            return true;
    }
}

export function validateForm(data: ToolAuditFormData): StepErrors {
    const allErrors: StepErrors = {};
    const stepsToValidate: StepId[] = ['entry', 'audit-details', 'tools-checklist', 'conclusion'];
    for (const step of stepsToValidate) {
        Object.assign(allErrors, validateStep(step, data));
    }
    return allErrors;
}
