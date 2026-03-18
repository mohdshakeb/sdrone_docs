'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/components/prototype/RoleProvider';
import EmptyState from '@/components/prototype/EmptyState';
import SegmentedTabs from '@/components/prototype/SegmentedTabs';
import MobileHistoryList from '@/components/mobile/MobileHistoryList';
import { MOCK_HISTORY_RECORDS } from '@/data/mock-data';
import {
    HISTORY_TABS,
    type HistoryRecord,
} from '@/types/history';
import { getVisibleRecords, getVisibleHistoryTabs } from '@/utils/role-filters';
import styles from './page.module.css';

export default function MobileHistoryPage() {
    const router = useRouter();
    const { role } = useRole();
    const [activeTab, setActiveTab] = useState('all');

    // Get role-aware tabs
    const visibleTabs = useMemo(() => getVisibleHistoryTabs(role.level), [role.level]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    const handleRecordClick = (record: HistoryRecord) => {
        router.push(`/mobile/history/${record.id}`);
    };

    const filteredRecords = useMemo(() => {
        // Apply role-based filtering first
        let records = getVisibleRecords(MOCK_HISTORY_RECORDS, role);

        const tab = visibleTabs.find((t) => t.id === activeTab);
        if (tab?.category) {
            records = records.filter((r) => r.category === tab.category);
        }

        // Sort by most recent
        records.sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        return records;
    }, [activeTab, role, visibleTabs]);

    return (
        <div className={styles.container}>
            <div className={styles.tabsContainer}>
                <SegmentedTabs
                    tabs={visibleTabs}
                    activeTab={activeTab}
                    onChange={handleTabChange}
                />
            </div>

            <div className={styles.listContainer}>
                {filteredRecords.length === 0 ? (
                    <EmptyState
                        title="No records found"
                        description="Try a different category."
                        icon="archive"
                    />
                ) : (
                    <MobileHistoryList
                        records={filteredRecords}
                        onRecordClick={handleRecordClick}
                    />
                )}
            </div>
        </div>
    );
}
