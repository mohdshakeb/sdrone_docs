'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import {
    siteOptions,
    bodyPartOptions,
    incidentTypeLabels,
    incidentTypeBadgeColors,
    contributingFactorOptions,
    treatmentOptions,
} from '../../mockData';
import type { IncidentFormData, IncidentType } from '../../types';
import styles from './Steps.module.css';

export interface StepReviewProps {
    data: IncidentFormData;
    inferredType: IncidentType;
}

// Helper to get label from options
const getLabel = (options: { value: string; label: string }[], value: string): string => {
    return options.find((opt) => opt.value === value)?.label ?? value;
};

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
const formatTime = (timeStr: string): string => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

export const StepReview: React.FC<StepReviewProps> = ({ data, inferredType }) => {
    const badgeColor = incidentTypeBadgeColors[inferredType];

    return (
        <div className={styles.reviewContainer}>
            {/* Incident Type */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Incident Classification
                </h3>
                <Badge color={badgeColor}>{incidentTypeLabels[inferredType]}</Badge>
            </div>

            {/* What Happened */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    What Happened
                </h3>
                <p className={['text-body', styles.reviewText].join(' ')}>
                    {data.description || '—'}
                </p>
                {data.immediateAction && (
                    <>
                        <h4 className={['text-caption', styles.reviewSubtitle].join(' ')}>
                            Immediate Action
                        </h4>
                        <p className={['text-body', styles.reviewText].join(' ')}>
                            {data.immediateAction}
                        </p>
                    </>
                )}
            </div>

            {/* When & Where */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    When & Where
                </h3>
                <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Date</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {formatDate(data.dateOccurred)}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Time</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {formatTime(data.timeOccurred)}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Site</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {getLabel(siteOptions, data.site)}
                        </span>
                    </div>
                    {data.area && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Area</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.area}
                            </span>
                        </div>
                    )}
                    {data.asset && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Asset</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.asset}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Injury Details */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Injury Information
                </h3>
                {data.wasInjured ? (
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Injured Person</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.injuredEmployee}
                            </span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Body Part</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {getLabel(bodyPartOptions, data.bodyPart)}
                            </span>
                        </div>
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Treatment</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.treatment ? getLabel(treatmentOptions, data.treatment) : '—'}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className={['text-body', styles.reviewText].join(' ')}>No injuries reported</p>
                )}
            </div>

            {/* Contributing Factors */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Contributing Factors
                </h3>
                <p className={['text-body', styles.reviewText].join(' ')}>
                    {data.contributingFactor
                        ? getLabel(contributingFactorOptions, data.contributingFactor)
                        : '—'}
                </p>
                {data.contributingNotes && (
                    <p className={['text-body', styles.reviewTextSecondary].join(' ')}>
                        {data.contributingNotes}
                    </p>
                )}
            </div>

            {/* Evidence */}
            {(data.photos.length > 0 || data.attachments.length > 0) && (
                <div className={styles.reviewSection}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Evidence
                    </h3>
                    {data.photos.length > 0 && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Photos</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.photos.length} file{data.photos.length !== 1 ? 's' : ''} attached
                            </span>
                        </div>
                    )}
                    {data.attachments.length > 0 && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Attachments</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.attachments.length} file{data.attachments.length !== 1 ? 's' : ''} attached
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Corrective Action */}
            {data.correctiveAction && (
                <div className={styles.reviewSection}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Suggested Corrective Action
                    </h3>
                    <p className={['text-body', styles.reviewText].join(' ')}>
                        {data.correctiveAction}
                    </p>
                </div>
            )}
        </div>
    );
};

export default StepReview;
