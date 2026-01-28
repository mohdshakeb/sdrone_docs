'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
    IncidentFormData,
    IncidentType,
    FormStep,
    StepErrors,
    FormState,
    StepConfig,
} from './types';
import { initialFormData } from './types';
import { validateStep, stepHasErrors, validateForm } from './validation';

// Step configuration
const STEP_CONFIGS: StepConfig[] = [
    { id: 0, title: 'Report an Incident' },
    { id: 1, title: 'What Happened?' },
    { id: 2, title: 'When & Where?' },
    {
        id: 3,
        title: 'Was Anyone Injured?',
        isConditional: true,
        condition: (data) => data.selectedType === 'unsure' || data.selectedType === null,
    },
    {
        id: 4,
        title: 'Injury Details',
        isConditional: true,
        condition: (data) => data.wasInjured === true || data.selectedType === 'first-aid',
    },
    {
        id: 5,
        title: 'First Aid Specifics',
        isConditional: true,
        condition: (data) => data.selectedType === 'first-aid',
    },
    { id: 6, title: 'Contributing Factors' },
    { id: 7, title: 'Evidence' },
    { id: 8, title: 'Corrective Action' },
    { id: 9, title: 'Review & Submit' },
];

interface UseIncidentFormOptions {
    presetType?: IncidentType | null;
}

interface UseIncidentFormReturn {
    // State
    data: IncidentFormData;
    currentStep: FormStep;
    errors: StepErrors;
    presetType: IncidentType | null;
    isSubmitted: boolean;
    selectedType: string | null;

    // Computed
    stepConfig: StepConfig;
    activeSteps: StepConfig[];
    totalSteps: number;
    currentStepIndex: number;
    canGoBack: boolean;
    canGoNext: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
    isReviewStep: boolean;
    inferredType: IncidentType;

    // Actions
    updateField: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
    goToStep: (step: FormStep) => void;
    goNext: () => boolean;
    goBack: () => void;
    submit: () => boolean;
    reset: () => void;
    validateCurrentStep: () => boolean;
    setSelectedType: (type: string) => void;
}

