'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
    IncidentFormData,
    IncidentType,
    StepId,
    StepErrors,
    FormState,
    StepConfig,
} from './types';
import { initialFormData } from './types';
import { validateStep, stepHasErrors, validateForm, isStepFullyComplete } from './validation';

// Step metadata (title only — sequencing is done by the arrays below)
const STEP_META: Record<StepId, string> = {
    'entry':               'Report an Incident',
    'fir-reference':       'FIR Reference',
    'what-happened':       'What Happened?',
    'when-where':          'When & Where?',
    'injury-check':        'Was Anyone Injured?',
    'injured-employee':    'Injured Employee',
    'witnesses':           'Witnesses',
    'reason-and-loss':     'Reason & Loss',
    'observations':        'Observations',
    'event-details':       'Event Details',
    'corrective-actions':  'Corrective Actions',
    'investigation-team':  'Investigation Team',
    'evidence':            'Evidence',
    'review':              'Review & Submit',
};

// Explicit step sequences per incident type — 'review' is always the final step
const SEQUENCES: Record<IncidentType | 'unsure', StepId[]> = {
    'near-miss': ['entry', 'what-happened', 'when-where', 'observations', 'evidence', 'review'],
    'first-aid': ['entry', 'what-happened', 'when-where', 'injured-employee', 'observations', 'corrective-actions', 'evidence', 'review'],
    'fir':       ['entry', 'what-happened', 'when-where', 'injured-employee', 'witnesses', 'reason-and-loss', 'evidence', 'review'],
    'adr':       ['entry', 'fir-reference', 'what-happened', 'when-where', 'injured-employee', 'witnesses', 'reason-and-loss', 'observations', 'event-details', 'corrective-actions', 'investigation-team', 'evidence', 'review'],
    'unsure':    ['entry', 'what-happened', 'when-where', 'injury-check'], // tail appended dynamically
};

// Tails appended after injury-check for the Not Sure flow
const NOT_SURE_TAILS: Record<IncidentType, StepId[]> = {
    'near-miss': ['observations', 'evidence', 'review'],
    'first-aid': ['injured-employee', 'observations', 'corrective-actions', 'evidence', 'review'],
    'fir':       ['injured-employee', 'witnesses', 'reason-and-loss', 'evidence', 'review'],
    'adr':       [], // ADR is not reachable via Not Sure
};

function inferTypeFromQ1Q2(
    wasInjured: boolean | null,
    treatmentLocation: 'on-site' | 'hospital' | null,
): IncidentType {
    if (wasInjured === false) return 'near-miss';
    if (wasInjured === true) {
        if (treatmentLocation === 'on-site') return 'first-aid';
        if (treatmentLocation === 'hospital') return 'fir';
    }
    return 'near-miss';
}

function buildActiveSteps(
    selectedType: string | null,
    wasInjured: boolean | null,
    treatmentLocation: 'on-site' | 'hospital' | null,
): StepId[] {
    const type = (selectedType ?? 'unsure') as IncidentType | 'unsure';

    if (type !== 'unsure') {
        return SEQUENCES[type];
    }

    // Not Sure: base + dynamic tail once Q1+Q2 are answered
    const base = SEQUENCES['unsure'];

    if (wasInjured === false) {
        return [...base, ...NOT_SURE_TAILS['near-miss']];
    }
    if (wasInjured === true && treatmentLocation === 'on-site') {
        return [...base, ...NOT_SURE_TAILS['first-aid']];
    }
    if (wasInjured === true && treatmentLocation === 'hospital') {
        return [...base, ...NOT_SURE_TAILS['fir']];
    }

    return base;
}

interface UseIncidentFormOptions {
    presetType?: IncidentType | null;
}

interface UseIncidentFormReturn {
    data: IncidentFormData;
    currentStep: StepId;
    errors: StepErrors;
    presetType: IncidentType | null;
    isSubmitted: boolean;
    selectedType: string | null;

