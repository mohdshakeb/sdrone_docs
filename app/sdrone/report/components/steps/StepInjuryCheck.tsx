'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import RadioGroup from '@/components/ui/RadioGroup';
import styles from './Steps.module.css';
import { injuryOptions, treatmentLocationOptions } from '../../mockData';
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
    const handleInjuryChange = (value: string) => {
        const wasInjured = value === 'yes';
        onUpdate('wasInjured', wasInjured);
        // Clear Q2 answer when Q1 changes
        onUpdate('treatmentLocation', null);
    };

    const injuryValue = data.wasInjured === null
        ? undefined
        : data.wasInjured ? 'yes' : 'no';

    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="wasInjured"
                label="Did this incident result in any injury?"
                required
                error={errors.wasInjured}
            >
                <RadioGroup
                    name="wasInjured"
                    options={injuryOptions}
                    value={injuryValue}
                    onChange={handleInjuryChange}
                    hasError={!!errors.wasInjured}
                />
            </FormField>

            {data.wasInjured === true && (
                <FormField
                    id="treatmentLocation"
                    label="Where was the person treated?"
                    required
                    error={errors.treatmentLocation}
                >
                    <RadioGroup
                        name="treatmentLocation"
                        options={treatmentLocationOptions}
                        value={data.treatmentLocation ?? undefined}
                        onChange={(value) =>
                            onUpdate('treatmentLocation', value as 'on-site' | 'hospital')
                        }
                        hasError={!!errors.treatmentLocation}
                    />
                </FormField>
            )}
        </div>
    );
};

export default StepInjuryCheck;
