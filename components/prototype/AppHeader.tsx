'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import styles from './AppHeader.module.css';
import { Icon } from '@/components/ui/Icon';
import Modal, { ModalListItem } from '@/components/ui/Modal';
import { useModal } from '@/components/ui/hooks/useModal';

export default function AppHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const reportModal = useModal();

    const incidentTypes: ModalListItem[] = [
        { value: 'unsure', label: 'Not sure (Recommended)' },
        { value: 'near-miss', label: 'Near Miss / Hazard' },
        { value: 'first-aid', label: 'First Aid' },
        { value: 'fir', label: 'First Incident Report (FIR)' },
        { value: 'adr', label: 'Accident/Dangerous Occurrence (ADR)' },
    ];

    const handleIncidentTypeConfirm = (value: string) => {
        reportModal.close();
        // Navigate to report form with preset type (if not unsure)
        if (value === 'unsure') {
            router.push('/sdrone/report');
        } else {
            router.push(`/sdrone/report?type=${value}`);
        }
    };

    const getPageTitle = () => {
        if (pathname === '/sdrone') return 'Inbox';
        if (pathname === '/sdrone/history') return 'History';
        if (pathname === '/sdrone/alerts') return 'Alerts';
        if (pathname === '/sdrone/insights') return 'Insights';
        if (pathname === '/sdrone/settings') return 'Settings';
        return 'App';
    };

    const isInbox = pathname === '/sdrone';

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
                    <Button size="sm" variant="primary" onClick={reportModal.open}>
                        Report Incident
                    </Button>
                </div>

                <div className={styles.divider} />

                <Button size="sm" variant="negative" leadingIcon={<Icon name="sos" size={24} />}>
                </Button>
            </div>

            <Modal
                variant="list"
                isOpen={reportModal.isOpen}
                onClose={reportModal.close}
                title="What are you reporting?"
                items={incidentTypes}
                onConfirm={handleIncidentTypeConfirm}
                confirmLabel="Continue"
            />
        </header>
    );
}
