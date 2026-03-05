'use client';

import React from 'react';
import styles from './Steps.module.css';
import Badge from '@/components/ui/Badge';
import { auditTypeLabels, auditTypeBadgeColors, locationOptions, cseNameOptions } from '../../mockData';
import type { ToolAuditFormData } from '../../types';

export interface StepReviewProps {
    data: ToolAuditFormData;
}

function getLabel(options: { value: string; label: string }[], value: string): string {
    return options.find((o) => o.value === value)?.label ?? value;
}

export const StepReview: React.FC<StepReviewProps> = ({ data }) => {
    const totalTools = data.toolsChecklist.length;
    const okayCount = data.toolsChecklist.filter((t) => t.condition === 'okay').length;
    const damagedCount = data.toolsChecklist.filter((t) => t.condition === 'damaged').length;
    const damagedTools = data.toolsChecklist.filter((t) => t.condition === 'damaged');

    return (
        <div className={styles.reviewContainer}>
            {/* Audit Details */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Audit Details
                </h3>
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
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {data.auditDate || '\u2014'}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Time</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {data.auditTime || '\u2014'}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Location</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {data.auditLocation ? getLabel(locationOptions, data.auditLocation) : '\u2014'}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>CSE Name</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {data.cseName ? getLabel(cseNameOptions, data.cseName) : '\u2014'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tools Summary */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Tools Summary
                </h3>
                <div className={styles.reviewStats}>
                    <div className={styles.reviewStat}>
                        <span className={['text-body-strong', styles.reviewStatValue].join(' ')}>
                            {totalTools}
                        </span>
                        <span className={['text-caption', styles.reviewStatLabel].join(' ')}>
                            Total
                        </span>
                    </div>
                    <div className={styles.reviewStat}>
                        <span className={['text-body-strong', styles.reviewStatValue].join(' ')}>
                            {okayCount}
                        </span>
                        <span className={['text-caption', styles.reviewStatLabel].join(' ')}>
                            Okay
                        </span>
                    </div>
                    <div className={styles.reviewStat}>
                        <span className={['text-body-strong', styles.reviewStatValue].join(' ')}>
                            {damagedCount}
                        </span>
                        <span className={['text-caption', styles.reviewStatLabel].join(' ')}>
                            Damaged
                        </span>
                    </div>
                </div>

                {damagedTools.length > 0 && (
                    <div className={styles.reviewDamagedList}>
                        {damagedTools.map((tool) => (
                            <div key={tool.toolId} className={styles.reviewDamagedItem}>
                                <p className={['text-body-strong', styles.reviewDamagedName].join(' ')}>
                                    {tool.toolName}
                                </p>
                                <p className={['text-caption', styles.reviewDamagedRemarks].join(' ')}>
                                    {tool.remarks}
                                </p>
                                {tool.images.length > 0 && (
                                    <p className={['text-caption', styles.reviewDamagedRemarks].join(' ')}>
                                        {tool.images.length} image{tool.images.length !== 1 ? 's' : ''} attached
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Overall Observations */}
            {data.overallObservations && (
                <div className={styles.reviewSection}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Overall Observations
                    </h3>
                    <p className={['text-body', styles.reviewText].join(' ')}>
                        {data.overallObservations}
                    </p>
                </div>
            )}

            {/* Actions Required */}
            {data.actions.length > 0 && (
                <div className={styles.reviewSection}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Actions Required ({data.actions.length})
                    </h3>
                    <div className={styles.reviewActionList}>
                        {data.actions.map((action, index) => (
                            <div key={action.id} className={styles.reviewActionItem}>
                                <div className={styles.reviewGrid}>
                                    <div className={styles.reviewItem}>
                                        <span className={['text-caption', styles.reviewLabel].join(' ')}>
                                            Action #{index + 1}
                                        </span>
                                        <span className={['text-body', styles.reviewValue].join(' ')}>
                                            {action.description}
                                        </span>
                                    </div>
                                    <div className={styles.reviewItem}>
                                        <span className={['text-caption', styles.reviewLabel].join(' ')}>
                                            Responsibility
                                        </span>
                                        <span className={['text-body', styles.reviewValue].join(' ')}>
                                            {action.responsibility}
                                        </span>
                                    </div>
                                    <div className={styles.reviewItem}>
                                        <span className={['text-caption', styles.reviewLabel].join(' ')}>
                                            Target Date
                                        </span>
                                        <span className={['text-body', styles.reviewValue].join(' ')}>
                                            {action.targetDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Attachments */}
            {data.attachments.length > 0 && (
                <div className={styles.reviewSection}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Attachments
                    </h3>
                    <p className={['text-body', styles.reviewText].join(' ')}>
                        {data.attachments.length} file{data.attachments.length !== 1 ? 's' : ''} attached
                    </p>
                </div>
            )}
        </div>
    );
};

export default StepReview;
