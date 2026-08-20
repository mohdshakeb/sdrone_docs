'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { MOCK_EMPLOYEES } from '@/data/mock-data';
import type { IncidentFormData, StepErrors, CorrectiveAction, IncidentType } from '../../types';
import styles from './Steps.module.css';

export interface StepCorrectiveActionsProps {
    data: IncidentFormData;
    errors: StepErrors;
    inferredType: IncidentType;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

const employeeOptions = [
    { value: '', label: 'Select responsible person' },
    ...MOCK_EMPLOYEES.map(e => ({ value: e.id, label: `${e.name} — ${e.role}` })),
];

function createEmptyAction(): CorrectiveAction {
    return {
        id: crypto.randomUUID(),
        action: '',
        responsibilityEmployeeId: '',
        timeline: '',
    };
}

export const StepCorrectiveActions: React.FC<StepCorrectiveActionsProps> = ({
    data,
    errors,
    inferredType,
    onUpdate,
}) => {
    const isADR = inferredType === 'adr';

    // First Aid: simple text field
    if (!isADR) {
        return (
            <div className={styles.fieldsWrapper}>
                <FormField
                    id="correctiveActionText"
                    label="Suggested corrective action"
                    helpText="What steps could be taken to prevent similar incidents in the future?"
                    error={errors.correctiveActionText}
                >
                    <Textarea
                        value={data.correctiveActionText}
                        onChange={e => onUpdate('correctiveActionText', e.target.value)}
                        placeholder="Describe any recommendations for preventing future incidents..."
                        rows={5}
                    />
                </FormField>
            </div>
        );
    }

    // ADR: repeatable action items
    const actions = data.correctiveActions.length > 0
        ? data.correctiveActions
        : [createEmptyAction()];

    React.useEffect(() => {
        if (data.correctiveActions.length === 0) {
            onUpdate('correctiveActions', [createEmptyAction()]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateAction = (index: number, field: keyof CorrectiveAction, value: string) => {
        const updated = actions.map((a, i) =>
            i === index ? { ...a, [field]: value } : a
        );
        onUpdate('correctiveActions', updated);
    };

    const addAction = () => {
        onUpdate('correctiveActions', [...actions, createEmptyAction()]);
    };

    const removeAction = (index: number) => {
        const updated = actions.filter((_, i) => i !== index);
        onUpdate('correctiveActions', updated.length > 0 ? updated : [createEmptyAction()]);
    };

    const getError = (index: number, field: string) =>
        errors[`correctiveActions[${index}].${field}`];

    return (
        <div className={styles.fieldsWrapper}>
            {actions.map((action, index) => (
                <div key={action.id} className={styles.repeatableCard}>
                    {actions.length > 1 && (
                        <div className={styles.repeatableCardHeader}>
                            <span className={['text-caption-strong', styles.repeatableCardTitle].join(' ')}>
                                Action {index + 1}
                            </span>
                            <button
                                type="button"
                                className={styles.removeRowBtn}
                                onClick={() => removeAction(index)}
                                aria-label="Remove action"
                            >
                                <Icon name="close" size={16} />
                            </button>
                        </div>
                    )}

                    <FormField
                        id={`action-${index}`}
                        label="Action"
                        required
                        error={getError(index, 'action')}
                    >
                        <TextInput
                            value={action.action}
                            onChange={e => updateAction(index, 'action', e.target.value)}
                            placeholder="Describe the corrective action"
                            hasError={!!getError(index, 'action')}
                        />
                    </FormField>

                    <div className={styles.fieldRow}>
                        <FormField
                            id={`responsibility-${index}`}
                            label="Responsible person"
                            required
                            error={getError(index, 'responsibilityEmployeeId')}
                        >
                            <Select
                                options={employeeOptions}
                                value={action.responsibilityEmployeeId}
                                onChange={e => updateAction(index, 'responsibilityEmployeeId', e.target.value)}
                                hasError={!!getError(index, 'responsibilityEmployeeId')}
                            />
                        </FormField>

                        <FormField
                            id={`timeline-${index}`}
                            label="Target date"
                            required
                            error={getError(index, 'timeline')}
                        >
                            <TextInput
                                type="date"
                                value={action.timeline}
                                onChange={e => updateAction(index, 'timeline', e.target.value)}
                                hasError={!!getError(index, 'timeline')}
                            />
                        </FormField>
                    </div>
                </div>
            ))}

            <div className={styles.addRowWrapper}>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={addAction}
                    leadingIcon={<Icon name="add" size={16} />}
                >
                    Add action
                </Button>
            </div>
        </div>
    );
};

export default StepCorrectiveActions;
