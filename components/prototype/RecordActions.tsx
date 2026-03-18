'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { useRole } from '@/components/prototype/RoleProvider';
import type { HistoryRecord } from '@/types/history';
import styles from './RecordActions.module.css';

export interface RecordActionsProps {
    record: HistoryRecord;
}

/**
 * RecordActions - Role-gated action buttons for record detail pages.
 * Shows different actions based on record status and the current user's role permissions.
 */
export const RecordActions: React.FC<RecordActionsProps> = ({ record }) => {
    const { role } = useRole();
    const { canAssign, canReview, canClose, canEscalate } = role.permissions;
    const status = record.status;

    // Submitters don't get actions on their own reports
    const isSubmitter = record.reportedBy.name === role.userName;
    if (isSubmitter) return null;

    const handleAction = (action: string) => {
        alert(`"${action}" action would be performed on record "${record.title}".`);
    };

    // Determine which actions to show based on status and permissions
    const actions: { label: string; variant: 'primary' | 'secondary'; icon: string; action: string }[] = [];

    switch (status) {
        case 'Pending':
            // Assignee can submit their pending records
            actions.push({ label: 'Submit Record', variant: 'primary', icon: 'send', action: 'Submit' });
            if (canAssign) actions.push({ label: 'Reassign', variant: 'secondary', icon: 'user', action: 'Reassign' });
            break;

        case 'Under Review':
            if (canReview) actions.push({ label: 'Send Back', variant: 'secondary', icon: 'arrow-left', action: 'Send Back' });
            if (canEscalate) actions.push({ label: 'Escalate', variant: 'secondary', icon: 'arrow-up', action: 'Escalate' });
            if (canClose) actions.push({ label: 'Close', variant: 'primary', icon: 'checkbox-circle', action: 'Close' });
            break;

        case 'On Hold':
            if (canAssign) actions.push({ label: 'Reassign', variant: 'secondary', icon: 'user', action: 'Reassign' });
            if (canReview) actions.push({ label: 'Review', variant: 'secondary', icon: 'archive', action: 'Review' });
            if (canClose) actions.push({ label: 'Close', variant: 'primary', icon: 'checkbox-circle', action: 'Close' });
            break;

        case 'Escalated':
            if (canReview) actions.push({ label: 'Review Escalation', variant: 'secondary', icon: 'archive', action: 'Review Escalation' });
            if (canClose) actions.push({ label: 'Close', variant: 'primary', icon: 'checkbox-circle', action: 'Close' });
            break;

        case 'Closed':
            // No actions on closed records
            break;
    }

    if (actions.length === 0) return null;

    return (
        <div className={styles.actions}>
            {actions.map(({ label, variant, icon, action }) => (
                <Button
                    key={action}
                    size="sm"
                    variant={variant}
                    fullWidth={true}
                    leadingIcon={<Icon name={icon as React.ComponentProps<typeof Icon>['name']} size={16} />}
                    onClick={() => handleAction(action)}
                >
                    {label}
                </Button>
            ))}
        </div>
    );
};

export default RecordActions;
