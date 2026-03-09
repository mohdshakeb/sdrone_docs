'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import styles from './DashboardCategoryCard.module.css';

type AccentColor = 'default' | 'negative' | 'positive' | 'notice' | 'information';

export interface DashboardCategoryCardProps {
    icon: IconName;
    label: string;
    total: number;
    open: number;
    accentColor?: AccentColor;
    onClick?: () => void;
}

export default function DashboardCategoryCard({
    icon,
    label,
    total,
    open,
    accentColor = 'default',
    onClick,
}: DashboardCategoryCardProps) {
    return (
        <button
            className={`${styles.card} ${styles[`accent--${accentColor}`]}`}
            onClick={onClick}
            type="button"
        >
            <span className={styles.icon}>
                <Icon name={icon} size={32} />
            </span>
            <span className={`${styles.label} text-body-strong`}>{label}</span>
            <div className={styles.stats}>
                <span className={`${styles.total} text-heading`}>{total}</span>
                {open > 0 && (
                    <span className={`${styles.open} text-caption`}>
                        {open} open
                    </span>
                )}
            </div>
        </button>
    );
}
