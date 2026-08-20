'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Textarea from '@/components/ui/Textarea';
import RadioGroup from '@/components/ui/RadioGroup';
import styles from './Steps.module.css';
import type { IncidentFormData, StepErrors } from '../../types';

export interface StepReasonAndLossProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no',  label: 'No'  },
];

export const StepReasonAndLoss: React.FC<StepReasonAndLossProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    const machineryValue = data.machineryInvolved === null
        ? undefined
        : data.machineryInvolved ? 'yes' : 'no';

    const machineMovingValue = data.machineMoving === null
        ? undefined
        : data.machineMoving ? 'yes' : 'no';

    const handleMachineryChange = (value: string) => {
        const involved = value === 'yes';
        onUpdate('machineryInvolved', involved);
        if (!involved) {
            onUpdate('machineName', '');
            onUpdate('machineMoving', null);
        }
    };

    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="machineryInvolved"
                label="Was machinery or equipment involved?"
                required
                error={errors.machineryInvolved}
            >
                <RadioGroup
                    name="machineryInvolved"
                    options={yesNoOptions}
                    value={machineryValue}
                    onChange={handleMachineryChange}
                    hasError={!!errors.machineryInvolved}
                />
            </FormField>

            {data.machineryInvolved === true && (
                <>
                    <FormField
                        id="machineName"
                        label="Machine / equipment name"
                        required
                        error={errors.machineName}
                    >
                        <TextInput
                            value={data.machineName}
                            onChange={e => onUpdate('machineName', e.target.value)}
                            placeholder="e.g., Conveyor Belt CB-04"
                            hasError={!!errors.machineName}
                        />
                    </FormField>

                    <FormField
                        id="machineMoving"
                        label="Was the machine in motion at the time?"
                        required
                        error={errors.machineMoving}
                    >
                        <RadioGroup
                            name="machineMoving"
                            options={yesNoOptions}
                            value={machineMovingValue}
                            onChange={v => onUpdate('machineMoving', v === 'yes')}
                            hasError={!!errors.machineMoving}
                        />
                    </FormField>
                </>
            )}

            <FormField
                id="propertyLoss"
                label="Property damage / loss"
                helpText="Describe any damage to equipment, facilities, or materials. Leave blank if none."
                error={errors.propertyLoss}
            >
                <Textarea
                    value={data.propertyLoss}
                    onChange={e => onUpdate('propertyLoss', e.target.value)}
                    placeholder="e.g., Belt drive mechanism damaged — estimated repair cost ₹45,000"
                    rows={3}
                />
            </FormField>
        </div>
    );
};

export default StepReasonAndLoss;
