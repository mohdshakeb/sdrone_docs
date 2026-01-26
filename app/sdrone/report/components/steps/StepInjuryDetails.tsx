'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Select from '@/components/ui/Select';
import RadioGroup from '@/components/ui/RadioGroup';
import { bodyPartOptions, treatmentOptions } from '../../mockData';
import type { IncidentFormData, StepErrors, TreatmentLevel } from '../../types';

export interface StepInjuryDetailsProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

export const StepInjuryDetails: React.FC<StepInjuryDetailsProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    return (
        <>
            <FormField
                id="injuredEmployee"
                label="Name of injured person"
                required
                error={errors.injuredEmployee}
            >
                <TextInput
                    value={data.injuredEmployee}
                    onChange={(e) => onUpdate('injuredEmployee', e.target.value)}
                    placeholder="Full name"
                    hasError={!!errors.injuredEmployee}
                />
            </FormField>

            <FormField
                id="bodyPart"
                label="Body part affected"
                required
                error={errors.bodyPart}
            >
                <Select
                    options={bodyPartOptions}
                    value={data.bodyPart}
                    onChange={(e) => onUpdate('bodyPart', e.target.value)}
                    placeholder="Select body part"
                    hasError={!!errors.bodyPart}
                />
            </FormField>

            <FormField
                id="treatment"
                label="Treatment required"
                required
                error={errors.treatment}
                helpText="This helps categorize the incident severity"
            >
                <RadioGroup
                    name="treatment"
                    options={treatmentOptions}
                    value={data.treatment ?? undefined}
                    onChange={(value) => onUpdate('treatment', value as TreatmentLevel)}
                    hasError={!!errors.treatment}
                />
            </FormField>
        </>
    );
};

export default StepInjuryDetails;
