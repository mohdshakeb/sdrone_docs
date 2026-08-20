/**
 * Incident Report Form Types
 */

import type {
    StepErrors,
    FormState as BaseFormState,
    BaseStepConfig,
} from '@/components/prototype/form/types';

export type { StepErrors };

// Incident categories
export type IncidentType = 'near-miss' | 'first-aid' | 'fir' | 'adr';

// String-keyed step IDs — one per distinct screen in the form
export type StepId =
    | 'entry'
    | 'fir-reference'
    | 'what-happened'
    | 'when-where'
    | 'injury-check'
    | 'injured-employee'
    | 'witnesses'
    | 'reason-and-loss'
    | 'observations'
    | 'event-details'
    | 'corrective-actions'
    | 'investigation-team'
    | 'evidence'
    | 'review';

// Repeatable row types

export interface InjuredEmployee {
    id: string;
    employeeId: string;
    hourWorkStarted: string;       // FIR, ADR
    activityAtTime: string;        // FIR, ADR
    injuryDescription: string;
    bodyPart: string;
    bodyPartOther: string;         // free text when bodyPart === 'other'
    treatment: string;             // First Aid variant
    usedFirstAidBox: string;       // First Aid: "Has used medicines from First Aid Box or visited Hospital?"
    medicineDetails: string;       // First Aid: medicine details
    doctorHospital: string;        // FIR, ADR
    lossTime: boolean | null;      // FIR, ADR
    lossTimeDays: number | null;   // FIR, ADR
}

export interface Witness {
    id: string;
    type: 'employee' | 'other';
    employeeId?: string;
    name?: string;
}

export interface CorrectiveAction {
    id: string;
    action: string;
    responsibilityEmployeeId: string;
    timeline: string;
}

export interface InvestigationMember {
    id: string;
    employeeId: string;
}

// Full form data
export interface IncidentFormData {
    // Entry
    selectedType: string | null;

    // What Happened
    description: string;
    immediateAction: string;

    // When & Where
    dateOccurred: string;
    timeOccurred: string;
    site: string;
    workstation: string;            // Near Miss — predefined list
    area: string;
    asset: string;
    exactPlace: string;             // FIR, ADR

    // Injury Check (Not Sure flow)
    wasInjured: boolean | null;
    treatmentLocation: 'on-site' | 'hospital' | null;

    // FIR Reference (ADR only — optional pre-fill)
    firReference: string | null;

    // Injured Employees
    injuredEmployees: InjuredEmployee[];

    // Witnesses (FIR, ADR)
    witnesses: Witness[];

    // Reason & Loss (FIR, ADR)
    machineryInvolved: boolean | null;
    machineName: string;
    machineMoving: boolean | null;
    propertyLoss: string;

    // Observations
    rootCause: string;
    contributingFactorsText: string;
    recommendedSolution: string;    // Near Miss, First Aid
    whyAnalysis: string;            // ADR

    // Event Details (ADR)
    chronologyOfEvents: string;

    // Corrective Actions
    correctiveActions: CorrectiveAction[];  // ADR: repeatable
    correctiveActionText: string;           // First Aid: simple text

    // Investigation Team (ADR)
    investigationTeam: InvestigationMember[];

    // Evidence
    photos: File[];
    attachments: File[];
}

export const initialFormData: IncidentFormData = {
    selectedType: null,
    description: '',
    immediateAction: '',
    dateOccurred: '',
    timeOccurred: '',
    site: '',
    area: '',
    asset: '',
    exactPlace: '',
    wasInjured: null,
    treatmentLocation: null,
    firReference: null,
    workstation: '',
    injuredEmployees: [],
    witnesses: [],
    machineryInvolved: null,
    machineName: '',
    machineMoving: null,
    propertyLoss: '',
    rootCause: '',
    contributingFactorsText: '',
    recommendedSolution: '',
    whyAnalysis: '',
    chronologyOfEvents: '',
    correctiveActions: [],
    correctiveActionText: '',
    investigationTeam: [],
    photos: [],
    attachments: [],
};

// Form state parameterised with string step IDs
export interface FormState extends BaseFormState<IncidentFormData, StepId> {
    presetType: IncidentType | null;
}

// Step config with string IDs
export interface StepConfig extends BaseStepConfig<StepId> {
    isConditional?: boolean;
}

// Option shapes (kept from mockData consumers)
export interface BodyPartOption {
    value: string;
    label: string;
}

export interface SiteOption {
    value: string;
    label: string;
}
