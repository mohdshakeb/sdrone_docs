'use client';

import React from 'react';
import styles from './MobileTaskCard.module.css';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import type { BadgeColor } from '@/components/ui/Badge';

interface MobileTaskCardProps {
    id: string;
    title: string;
    subtitle: string;
    status: string;
    reportedBy: string;
    reportedOn: string;
    location: string;
    iconName?: IconName;
    badgeColor?: BadgeColor;
    onClick?: (id: string) => void;
    isSelected?: boolean;
}

export default function MobileTaskCard({
    id,
    title,
    subtitle,
    status,
    reportedBy,
    reportedOn,
    location,
    iconName = 'fire',
    badgeColor = 'neutral',
    onClick,
    isSelected = false,
}: MobileTaskCardProps) {
    const handleClick = () => {
        onClick?.(id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.(id);
        }
    };

    return (
        <div
            className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <div className={styles.header}>
                <div className={styles.leftSection}>
                    <div className={styles.iconContainer}>
                        <Icon name={iconName} size={20} />
                    </div>
                    <div className={styles.textContainer}>
                        <div className={`${styles.title} text-body-strong`}>{title}</div>
                        <div className={`${styles.subtitle} text-caption`}>{subtitle}</div>
                    </div>
                </div>
                <Badge color={badgeColor} size="small" emphasis="subtle">
                    {status}
                </Badge>
            </div>

            <div className={`${styles.footer} text-caption`}>
                <div className={styles.footerItem}>
                    <span className={styles.footerLabel}>Reported by</span>
                    <span className={styles.footerValue}>{reportedBy}</span>
                </div>
                <div className={styles.footerItem}>
                    <span className={styles.footerLabel}>Date</span>
                    <span className={styles.footerValue}>{reportedOn}</span>
                </div>
                <div className={styles.footerItem}>
                    <span className={styles.footerLabel}>Location</span>
                    <span className={styles.footerValue}>{location}</span>
                </div>
            </div>
        </div>
    );
}
