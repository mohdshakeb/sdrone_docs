'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { MOCK_EMPLOYEES } from '@/data/mock-data';
import type { IncidentFormData, StepErrors, InvestigationMember } from '../../types';
import styles from './Steps.module.css';

export interface StepInvestigationTeamProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

const employeeOptions = [
    { value: '', label: 'Select employee' },
    ...MOCK_EMPLOYEES.map(e => ({ value: e.id, label: `${e.name} — ${e.role}` })),
];

function createEmptyMember(): InvestigationMember {
    return { id: crypto.randomUUID(), employeeId: '' };
}

export const StepInvestigationTeam: React.FC<StepInvestigationTeamProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    const members = data.investigationTeam.length > 0
        ? data.investigationTeam
        : [createEmptyMember()];

    React.useEffect(() => {
        if (data.investigationTeam.length === 0) {
            onUpdate('investigationTeam', [createEmptyMember()]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateMember = (index: number, employeeId: string) => {
        const updated = members.map((m, i) =>
            i === index ? { ...m, employeeId } : m
        );
        onUpdate('investigationTeam', updated);
    };

    const addMember = () => {
        onUpdate('investigationTeam', [...members, createEmptyMember()]);
    };

    const removeMember = (index: number) => {
        const updated = members.filter((_, i) => i !== index);
        onUpdate('investigationTeam', updated.length > 0 ? updated : [createEmptyMember()]);
    };

    const getError = (index: number) =>
        errors[`investigationTeam[${index}].employeeId`];

    return (
        <div className={styles.fieldsWrapper}>
            <p className={['text-body', styles.stepHelpText].join(' ')}>
                Select the employees who will investigate this incident. At least one member is required.
            </p>

            {members.map((member, index) => (
                <div key={member.id} className={styles.repeatableCard}>
                    <div className={styles.repeatableCardHeader}>
                        <span className={['text-caption-strong', styles.repeatableCardTitle].join(' ')}>
                            Member {index + 1}
                        </span>
                        {members.length > 1 && (
                            <button
                                type="button"
                                className={styles.removeRowBtn}
                                onClick={() => removeMember(index)}
                                aria-label="Remove member"
                            >
                                <Icon name="close" size={16} />
                            </button>
                        )}
                    </div>

                    <FormField
                        id={`investigationMember-${index}`}
                        label="Employee"
                        required
                        error={getError(index)}
                    >
                        <Select
                            options={employeeOptions}
                            value={member.employeeId}
                            onChange={e => updateMember(index, e.target.value)}
                            hasError={!!getError(index)}
                        />
                    </FormField>
                </div>
            ))}

            <div className={styles.addRowWrapper}>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={addMember}
                    leadingIcon={<Icon name="add" size={16} />}
                >
                    Add team member
                </Button>
            </div>
        </div>
    );
};

export default StepInvestigationTeam;
