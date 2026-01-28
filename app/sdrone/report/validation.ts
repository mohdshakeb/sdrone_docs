/**
 * Validation logic for incident report form
 */

import type { IncidentFormData, StepErrors, FormStep } from './types';

// Validation functions per step
export function validateStep(step: FormStep, data: IncidentFormData): StepErrors {
    const errors: StepErrors = {};

    switch (step) {
        case 0:
            // Entry step - no validation
            break;

        case 1:
            // What Happened
            if (!data.description.trim()) {
                errors.description = 'Description is required';
            } else if (data.description.trim().length < 10) {
                errors.description = 'Description must be at least 10 characters';
            } else if (data.description.length > 1000) {
                errors.description = 'Description must be less than 1000 characters';
            }
            break;

        case 2:
            // When & Where
            if (!data.dateOccurred) {
                errors.dateOccurred = 'Date is required';
            } else {
                const selectedDate = new Date(data.dateOccurred);
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                if (selectedDate > today) {
                    errors.dateOccurred = 'Date cannot be in the future';
                }
            }

            if (!data.timeOccurred) {
                errors.timeOccurred = 'Time is required';
            }

            if (!data.site) {
                errors.site = 'Site is required';
            }
            break;

        case 3:
            // Injury Check
            if (data.wasInjured === null) {
                errors.wasInjured = 'Please indicate if there was an injury';
            }
            break;

        case 4:
            // Injury Details (only if wasInjured is true or explicit first-aid)
            if (data.wasInjured || data.selectedType === 'first-aid') {
                if (!data.injuredEmployee.trim()) {
                    errors.injuredEmployee = 'Name of injured person is required';
                }
                if (!data.bodyPart) {
                    errors.bodyPart = 'Body part is required';
                }
                if (!data.treatment) {
                    errors.treatment = 'Treatment level is required';
                }
            }
            break;

        case 5:
            // First Aid Specifics (only for explicit first-aid type)
            if (data.selectedType === 'first-aid') {
                if (data.medicineUsed === null) {
                    errors.medicineUsed = 'Please indicate if medicine was used';
                }
                if (data.medicineUsed === true && !data.medicineDetails?.trim()) {
                    errors.medicineDetails = 'Please describe the medicine or treatment applied';
                }
            }
            break;

        case 6:
            // Contributing Factors
            if (!data.contributingFactor) {
                errors.contributingFactor = 'Contributing factor is required';
            }
            break;

        case 7:
            // Evidence - optional, no validation required
            break;

        case 8:
            // Corrective Action - optional, no validation required
            break;

        case 9:
            // Review - validate all required fields
            // This aggregates all step validations
            break;

        default:
            break;
    }

    return errors;
}

// Check if step has any errors
export function stepHasErrors(errors: StepErrors): boolean {
    return Object.keys(errors).length > 0;
}

// Get first error message for a field
export function getFieldError(errors: StepErrors, field: string): string | undefined {
    return errors[field];
}

// Validate entire form for submission
export function validateForm(data: IncidentFormData): StepErrors {
    const allErrors: StepErrors = {};

    // Steps 1-8 validation (excluding step 0 entry and step 9 review)
    for (let step = 1; step <= 8; step++) {
        // Skip steps based on selected type
        if (step === 3 && data.selectedType !== 'unsure' && data.selectedType !== null) {
            continue; // Skip injury check for explicit types
        }
        if (step === 5 && data.selectedType !== 'first-aid') {
            continue; // Skip first aid specifics unless first-aid type
        }
        if (step === 4 && !data.wasInjured && data.selectedType !== 'first-aid') {
            continue; // Skip injury details if no injury (unless first-aid)
        }

        const stepErrors = validateStep(step as FormStep, data);
        Object.assign(allErrors, stepErrors);
    }

    return allErrors;
}
