'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import styles from './DashboardAlertCard.module.css';

export interface DashboardAlertCardProps {
    icon: IconName;
    title: string;
    reportType: string;
    location: string;
    reporterName: string;
    reportedAt: string;
    onClick?: () => void;
}

export default function DashboardAlertCard({
    icon,
    title,
    reportType,
    location,
    reporterName,
    reportedAt,
    onClick,
}: DashboardAlertCardProps) {
    return (
        <button
            className={styles.card}
            onClick={onClick}
            type="button"
        >
            <div className={styles.iconWrapper}>
                <Icon name={icon} size={20} />
            </div>
            <div className={styles.content}>
                <span className={`${styles.title} text-body-strong`}>{title}</span>
                <div className={styles.metaRow}>
                    <span className={`${styles.meta} text-body`}>
                        {reportType} &middot; {location}
                    </span>
                    <span className={`${styles.meta} text-body`}>
                        {reporterName} &middot; {reportedAt}
                    </span>
                </div>
            </div>
        </button>
    );
}
