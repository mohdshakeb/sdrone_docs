'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Select from '@/components/ui/Select';
import styles from './Steps.module.css';
import { MOCK_FIR_REFERENCES } from '../../mockData';
import type { IncidentFormData, StepErrors } from '../../types';

export interface StepFIRReferenceProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

const firOptions = [
    { value: '', label: 'None — start fresh' },
    ...MOCK_FIR_REFERENCES.map(f => ({
        value: f.id,
        label: `${f.title} (${f.date})`,
    })),
];

export const StepFIRReference: React.FC<StepFIRReferenceProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value || null;
        onUpdate('firReference', id);

        if (!id) return;

        const ref = MOCK_FIR_REFERENCES.find(f => f.id === id);
        if (!ref) return;

        // Pre-fill shared ADR fields from the selected FIR
        onUpdate('description', ref.description);
        onUpdate('exactPlace', ref.exactPlace);
        onUpdate('injuredEmployees', ref.injuredEmployees);
        onUpdate('witnesses', ref.witnesses);
        onUpdate('machineryInvolved', ref.machineryInvolved);
        onUpdate('machineName', ref.machineName);
        onUpdate('machineMoving', ref.machineMoving);
        onUpdate('propertyLoss', ref.propertyLoss);
    };

    return (
        <div className={styles.fieldsWrapper}>
            <p className={['text-body', styles.stepHelpText].join(' ')}>
                If this ADR escalates an existing FIR, select it below to pre-fill shared fields.
                All pre-filled values remain editable.
            </p>
            <FormField
                id="firReference"
                label="FIR Reference"
                error={errors.firReference}
            >
                <Select
                    options={firOptions}
                    value={data.firReference ?? ''}
                    onChange={handleChange}
                    placeholder="Select a FIR (optional)"
                />
            </FormField>
        </div>
    );
};

export default StepFIRReference;
