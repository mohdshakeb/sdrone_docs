'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import styles from './SOSConfirmation.module.css';

export interface SOSConfirmationProps {
    onViewAlerts: () => void;
    onSendAnother: () => void;
}

export const SOSConfirmation: React.FC<SOSConfirmationProps> = ({
    onViewAlerts,
    onSendAnother,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <Icon name="sos" size={32} />
                </div>

                <h1 className={['text-heading', styles.title].join(' ')}>
                    SOS Sent
                </h1>

                <p className={['text-body', styles.description].join(' ')}>
                    Your emergency alert has been dispatched. Stay calm — the safety team has been notified and is responding.
                </p>

                <div className={styles.statusBanner}>
                    <Icon name="time" size={16} />
                    <span className="text-body-strong">Awaiting acknowledgement</span>
                </div>

                <div className={styles.actions}>
                    <Button variant="primary" size="lg" onClick={onViewAlerts}>
                        View Alert Status
                    </Button>
                    <Button variant="ghost" size="md" onClick={onSendAnother}>
                        Send Another SOS
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SOSConfirmation;
