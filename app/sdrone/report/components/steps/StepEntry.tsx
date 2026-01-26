'use client';

import React from 'react';
import styles from './Steps.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export interface StepEntryProps {
    onStart: () => void;
}

export const StepEntry: React.FC<StepEntryProps> = ({ onStart }) => {
    return (
        <div className={styles.entryContainer}>
            <div className={styles.entryIcon}>
                <Icon name="survey" size={32} />
            </div>
            <h2 className={['text-heading', styles.entryTitle].join(' ')}>
                Report an Incident
            </h2>
            <p className={['text-body', styles.entryDescription].join(' ')}>
                Use this form to report safety incidents, near misses, or hazardous conditions.
                Your report helps us maintain a safe workplace for everyone.
            </p>
            <Button
                variant="primary"
                size="lg"
                onClick={onStart}
                trailingIcon={<Icon name="arrow-right" size={20} />}
            >
                Start Report
            </Button>
        </div>
    );
};

export default StepEntry;
