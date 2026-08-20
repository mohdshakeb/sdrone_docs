/**
 * Validation logic for incident report form
 */

import type { IncidentFormData, StepErrors, StepId, IncidentType } from './types';

export function validateStep(
    stepId: StepId,
    data: IncidentFormData,
    inferredType?: IncidentType,
): StepErrors {
    const errors: StepErrors = {};

    switch (stepId) {
        case 'entry':
            // No validation — user must just select a type before the button enables
            break;

        case 'fir-reference':
            // Optional field — no validation
            break;

        case 'what-happened':
            if (!data.description.trim()) {
                errors.description = 'Description is required';
            } else if (data.description.trim().length < 10) {
                errors.description = 'Description must be at least 10 characters';
            } else if (data.description.length > 1000) {
                errors.description = 'Description must be less than 1000 characters';
            }
            break;

        case 'when-where': {
            if (!data.dateOccurred) {
                errors.dateOccurred = 'Date is required';
            } else {
                const selected = new Date(data.dateOccurred);
                const today = new Date();
                today.setHours(23, 59, 59, 999);
                if (selected > today) {
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
        }

        case 'injury-check':
            if (data.wasInjured === null) {
                errors.wasInjured = 'Please indicate if there was an injury';
            }
            if (data.wasInjured === true && data.treatmentLocation === null) {
                errors.treatmentLocation = 'Please indicate where the person was treated';
            }
            break;

        case 'injured-employee': {
            const isFirstAid = inferredType === 'first-aid';
            const employees = data.injuredEmployees;

            if (employees.length === 0) {
                errors['injuredEmployees'] = 'At least one injured person is required';
                break;
            }

            employees.forEach((emp, i) => {
                if (!emp.employeeId) {
                    errors[`injuredEmployees[${i}].employeeId`] = 'Employee is required';
                }
                if (!emp.injuryDescription.trim()) {
                    errors[`injuredEmployees[${i}].injuryDescription`] = 'Injury description is required';
                }
                if (!emp.bodyPart) {
                    errors[`injuredEmployees[${i}].bodyPart`] = 'Body part is required';
                }
                if (emp.bodyPart === 'other' && !emp.bodyPartOther.trim()) {
                    errors[`injuredEmployees[${i}].bodyPartOther`] = 'Please specify the body part';
                }
                if (!isFirstAid) {
                    if (!emp.hourWorkStarted) {
                        errors[`injuredEmployees[${i}].hourWorkStarted`] = 'Hour work started is required';
                    }
                    if (!emp.activityAtTime.trim()) {
                        errors[`injuredEmployees[${i}].activityAtTime`] = 'Activity at time of incident is required';
                    }
                    if (!emp.doctorHospital.trim()) {
                        errors[`injuredEmployees[${i}].doctorHospital`] = 'Doctor / hospital is required';
                    }
                    if (emp.lossTime === null) {
                        errors[`injuredEmployees[${i}].lossTime`] = 'Please indicate if there was loss of time';
                    }
                    if (emp.lossTime === true && (emp.lossTimeDays === null || emp.lossTimeDays <= 0)) {
                        errors[`injuredEmployees[${i}].lossTimeDays`] = 'Number of days lost is required';
                    }
                }
            });
            break;
        }

        case 'witnesses':
            // Optional step — validate only filled rows
            data.witnesses.forEach((w, i) => {
                if (w.type === 'employee' && !w.employeeId) {
                    errors[`witnesses[${i}].employeeId`] = 'Select an employee or change type to Other';
                }
                if (w.type === 'other' && !w.name?.trim()) {
                    errors[`witnesses[${i}].name`] = 'Witness name is required';
                }
            });
            break;

        case 'reason-and-loss':
            if (data.machineryInvolved === null) {
                errors.machineryInvolved = 'Please indicate if machinery was involved';
            }
            if (data.machineryInvolved === true) {
                if (!data.machineName.trim()) {
                    errors.machineName = 'Machine name is required';
                }
                if (data.machineMoving === null) {
                    errors.machineMoving = 'Please indicate if the machine was in motion';
                }
            }
            break;

        case 'observations':
            if (!data.rootCause.trim()) {
                errors.rootCause = 'Root cause is required';
            }
            if (!data.contributingFactorsText.trim()) {
                errors.contributingFactorsText = 'Contributing factors are required';
            }
            break;

        case 'event-details':
            if (!data.chronologyOfEvents.trim()) {
                errors.chronologyOfEvents = 'Chronology of events is required';
            }
            break;

        case 'corrective-actions':
            if (inferredType === 'adr') {
                data.correctiveActions.forEach((a, i) => {
                    if (!a.action.trim()) {
                        errors[`correctiveActions[${i}].action`] = 'Action description is required';
                    }
                    if (!a.responsibilityEmployeeId) {
                        errors[`correctiveActions[${i}].responsibilityEmployeeId`] = 'Responsible person is required';
                    }
                    if (!a.timeline) {
                        errors[`correctiveActions[${i}].timeline`] = 'Target date is required';
                    }
                });
            }
            // First Aid: optional
            break;

        case 'investigation-team': {
            const members = data.investigationTeam;
            if (members.length === 0 || !members[0]?.employeeId) {
                errors['investigationTeam[0].employeeId'] = 'At least one investigation team member is required';
            }
            members.forEach((m, i) => {
                if (!m.employeeId) {
                    errors[`investigationTeam[${i}].employeeId`] = 'Employee is required';
                }
            });
            break;
        }

        case 'evidence':
            // Optional — no validation
            break;

        case 'review':
            // Review step — no field validation; submit validates the full form
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

export function isStepFullyComplete(
    stepId: StepId,
    data: IncidentFormData,
    inferredType?: IncidentType,
): boolean {
    if (stepHasErrors(validateStep(stepId, data, inferredType))) return false;

    switch (stepId) {
        case 'fir-reference':
            return !!(data.firReference?.trim());
        case 'what-happened':
            return !!data.immediateAction.trim();
        case 'when-where': {
            const base = !!(data.area.trim() && data.asset.trim());
            if (inferredType === 'near-miss') return base && !!data.workstation;
            if (inferredType === 'fir' || inferredType === 'adr') return base && !!data.exactPlace.trim();
            return base;
        }
        case 'witnesses':
            return data.witnesses.length > 0;
        case 'reason-and-loss':
            return !!data.propertyLoss.trim();
        case 'observations':
            if (inferredType === 'adr') return !!(data.recommendedSolution.trim() && data.whyAnalysis.trim());
            return !!data.recommendedSolution.trim();
        case 'corrective-actions':
            if (inferredType !== 'adr') return !!data.correctiveActionText.trim();
            return true;
        case 'evidence':
            return data.photos.length > 0 || data.attachments.length > 0;
        default:
            return true;
    }
}

export function validateForm(data: IncidentFormData, inferredType: IncidentType): StepErrors {
    const allErrors: StepErrors = {};

    const stepsToValidate: StepId[] = [
        'what-happened',
        'when-where',
        'injured-employee',
        'reason-and-loss',
        'observations',
        'event-details',
        'corrective-actions',
        'investigation-team',
    ];

    for (const stepId of stepsToValidate) {
        // Skip steps that don't apply to the current type
        if (stepId === 'injured-employee' && inferredType === 'near-miss') continue;
        if (stepId === 'reason-and-loss' && (inferredType === 'near-miss' || inferredType === 'first-aid')) continue;
        if (stepId === 'observations' && inferredType === 'fir') continue;
        if (stepId === 'event-details' && inferredType !== 'adr') continue;
        if (stepId === 'investigation-team' && inferredType !== 'adr') continue;

        const stepErrors = validateStep(stepId, data, inferredType);
        Object.assign(allErrors, stepErrors);
    }

    return allErrors;
}
