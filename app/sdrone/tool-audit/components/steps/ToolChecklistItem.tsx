'use client';

import React from 'react';
import styles from './ToolChecklistItem.module.css';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import FileInput from '@/components/ui/FileInput';
import Icon from '@/components/ui/Icon';
import type { ToolChecklistEntry, ToolCondition, StepErrors } from '../../types';

export interface ToolChecklistItemProps {
    tool: ToolChecklistEntry;
    errors: StepErrors;
    onConditionChange: (toolId: string, condition: ToolCondition) => void;
    onRemarksChange: (toolId: string, remarks: string) => void;
    onImagesChange: (toolId: string, images: File[]) => void;
}

export const ToolChecklistItem: React.FC<ToolChecklistItemProps> = ({
    tool,
    errors,
    onConditionChange,
    onRemarksChange,
    onImagesChange,
}) => {
    const conditionError = errors[`tool_${tool.toolId}_condition`];
    const remarksError = errors[`tool_${tool.toolId}_remarks`];
    const imagesError = errors[`tool_${tool.toolId}_images`];

    const cardClass = [
        styles.toolCard,
        tool.condition === 'okay' && styles.toolCardOkay,
        tool.condition === 'damaged' && styles.toolCardDamaged,
        tool.condition === null && styles.toolCardPending,
        conditionError && styles.toolCardError,
    ].filter(Boolean).join(' ');

    const okayButtonClass = [
        styles.conditionButton,
        tool.condition === 'okay' && styles.conditionButtonOkay,
    ].filter(Boolean).join(' ');

    const damagedButtonClass = [
        styles.conditionButton,
        tool.condition === 'damaged' && styles.conditionButtonDamaged,
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClass}>
            <h4 className={['text-body-strong', styles.toolHeader].join(' ')}>
                {tool.toolName}
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
                    onClick={() => onConditionChange(tool.toolId, 'okay')}
                    aria-pressed={tool.condition === 'okay'}
                >
                    <Icon name="check" size={16} />
                    Okay
                </button>
                <button
                    type="button"
                    className={damagedButtonClass}
                    onClick={() => onConditionChange(tool.toolId, 'damaged')}
                    aria-pressed={tool.condition === 'damaged'}
                >
                    <Icon name="close" size={16} />
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

                    <FormField
                        id={`images-${tool.toolId}`}
                        label="Images"
                        required
                        error={imagesError}
                    >
                        <FileInput
                            id={`images-${tool.toolId}`}
                            accept="image/*"
                            multiple
                            maxFiles={5}
                            maxSize={10 * 1024 * 1024}
                            files={tool.images}
                            onChange={(files) => onImagesChange(tool.toolId, files)}
                            placeholder="Upload photos of the damage"
                            helpText="At least 1 image required"
                        />
                    </FormField>
                </div>
            )}
        </div>
    );
};

export default ToolChecklistItem;
