'use client';

import React, { useEffect } from 'react';
import styles from './TaskDetailPanel.module.css';
import { Icon } from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import type { Task } from '@/data/mock-data';

interface TaskDetailPanelProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function TaskDetailPanel({ task, isOpen, onClose }: TaskDetailPanelProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
            {task && (
                <>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <div className={styles.iconContainer}>
                                <Icon name={task.iconName} size={24} />
                            </div>
                            <h2 className={`${styles.title} text-body-strong`}>{task.title}</h2>
                        </div>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Close panel"
                        >
                            <Icon name="close" size={20} />
                        </button>
                    </div>

                    <div className={styles.body}>
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
                </>
            )}
        </div>
    );
}
