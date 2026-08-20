'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
    ToolAuditFormData,
    ToolCondition,
    StepId,
    StepErrors,
    FormState,
    StepConfig,
    AuditType,
} from './types';
import { initialFormData } from './types';
import { validateStep, stepHasErrors, validateForm, isStepFullyComplete } from './validation';
import { getToolChecklistForType } from './mockData';

const STEP_META: Record<StepId, string> = {
    'entry':            'Tool Audit',
    'audit-details':    'Audit Details',
    'tools-checklist':  'Tools Checklist',
    'conclusion':       'Conclusion',
    'review':           'Review & Submit',
};

const STEP_SEQUENCE: StepId[] = [
    'entry',
    'audit-details',
    'tools-checklist',
    'conclusion',
    'review',
];

interface UseToolAuditFormReturn {
    data: ToolAuditFormData;
    currentStep: StepId;
    errors: StepErrors;
    isSubmitted: boolean;

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

    updateField: <K extends keyof ToolAuditFormData>(field: K, value: ToolAuditFormData[K]) => void;
    selectTypeAndAdvance: (type: AuditType) => void;
    goToStep: (step: StepId) => void;
    goNext: () => boolean;
    goBack: () => void;
    goToFirstError: () => void;
    submit: () => boolean;
    reset: () => void;
    validateCurrentStep: () => boolean;

    updateToolCondition: (toolId: string, condition: ToolCondition) => void;
    updateToolRemarks: (toolId: string, remarks: string) => void;
    updateToolImages: (toolId: string, images: File[]) => void;
}

