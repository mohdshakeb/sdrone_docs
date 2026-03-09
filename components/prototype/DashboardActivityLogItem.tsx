import React from 'react';
import styles from './DashboardActivityLogItem.module.css';

export interface DashboardActivityLogItemProps {
    avatarUrl?: string;
    name: string;
    activity: string;
    timestamp: string;
}

export default function DashboardActivityLogItem({
    avatarUrl,
    name,
    activity,
    timestamp,
}: DashboardActivityLogItemProps) {
    // Get initials for fallback avatar
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className={styles.item}>
            <div className={styles.avatar}>
                {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className={styles.avatarImage} />
                ) : (
                    <span className={`${styles.avatarInitials} text-caption-strong`}>
                        {initials}
                    </span>
                )}
            </div>
            <div className={styles.content}>
                <span className={`${styles.text} text-body`}>
                    <span className="text-body-strong">{name}</span> {activity}
                </span>
                <span className={`${styles.timestamp} text-caption`}>
                    {timestamp}
                </span>
            </div>
        </div>
    );
}
