'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import type { HistoryRecord } from '@/types/history';
import { getStatusBadgeColor } from '@/types/status';
import styles from './MobileHistoryList.module.css';

interface MobileHistoryListProps {
    records: HistoryRecord[];
    onRecordClick: (record: HistoryRecord) => void;
}

const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
};

export default function MobileHistoryList({ records, onRecordClick }: MobileHistoryListProps) {
    return (
        <div className={styles.list}>
            {records.map((record) => (
                <div
                    key={record.id}
                    className={styles.card}
                    role="button"
                    tabIndex={0}
                    onClick={() => onRecordClick(record)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onRecordClick(record);
                        }
                    }}
                >
                    <div className={styles.cardTop}>
                        <div className={styles.titleArea}>
                            <span className={`${styles.title} text-body-strong`}>{record.title}</span>
                            <span className={`${styles.type} text-caption`}>{record.type}</span>
                        </div>
                        <Badge
                            color={getStatusBadgeColor(record.status)}
                            size="small"
                            emphasis="subtle"
                        >
                            {record.status}
                        </Badge>
                    </div>
                    <div className={`${styles.cardBottom} text-caption`}>
                        <span className={styles.location}>{record.location.name}</span>
                        <span className={styles.time}>{formatRelativeTime(record.updatedAt)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
