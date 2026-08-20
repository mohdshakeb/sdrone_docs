'use client';

import React from 'react';
import styles from './StepContainer.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export interface StepContainerProps {
    /** Step title */
    title: string;
    /** Step content */
    children: React.ReactNode;
    /** When provided, renders "Step N: Title" heading with a muted prefix */
    stepNumber?: number;
    /** Removes the card border and border-radius (use when inside an outer card) */
    noBorder?: boolean;
    /** Whether this is the review step (kept for tool-audit backward compat) */
    isReviewStep?: boolean;
    /** Whether back button should be shown */
    showBack?: boolean;
    /** Whether next/continue button should be shown */
    showNext?: boolean;
    /** Back button callback */
    onBack?: () => void;
    /** Next button callback */
    onNext?: () => void;
    /** Submit button callback (used by review step in tool-audit) */
    onSubmit?: () => void;
    /** Custom next button label */
    nextLabel?: string;
}

export const StepContainer: React.FC<StepContainerProps> = ({
    title,
    children,
    stepNumber,
    noBorder = false,
    isReviewStep = false,
    showBack = true,
    showNext = true,
    onBack,
    onNext,
    onSubmit,
    nextLabel,
}) => {
    const getNextLabel = () => {
        if (nextLabel) return nextLabel;
        if (isReviewStep) return 'Submit Report';
        return 'Continue';
    };

    const handleNextClick = () => {
        if (isReviewStep && onSubmit) {
            onSubmit();
        } else if (onNext) {
            onNext();
        }
    };

    const containerClass = [styles.container, noBorder ? styles.containerFlat : ''].filter(Boolean).join(' ');

    return (
        <div className={containerClass}>
            <div className={styles.content}>
                <h2 className={[styles.title, stepNumber !== undefined ? 'text-body-base' : 'text-heading'].join(' ')}>
                    {stepNumber !== undefined && (
                        <span className={styles.stepPrefix}>Step {stepNumber}:&nbsp;</span>
                    )}
                    {title}
                </h2>
                <div className={styles.body}>{children}</div>
            </div>

            {(showBack || showNext) && (
                <div className={styles.navigation}>
                    {showBack && (
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={onBack}
                            leadingIcon={<Icon name="arrow-left" size={16} />}
                        >
                            Back
                        </Button>
                    )}

                    <div className={styles.spacer} />

                    {showNext && (
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleNextClick}
                            trailingIcon={!isReviewStep ? <Icon name="arrow-right" size={16} /> : undefined}
                        >
                            {getNextLabel()}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default StepContainer;
