'use client';

import React from 'react';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps {
    /** Current step index (0-based) */
    currentStep: number;
    /** Total number of steps */
    totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    currentStep,
    totalSteps,
}) => {
    // Progress percentage (excluding entry step 0)
    const progress = totalSteps > 1
        ? Math.round((currentStep / (totalSteps - 1)) * 100)
        : 0;

    return (
        <div className={styles.wrapper}>
            <div className={styles.barContainer}>
                <div
                    className={styles.barFill}
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
                />
            </div>
            <span className={[styles.label, 'text-caption'].join(' ')}>
                Step {currentStep + 1} of {totalSteps}
            </span>
        </div>
    );
};

export default ProgressBar;
