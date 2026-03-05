'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
    ToolAuditFormData,
    ToolCondition,
    FormStep,
    StepErrors,
    FormState,
    StepConfig,
    AuditType,
} from './types';
import { initialFormData } from './types';
import { validateStep, stepHasErrors, validateForm } from './validation';
import { getToolChecklistForType } from './mockData';

// Step configuration — 6 fixed steps, no conditional logic
const STEP_CONFIGS: StepConfig[] = [
    { id: 0, title: 'Tool Audit' },
    { id: 1, title: 'Audit Details' },
    { id: 2, title: 'Tools Checklist' },
    { id: 3, title: 'Observations & Actions' },
    { id: 4, title: 'Attachments' },
    { id: 5, title: 'Review & Submit' },
];

interface UseToolAuditFormReturn {
    // State
    data: ToolAuditFormData;
    currentStep: FormStep;
    errors: StepErrors;
    isSubmitted: boolean;

    // Computed
    stepConfig: StepConfig;
    totalSteps: number;
    currentStepIndex: number;
    canGoBack: boolean;
    canGoNext: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
    isReviewStep: boolean;

    // General actions
    updateField: <K extends keyof ToolAuditFormData>(field: K, value: ToolAuditFormData[K]) => void;
    goToStep: (step: FormStep) => void;
    goNext: () => boolean;
    goBack: () => void;
    submit: () => boolean;
    reset: () => void;
    validateCurrentStep: () => boolean;

    // Tool-specific actions
    updateToolCondition: (toolId: string, condition: ToolCondition) => void;
    updateToolRemarks: (toolId: string, remarks: string) => void;
    updateToolImages: (toolId: string, images: File[]) => void;

    // Action-specific actions
    addAction: () => void;
    removeAction: (id: string) => void;
    updateAction: (id: string, field: 'description' | 'responsibility' | 'targetDate', value: string) => void;
}

