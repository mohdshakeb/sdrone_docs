'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import styles from './DashboardStatCard.module.css';

export interface DashboardStatCardProps {
    icon: IconName;
    label: string;
    value: number;
    accentColor?: 'default' | 'negative' | 'positive' | 'notice' | 'information';
    onClick?: () => void;
}

export default function DashboardStatCard({
    icon,
    label,
    value,
    accentColor = 'default',
    onClick,
}: DashboardStatCardProps) {
    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            className={styles.card}
            onClick={onClick}
            {...(onClick ? { type: 'button' as const } : {})}
        >
            <div className={`${styles.iconWrapper} ${styles[`accent--${accentColor}`]}`}>
                <Icon name={icon} size={20} />
            </div>
            <div className={styles.textContainer}>
                <span className={`${styles.value} text-heading`}>{value}</span>
                <span className={`${styles.label} text-caption`}>{label}</span>
            </div>
        </Component>
    );
}
