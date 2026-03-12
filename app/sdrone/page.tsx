'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { IconName } from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import Dropdown from '@/components/ui/Dropdown';
import DashboardStatCard from '@/components/prototype/DashboardStatCard';
import TaskCard from '@/components/prototype/TaskCard';
import DashboardCategoryCard from '@/components/prototype/DashboardCategoryCard';
import DashboardActivityLogItem from '@/components/prototype/DashboardActivityLogItem';
import Button from '@/components/ui/Button';
import { MOCK_TASKS, MOCK_HISTORY_RECORDS } from '@/data/mock-data';
import { CATEGORY_ICONS, STATUS_BADGE_COLORS } from '@/types/history';
import type { RecordCategory } from '@/types/history';
import { getGreeting, getFormattedDate, getShortDate } from '@/utils/formatters';
import styles from './page.module.css';

type AccentColor = 'default' | 'negative' | 'positive' | 'notice' | 'information';

// Category display config
const CATEGORIES: { key: RecordCategory; icon: IconName; accent: AccentColor }[] = [
    { key: 'Incident', icon: 'barricade', accent: 'negative' },
    { key: 'Audit', icon: 'task', accent: 'information' },
    { key: 'Compliance', icon: 'dossier', accent: 'notice' },
    { key: 'Permit to Work', icon: 'pass-valid', accent: 'positive' },
    { key: 'Toolbox Talk', icon: 'speak', accent: 'default' },
];

const PERIOD_OPTIONS = [
    { value: 'today', label: 'Today' },
    { value: 'last-week', label: 'Last 7 days' },
    { value: 'last-month', label: 'Last 30 days' },
    { value: 'all', label: 'All time' },
];

