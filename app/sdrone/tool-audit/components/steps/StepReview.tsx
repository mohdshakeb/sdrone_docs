'use client';

import React from 'react';
import styles from './Steps.module.css';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import PhotoGrid from './PhotoGrid';
import { auditTypeLabels, auditTypeBadgeColors, locationOptions, cseNameOptions } from '../../mockData';
import type { ToolAuditFormData, StepId } from '../../types';

export interface StepReviewProps {
    data: ToolAuditFormData;
    onGoToStep?: (step: StepId) => void;
}

function getLabel(options: { value: string; label: string }[], value: string): string {
    return options.find(o => o.value === value)?.label ?? value;
}

export const StepReview: React.FC<StepReviewProps> = ({ data, onGoToStep }) => {
    const totalTools = data.toolsChecklist.length;
    const goodCount = data.toolsChecklist.filter(t => t.condition === 'good').length;
    const damagedCount = data.toolsChecklist.filter(t => t.condition === 'damaged').length;
    const damagedTools = data.toolsChecklist.filter(t => t.condition === 'damaged');

    const EditBtn = ({ step }: { step: StepId }) =>
        onGoToStep ? (
            <button className={styles.reviewEditBtn} onClick={() => onGoToStep(step)} aria-label={`Edit ${step}`}>
                <Icon name="todo-line" size={14} />
                Edit
            </button>
        ) : null;

    return (
        <div className={styles.reviewContainer}>

            {/* Audit Details */}
            <div className={styles.reviewSection}>
                <div className={styles.reviewSectionHeader}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Audit Details
                    </h3>
                    <EditBtn step="audit-details" />
                </div>
                <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Audit Type</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {data.auditType && (
                                <Badge color={auditTypeBadgeColors[data.auditType]}>
                                    {auditTypeLabels[data.auditType]}
                                </Badge>
                            )}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Date</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{data.auditDate || '—'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Time</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{data.auditTime || '—'}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Location</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {data.auditLocation ? getLabel(locationOptions, data.auditLocation) : '—'}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>CSE Name</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {data.cseName ? getLabel(cseNameOptions, data.cseName) : '—'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tools Summary */}
            <div className={styles.reviewSection}>
                <div className={styles.reviewSectionHeader}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Tools Checklist
                    </h3>
                    <EditBtn step="tools-checklist" />
                </div>
                <div className={styles.reviewStats}>
                    <div className={styles.reviewStat}>
                        <span className={['text-body-strong', styles.reviewStatValue].join(' ')}>{totalTools}</span>
                        <span className={['text-caption', styles.reviewStatLabel].join(' ')}>Total</span>
                    </div>
                    <div className={styles.reviewStat}>
                        <span className={['text-body-strong', styles.reviewStatValue].join(' ')}>{goodCount}</span>
                        <span className={['text-caption', styles.reviewStatLabel].join(' ')}>Good</span>
                    </div>
                    <div className={styles.reviewStat}>
                        <span className={['text-body-strong', styles.reviewStatValue].join(' ')}>{damagedCount}</span>
                        <span className={['text-caption', styles.reviewStatLabel].join(' ')}>Damaged</span>
                    </div>
                </div>

                {damagedTools.length > 0 && (
                    <div className={styles.reviewDamagedList}>
                        {damagedTools.map(tool => (
                            <div key={tool.toolId} className={styles.reviewDamagedItem}>
                                <div className={styles.reviewDamagedNameRow}>
                                    <p className={['text-body-strong', styles.reviewDamagedName].join(' ')}>
                                        {tool.toolName}
                                    </p>
                                    <Badge color="negative" size="xsmall">Damaged</Badge>
                                </div>
                                {tool.remarks && (
                                    <p className={['text-caption', styles.reviewDamagedRemarks].join(' ')}>
                                        {tool.remarks}
                                    </p>
                                )}
                                {tool.images.length > 0 && (
                                    <PhotoGrid
                                        id={`review-images-${tool.toolId}`}
                                        files={tool.images}
                                        readOnly
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Conclusion */}
            <div className={styles.reviewSection}>
                <div className={styles.reviewSectionHeader}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Conclusion
                    </h3>
                    <EditBtn step="conclusion" />
                </div>
                <div className={styles.reviewGrid}>
                    {data.observations && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Observations</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>{data.observations}</span>
                        </div>
                    )}
                    {data.actionRequired && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Action Required</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>{data.actionRequired}</span>
                        </div>
                    )}
                    {data.responsibility && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Responsibility</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>{data.responsibility}</span>
                        </div>
                    )}
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Target Date</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{data.targetDate || '—'}</span>
                    </div>
                    {data.attachments.length > 0 && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Attachments</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.attachments.length} file{data.attachments.length !== 1 ? 's' : ''} attached
                            </span>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default StepReview;
