'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import styles from './AppHeader.module.css';
import { Icon } from '@/components/ui/Icon';

import { usePathname } from 'next/navigation';

export default function AppHeader() {
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
                    <Button size="sm" variant="primary">
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
