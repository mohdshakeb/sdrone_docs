'use client';

import { useState, useCallback } from 'react';
import type { SOSFormData } from './types';
import { initialSOSData } from './types';

interface UseSOSFormReturn {
    data: SOSFormData;
    isSubmitted: boolean;
    updateField: <K extends keyof SOSFormData>(field: K, value: SOSFormData[K]) => void;
    submit: () => void;
    reset: () => void;
}

export function useSOSForm(): UseSOSFormReturn {
    const [data, setData] = useState<SOSFormData>(initialSOSData);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const updateField = useCallback(<K extends keyof SOSFormData>(
        field: K,
        value: SOSFormData[K],
    ) => {
        setData(prev => ({ ...prev, [field]: value }));
    }, []);

    const submit = useCallback(() => {
        setIsSubmitted(true);
    }, []);

    const reset = useCallback(() => {
        setData(initialSOSData);
        setIsSubmitted(false);
    }, []);

    return { data, isSubmitted, updateField, submit, reset };
}
