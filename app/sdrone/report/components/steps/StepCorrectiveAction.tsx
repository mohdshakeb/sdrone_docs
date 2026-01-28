'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import styles from './Steps.module.css';
import type { IncidentFormData, StepErrors } from '../../types';

export interface StepCorrectiveActionProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

export const StepCorrectiveAction: React.FC<StepCorrectiveActionProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="correctiveAction"
                label="Suggested corrective action"
                helpText="What steps could be taken to prevent similar incidents in the future?"
            >
                <Textarea
                    value={data.correctiveAction}
                    onChange={(e) => onUpdate('correctiveAction', e.target.value)}
                    placeholder="Describe any recommendations for preventing future incidents..."
                    rows={5}
                />
            </FormField>
        </div>
    );
};

export default StepCorrectiveAction;
