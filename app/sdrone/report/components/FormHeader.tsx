'use client';

import React from 'react';
import Link from 'next/link';
import styles from './FormHeader.module.css';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export interface FormHeaderProps {
    /** Callback when close button is clicked */
    onClose?: () => void;
    /** Whether to show the submit button */
    showSubmit?: boolean;
    /** Whether submit button is disabled */
    submitDisabled?: boolean;
    /** Callback when submit button is clicked */
    onSubmit?: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
    onClose,
    showSubmit = false,
    submitDisabled = true,
    onSubmit,
}) => {
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/sdrone" className={styles.closeButton} aria-label="Close form">
                    <Icon name="close" size={24} />
                </Link>
            </div>

            <h1 className={[styles.title, 'text-body-strong'].join(' ')}>
                Report Incident
            </h1>

            <div className={styles.right}>
                {showSubmit && (
                    <Button
                        variant="primary"
                        size="sm"
                        disabled={submitDisabled}
                        onClick={onSubmit}
                    >
                        Submit
                    </Button>
                )}
            </div>
        </header>
    );
};

export default FormHeader;
