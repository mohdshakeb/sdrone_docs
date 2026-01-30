'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import styles from './AppHeader.module.css';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';
import { useTheme } from '@/components/ui/ThemeProvider';

// Breadcrumb item for innerPage variant
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface AppHeaderProps {
    // Variant control
    variant?: 'default' | 'form' | 'innerPage' | 'docs';

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

    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={handleBackClick}
                        aria-label="Go back"
                        leadingIcon={<Icon name="arrow-left" size={20} />}
                    />
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
                        <Button
                            variant="ghost"
                            size="sm"
                            iconOnly
                            onClick={onFormBack}
                            aria-label="Go back"
                            leadingIcon={<Icon name="arrow-left" size={20} />}
                        />
                        <h1 className={`${styles.formTitle} text-body-strong`}>{formTitle}</h1>
                    </div>
                </header>
            );
        }

        return (
            <header className={styles.header}>
                <div className={styles.formLeft}>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={onFormBack}
                        aria-label="Go back to previous step"
                        leadingIcon={<Icon name="arrow-left" size={20} />}
                    />
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

    // Documentation variant
    if (variant === 'docs') {
        return (
            <header className={styles.header}>
                <div className={styles.left}>
                    <Link href="/" className={styles.brand}>
                        Design System
                    </Link>
                </div>

                <div className={styles.right}>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        onClick={toggleTheme}
                        aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                    >
                        {!mounted ? (
                            <div style={{ width: 20, height: 20 }} />
                        ) : theme === 'light' ? (
                            <Icon name="moon" size={20} />
                        ) : (
                            <Icon name="sun" size={20} />
                        )}
                    </Button>

                    <Button
                        size="sm"
                        variant="primary"
                        href="/sdrone"
                        target="_blank"
                    >
                        Prototype
                    </Button>
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

                <Button
                    size="sm"
                    variant="negative"
                    iconOnly
                    leadingIcon={<Icon name="sos" size={24} />}
                    aria-label="SOS"
                />
            </div>
        </header>
    );
}
