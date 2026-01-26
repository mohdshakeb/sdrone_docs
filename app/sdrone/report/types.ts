/**
 * Incident Report Form Types
 */

// Incident categories
export type IncidentType = 'near-miss' | 'first-aid' | 'fir' | 'adr';

// Form step indices
export type FormStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Contributing factor types
export type ContributingFactor = 'UA' | 'UC' | 'both';

// Treatment levels
export type TreatmentLevel = 'first-aid' | 'medical' | 'hospital';

// Form data structure
export interface IncidentFormData {
    // Step 1: What Happened
    description: string;
    immediateAction: string;

    // Step 2: When & Where
    dateOccurred: string;
    timeOccurred: string;
    site: string;
    area: string;
    asset: string;

    // Step 3: Injury Check
    wasInjured: boolean | null;

    // Step 4: Injury Details (conditional)
    injuredEmployee: string;
    bodyPart: string;
    treatment: TreatmentLevel | null;

    // Step 5: Contributing Factors
    contributingFactor: ContributingFactor | null;
    contributingNotes: string;

    // Step 6: Evidence
    photos: File[];
    attachments: File[];

    // Step 7: Corrective Action
    correctiveAction: string;
}

// Initial form state
export const initialFormData: IncidentFormData = {
    description: '',
    immediateAction: '',
    dateOccurred: '',
    timeOccurred: '',
    site: '',
    area: '',
    asset: '',
    wasInjured: null,
    injuredEmployee: '',
    bodyPart: '',
    treatment: null,
    contributingFactor: null,
    contributingNotes: '',
    photos: [],
    attachments: [],
    correctiveAction: '',
};

// Validation errors per step
export interface StepErrors {
    [key: string]: string;
}

// Form state
export interface FormState {
    data: IncidentFormData;
    currentStep: FormStep;
    errors: StepErrors;
    presetType: IncidentType | null;
    isSubmitted: boolean;
}

// Step configuration
export interface StepConfig {
    id: FormStep;
    title: string;
    isConditional?: boolean;
    condition?: (data: IncidentFormData) => boolean;
}

// Body part option
export interface BodyPartOption {
    value: string;
    label: string;
}

// Site option
export interface SiteOption {
    value: string;
    label: string;
}
