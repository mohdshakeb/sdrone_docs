'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/components/prototype/RoleProvider';
import type { IconName } from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import FilterChip from '@/components/ui/FilterChip';
import SelectBottomSheet from '@/components/ui/SelectBottomSheet';
import DashboardStatCard from '@/components/prototype/DashboardStatCard';
import TaskCard from '@/components/prototype/TaskCard';
import DashboardActivityLogItem from '@/components/prototype/DashboardActivityLogItem';
import DashboardCategoryCard from '@/components/prototype/DashboardCategoryCard';
import { MOCK_TASKS, MOCK_HISTORY_RECORDS } from '@/data/mock-data';
import { CATEGORY_ICONS } from '@/types/history';
import type { RecordCategory } from '@/types/history';
import { getDisplayLabel } from '@/types/status';
import { getVisibleRecords, getVisibleCategories } from '@/utils/role-filters';
import { getGreeting, getShortDate } from '@/utils/formatters';
import styles from './page.module.css';

type AccentColor = 'default' | 'negative' | 'positive' | 'notice' | 'information';

const ALL_CATEGORIES: { key: RecordCategory; icon: IconName; accent: AccentColor }[] = [
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

export default function MobileHomePage() {
    const router = useRouter();
    const { role } = useRole();
    const [categoryPeriod, setCategoryPeriod] = useState('all');
    const [isPeriodSheetOpen, setIsPeriodSheetOpen] = useState(false);

    const isLevel1 = role.level === 1;
    const isLevel3 = role.level === 3;

    // Get records visible to this role
    const visibleRecords = useMemo(() => getVisibleRecords(MOCK_HISTORY_RECORDS, role), [role]);

    // Helper to compute display label context for a record
    const getRecordDisplayContext = (r: { status: string; owner?: { name: string }; createdAt: string; updatedAt: string }) => ({
        isAssignee: r.status === 'Pending' && r.owner?.name === role.userName,
        isReviewer: role.level >= 2 && r.status === 'Under Review',
        recordAgeDays: (Date.now() - new Date(r.createdAt).getTime()) / 86400000,
        isUpdated: r.createdAt !== r.updatedAt && r.status !== 'Closed',
    });

    // Compute dashboard stats (role-aware, matching web)
    const stats = useMemo(() => {
        if (isLevel1) {
            return {
                pending: visibleRecords.filter(r => r.status !== 'Closed').length,
                critical: visibleRecords.filter(r => r.status === 'On Hold').length,
                underReview: visibleRecords.filter(r => r.status === 'Under Review').length,
                resolved: visibleRecords.filter(r => r.status === 'Closed').length,
            };
        }
        if (isLevel3) {
            return {
                pending: MOCK_TASKS.filter(t => t.status !== 'Closed').length,
                critical: MOCK_HISTORY_RECORDS.filter(r => r.status === 'Escalated').length,
                underReview: MOCK_HISTORY_RECORDS.filter(r => r.status === 'Under Review').length,
                resolved: MOCK_HISTORY_RECORDS.filter(r => r.status === 'Closed').length,
            };
        }
        // Level 2
        return {
            pending: MOCK_TASKS.filter(t => t.status !== 'Closed').length,
            critical: MOCK_HISTORY_RECORDS.filter(r => r.status === 'On Hold' || r.status === 'Escalated').length,
            underReview: MOCK_HISTORY_RECORDS.filter(r => r.status === 'Under Review').length,
            resolved: MOCK_HISTORY_RECORDS.filter(r => r.status === 'Closed').length,
        };
    }, [isLevel1, isLevel3, visibleRecords]);

    // Urgent items (role-aware, matching web)
    const urgentItems = useMemo(() => {
        if (isLevel1) {
            // Level 1: Only their Pending + On Hold records
            return visibleRecords
                .filter(r => r.status === 'Pending' || r.status === 'On Hold')
                .map(r => {
                    const display = getDisplayLabel(r.status, getRecordDisplayContext(r));
                    return {
                        id: r.id,
                        icon: CATEGORY_ICONS[r.category],
                        title: r.title,
                        reportType: r.type,
                        location: r.location.name,
                        reporterName: r.reportedBy.name,
                        reportedAt: getShortDate(r.updatedAt),
                        status: display.label,
                        badgeColor: display.color,
                        href: `/mobile/history/${r.id}`,
                    };
                })
                .slice(0, 4);
        }

        // Level 2 & 3: On Hold tasks + urgent records
        const onHoldTasks = MOCK_TASKS
            .filter(t => t.status === 'On Hold')
            .map(t => {
                const display = getDisplayLabel(t.status, { isReviewer: true });
                return {
                    id: t.id,
                    icon: t.iconName,
                    title: t.title,
                    reportType: t.subtitle,
                    location: t.location,
                    reporterName: t.reportedBy,
                    reportedAt: t.reportedOn,
                    status: display.label,
                    badgeColor: display.color,
                    href: '/mobile/inbox',
                };
            });

        const urgentRecords = MOCK_HISTORY_RECORDS
            .filter(r => {
                if (isLevel3) {
                    return r.status === 'Escalated' || r.status === 'On Hold';
                }
                return r.status === 'On Hold' || r.status === 'Escalated';
            })
            .map(r => {
                const display = getDisplayLabel(r.status, getRecordDisplayContext(r));
                return {
                    id: r.id,
                    icon: CATEGORY_ICONS[r.category],
                    title: r.title,
                    reportType: r.type,
                    location: r.location.name,
                    reporterName: r.reportedBy.name,
                    reportedAt: getShortDate(r.updatedAt),
                    status: display.label,
                    badgeColor: display.color,
                    href: `/mobile/history/${r.id}`,
                };
            });

        // Level 3: sort escalated items first
        const combined = isLevel3
            ? [...urgentRecords.filter(r => r.status === 'Escalated'), ...onHoldTasks, ...urgentRecords.filter(r => r.status !== 'Escalated')]
            : [...onHoldTasks, ...urgentRecords];

        return combined.slice(0, 4);
    }, [isLevel1, isLevel3, visibleRecords, role.level]);

    // Recent Reports for Level 1
    const myRecentReports = useMemo(() => {
        if (!isLevel1) return [];
        return visibleRecords
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [isLevel1, visibleRecords]);

    // Category breakdown (filtered by period) - role-aware categories
    const visibleCats = getVisibleCategories(role.level);
    const categories = ALL_CATEGORIES.filter(c => visibleCats.includes(c.key));

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

        return categories.map(({ key, icon, accent }) => {
            const records = filteredRecords.filter(r => r.category === key);
            const openCount = records.filter(r => r.status !== 'Closed').length;
            return { category: key, icon, accent, total: records.length, open: openCount };
        });
    }, [categoryPeriod, categories]);

    // Activity log (Level 2 & 3 only)
    const activityLogItems = useMemo(() => [
        { id: 'al-1', name: 'Ajay Nair', activity: 'created a Tool Audit', timestamp: '2 mins ago' },
        { id: 'al-2', name: 'Sara Khan', activity: 'closed a General Work Permit', timestamp: '1 hour ago' },
        { id: 'al-3', name: 'Rohan Sharma', activity: 'reported a Near Miss', timestamp: '3 hours ago' },
        { id: 'al-4', name: 'Meera Patel', activity: 'escalated Safety Audit', timestamp: '5 hours ago' },
        { id: 'al-5', name: 'Karan Johar', activity: 'completed Health Check', timestamp: '1 day ago' },
    ], []);

    // Stat card labels per role (matching web)
    const statLabels = isLevel1
        ? { pending: 'Assigned to Me', critical: 'On Hold', underReview: 'Under Review', resolved: 'Closed' }
        : isLevel3
            ? { pending: 'Awaiting Review', critical: 'Escalated', underReview: 'Under Review', resolved: 'Closed' }
            : { pending: 'Awaiting Review', critical: 'On Hold', underReview: 'Under Review', resolved: 'Closed' };

    const attentionLabel = isLevel1 ? 'Items Needing Action' : 'Attention Required';

    return (
        <div className={styles.container}>
            {/* Greeting */}
            <section className={styles.greeting}>
                <h2 className="text-heading">{getGreeting()}, {role.userName.split(' ')[0]}</h2>
                <p className={`${styles.greetingSubtext} text-body`}>Here&apos;s your safety overview</p>
            </section>

            {/* Quick Stats */}
            <section className={styles.statsGrid}>
                <DashboardStatCard
                    icon="inbox"
                    label={statLabels.pending}
                    value={stats.pending}
                    onClick={() => router.push(isLevel1 ? '/mobile/history' : '/mobile/inbox')}
                />
                <DashboardStatCard
                    icon={isLevel3 ? 'arrow-up' : 'alert'}
                    label={statLabels.critical}
                    value={stats.critical}
                    accentColor="negative"
                    onClick={() => router.push(isLevel1 ? '/mobile/history' : '/mobile/inbox')}
                />
                <DashboardStatCard
                    icon="archive"
                    label={statLabels.underReview}
                    value={stats.underReview}
                    accentColor="notice"
                    onClick={() => router.push('/mobile/history')}
                />
                <DashboardStatCard
                    icon="checkbox-circle"
                    label={statLabels.resolved}
                    value={stats.resolved}
                    accentColor="positive"
                    onClick={() => router.push('/mobile/history')}
                />
            </section>

            {/* Attention Required / Items Needing Action */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span className="text-body-strong">{attentionLabel}</span>
                        <Badge color="negative" size="small">{urgentItems.length}</Badge>
                    </div>
                    <Button href={isLevel1 ? '/mobile/history' : '/mobile/inbox'} variant="ghost" size="sm">
                        {isLevel1 ? 'View History' : 'View Inbox'}
                    </Button>
                </div>
                <div className={styles.alertList}>
                    {urgentItems.length === 0 ? (
                        <p className={`text-body ${styles.emptyText}`}>No items need your attention right now.</p>
                    ) : (
                        urgentItems.map(item => (
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
                                compact
                            />
                        ))
                    )}
                </div>
            </section>

            {/* Level 1: Recent Reports / Level 2 & 3: Recent Activity */}
            {isLevel1 ? (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className="text-body-strong">Recent Reports</span>
                        <Button href="/mobile/history" variant="ghost" size="sm">
                            View all
                        </Button>
                    </div>
                    <div className={styles.alertList}>
                        {myRecentReports.map(record => {
                            const display = getDisplayLabel(record.status, getRecordDisplayContext(record));
                            return (
                                <TaskCard
                                    key={record.id}
                                    id={record.id}
                                    iconName={CATEGORY_ICONS[record.category]}
                                    title={record.title}
                                    subtitle={record.type}
                                    location={record.location.name}
                                    reportedBy={record.reportedBy.name}
                                    reportedOn={getShortDate(record.createdAt)}
                                    status={display.label}
                                    badgeColor={display.color}
                                    onClick={() => router.push(`/mobile/history/${record.id}`)}
                                    compact
                                />
                            );
                        })}
                    </div>
                </section>
            ) : (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className="text-body-strong">Recent Activity</span>
                        <Button href="/mobile/history" variant="ghost" size="sm">
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
                </section>
            )}

            {/* Records by Category (role-filtered) - Level 2 & 3 only */}
            {!isLevel1 && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className="text-body-strong">Records by Category</span>
                        <FilterChip
                            selected={true}
                            value={PERIOD_OPTIONS.find(opt => opt.value === categoryPeriod)?.label}
                            isOpen={isPeriodSheetOpen}
                            onClick={() => setIsPeriodSheetOpen(true)}
                            hideClearButton={true}
                            hideLabel={true}
                            neutralValue={true}
                        >
                            Period
                        </FilterChip>
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
                                onClick={() => router.push('/mobile/history')}
                            />
                        ))}
                    </div>
                </section>
            )}

            <SelectBottomSheet
                isOpen={isPeriodSheetOpen}
                onClose={() => setIsPeriodSheetOpen(false)}
                title="Period"
                options={PERIOD_OPTIONS}
                selectedValue={categoryPeriod}
                onSelect={(value) => setCategoryPeriod(value)}
            />
        </div>
    );
}
