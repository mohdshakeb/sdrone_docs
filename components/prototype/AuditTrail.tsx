'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { AuditTrailEntry } from '@/types/history';
import styles from './AuditTrail.module.css';

export interface AuditTrailProps {
    /** Array of audit trail entries */
    entries: AuditTrailEntry[];
    /** Whether the section starts expanded */
    defaultExpanded?: boolean;
}

// Helper to format timestamp
const formatTimestamp = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * AuditTrail - Collapsible timeline showing record history
 * Displays status changes, ownership changes, and escalations
 */
export const AuditTrail: React.FC<AuditTrailProps> = ({
    entries,
    defaultExpanded = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const toggleExpanded = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpanded();
        }
    };

    // Sort entries by timestamp (newest first for display)
    const sortedEntries = [...entries].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return (
        <div className={styles.container}>
            <button
                className={styles.header}
                onClick={toggleExpanded}
                onKeyDown={handleKeyDown}
                aria-expanded={isExpanded}
                aria-controls="audit-trail-content"
            >
                <span className={`${styles.headerText} text-body-strong`}>
                    Audit Trail
                </span>
                <span className={styles.entryCount}>
                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </span>
                <Icon
                    name={isExpanded ? 'arrow-up' : 'arrow-down'}
                    size={16}
                    className={styles.chevron}
                />
            </button>

            {isExpanded && (
                <div
                    id="audit-trail-content"
                    className={styles.content}
                    role="region"
                    aria-label="Audit trail timeline"
                >
                    <div className={styles.timeline}>
                        {sortedEntries.map((entry, index) => (
                            <div
                                key={entry.id}
                                className={styles.entry}
                            >
                                <div className={styles.timelineMarker}>
                                    <div className={styles.dot} />
                                    {index < sortedEntries.length - 1 && (
                                        <div className={styles.line} />
                                    )}
                                </div>
                                <div className={styles.entryContent}>
                                    <div className={styles.entryHeader}>
                                        <span className={`${styles.action} text-body`}>
                                            {entry.action}
                                        </span>
                                        <span className={`${styles.timestamp} text-caption`}>
                                            {formatTimestamp(entry.timestamp)}
                                        </span>
                                    </div>
                                    <span className={`${styles.actor} text-caption`}>
                                        {entry.actor.name}
                                        <span className={styles.actorRole}>
                                            ({entry.actor.role})
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditTrail;
