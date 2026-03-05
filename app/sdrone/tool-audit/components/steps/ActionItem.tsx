'use client';

import React from 'react';
import styles from './ActionItem.module.css';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import type { ActionItem as ActionItemType, StepErrors } from '../../types';

export interface ActionItemProps {
    action: ActionItemType;
    index: number;
    errors: StepErrors;
    onUpdate: (id: string, field: 'description' | 'responsibility' | 'targetDate', value: string) => void;
    onRemove: (id: string) => void;
}

export const ActionItemCard: React.FC<ActionItemProps> = ({
    action,
    index,
    errors,
    onUpdate,
    onRemove,
}) => {
    return (
        <div className={styles.actionCard}>
            <div className={styles.actionHeader}>
                <h4 className={['text-body-strong', styles.actionTitle].join(' ')}>
                    Action #{index + 1}
                </h4>
                <Button
                    variant="ghost"
                    size="sm"
                    iconOnly
                    onClick={() => onRemove(action.id)}
                    aria-label={`Remove action ${index + 1}`}
                    leadingIcon={<Icon name="delete" size={16} />}
                />
            </div>

            <div className={styles.actionFields}>
                <FormField
                    id={`action-desc-${action.id}`}
                    label="Description"
                    required
                    error={errors[`action_${action.id}_description`]}
                >
                    <TextInput
                        value={action.description}
                        onChange={(e) => onUpdate(action.id, 'description', e.target.value)}
                        placeholder="Describe the action required..."
                        hasError={!!errors[`action_${action.id}_description`]}
                    />
                </FormField>

                <div className={styles.actionFieldRow}>
                    <FormField
                        id={`action-resp-${action.id}`}
                        label="Responsibility"
                        required
                        error={errors[`action_${action.id}_responsibility`]}
                    >
                        <TextInput
                            value={action.responsibility}
                            onChange={(e) => onUpdate(action.id, 'responsibility', e.target.value)}
                            placeholder="Person or role responsible"
                            hasError={!!errors[`action_${action.id}_responsibility`]}
                        />
                    </FormField>

                    <FormField
                        id={`action-date-${action.id}`}
                        label="Target Date"
                        required
                        error={errors[`action_${action.id}_targetDate`]}
                    >
                        <TextInput
                            type="date"
                            value={action.targetDate}
                            onChange={(e) => onUpdate(action.id, 'targetDate', e.target.value)}
                            hasError={!!errors[`action_${action.id}_targetDate`]}
                        />
                    </FormField>
                </div>
            </div>
        </div>
    );
};

export default ActionItemCard;