export default function DashboardPage() {
    const router = useRouter();
    const [categoryPeriod, setCategoryPeriod] = useState('all');

    // Compute dashboard stats
    const stats = useMemo(() => ({
        pending: MOCK_TASKS.filter(t => t.status !== 'Completed').length,
        critical: MOCK_TASKS.filter(t => t.status === 'Critical').length,
        underReview: MOCK_HISTORY_RECORDS.filter(r => r.status === 'Under Review').length,
        resolved: MOCK_HISTORY_RECORDS.filter(r => r.status === 'Closed').length,
    }), []);

    // Urgent items: Critical tasks + Action Required/Escalated records
    const urgentItems = useMemo(() => {
        const criticalTasks = MOCK_TASKS
            .filter(t => t.status === 'Critical')
            .map(t => ({
                id: t.id,
                icon: t.iconName,
                title: t.title,
                reportType: t.subtitle,
                location: t.location,
                reporterName: t.reportedBy,
                reportedAt: t.reportedOn,
                status: t.status,
                badgeColor: t.badgeColor,
                href: '/sdrone/inbox',
            }));

        const urgentRecords = MOCK_HISTORY_RECORDS
            .filter(r => r.status === 'Action Required' || r.status === 'Escalated')
            .map(r => ({
                id: r.id,
                icon: CATEGORY_ICONS[r.category],
                title: r.title,
                reportType: r.type,
                location: r.location.name,
                reporterName: r.reportedBy.name,
                reportedAt: getShortDate(r.updatedAt),
                status: r.status,
                badgeColor: STATUS_BADGE_COLORS[r.status],
                href: `/sdrone/history/${r.id}`,
            }));

        return [...criticalTasks, ...urgentRecords].slice(0, 4);
    }, []);

    // Activity log: Mock 6 items for the new section
    const activityLogItems = useMemo(() => [
        { id: 'al-1', name: 'Ajay Nair', activity: 'created a Tool Audit', timestamp: '2 mins ago' },
        { id: 'al-2', name: 'Sara Khan', activity: 'closed a General Work Permit', timestamp: '1 hour ago' },
        { id: 'al-3', name: 'Rohan Sharma', activity: 'reported a Near Miss', timestamp: '3 hours ago' },
        { id: 'al-4', name: 'Meera Patel', activity: 'escalated Safety Audit', timestamp: '5 hours ago' },
        { id: 'al-5', name: 'Karan Johar', activity: 'completed Health Check', timestamp: '1 day ago' },
        { id: 'al-6', name: 'Priya Rao', activity: 'scheduled a Toolbox Talk', timestamp: '2 days ago' },
    ], []);

    // Category breakdown (filtered by period)
    const categoryBreakdown = useMemo(() => {
        const now = new Date();
        const cutoff = categoryPeriod === 'today'
            ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
            : categoryPeriod === 'last-week'
                ? new Date(now.getTime() - 7 * 86400000)
                : categoryPeriod === 'last-month'
                    ? new Date(now.getTime() - 30 * 86400000)
                    : null;

        const filteredRecords = cutoff
            ? MOCK_HISTORY_RECORDS.filter(r => new Date(r.createdAt) >= cutoff)
            : MOCK_HISTORY_RECORDS;

        return CATEGORIES.map(({ key, icon, accent }) => {
            const records = filteredRecords.filter(r => r.category === key);
            const openCount = records.filter(r => r.status !== 'Closed').length;
            return { category: key, icon, accent, total: records.length, open: openCount };
        });
    }, [categoryPeriod]);

    return (
        <div className={styles.dashboard}>
            {/* Greeting Section */}
            <section className={styles.greeting}>
                <div>
                    <h2 className={`${styles.greetingHeading} text-heading`}>{getGreeting()}, John</h2>
                    <p className={`${styles.greetingSubtext} text-body`}>
                        Here&apos;s your safety overview
                    </p>
                </div>
                <span className={`${styles.dateText} text-body`}>
                    {getFormattedDate()}
                </span>
            </section>

            {/* Quick Stats */}
            <section className={styles.statsGrid}>
                <DashboardStatCard
                    icon="inbox"
                    label="Pending Tasks"
                    value={stats.pending}
                    onClick={() => router.push('/sdrone/inbox')}
                />
                <DashboardStatCard
                    icon="alert"
                    label="Critical Items"
                    value={stats.critical}
                    accentColor="negative"
                    onClick={() => router.push('/sdrone/inbox')}
                />
                <DashboardStatCard
                    icon="archive"
                    label="Under Review"
                    value={stats.underReview}
                    accentColor="notice"
                    onClick={() => router.push('/sdrone/history')}
                />
                <DashboardStatCard
                    icon="checkbox-circle"
                    label="Resolved Tasks"
                    value={stats.resolved}
                    accentColor="positive"
                    onClick={() => router.push('/sdrone/history')}
                />
            </section>

            {/* Two-Column Content */}
            <section className={styles.contentGrid}>
                {/* Attention Required */}
                <div className={styles.contentSection}>
                    <div className={styles.sectionHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <span className="text-body-strong">Attention Required</span>
                            <Badge color="negative" size="small">{urgentItems.length}</Badge>
                        </div>
                        <Button href="/sdrone/inbox" variant="ghost" size="sm">
                            View Inbox
                        </Button>
                    </div>
                    <div className={styles.alertList}>
                        {urgentItems.map(item => (
                            <TaskCard
                                key={item.id}
                                id={item.id}
                                iconName={item.icon}
                                title={item.title}
                                subtitle={item.reportType}
                                location={item.location}
                                reportedBy={item.reporterName}
                                reportedOn={item.reportedAt}
                                status={item.status}
                                badgeColor={item.badgeColor}
                                onClick={() => router.push(item.href)}
                            />
                        ))}
                    </div>

                </div>

                {/* Recent Activity */}
                <div className={styles.contentSection}>
                    <div className={styles.sectionHeader}>
                        <span className="text-body-strong">Recent Activity</span>
                        <Button href="/sdrone/history" variant="ghost" size="sm">
                            See all
                        </Button>
                    </div>
                    <div className={styles.activityList}>
                        {activityLogItems.map(item => (
                            <DashboardActivityLogItem
                                key={item.id}
                                name={item.name}
                                activity={item.activity}
                                timestamp={item.timestamp}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Breakdown */}
            <section className={styles.categorySection}>
                <div className={styles.sectionHeader}>
                    <span className="text-body-strong">Records by Category</span>
                    <Dropdown
                        label="Period"
                        options={PERIOD_OPTIONS}
                        value={categoryPeriod}
                        onChange={(value) => setCategoryPeriod(value || 'all')}
                        hideClearButton={true}
                        hideLabel={true}
                        neutralValue={true}
                    />
                </div>
                <div className={styles.categoryGrid}>
                    {categoryBreakdown.map(cat => (
                        <DashboardCategoryCard
                            key={cat.category}
                            icon={cat.icon}
                            label={cat.category}
                            total={cat.total}
                            open={cat.open}
                            accentColor={cat.accent}
                            onClick={() => router.push('/sdrone/history')}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
