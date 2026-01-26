'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import type { IncidentFormData, StepErrors } from '../../types';

export interface StepWhatHappenedProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

export const StepWhatHappened: React.FC<StepWhatHappenedProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    return (
        <>
            <FormField
                id="description"
                label="What happened?"
                required
                error={errors.description}
                helpText="Describe the incident in detail. Include what led up to it, what occurred, and any immediate consequences."
            >
                <Textarea
                    value={data.description}
                    onChange={(e) => onUpdate('description', e.target.value)}
                    placeholder="Describe the incident..."
                    hasError={!!errors.description}
                    showCharCount
                    maxLength={1000}
                    rows={5}
                />
            </FormField>

            <FormField
                id="immediateAction"
                label="What immediate action was taken?"
                helpText="Describe any actions taken to address the situation immediately after it occurred."
            >
                <Textarea
                    value={data.immediateAction}
                    onChange={(e) => onUpdate('immediateAction', e.target.value)}
                    placeholder="Describe any immediate response..."
                    rows={3}
                />
            </FormField>
        </>
    );
};

export default StepWhatHappened;
