'use client';

import React from 'react';
import styles from './ToolChecklistItem.module.css';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import PhotoGrid from './PhotoGrid';
import Icon from '@/components/ui/Icon';
import type { ToolChecklistEntry, ToolCondition, StepErrors } from '../../types';

export interface ToolChecklistItemProps {
    tool: ToolChecklistEntry;
    index: number;
    errors: StepErrors;
    onConditionChange: (toolId: string, condition: ToolCondition) => void;
    onRemarksChange: (toolId: string, remarks: string) => void;
    onImagesChange: (toolId: string, images: File[]) => void;
}

export const ToolChecklistItem: React.FC<ToolChecklistItemProps> = ({
    tool,
    index,
    errors,
    onConditionChange,
    onRemarksChange,
    onImagesChange,
}) => {
    const conditionError = errors[`tool_${tool.toolId}_condition`];
    const remarksError = errors[`tool_${tool.toolId}_remarks`];
    const imagesError = errors[`tool_${tool.toolId}_images`];

    const okayButtonClass = [
        styles.conditionButton,
        tool.condition === 'good' && styles.conditionButtonGood,
    ].filter(Boolean).join(' ');

    const damagedButtonClass = [
        styles.conditionButton,
        tool.condition === 'damaged' && styles.conditionButtonDamaged,
    ].filter(Boolean).join(' ');

    return (
        <div className={styles.item}>
            <h4 className={['text-body-strong', styles.toolHeader].join(' ')}>
                {index + 1}. {tool.toolName}
                <span className={styles.requiredMark}> *</span>
            </h4>

            <div className={styles.toolMeta}>
                <span className={['text-caption', styles.toolMetaItem].join(' ')}>
                    <span className={styles.toolMetaLabel}>Spec: </span>
                    {tool.specification}
                </span>
                <span className={['text-caption', styles.toolMetaItem].join(' ')}>
                    <span className={styles.toolMetaLabel}>Checkpoint: </span>
                    {tool.checkpoint}
                </span>
            </div>

            <div className={styles.conditionRow}>
                <button
                    type="button"
                    className={okayButtonClass}
                    onClick={() => onConditionChange(tool.toolId, 'good')}
                    aria-pressed={tool.condition === 'good'}
                >
                    <Icon name="check" size={14} />
                    Good
                </button>
                <button
                    type="button"
                    className={damagedButtonClass}
                    onClick={() => onConditionChange(tool.toolId, 'damaged')}
                    aria-pressed={tool.condition === 'damaged'}
                >
                    <Icon name="close" size={14} />
                    Damaged
                </button>
            </div>

            {conditionError && (
                <p className={['text-caption', styles.conditionError].join(' ')}>
                    {conditionError}
                </p>
            )}

            {tool.condition === 'damaged' && (
                <div className={styles.damagedFields}>
                    <PhotoGrid
                        id={`images-${tool.toolId}`}
                        files={tool.images}
                        onChange={(files) => onImagesChange(tool.toolId, files)}
                        maxFiles={5}
                        hasError={!!imagesError}
                        helpText={imagesError ?? 'At least 1 photo required'}
                    />

                    <FormField
                        id={`remarks-${tool.toolId}`}
                        label="Remarks"
                        required
                        error={remarksError}
                    >
                        <Textarea
                            value={tool.remarks}
                            onChange={(e) => onRemarksChange(tool.toolId, e.target.value)}
                            placeholder="Describe the damage or issue..."
                            hasError={!!remarksError}
                            rows={2}
                        />
                    </FormField>
                </div>
            )}
        </div>
    );
};

export default ToolChecklistItem;
