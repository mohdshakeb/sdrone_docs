/**
 * Shared multi-step form types.
 *
 * Generic skeleton used by the prototype's self-contained form flows
 * (e.g. app/sdrone/report, app/sdrone/tool-audit). Each feature parameterises
 * these with its own data type and step union, then adds feature-specific
 * fields by extension. Runtime form logic stays in each feature's hook.
 */

// Validation errors keyed by field/step id.
export interface StepErrors {
    [key: string]: string;
}

// Generic form state. TStep is the feature's literal step union (numeric or string).
export interface FormState<TData, TStep extends string | number = number> {
    data: TData;
    currentStep: TStep;
    errors: StepErrors;
    isSubmitted: boolean;
}

// Base step descriptor. Features extend this when they need conditional logic.
export interface BaseStepConfig<TStep extends string | number = number> {
    id: TStep;
    title: string;
}