export function useToolAuditForm(): UseToolAuditFormReturn {
    const [state, setState] = useState<FormState>({
        data: initialFormData,
        currentStep: 0,
        errors: {},
        isSubmitted: false,
    });

    // Current step config
    const stepConfig = useMemo(() => {
        return STEP_CONFIGS.find((s) => s.id === state.currentStep) ?? STEP_CONFIGS[0];
    }, [state.currentStep]);

    // Navigation state
    const totalSteps = STEP_CONFIGS.length;
    const currentStepIndex = state.currentStep;
    const canGoBack = state.currentStep > 0;
    const canGoNext = state.currentStep < totalSteps - 1;
    const isFirstStep = state.currentStep === 0;
    const isLastStep = state.currentStep === 5;
    const isReviewStep = state.currentStep === 5;

    // Update a single field
    const updateField = useCallback(<K extends keyof ToolAuditFormData>(
        field: K,
        value: ToolAuditFormData[K]
    ) => {
        setState((prev) => {
            const newErrors = { ...prev.errors };
            delete newErrors[field];

            const newData = { ...prev.data, [field]: value };

            // Auto-populate tools checklist when audit type changes
            if (field === 'auditType' && value && typeof value === 'string') {
                newData.toolsChecklist = getToolChecklistForType(value as AuditType);
            }

            return {
                ...prev,
                data: newData,
                errors: newErrors,
            };
        });
    }, []);

    // Tool-specific updaters
    const updateToolCondition = useCallback((toolId: string, condition: ToolCondition) => {
        setState((prev) => {
            const newChecklist = prev.data.toolsChecklist.map((tool) => {
                if (tool.toolId !== toolId) return tool;
                return {
                    ...tool,
                    condition,
                    // Clear remarks/images if switching to okay
                    remarks: condition === 'okay' ? '' : tool.remarks,
                    images: condition === 'okay' ? [] : tool.images,
                };
            });

            // Clear related errors
            const newErrors = { ...prev.errors };
            delete newErrors[`tool_${toolId}_condition`];
            if (condition === 'okay') {
                delete newErrors[`tool_${toolId}_remarks`];
                delete newErrors[`tool_${toolId}_images`];
            }

            return {
                ...prev,
                data: { ...prev.data, toolsChecklist: newChecklist },
                errors: newErrors,
            };
        });
    }, []);

    const updateToolRemarks = useCallback((toolId: string, remarks: string) => {
        setState((prev) => {
            const newChecklist = prev.data.toolsChecklist.map((tool) =>
                tool.toolId === toolId ? { ...tool, remarks } : tool
            );
            const newErrors = { ...prev.errors };
            delete newErrors[`tool_${toolId}_remarks`];

            return {
                ...prev,
                data: { ...prev.data, toolsChecklist: newChecklist },
                errors: newErrors,
            };
        });
    }, []);

    const updateToolImages = useCallback((toolId: string, images: File[]) => {
        setState((prev) => {
            const newChecklist = prev.data.toolsChecklist.map((tool) =>
                tool.toolId === toolId ? { ...tool, images } : tool
            );
            const newErrors = { ...prev.errors };
            delete newErrors[`tool_${toolId}_images`];

            return {
                ...prev,
                data: { ...prev.data, toolsChecklist: newChecklist },
                errors: newErrors,
            };
        });
    }, []);

    // Action item management
    const addAction = useCallback(() => {
        setState((prev) => {
            const newAction = {
                id: `action-${Date.now()}`,
                description: '',
                responsibility: '',
                targetDate: '',
            };
            return {
                ...prev,
                data: {
                    ...prev.data,
                    actions: [...prev.data.actions, newAction],
                },
            };
        });
    }, []);

    const removeAction = useCallback((id: string) => {
        setState((prev) => {
            const newErrors = { ...prev.errors };
            delete newErrors[`action_${id}_description`];
            delete newErrors[`action_${id}_responsibility`];
            delete newErrors[`action_${id}_targetDate`];

            return {
                ...prev,
                data: {
                    ...prev.data,
                    actions: prev.data.actions.filter((a) => a.id !== id),
                },
                errors: newErrors,
            };
        });
    }, []);

    const updateAction = useCallback((
        id: string,
        field: 'description' | 'responsibility' | 'targetDate',
        value: string
    ) => {
        setState((prev) => {
            const newActions = prev.data.actions.map((action) =>
                action.id === id ? { ...action, [field]: value } : action
            );
            const newErrors = { ...prev.errors };
            delete newErrors[`action_${id}_${field}`];

            return {
                ...prev,
                data: { ...prev.data, actions: newActions },
                errors: newErrors,
            };
        });
    }, []);

    // Validate current step
    const validateCurrentStep = useCallback((): boolean => {
        const errors = validateStep(state.currentStep, state.data);
        setState((prev) => ({ ...prev, errors }));
        return !stepHasErrors(errors);
    }, [state.currentStep, state.data]);

    // Navigate to a specific step
    const goToStep = useCallback((step: FormStep) => {
        setState((prev) => ({ ...prev, currentStep: step, errors: {} }));
    }, []);

    // Go to next step
    const goNext = useCallback((): boolean => {
        const errors = validateStep(state.currentStep, state.data);
        if (stepHasErrors(errors)) {
            setState((prev) => ({ ...prev, errors }));
            return false;
        }

        const nextStep = (state.currentStep + 1) as FormStep;
        if (nextStep <= 5) {
            setState((prev) => ({ ...prev, currentStep: nextStep, errors: {} }));
            return true;
        }
        return false;
    }, [state.currentStep, state.data]);

    // Go to previous step
    const goBack = useCallback(() => {
        if (state.currentStep > 0) {
            const prevStep = (state.currentStep - 1) as FormStep;
            setState((prev) => ({ ...prev, currentStep: prevStep, errors: {} }));
        }
    }, [state.currentStep]);

    // Submit the form
    const submit = useCallback((): boolean => {
        const errors = validateForm(state.data);
        if (stepHasErrors(errors)) {
            setState((prev) => ({ ...prev, errors }));
            return false;
        }

        setState((prev) => ({ ...prev, isSubmitted: true }));
        return true;
    }, [state.data]);

    // Reset the form
    const reset = useCallback(() => {
        setState({
            data: initialFormData,
            currentStep: 0,
            errors: {},
            isSubmitted: false,
        });
    }, []);

    return {
        // State
        data: state.data,
        currentStep: state.currentStep,
        errors: state.errors,
        isSubmitted: state.isSubmitted,

        // Computed
        stepConfig,
        totalSteps,
        currentStepIndex,
        canGoBack,
        canGoNext,
        isFirstStep,
        isLastStep,
        isReviewStep,

        // General actions
        updateField,
        goToStep,
        goNext,
        goBack,
        submit,
        reset,
        validateCurrentStep,

        // Tool-specific
        updateToolCondition,
        updateToolRemarks,
        updateToolImages,

        // Action-specific
        addAction,
        removeAction,
        updateAction,
    };
}

export default useToolAuditForm;
