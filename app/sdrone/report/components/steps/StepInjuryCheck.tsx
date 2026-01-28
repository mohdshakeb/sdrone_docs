'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import RadioGroup from '@/components/ui/RadioGroup';
import styles from './Steps.module.css';
import { injuryOptions } from '../../mockData';
import type { IncidentFormData, StepErrors } from '../../types';

export interface StepInjuryCheckProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

export const StepInjuryCheck: React.FC<StepInjuryCheckProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    const handleChange = (value: string) => {
        onUpdate('wasInjured', value === 'yes');

        // Clear injury details if no injury
        if (value === 'no') {
            onUpdate('injuredEmployee', '');
            onUpdate('bodyPart', '');
            onUpdate('treatment', null);
        }
    };

    // Convert boolean to string for RadioGroup
    const selectedValue = data.wasInjured === null
        ? undefined
        : data.wasInjured
            ? 'yes'
            : 'no';

    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="wasInjured"
                label="Was anyone injured as a result of this incident?"
                required
                error={errors.wasInjured}
            >
                <RadioGroup
                    name="wasInjured"
                    options={injuryOptions}
                    value={selectedValue}
                    onChange={handleChange}
                    hasError={!!errors.wasInjured}
                />
            </FormField>
        </div>
    );
};

export default StepInjuryCheck;
