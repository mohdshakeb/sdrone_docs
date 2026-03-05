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
            <div className={styles.entryIconWrapper}>
                <div className={styles.entryIcon}>
                    <Icon name="pass-valid" size={32} />
                </div>
            </div>

            <div className={styles.entryHeaderWrapper}>
                <h2 className={['text-heading', styles.entryTitle].join(' ')}>
                    Tool Audit
                </h2>
                <p className={['text-body', styles.entryDescription].join(' ')}>
                    Assess the condition of tools against predefined specifications and checkpoints.
                    Select an audit type to begin.
                </p>
            </div>

            <div className={styles.entryActionWrapper}>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={onStart}
                    trailingIcon={<Icon name="arrow-right" size={20} />}
                >
                    Start Audit
                </Button>
            </div>
        </div>
    );
};

export default StepEntry;
