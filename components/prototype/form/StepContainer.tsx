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
    /** Whether this is the review step */
    isReviewStep?: boolean;
    /** Whether back button should be shown */
    showBack?: boolean;
    /** Back button callback */
    onBack?: () => void;
    /** Next button callback */
    onNext?: () => void;
    /** Submit button callback */
    onSubmit?: () => void;
    /** Custom next button label */
    nextLabel?: string;
}

export const StepContainer: React.FC<StepContainerProps> = ({
    title,
    children,
    isReviewStep = false,
    showBack = true,
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

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={[styles.title, 'text-heading'].join(' ')}>{title}</h2>
                <div className={styles.body}>{children}</div>
            </div>

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

                <Button
                    variant="primary"
                    size="md"
                    onClick={handleNextClick}
                    trailingIcon={!isReviewStep ? <Icon name="arrow-right" size={16} /> : undefined}
                >
                    {getNextLabel()}
                </Button>
            </div>
        </div>
    );
};

export default StepContainer;
