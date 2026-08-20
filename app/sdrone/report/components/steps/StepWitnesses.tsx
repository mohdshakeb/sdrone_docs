'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Select from '@/components/ui/Select';
import TextInput from '@/components/ui/TextInput';
import RadioGroup from '@/components/ui/RadioGroup';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { MOCK_EMPLOYEES } from '@/data/mock-data';
import type { IncidentFormData, StepErrors, Witness } from '../../types';
import styles from './Steps.module.css';

export interface StepWitnessesProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

const employeeOptions = [
    { value: '', label: 'Select employee' },
    ...MOCK_EMPLOYEES.map(e => ({ value: e.id, label: `${e.name} — ${e.role}` })),
];

const witnessTypeOptions = [
    { value: 'employee', label: 'Employee', description: 'Select from the employee directory' },
    { value: 'other',    label: 'Other',    description: 'Enter name manually' },
];

function createEmptyWitness(): Witness {
    return { id: crypto.randomUUID(), type: 'employee', employeeId: '', name: '' };
}

export const StepWitnesses: React.FC<StepWitnessesProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    const witnesses = data.witnesses;

    const updateWitness = (index: number, field: keyof Witness, value: unknown) => {
        const updated = witnesses.map((w, i) =>
            i === index ? { ...w, [field]: value } : w
        );
        onUpdate('witnesses', updated);
    };

    const addWitness = () => {
        onUpdate('witnesses', [...witnesses, createEmptyWitness()]);
    };

    const removeWitness = (index: number) => {
        onUpdate('witnesses', witnesses.filter((_, i) => i !== index));
    };

    const getError = (index: number, field: string) =>
        errors[`witnesses[${index}].${field}`];

    return (
        <div className={styles.fieldsWrapper}>
            <p className={['text-body', styles.stepHelpText].join(' ')}>
                Add anyone who witnessed the incident. This step is optional — leave empty if there were no witnesses.
            </p>

            {witnesses.map((witness, index) => (
                <div key={witness.id} className={styles.repeatableCard}>
                    <div className={styles.repeatableCardHeader}>
                        <span className={['text-caption-strong', styles.repeatableCardTitle].join(' ')}>
                            Witness {index + 1}
                        </span>
                        <button
                            type="button"
                            className={styles.removeRowBtn}
                            onClick={() => removeWitness(index)}
                            aria-label="Remove witness"
                        >
                            <Icon name="close" size={16} />
                        </button>
                    </div>

                    <FormField
                        id={`witnessType-${index}`}
                        label="Witness type"
                    >
                        <RadioGroup
                            name={`witnessType-${index}`}
                            options={witnessTypeOptions}
                            value={witness.type}
                            onChange={v => updateWitness(index, 'type', v as 'employee' | 'other')}
                        />
                    </FormField>

                    {witness.type === 'employee' ? (
                        <FormField
                            id={`witnessEmployee-${index}`}
                            label="Employee"
                            error={getError(index, 'employeeId')}
                        >
                            <Select
                                options={employeeOptions}
                                value={witness.employeeId ?? ''}
                                onChange={e => updateWitness(index, 'employeeId', e.target.value)}
                                hasError={!!getError(index, 'employeeId')}
                            />
                        </FormField>
                    ) : (
                        <FormField
                            id={`witnessName-${index}`}
                            label="Full name"
                            error={getError(index, 'name')}
                        >
                            <TextInput
                                value={witness.name ?? ''}
                                onChange={e => updateWitness(index, 'name', e.target.value)}
                                placeholder="Enter witness name"
                                hasError={!!getError(index, 'name')}
                            />
                        </FormField>
                    )}
                </div>
            ))}

            <div className={styles.addRowWrapper}>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={addWitness}
                    leadingIcon={<Icon name="add" size={16} />}
                >
                    Add witness
                </Button>
            </div>
        </div>
    );
};

export default StepWitnesses;
