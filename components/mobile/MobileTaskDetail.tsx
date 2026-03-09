'use client';

import React, { useEffect } from 'react';
import styles from './MobileTaskDetail.module.css';
import { Icon } from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import type { Task } from '@/data/mock-data';

interface MobileTaskDetailProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileTaskDetail({ task, isOpen, onClose }: MobileTaskDetailProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen || !task) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={onClose}
                    aria-label="Close detail"
                >
                    <Icon name="arrow-left" size={20} />
                </button>
                <span className={`${styles.headerTitle} text-body-strong`}>Detail</span>
                <div className={styles.headerSpacer} />
            </div>

            <div className={styles.body}>
                <div className={styles.titleSection}>
                    <div className={styles.iconContainer}>
                        <Icon name={task.iconName} size={24} />
                    </div>
                    <h2 className={`${styles.title} text-body-strong`}>{task.title}</h2>
                </div>

                <div className={styles.section}>
                    <div className={styles.statusRow}>
                        <span className="text-caption">Status</span>
                        <Badge color={task.badgeColor} size="small" emphasis="subtle">
                            {task.status}
                        </Badge>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={`${styles.sectionTitle} text-caption-strong`}>Details</h3>
                    <div className={styles.metadataList}>
                        <div className={styles.metadataItem}>
                            <span className={`${styles.metadataLabel} text-caption`}>Report Type</span>
                            <span className={`${styles.metadataValue} text-body`}>{task.subtitle}</span>
                        </div>
                        <div className={styles.metadataItem}>
                            <span className={`${styles.metadataLabel} text-caption`}>Reported By</span>
                            <span className={`${styles.metadataValue} text-body`}>{task.reportedBy}</span>
                        </div>
                        <div className={styles.metadataItem}>
                            <span className={`${styles.metadataLabel} text-caption`}>Reported On</span>
                            <span className={`${styles.metadataValue} text-body`}>{task.reportedOn}</span>
                        </div>
                        <div className={styles.metadataItem}>
                            <span className={`${styles.metadataLabel} text-caption`}>Location</span>
                            <span className={`${styles.metadataValue} text-body`}>{task.location}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={`${styles.sectionTitle} text-caption-strong`}>Description</h3>
                    <p className={`${styles.description} text-body`}>
                        No description provided for this incident report.
                    </p>
                </div>
            </div>
        </div>
    );
}
