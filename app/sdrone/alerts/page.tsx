'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import { MOCK_SOS_RECORDS, MOCK_SAFETY_ALERT_RECORDS } from '@/data/mock-data';
import type { SOSRecord, SafetyAlertRecord } from '@/data/mock-data';
import styles from './page.module.css';

const STATUS_BADGE: Record<SOSRecord['status'], { color: 'negative' | 'notice' | 'positive'; label: string }> = {
    Sent:         { color: 'negative', label: 'Sent' },
    Acknowledged: { color: 'notice',   label: 'Acknowledged' },
    Resolved:     { color: 'positive', label: 'Resolved' },
};

function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
        ' · ' +
        d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function SOSCard({ record }: { record: SOSRecord }) {
    const badge = STATUS_BADGE[record.status];

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardLeft}>
                    <div className={styles.sosIconWrapper}>
                        <Icon name="sos" size={16} />
                    </div>
                    <div className={styles.cardMeta}>
                        <span className="text-body-strong">{record.sentBy.name}</span>
                        <span className={['text-caption', styles.metaRole].join(' ')}>{record.sentBy.role}</span>
                    </div>
                </div>
                <Badge color={badge.color}>{badge.label}</Badge>
            </div>

            <div className={styles.cardDetails}>
                <div className={styles.detailRow}>
                    <Icon name="pin" size={14} />
                    <span className="text-body">{record.location}</span>
                </div>
                <div className={styles.detailRow}>
                    <Icon name="time" size={14} />
                    <span className={['text-body', styles.detailMuted].join(' ')}>{formatTime(record.sentAt)}</span>
                </div>
                {record.photoCount > 0 && (
                    <div className={styles.detailRow}>
                        <Icon name="image" size={14} />
                        <span className={['text-body', styles.detailMuted].join(' ')}>{record.photoCount} photo{record.photoCount !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {record.description && (
                <p className={['text-body', styles.description].join(' ')}>{record.description}</p>
            )}

            {record.acknowledgedBy && (
                <div className={styles.timeline}>
                    <div className={styles.timelineItem}>
                        <Icon name="check" size={14} />
                        <span className={['text-caption', styles.timelineText].join(' ')}>
                            Acknowledged by {record.acknowledgedBy.name} · {formatTime(record.acknowledgedBy.timestamp)}
                        </span>
                    </div>
                    {record.resolvedBy && (
                        <div className={styles.timelineItem}>
                            <Icon name="checkbox-circle" size={14} />
                            <span className={['text-caption', styles.timelineText].join(' ')}>
                                Resolved by {record.resolvedBy.name} · {formatTime(record.resolvedBy.timestamp)}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SafetyAlertCard({ record }: { record: SafetyAlertRecord }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardLeft}>
                    <div className={styles.safetyAlertIconWrapper}>
                        <Icon name="alert" size={16} />
                    </div>
                    <div className={styles.cardMeta}>
                        <span className="text-body-strong">{record.sentBy.name}</span>
                        <span className={['text-caption', styles.metaRole].join(' ')}>{record.sentBy.role}</span>
                    </div>
                </div>
                <Badge color="notice">Safety Alert</Badge>
            </div>

            <div className={styles.cardDetails}>
                <div className={styles.detailRow}>
                    <Icon name="time" size={14} />
                    <span className={['text-body', styles.detailMuted].join(' ')}>{formatTime(record.sentAt)}</span>
                </div>
                {record.attachmentCount > 0 && (
                    <div className={styles.detailRow}>
                        <Icon name="file" size={14} />
                        <span className={['text-body', styles.detailMuted].join(' ')}>{record.attachmentCount} attachment{record.attachmentCount !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            <p className={['text-body', styles.safetyAlertMessage].join(' ')}>{record.message}</p>

            <div className={styles.audienceTags}>
                {record.targetAudience.map(audience => (
                    <span key={audience} className={['text-caption', styles.audienceTag].join(' ')}>
                        {audience}
                    </span>
                ))}
            </div>
        </div>
    );
}

type FeedItem =
    | { kind: 'sos'; record: SOSRecord; sentAt: string }
    | { kind: 'safety-alert'; record: SafetyAlertRecord; sentAt: string };

export default function AlertsPage() {
    const feed: FeedItem[] = [
        ...MOCK_SOS_RECORDS.map(r => ({ kind: 'sos' as const, record: r, sentAt: r.sentAt })),
        ...MOCK_SAFETY_ALERT_RECORDS.map(r => ({ kind: 'safety-alert' as const, record: r, sentAt: r.sentAt })),
    ].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={['text-heading', styles.title].join(' ')}>Alerts</h2>
                <p className={['text-body', styles.subtitle].join(' ')}>
                    SOS and safety alerts from your team
                </p>
            </div>

            <div className={styles.list}>
                {feed.map(item =>
                    item.kind === 'sos'
                        ? <SOSCard key={item.record.id} record={item.record} />
                        : <SafetyAlertCard key={item.record.id} record={item.record} />
                )}
            </div>
        </div>
    );
}
