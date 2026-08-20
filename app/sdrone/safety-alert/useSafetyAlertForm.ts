'use client';

import { useState, useCallback } from 'react';
import type { SafetyAlertFormData } from './types';
import { initialSafetyAlertData } from './types';

interface UseSafetyAlertFormReturn {
    data: SafetyAlertFormData;
    isSubmitted: boolean;
    updateField: <K extends keyof SafetyAlertFormData>(field: K, value: SafetyAlertFormData[K]) => void;
    toggleAudience: (value: string) => void;
    isValid: boolean;
    submit: () => void;
    reset: () => void;
}

export function useSafetyAlertForm(): UseSafetyAlertFormReturn {
    const [data, setData] = useState<SafetyAlertFormData>(initialSafetyAlertData);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const updateField = useCallback(<K extends keyof SafetyAlertFormData>(
        field: K,
        value: SafetyAlertFormData[K],
    ) => {
        setData(prev => ({ ...prev, [field]: value }));
    }, []);

    const toggleAudience = useCallback((value: string) => {
        setData(prev => ({
            ...prev,
            targetAudience: prev.targetAudience.includes(value)
                ? prev.targetAudience.filter(v => v !== value)
                : [...prev.targetAudience, value],
        }));
    }, []);

    const isValid = data.message.trim().length > 0 && data.targetAudience.length > 0;

    const submit = useCallback(() => {
        setIsSubmitted(true);
    }, []);

    const reset = useCallback(() => {
        setData(initialSafetyAlertData);
        setIsSubmitted(false);
    }, []);

    return { data, isSubmitted, updateField, toggleAudience, isValid, submit, reset };
}
