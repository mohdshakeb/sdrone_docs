'use client';

import React from 'react';
import styles from './Steps.module.css';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import ActionItemCard from './ActionItem';
import type { ToolAuditFormData, StepErrors } from '../../types';

export interface StepObservationsActionsProps {
    data: ToolAuditFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof ToolAuditFormData>(field: K, value: ToolAuditFormData[K]) => void;
    onAddAction: () => void;
    onRemoveAction: (id: string) => void;
    onUpdateAction: (id: string, field: 'description' | 'responsibility' | 'targetDate', value: string) => void;
}

export const StepObservationsActions: React.FC<StepObservationsActionsProps> = ({
    data,
    errors,
    onUpdate,
    onAddAction,
    onRemoveAction,
    onUpdateAction,
}) => {
    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="overallObservations"
                label="Overall Observations"
                helpText="General observations about the audit findings"
            >
                <Textarea
                    value={data.overallObservations}
                    onChange={(e) => onUpdate('overallObservations', e.target.value)}
                    placeholder="Enter any overall observations..."
                    rows={4}
                />
            </FormField>

            <div className={styles.actionsSection}>
                <div className={styles.actionsSectionHeader}>
                    <h3 className={['text-body-strong', styles.actionsSectionTitle].join(' ')}>
                        Actions Required
                    </h3>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onAddAction}
                        leadingIcon={<Icon name="add" size={16} />}
                    >
                        Add Action
                    </Button>
                </div>

                {data.actions.length === 0 ? (
                    <div className={styles.actionsEmpty}>
                        <p className="text-body">No actions added yet</p>
                    </div>
                ) : (
                    data.actions.map((action, index) => (
                        <ActionItemCard
                            key={action.id}
                            action={action}
                            index={index}
                            errors={errors}
                            onUpdate={onUpdateAction}
                            onRemove={onRemoveAction}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default StepObservationsActions;
