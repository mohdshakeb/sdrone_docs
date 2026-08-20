'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { TARGET_AUDIENCE_GROUPS } from '../types';
import styles from './SafetyAlertConfirmation.module.css';

export interface SafetyAlertConfirmationProps {
    recipientValues: string[];
    onViewAlerts: () => void;
    onSendAnother: () => void;
}

export const SafetyAlertConfirmation: React.FC<SafetyAlertConfirmationProps> = ({
    recipientValues,
    onViewAlerts,
    onSendAnother,
}) => {
    const allOptions = TARGET_AUDIENCE_GROUPS.flatMap(g => g.options);
    const recipientLabels = recipientValues
        .map(v => allOptions.find(o => o.value === v)?.label)
        .filter(Boolean) as string[];

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <Icon name="checkbox-circle" size={32} />
                </div>

                <h1 className={['text-heading', styles.title].join(' ')}>
                    Safety Alert Sent
                </h1>

                <p className={['text-body', styles.description].join(' ')}>
                    Your safety alert has been dispatched to all selected recipients.
                </p>

                {recipientLabels.length > 0 && (
                    <div className={styles.recipientsSummary}>
                        {recipientLabels.map(label => (
                            <span key={label} className={styles.recipientTag}>
                                <Icon name="check" size={14} />
                                {label}
                            </span>
                        ))}
                    </div>
                )}

                <div className={styles.actions}>
                    <Button variant="primary" size="lg" onClick={onViewAlerts}>
                        View Alerts
                    </Button>
                    <Button variant="ghost" size="md" onClick={onSendAnother}>
                        Send Another Alert
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SafetyAlertConfirmation;
