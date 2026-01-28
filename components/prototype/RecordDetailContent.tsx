'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { HistoryRecord } from '@/types/history';
import { STATUS_BADGE_COLORS, CATEGORY_ICONS } from '@/types/history';
import styles from './RecordDetailContent.module.css';

export interface RecordDetailContentProps {
    /** The record to display */
    record: HistoryRecord;
}

// Helper to format date
const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Helper to format time
const formatTime = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * RecordDetailContent - Displays record details following the StepReview design pattern
 * Uses reviewContainer, reviewSection, reviewGrid structure
 */
export const RecordDetailContent: React.FC<RecordDetailContentProps> = ({
    record,
}) => {
    const badgeColor = STATUS_BADGE_COLORS[record.status];

    return (
        <div className={styles.reviewContainer}>
            {/* Classification */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Classification
                </h3>
                <div className={styles.classificationRow}>
                    <Badge color={badgeColor}>{record.status}</Badge>
                    <span className={`text-body ${styles.typeText}`}>
                        {record.category} - {record.type}
                    </span>
                </div>
            </div>

            {/* Details */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Details
                </h3>
                <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Location</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {record.location.name}
                            {record.location.area && ` - ${record.location.area}`}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Reported By</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {record.reportedBy.name}
                            <span className={styles.roleText}>{record.reportedBy.role}</span>
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Created</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {formatDate(record.createdAt)}
                            <span className={styles.timeText}>{formatTime(record.createdAt)}</span>
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Last Updated</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {formatDate(record.updatedAt)}
                            <span className={styles.timeText}>{formatTime(record.updatedAt)}</span>
                        </span>
                    </div>
                    {record.owner && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Current Owner</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {record.owner.name}
                                <span className={styles.roleText}>{record.owner.role}</span>
                            </span>
                        </div>
                    )}
                    {record.closedBy && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Closed By</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {record.closedBy.name}
                                <span className={styles.roleText}>{record.closedBy.role}</span>
                                <span className={styles.timeText}>
                                    {formatDate(record.closedBy.timestamp)}
                                </span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Description
                </h3>
                <p className={['text-body', styles.reviewText].join(' ')}>
                    {record.description || 'No description provided.'}
                </p>
            </div>

            {/* Record ID */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Record ID
                </h3>
                <p className={['text-body', styles.recordId].join(' ')}>
                    {record.id}
                </p>
            </div>
        </div>
    );
};

export default RecordDetailContent;