    stepConfig: StepConfig;
    activeSteps: StepConfig[];
    totalSteps: number;
    currentStepIndex: number;
    canGoBack: boolean;
    canGoNext: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
    isFormValid: boolean;
    stepStatuses: Record<StepId, 'complete' | 'incomplete'>;
    inferredType: IncidentType;

    updateField: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
    goToStep: (step: StepId) => void;
    goNext: () => boolean;
    goBack: () => void;
    goToFirstError: () => void;
    submit: () => boolean;
    reset: () => void;
    validateCurrentStep: () => boolean;
    setSelectedType: (type: string) => void;
    selectTypeAndAdvance: (type: string) => void;
}

export function useIncidentForm(options: UseIncidentFormOptions = {}): UseIncidentFormReturn {
    const { presetType = null } = options;

    const [state, setState] = useState<FormState & { selectedType: string | null; visitedSteps: Set<StepId> }>({
        data: initialFormData,
        currentStep: 'entry',
        errors: {},
        presetType,
        isSubmitted: false,
        selectedType: presetType ?? null,
        visitedSteps: new Set<StepId>(['entry']),
    });

    const inferredType = useMemo((): IncidentType => {
        const sel = state.selectedType;
        if (sel && sel !== 'unsure') return sel as IncidentType;
        if (presetType) return presetType;
        return inferTypeFromQ1Q2(state.data.wasInjured, state.data.treatmentLocation);
    }, [state.selectedType, presetType, state.data.wasInjured, state.data.treatmentLocation]);

    const activeStepIds = useMemo(
        () => buildActiveSteps(state.selectedType, state.data.wasInjured, state.data.treatmentLocation),
        [state.selectedType, state.data.wasInjured, state.data.treatmentLocation],
    );

    const activeSteps = useMemo(
        (): StepConfig[] => activeStepIds.map(id => ({ id, title: STEP_META[id] })),
        [activeStepIds],
    );

    const stepConfig = useMemo(
        (): StepConfig => ({ id: state.currentStep, title: STEP_META[state.currentStep] }),
        [state.currentStep],
    );

    const currentStepIndex = useMemo(
        () => activeStepIds.indexOf(state.currentStep),
        [activeStepIds, state.currentStep],
    );

    const totalSteps = activeSteps.length;
    const canGoBack = currentStepIndex > 0;
    const canGoNext = currentStepIndex < totalSteps - 1;
    const isFirstStep = state.currentStep === 'entry';
    const isLastStep = currentStepIndex === totalSteps - 1 && !isFirstStep;

    const isFormValid = useMemo(
        () => !stepHasErrors(validateForm(state.data, inferredType)),
        [state.data, inferredType],
    );

    const stepStatuses = useMemo((): Record<StepId, 'complete' | 'incomplete'> => {
        const result = {} as Record<StepId, 'complete' | 'incomplete'>;
        for (const id of activeStepIds) {
            const visited = state.visitedSteps.has(id);
            const fullyComplete = isStepFullyComplete(id, state.data, inferredType);
            result[id] = visited && fullyComplete ? 'complete' : 'incomplete';
        }
        return result;
    }, [activeStepIds, state.data, inferredType, state.visitedSteps]);

    const updateField = useCallback(<K extends keyof IncidentFormData>(
        field: K,
        value: IncidentFormData[K],
    ) => {
        setState(prev => {
            const newErrors = { ...prev.errors };
            delete newErrors[field as string];
            return { ...prev, data: { ...prev.data, [field]: value }, errors: newErrors };
        });
    }, []);

    const setSelectedType = useCallback((type: string) => {
        setState(prev => ({
            ...prev,
            selectedType: type,
            data: { ...prev.data, selectedType: type },
        }));
    }, []);

    // Atomically sets the type and advances to the next step in one state update,
    // avoiding the stale-closure issue that arises when calling setSelectedType + goNext separately.
    const selectTypeAndAdvance = useCallback((type: string) => {
        setState(prev => {
            const nextIds = buildActiveSteps(type, prev.data.wasInjured, prev.data.treatmentLocation);
            const idx = nextIds.indexOf(prev.currentStep);
            const nextStep = idx >= 0 && idx < nextIds.length - 1 ? nextIds[idx + 1] : prev.currentStep;
            return {
                ...prev,
                selectedType: type,
                data: { ...prev.data, selectedType: type },
                currentStep: nextStep,
                errors: {},
                visitedSteps: new Set([...prev.visitedSteps, nextStep]),
            };
        });
    }, []);

    const validateCurrentStep = useCallback((): boolean => {
        const errors = validateStep(state.currentStep, state.data, inferredType);
        setState(prev => ({ ...prev, errors }));
        return !stepHasErrors(errors);
    }, [state.currentStep, state.data, inferredType]);

    const goToStep = useCallback((step: StepId) => {
        setState(prev => ({
            ...prev,
            currentStep: step,
            errors: {},
            visitedSteps: new Set([...prev.visitedSteps, step]),
        }));
    }, []);

    const goNext = useCallback((): boolean => {
        const errors = validateStep(state.currentStep, state.data, inferredType);
        if (stepHasErrors(errors)) {
            setState(prev => ({ ...prev, errors }));
            return false;
        }

        const currentIds = buildActiveSteps(
            state.selectedType,
            state.data.wasInjured,
            state.data.treatmentLocation,
        );
        const idx = currentIds.indexOf(state.currentStep);
        if (idx < currentIds.length - 1) {
            const nextStep = currentIds[idx + 1];
            if (nextStep === 'review' && stepHasErrors(validateForm(state.data, inferredType))) {
                return false;
            }
            setState(prev => ({
                ...prev,
                currentStep: nextStep,
                errors: {},
                visitedSteps: new Set([...prev.visitedSteps, nextStep]),
            }));
            return true;
        }
        return false;
    }, [state.currentStep, state.data, state.selectedType, inferredType]);

    const goBack = useCallback(() => {
        const currentIds = buildActiveSteps(
            state.selectedType,
            state.data.wasInjured,
            state.data.treatmentLocation,
        );
        const idx = currentIds.indexOf(state.currentStep);
        if (idx > 0) {
            const prevStep = currentIds[idx - 1];
            setState(prev => ({
                ...prev,
                currentStep: prevStep,
                errors: {},
                visitedSteps: new Set([...prev.visitedSteps, prevStep]),
            }));
        }
    }, [state.currentStep, state.data, state.selectedType]);

    const goToFirstError = useCallback(() => {
        const stepsToCheck = activeStepIds.filter(id => id !== 'entry' && id !== 'review');
        for (const stepId of stepsToCheck) {
            const errors = validateStep(stepId, state.data, inferredType);
            if (stepHasErrors(errors)) {
                setState(prev => ({
                    ...prev,
                    currentStep: stepId,
                    errors,
                    visitedSteps: new Set([...prev.visitedSteps, stepId]),
                }));
                return;
            }
        }
    }, [activeStepIds, state.data, inferredType]);

    const submit = useCallback((): boolean => {
        const errors = validateForm(state.data, inferredType);
        if (stepHasErrors(errors)) {
            setState(prev => ({ ...prev, errors }));
            return false;
        }
        setState(prev => ({ ...prev, isSubmitted: true }));
        return true;
    }, [state.data, inferredType]);

    const reset = useCallback(() => {
        setState({
            data: initialFormData,
            currentStep: 'entry',
            errors: {},
            presetType,
            isSubmitted: false,
            selectedType: presetType ?? null,
            visitedSteps: new Set<StepId>(['entry']),
        });
    }, [presetType]);

    return {
        data: state.data,
        currentStep: state.currentStep,
        errors: state.errors,
        presetType: state.presetType,
        isSubmitted: state.isSubmitted,
        selectedType: state.selectedType,

        stepConfig,
        activeSteps,
        totalSteps,
        currentStepIndex,
        canGoBack,
        canGoNext,
        isFirstStep,
        isLastStep,
        isFormValid,
        stepStatuses,
        inferredType,

        updateField,
        goToStep,
        goNext,
        goBack,
        goToFirstError,
        submit,
        reset,
        validateCurrentStep,
        setSelectedType,
        selectTypeAndAdvance,
    };
}

export default useIncidentForm;
