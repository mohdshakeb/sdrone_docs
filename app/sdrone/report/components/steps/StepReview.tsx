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

// Helper to format submission date/time
const formatSubmissionDateTime = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

export const StepReview: React.FC<StepReviewProps> = ({ data, inferredType }) => {
    const badgeColor = incidentTypeBadgeColors[inferredType];
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Mock report metadata
    const reportMetadata = React.useMemo(() => ({
        reportId: 'INC-2026-00123',
        reportedBy: 'Michael Johnson',
        reporterRole: 'Site Supervisor',
        submittedAt: new Date(2026, 0, 28, 14, 0), // Stable date for prototype
        submissionLocation: 'Main Office',
    }), []);

    if (!mounted) {
        return <div className={styles.reviewContainer}>Loading review...</div>;
    }


    return (
        <div className={styles.reviewContainer}>
            {/* Report Details */}
            <div className={styles.reviewSection}>
                <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                    Report Details
                </h3>
                <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Report ID</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {reportMetadata.reportId}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Reported By</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {reportMetadata.reportedBy}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Role</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {reportMetadata.reporterRole}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Submitted</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {formatSubmissionDateTime(reportMetadata.submittedAt)}
                        </span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Location</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>
                            {reportMetadata.submissionLocation}
                        </span>
                    </div>
                </div>
            </div>

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
                {data.wasInjured || data.selectedType === 'first-aid' ? (
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

            {/* First Aid Specifics */}
            {data.selectedType === 'first-aid' && data.medicineUsed !== null && (
                <div className={styles.reviewSection}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        First Aid Specifics
                    </h3>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Medicine Applied</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.medicineUsed ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                    {data.medicineUsed && data.medicineDetails && (
                        <>
                            <h4 className={['text-caption', styles.reviewSubtitle].join(' ')}>
                                Medicine Details
                            </h4>
                            <p className={['text-body', styles.reviewText].join(' ')}>
                                {data.medicineDetails}
                            </p>
                        </>
                    )}
                </div>
            )}

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
