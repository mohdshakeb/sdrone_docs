'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import type { HistoryRecord, RecordStatus } from '@/types/history';
import styles from './NextStepBanner.module.css';

export interface NextStepBannerProps {
    /** The record to check for next steps */
    record: HistoryRecord;
    /** Current user's role (for permission checking) */
    userRole?: string;
    /** Callback when action button is clicked */
    onAction?: () => void;
}

// Map status to next step message and action
const getNextStepInfo = (
    record: HistoryRecord,
    userRole?: string
): {
    message: string;
    actionLabel?: string;
    showAction: boolean;
    responsiblePerson?: string;
} | null => {
    switch (record.status) {
        case 'Submitted':
            return {
                message: 'Awaiting initial review',
                actionLabel: 'Start Review',
                showAction: userRole === 'Safety Officer' || userRole === 'HSE Manager',
                responsiblePerson: 'Safety Officer',
            };

        case 'Under Review':
            const isOwner = record.owner?.role === userRole;
            return {
                message: `Under review by ${record.owner?.name || 'Safety team'}`,
                actionLabel: 'Complete Review',
                showAction: isOwner,
                responsiblePerson: record.owner?.name,
            };

        case 'Action Required':
            const isActionOwner = record.owner?.role === userRole;
            return {
                message: `Action required from ${record.owner?.name || 'assigned owner'}`,
                actionLabel: 'Take Action',
                showAction: isActionOwner,
                responsiblePerson: record.owner?.name,
            };

        case 'Escalated':
            return {
                message: 'This record has been escalated for management attention',
                actionLabel: 'Review Escalation',
                showAction: userRole === 'HSE Manager' || userRole === 'Management',
                responsiblePerson: 'HSE Manager',
            };

        case 'Draft':
            return {
                message: 'This record is a draft and has not been submitted',
                actionLabel: 'Submit Record',
                showAction: record.reportedBy.role === userRole,
                responsiblePerson: record.reportedBy.name,
            };

        case 'Closed':
            // No next step for closed records
            return null;

        default:
            return null;
    }
};

/**
 * NextStepBanner - Contextual banner showing next action needed for a record
 * Displays different messages and CTAs based on record status and user permissions
 */
export const NextStepBanner: React.FC<NextStepBannerProps> = ({
    record,
    userRole,
    onAction,
}) => {
    const nextStep = getNextStepInfo(record, userRole);

    // Don't render if no next step (e.g., closed records)
    if (!nextStep) {
        return null;
    }

    return (
        <div className={styles.banner}>
            <div className={styles.content}>
                <Icon name="alert" size={20} className={styles.icon} />
                <div className={styles.textContainer}>
                    <span className={`${styles.message} text-body-strong`}>
                        {nextStep.message}
                    </span>
                    {!nextStep.showAction && nextStep.responsiblePerson && (
                        <span className={`${styles.responsible} text-caption`}>
                            Responsible: {nextStep.responsiblePerson}
                        </span>
                    )}
                </div>
            </div>

            {nextStep.showAction && nextStep.actionLabel && onAction && (
                <Button
                    size="sm"
                    variant="primary"
                    onClick={onAction}
                >
                    {nextStep.actionLabel}
                </Button>
            )}
        </div>
    );
};

export default NextStepBanner;
