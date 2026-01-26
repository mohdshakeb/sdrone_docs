'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import RadioGroup from '@/components/ui/RadioGroup';
import Textarea from '@/components/ui/Textarea';
import { contributingFactorOptions } from '../../mockData';
import type { IncidentFormData, StepErrors, ContributingFactor } from '../../types';

export interface StepContributingFactorsProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

export const StepContributingFactors: React.FC<StepContributingFactorsProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    return (
        <>
            <FormField
                id="contributingFactor"
                label="What contributed to this incident?"
                required
                error={errors.contributingFactor}
            >
                <RadioGroup
                    name="contributingFactor"
                    options={contributingFactorOptions}
                    value={data.contributingFactor ?? undefined}
                    onChange={(value) => onUpdate('contributingFactor', value as ContributingFactor)}
                    hasError={!!errors.contributingFactor}
                />
            </FormField>

            <FormField
                id="contributingNotes"
                label="Additional details"
                helpText="Provide more context about the contributing factors"
            >
                <Textarea
                    value={data.contributingNotes}
                    onChange={(e) => onUpdate('contributingNotes', e.target.value)}
                    placeholder="Describe the unsafe act or condition in more detail..."
                    rows={3}
                />
            </FormField>
        </>
    );
};

export default StepContributingFactors;
