'use client';

import React from 'react';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import styles from './DashboardActivityItem.module.css';

export interface DashboardActivityItemProps {
    icon: IconName;
    title: string;
    meta: string;
    onClick?: () => void;
}

export default function DashboardActivityItem({
    icon,
    title,
    meta,
    onClick,
}: DashboardActivityItemProps) {
    return (
        <button
            className={styles.item}
            onClick={onClick}
            type="button"
        >
            <div className={styles.iconWrapper}>
                <Icon name={icon} size={20} />
            </div>
            <div className={styles.content}>
                <span className={`${styles.title} text-body-strong`}>{title}</span>
                <span className={`${styles.meta} text-caption`}>{meta}</span>
            </div>
        </button>
    );
}
