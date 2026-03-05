'use client';

import React from 'react';
import styles from './ConfirmationScreen.module.css';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import { auditTypeLabels, auditTypeBadgeColors } from '../mockData';
import type { AuditType } from '../types';

export interface ConfirmationScreenProps {
    auditType: AuditType | '';
    onViewInbox: () => void;
    onCreateAnother: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
    auditType,
    onViewInbox,
    onCreateAnother,
}) => {
    const badgeColor = auditType ? auditTypeBadgeColors[auditType] : 'neutral';

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <Icon name="check" size={32} />
                </div>

                <h1 className={['text-heading', styles.title].join(' ')}>
                    Audit Submitted
                </h1>

                <p className={['text-body', styles.description].join(' ')}>
                    Your tool audit has been successfully submitted and will be reviewed by the safety team.
                </p>

                {auditType && (
                    <div className={styles.auditType}>
                        <span className={['text-caption', styles.label].join(' ')}>
                            Audit Type
                        </span>
                        <Badge color={badgeColor}>
                            {auditTypeLabels[auditType]}
                        </Badge>
                    </div>
                )}

                <div className={styles.actions}>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onViewInbox}
                    >
                        View Inbox
                    </Button>
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={onCreateAnother}
                    >
                        Start Another Audit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationScreen;
