'use client';

import React from 'react';
import styles from './TaskCard.module.css';
import { Icon, IconName } from '@/components/ui/Icon';
import Badge, { BadgeColor } from '@/components/ui/Badge';

interface TaskCardProps {
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

export default function TaskCard({
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
    isSelected = false
}: TaskCardProps) {
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
            {/* Header Section */}
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

            {/* Footer Section */}
            <div className={`${styles.footer} text-caption`}>
                <div className={styles.footerItem}>
                    <span>Reported by:</span>
                    <span className={`${styles.footerValue} text-caption`}>{reportedBy}</span>
                </div>
                <div className={styles.footerItem}>
                    <span>Reported on:</span>
                    <span className={`${styles.footerValue} text-caption`}>{reportedOn}</span>
                </div>
                <div className={styles.footerItem}>
                    <span>Location:</span>
                    <span className={`${styles.footerValue} text-caption`}>{location}</span>
                </div>
            </div>
        </div>
    );
}
