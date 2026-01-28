'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import styles from './AppHeader.module.css';
import { Icon } from '@/components/ui/Icon';

// Breadcrumb item for innerPage variant
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface AppHeaderProps {
    // Variant control
    variant?: 'default' | 'form' | 'innerPage';

    // Form variant props
    formTitle?: string;
    currentStep?: number;
    totalSteps?: number;
    onFormBack?: () => void;
    onFormCancel?: () => void;
    onFormSubmit?: () => void;
    isEntryStep?: boolean;
    isReviewStep?: boolean;

    // Inner page variant props
    innerPageTitle?: string;
    breadcrumbs?: BreadcrumbItem[];
    onBack?: () => void;
    onExportPdf?: () => void;
}

export default function AppHeader({
    variant = 'default',
    formTitle,
    currentStep,
    totalSteps,
    onFormBack,
    onFormCancel,
    onFormSubmit,
    isEntryStep = false,
    isReviewStep = false,
    innerPageTitle,
    breadcrumbs = [],
    onBack,
    onExportPdf,
}: AppHeaderProps = {}) {
    const router = useRouter();
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname === '/sdrone') return 'Inbox';
        if (pathname === '/sdrone/history') return 'History';
        if (pathname === '/sdrone/alerts') return 'Alerts';
        if (pathname === '/sdrone/insights') return 'Insights';
        if (pathname === '/sdrone/settings') return 'Settings';
        return 'App';
    };

    const isInbox = pathname === '/sdrone';

    // Escape key handler for form and innerPage variants
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (variant === 'form' && onFormBack) {
                    onFormBack();
                } else if (variant === 'innerPage' && onBack) {
                    onBack();
                }
            }
        };

        if ((variant === 'form' && onFormBack) || (variant === 'innerPage' && onBack)) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [variant, onFormBack, onBack]);

    // Inner page variant rendering (detail pages with back button, title, breadcrumbs)
    if (variant === 'innerPage') {
        const handleBackClick = () => {
            if (onBack) {
                onBack();
            } else {
                router.back();
            }
        };

        return (
            <header className={styles.header}>
                <div className={styles.innerPageLeft}>
                    <button
                        className={styles.formBackButton}
                        onClick={handleBackClick}
                        aria-label="Go back"
                    >
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h1 className={`${styles.innerPageTitle} text-body-strong`}>
                        {innerPageTitle}
                    </h1>
                    {breadcrumbs.length > 0 && (
                        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                            {breadcrumbs.map((crumb, index) => (
                                <span key={index} className={styles.breadcrumbItem}>
                                    <span className={styles.breadcrumbSeparator}>&gt;</span>
                                    {crumb.href ? (
                                        <a
                                            href={crumb.href}
                                            className={`${styles.breadcrumbLink} text-body`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.push(crumb.href!);
                                            }}
                                        >
                                            {crumb.label}
                                        </a>
                                    ) : (
                                        <span className={`${styles.breadcrumbText} text-body`}>
                                            {crumb.label}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    )}
                </div>

                {onExportPdf && (
                    <div className={styles.right}>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={onExportPdf}
                            leadingIcon={<Icon name="file" size={16} />}
                        >
                            Export as PDF
                        </Button>
                    </div>
                )}
            </header>
        );
    }

    // Form variant rendering
    if (variant === 'form') {
        // Entry step: simplified header with only back button and title
        if (isEntryStep) {
            return (
                <header className={styles.header}>
                    <div className={styles.formLeft}>
                        <button
                            className={styles.formBackButton}
                            onClick={onFormBack}
                            aria-label="Go back"
                        >
                            <Icon name="arrow-left" size={20} />
                        </button>
                        <h1 className={`${styles.formTitle} text-body-strong`}>{formTitle}</h1>
                    </div>
                </header>
            );
        }

        return (
            <header className={styles.header}>
                <div className={styles.formLeft}>
                    <button
                        className={styles.formBackButton}
                        onClick={onFormBack}
                        aria-label="Go back to previous step"
                    >
                        <Icon name="arrow-left" size={20} />
                    </button>
                    <h1 className={`${styles.formTitle} text-body-strong`}>{formTitle}</h1>
                </div>

                <div className={styles.center}>
                    <span className={`${styles.progressText} text-caption`}>
                        Step {currentStep} of {totalSteps}
                    </span>
                </div>

                <div className={styles.right}>
                    <div className={styles.buttonGroup}>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={onFormCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={onFormSubmit}
                            disabled={!isReviewStep}
                        >
                            Submit Report
                        </Button>
                    </div>
                </div>
            </header>
        );
    }

    // Default variant rendering
    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <span className={`${styles.title} text-body-base`}>{getPageTitle()}</span>
                {isInbox && <span className={`${styles.subtext} text-body`}>3 Pending</span>}
            </div>

            <div className={styles.right}>
                <div className={styles.buttonGroup}>
                    <Button size="sm" variant="secondary" leadingIcon={<Icon name="add" size={16} />}>
                        Start New
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => router.push('/sdrone/report')}>
                        Report Incident
                    </Button>
                </div>

                <div className={styles.divider} />

                <Button size="sm" variant="negative" leadingIcon={<Icon name="sos" size={24} />}>
                </Button>
            </div>
        </header>
    );
}
