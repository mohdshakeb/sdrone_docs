'use client';

import React from 'react';
import styles from './Steps.module.css';
import ToolChecklistItem from './ToolChecklistItem';
import type { ToolAuditFormData, ToolCondition, StepErrors } from '../../types';

export interface StepToolsChecklistProps {
    data: ToolAuditFormData;
    errors: StepErrors;
    onConditionChange: (toolId: string, condition: ToolCondition) => void;
    onRemarksChange: (toolId: string, remarks: string) => void;
    onImagesChange: (toolId: string, images: File[]) => void;
}

export const StepToolsChecklist: React.FC<StepToolsChecklistProps> = ({
    data,
    errors,
    onConditionChange,
    onRemarksChange,
    onImagesChange,
}) => {
    const checkedCount = data.toolsChecklist.filter((t) => t.condition !== null).length;
    const totalCount = data.toolsChecklist.length;
    const damagedCount = data.toolsChecklist.filter((t) => t.condition === 'damaged').length;

    return (
        <div className={styles.fieldsWrapper}>
            <div className={styles.checklistSummary}>
                <span className={['text-caption-strong', styles.summaryCount].join(' ')}>
                    {checkedCount} of {totalCount} tools checked
                </span>
                {damagedCount > 0 && (
                    <>
                        <span className={styles.summaryDot} />
                        <span className={['text-caption-strong', styles.summaryDamaged].join(' ')}>
                            {damagedCount} damaged
                        </span>
                    </>
                )}
            </div>

            <div className={styles.checklistContainer}>
                {data.toolsChecklist.map((tool) => (
                    <ToolChecklistItem
                        key={tool.toolId}
                        tool={tool}
                        errors={errors}
                        onConditionChange={onConditionChange}
                        onRemarksChange={onRemarksChange}
                        onImagesChange={onImagesChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default StepToolsChecklist;
