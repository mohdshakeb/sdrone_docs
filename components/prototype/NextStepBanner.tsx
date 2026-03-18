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
        case 'Pending':
            return {
                message: `Assigned — awaiting submission from ${record.owner?.name || 'assigned owner'}`,
                actionLabel: 'Submit Record',
                showAction: record.owner?.role === userRole,
                responsiblePerson: record.owner?.name,
            };

        case 'Under Review':
            const isOwner = record.owner?.role === userRole;
            return {
                message: `Under review by ${record.owner?.name || 'Safety team'}`,
                actionLabel: 'Complete Review',
                showAction: isOwner,
                responsiblePerson: record.owner?.name,
            };

        case 'On Hold':
            const isHoldOwner = record.owner?.role === userRole;
            return {
                message: `On hold — awaiting response from ${record.owner?.name || 'assigned owner'}`,
                actionLabel: 'Take Action',
                showAction: isHoldOwner,
                responsiblePerson: record.owner?.name,
            };

        case 'Escalated':
            return {
                message: 'Escalated for management attention',
                actionLabel: 'Review Escalation',
                showAction: userRole === 'HSE Manager' || userRole === 'Management',
                responsiblePerson: 'HSE Manager',
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