export function useToolAuditForm(): UseToolAuditFormReturn {
    const [state, setState] = useState<FormState & { visitedSteps: Set<StepId> }>({
        data: initialFormData,
        currentStep: 'entry',
        errors: {},
        isSubmitted: false,
        visitedSteps: new Set<StepId>(['entry']),
    });

    const stepConfig = useMemo(
        (): StepConfig => ({ id: state.currentStep, title: STEP_META[state.currentStep] }),
        [state.currentStep],
    );

    const activeSteps = useMemo(
        (): StepConfig[] => STEP_SEQUENCE.map(id => ({ id, title: STEP_META[id] })),
        [],
    );

    const currentStepIndex = STEP_SEQUENCE.indexOf(state.currentStep);
    const totalSteps = STEP_SEQUENCE.length;
    const canGoBack = currentStepIndex > 0;
    const canGoNext = currentStepIndex < totalSteps - 1;
    const isFirstStep = state.currentStep === 'entry';
    const isLastStep = state.currentStep === 'review';

    const isFormValid = useMemo(
        () => !stepHasErrors(validateForm(state.data)),
        [state.data],
    );

    const stepStatuses = useMemo((): Record<StepId, 'complete' | 'incomplete'> => {
        const result = {} as Record<StepId, 'complete' | 'incomplete'>;
        for (const id of STEP_SEQUENCE) {
            const visited = state.visitedSteps.has(id);
            const fullyComplete = isStepFullyComplete(id, state.data);
            result[id] = visited && fullyComplete ? 'complete' : 'incomplete';
        }
        return result;
    }, [state.data, state.visitedSteps]);

    const updateField = useCallback(<K extends keyof ToolAuditFormData>(
        field: K,
        value: ToolAuditFormData[K],
    ) => {
        setState(prev => {
            const newErrors = { ...prev.errors };
            delete newErrors[field as string];
            const newData = { ...prev.data, [field]: value };
            if (field === 'auditType' && value && typeof value === 'string') {
                newData.toolsChecklist = getToolChecklistForType(value as AuditType);
            }
            return { ...prev, data: newData, errors: newErrors };
        });
    }, []);

    const updateToolCondition = useCallback((toolId: string, condition: ToolCondition) => {
        setState(prev => {
            const newChecklist = prev.data.toolsChecklist.map(tool => {
                if (tool.toolId !== toolId) return tool;
                return {
                    ...tool,
                    condition,
                    remarks: condition === 'good' ? '' : tool.remarks,
                    images: condition === 'good' ? [] : tool.images,
                };
            });
            const newErrors = { ...prev.errors };
            delete newErrors[`tool_${toolId}_condition`];
            if (condition === 'good') {
                delete newErrors[`tool_${toolId}_remarks`];
                delete newErrors[`tool_${toolId}_images`];
            }
            return { ...prev, data: { ...prev.data, toolsChecklist: newChecklist }, errors: newErrors };
        });
    }, []);

    const updateToolRemarks = useCallback((toolId: string, remarks: string) => {
        setState(prev => {
            const newChecklist = prev.data.toolsChecklist.map(tool =>
                tool.toolId === toolId ? { ...tool, remarks } : tool,
            );
            const newErrors = { ...prev.errors };
            delete newErrors[`tool_${toolId}_remarks`];
            return { ...prev, data: { ...prev.data, toolsChecklist: newChecklist }, errors: newErrors };
        });
    }, []);

    const updateToolImages = useCallback((toolId: string, images: File[]) => {
        setState(prev => {
            const newChecklist = prev.data.toolsChecklist.map(tool =>
                tool.toolId === toolId ? { ...tool, images } : tool,
            );
            const newErrors = { ...prev.errors };
            delete newErrors[`tool_${toolId}_images`];
            return { ...prev, data: { ...prev.data, toolsChecklist: newChecklist }, errors: newErrors };
        });
    }, []);

    const selectTypeAndAdvance = useCallback((type: AuditType) => {
        setState(prev => ({
            ...prev,
            data: {
                ...prev.data,
                auditType: type,
                toolsChecklist: getToolChecklistForType(type),
            },
            currentStep: 'audit-details',
            errors: {},
            visitedSteps: new Set([...prev.visitedSteps, 'audit-details']),
        }));
    }, []);

    const goToStep = useCallback((step: StepId) => {
        setState(prev => ({
            ...prev,
            currentStep: step,
            errors: {},
            visitedSteps: new Set([...prev.visitedSteps, step]),
        }));
    }, []);

    const goNext = useCallback((): boolean => {
        const errors = validateStep(state.currentStep, state.data);
        if (stepHasErrors(errors)) {
            setState(prev => ({ ...prev, errors }));
            return false;
        }
        const idx = STEP_SEQUENCE.indexOf(state.currentStep);
        if (idx < STEP_SEQUENCE.length - 1) {
            const nextStep = STEP_SEQUENCE[idx + 1];
            if (nextStep === 'review' && stepHasErrors(validateForm(state.data))) {
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
    }, [state.currentStep, state.data]);

    const goBack = useCallback(() => {
        const idx = STEP_SEQUENCE.indexOf(state.currentStep);
        if (idx > 0) {
            const prevStep = STEP_SEQUENCE[idx - 1];
            setState(prev => ({
                ...prev,
                currentStep: prevStep,
                errors: {},
                visitedSteps: new Set([...prev.visitedSteps, prevStep]),
            }));
        }
    }, [state.currentStep]);

    const goToFirstError = useCallback(() => {
        const stepsToCheck: StepId[] = ['audit-details', 'tools-checklist', 'conclusion'];
        for (const stepId of stepsToCheck) {
            const errors = validateStep(stepId, state.data);
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
    }, [state.data]);

    const validateCurrentStep = useCallback((): boolean => {
        const errors = validateStep(state.currentStep, state.data);
        setState(prev => ({ ...prev, errors }));
        return !stepHasErrors(errors);
    }, [state.currentStep, state.data]);

    const submit = useCallback((): boolean => {
        const errors = validateForm(state.data);
        if (stepHasErrors(errors)) {
            setState(prev => ({ ...prev, errors }));
            return false;
        }
        setState(prev => ({ ...prev, isSubmitted: true }));
        return true;
    }, [state.data]);

    const reset = useCallback(() => {
        setState({
            data: initialFormData,
            currentStep: 'entry',
            errors: {},
            isSubmitted: false,
            visitedSteps: new Set<StepId>(['entry']),
        });
    }, []);

    return {
        data: state.data,
        currentStep: state.currentStep,
        errors: state.errors,
        isSubmitted: state.isSubmitted,

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

        updateField,
        selectTypeAndAdvance,
        goToStep,
        goNext,
        goBack,
        goToFirstError,
        submit,
        reset,
        validateCurrentStep,

        updateToolCondition,
        updateToolRemarks,
        updateToolImages,
    };
}

export default useToolAuditForm;
