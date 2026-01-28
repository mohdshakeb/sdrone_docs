'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import RadioGroup from '@/components/ui/RadioGroup';
import Textarea from '@/components/ui/Textarea';
import styles from './Steps.module.css';
import type { IncidentFormData, StepErrors } from '../../types';

export interface StepFirstAidSpecificsProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

const medicineOptions = [
    { value: 'yes', label: 'Yes', description: 'Medicine or treatment was applied from first aid kit' },
    { value: 'no', label: 'No', description: 'No medicine or treatment was applied' },
];

export const StepFirstAidSpecifics: React.FC<StepFirstAidSpecificsProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    const handleMedicineChange = (value: string) => {
        onUpdate('medicineUsed', value === 'yes');

        // Clear medicine details if no medicine was used
        if (value === 'no') {
            onUpdate('medicineDetails', '');
        }
    };

    // Convert boolean to string for RadioGroup
    const selectedValue = data.medicineUsed === null
        ? undefined
        : data.medicineUsed
            ? 'yes'
            : 'no';

    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="medicineUsed"
                label="Was any medicine or topical treatment applied?"
                required
                error={errors.medicineUsed}
                helpText="Indicate if any medicine or treatment from the first aid kit was used"
            >
                <RadioGroup
                    name="medicineUsed"
                    options={medicineOptions}
                    value={selectedValue}
                    onChange={handleMedicineChange}
                    hasError={!!errors.medicineUsed}
                />
            </FormField>

            {data.medicineUsed && (
                <FormField
                    id="medicineDetails"
                    label="Describe the medicine or treatment applied"
                    required
                    error={errors.medicineDetails}
                    helpText="Include type, quantity, and area applied"
                >
                    <Textarea
                        value={data.medicineDetails}
                        onChange={(e) => onUpdate('medicineDetails', e.target.value)}
                        placeholder="e.g., Antiseptic cream applied to minor cut on left forearm"
                        rows={3}
                        maxLength={500}
                        showCharCount
                    />
                </FormField>
            )}
        </div>
    );
};

export default StepFirstAidSpecifics;
