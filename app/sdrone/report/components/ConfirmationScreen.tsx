'use client';

import React from 'react';
import styles from './ConfirmationScreen.module.css';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import { incidentTypeLabels, incidentTypeBadgeColors } from '../mockData';
import type { IncidentType } from '../types';

export interface ConfirmationScreenProps {
    incidentType: IncidentType;
    onViewInbox: () => void;
    onCreateAnother: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
    incidentType,
    onViewInbox,
    onCreateAnother,
}) => {
    const badgeColor = incidentTypeBadgeColors[incidentType];

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <Icon name="check" size={32} />
                </div>

                <h1 className={['text-heading', styles.title].join(' ')}>
                    Report Submitted
                </h1>

                <p className={['text-body', styles.description].join(' ')}>
                    Your incident report has been successfully submitted and will be reviewed by the safety team.
                </p>

                <div className={styles.incidentType}>
                    <span className={['text-caption', styles.label].join(' ')}>
                        Incident Type
                    </span>
                    <Badge color={badgeColor}>
                        {incidentTypeLabels[incidentType]}
                    </Badge>
                </div>

                <div className={styles.actions}>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onViewInbox}
                    >
                        View in Inbox
                    </Button>
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={onCreateAnother}
                    >
                        Report Another Incident
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationScreen;