export function useIncidentForm(options: UseIncidentFormOptions = {}): UseIncidentFormReturn {
    const { presetType = null } = options;

    const [state, setState] = useState<FormState & { selectedType: string | null }>({
        data: initialFormData,
        currentStep: 0,
        errors: {},
        presetType,
        isSubmitted: false,
        selectedType: presetType ?? null,
    });

    // Get active steps (excluding conditionally skipped steps)
    const activeSteps = useMemo(() => {
        return STEP_CONFIGS.filter((step) => {
            if (!step.isConditional) return true;
            return step.condition?.(state.data) ?? true;
        });
    }, [state.data]);

    // Current step config
    const stepConfig = useMemo(() => {
        return STEP_CONFIGS.find((s) => s.id === state.currentStep) ?? STEP_CONFIGS[0];
    }, [state.currentStep]);

    // Current step index in active steps
    const currentStepIndex = useMemo(() => {
        return activeSteps.findIndex((s) => s.id === state.currentStep);
    }, [activeSteps, state.currentStep]);

    // Navigation state
    const totalSteps = activeSteps.length;
    const canGoBack = currentStepIndex > 0;
    const canGoNext = currentStepIndex < totalSteps - 1;
    const isFirstStep = state.currentStep === 0;
    const isLastStep = state.currentStep === 9;
    const isReviewStep = state.currentStep === 9;

    // Infer incident type based on form data
    const inferredType = useMemo((): IncidentType => {
        // If selected type is provided and not "unsure", use it
        if (state.selectedType && state.selectedType !== 'unsure') {
            return state.selectedType as IncidentType;
        }

        // If preset type is provided and not "not sure", use it
        if (presetType) {
            return presetType;
        }

        // No injury = Near Miss
        if (state.data.wasInjured === false) {
            return 'near-miss';
        }

        // Injury with treatment level determines category
        if (state.data.wasInjured === true && state.data.treatment) {
            switch (state.data.treatment) {
                case 'first-aid':
                    return 'first-aid';
                case 'medical':
                    return 'fir';
                case 'hospital':
                    return 'adr';
            }
        }

        // Default to near-miss if undetermined
        return 'near-miss';
    }, [state.selectedType, presetType, state.data.wasInjured, state.data.treatment]);

    // Update a single field
    const updateField = useCallback(<K extends keyof IncidentFormData>(
        field: K,
        value: IncidentFormData[K]
    ) => {
        setState((prev) => {
            // Create new errors object without the cleared field
            const newErrors = { ...prev.errors };
            delete newErrors[field];

            return {
                ...prev,
                data: {
                    ...prev.data,
                    [field]: value,
                },
                errors: newErrors,
            };
        });
    }, []);

    // Set selected incident type from entry step
    const setSelectedType = useCallback((type: string) => {
        setState((prev) => ({
            ...prev,
            selectedType: type,
            data: {
                ...prev.data,
                selectedType: type,
                // Auto-set treatment for explicit first-aid selection
                treatment: type === 'first-aid' ? 'first-aid' : prev.data.treatment,
            },
        }));
    }, []);

    // Validate current step
    const validateCurrentStep = useCallback((): boolean => {
        const errors = validateStep(state.currentStep, state.data);
        setState((prev) => ({
            ...prev,
            errors,
        }));
        return !stepHasErrors(errors);
    }, [state.currentStep, state.data]);

    // Go to a specific step
    const goToStep = useCallback((step: FormStep) => {
        setState((prev) => ({
            ...prev,
            currentStep: step,
            errors: {},
        }));
    }, []);

    // Go to next step
    const goNext = useCallback((): boolean => {
        // Validate current step first
        const errors = validateStep(state.currentStep, state.data);
        if (stepHasErrors(errors)) {
            setState((prev) => ({
                ...prev,
                errors,
            }));
            return false;
        }

        // Find next active step
        const currentIdx = activeSteps.findIndex((s) => s.id === state.currentStep);
        if (currentIdx < activeSteps.length - 1) {
            const nextStep = activeSteps[currentIdx + 1];
            setState((prev) => ({
                ...prev,
                currentStep: nextStep.id,
                errors: {},
            }));
            return true;
        }
        return false;
    }, [state.currentStep, state.data, activeSteps]);

    // Go to previous step
    const goBack = useCallback(() => {
        const currentIdx = activeSteps.findIndex((s) => s.id === state.currentStep);
        if (currentIdx > 0) {
            const prevStep = activeSteps[currentIdx - 1];
            setState((prev) => ({
                ...prev,
                currentStep: prevStep.id,
                errors: {},
            }));
        }
    }, [activeSteps, state.currentStep]);

    // Submit the form
    const submit = useCallback((): boolean => {
        const errors = validateForm(state.data);
        if (stepHasErrors(errors)) {
            setState((prev) => ({
                ...prev,
                errors,
            }));
            return false;
        }

        // Mock submission - just set submitted flag
        setState((prev) => ({
            ...prev,
            isSubmitted: true,
        }));
        return true;
    }, [state.data]);

    // Reset the form
    const reset = useCallback(() => {
        setState({
            data: initialFormData,
            currentStep: 0,
            errors: {},
            presetType,
            isSubmitted: false,
            selectedType: presetType ?? null,
        });
    }, [presetType]);

    return {
        // State
        data: state.data,
        currentStep: state.currentStep,
        errors: state.errors,
        presetType: state.presetType,
        isSubmitted: state.isSubmitted,
        selectedType: state.selectedType,

        // Computed
        stepConfig,
        activeSteps,
        totalSteps,
        currentStepIndex,
        canGoBack,
        canGoNext,
        isFirstStep,
        isLastStep,
        isReviewStep,
        inferredType,

        // Actions
        updateField,
        goToStep,
        goNext,
        goBack,
        submit,
        reset,
        validateCurrentStep,
        setSelectedType,
    };
}

export default useIncidentForm;
