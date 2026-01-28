'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Select from '@/components/ui/Select';
import RadioGroup from '@/components/ui/RadioGroup';
import { bodyPartOptions, treatmentOptions } from '../../mockData';
import type { IncidentFormData, StepErrors, TreatmentLevel } from '../../types';

import styles from './Steps.module.css';

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
    const isFirstAidLocked = data.selectedType === 'first-aid';

    return (
        <div className={styles.fieldsWrapper}>
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
                helpText={isFirstAidLocked ? 'Automatically set for First Aid reports' : 'This helps categorize the incident severity'}
            >
                <RadioGroup
                    name="treatment"
                    options={treatmentOptions}
                    value={isFirstAidLocked ? 'first-aid' : (data.treatment ?? undefined)}
                    onChange={(value) => !isFirstAidLocked && onUpdate('treatment', value as TreatmentLevel)}
                    disabled={isFirstAidLocked}
                    hasError={!!errors.treatment}
                />
            </FormField>
        </div>
    );
};

export default StepInjuryDetails;
