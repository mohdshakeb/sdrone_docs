'use client';

import React, { useState, useMemo } from 'react';
import { useRole } from '@/components/prototype/RoleProvider';
import TaskCard from '@/components/prototype/TaskCard';
import MobileTaskDetail from '@/components/mobile/MobileTaskDetail';
import FilterBottomSheet from '@/components/mobile/FilterBottomSheet';
import FilterChip from '@/components/ui/FilterChip';
import EmptyState from '@/components/prototype/EmptyState';
import { MOCK_TASKS, REPORT_TYPE_ITEMS_ALL_TAB, Task } from '@/data/mock-data';
import { getInboxStatusOptions, getInboxStatusLabel, getDisplayLabel } from '@/types/status';
import { getVisibleTasks, getVisibleReportTypeItems } from '@/utils/role-filters';
import styles from './page.module.css';

// Helper to find label from structured items
function getItemLabel(value: string | null): string | undefined {
    if (!value) return undefined;
    for (const item of REPORT_TYPE_ITEMS_ALL_TAB) {
        if (item.type === 'divider' || item.type === 'header' || item.type === 'custom') continue;
        if (item.value === value) return item.label;
    }
    return undefined;
}

export default function MobileInboxPage() {
    const { role } = useRole();
    const [filters, setFilters] = useState<{ reportType: string | null; status: string | null }>({
        reportType: null,
        status: null,
    });
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [openFilter, setOpenFilter] = useState<'reportType' | 'status' | null>(null);

    // Get role-aware filter options
    const reportTypeItems = useMemo(
        () => getVisibleReportTypeItems(REPORT_TYPE_ITEMS_ALL_TAB, role.level),
        [role.level]
    );
    const statusOptions = useMemo(() => getInboxStatusOptions(role.level), [role.level]);

    const filteredTasks = useMemo(() => {
        // Apply role-based filtering first
        let tasks = getVisibleTasks(MOCK_TASKS, role);

        if (filters.reportType) {
            tasks = tasks.filter((task) => {
                if (filters.reportType === 'permit-to-work') {
                    const permitSubtypes = ['general work', 'cold work', 'hot work', 'height work', 'permit to work'];
                    return permitSubtypes.some(subtype =>
                        task.subtitle.toLowerCase().includes(subtype) ||
                        subtype.includes(task.subtitle.toLowerCase())
                    );
                }

                const item = REPORT_TYPE_ITEMS_ALL_TAB.find(
                    (item) =>
                        item.type !== 'divider' &&
                        item.type !== 'header' &&
                        item.value === filters.reportType
                );
                if (!item || item.type === 'divider' || item.type === 'header') return true;

                const itemLabel = item.type === 'icon' || item.type === 'text' ? item.label : '';
                return (
                    task.subtitle.toLowerCase().includes(itemLabel.toLowerCase()) ||
                    itemLabel.toLowerCase().includes(task.subtitle.toLowerCase())
                );
            });
        }

        if (filters.status) {
            const statusOption = statusOptions.find((opt) => opt.value === filters.status);
            if (statusOption) {
                tasks = tasks.filter((task) => {
                    const displayLabel = getInboxStatusLabel(task.status, role.level);
                    return displayLabel === statusOption.label;
                });
            }
        }

        return tasks;
    }, [filters.reportType, filters.status, role, statusOptions]);

    const handleTaskClick = (taskId: string) => {
        const task = MOCK_TASKS.find(t => t.id === taskId);
        setSelectedTask(task || null);
    };

    const handleDetailClose = () => {
        setSelectedTask(null);
    };

    const reportTypeLabel = getItemLabel(filters.reportType);
    const statusLabel = filters.status
        ? statusOptions.find((opt) => opt.value === filters.status)?.label
        : undefined;

    return (
        <div className={styles.container}>
            <div className={styles.filterBar}>
                <FilterChip
                    selected={filters.reportType !== null}
                    value={reportTypeLabel}
                    isOpen={openFilter === 'reportType'}
                    onClick={() => setOpenFilter('reportType')}
                    onClear={(e) => {
                        e.stopPropagation();
                        setFilters(prev => ({ ...prev, reportType: null }));
                    }}
                >
                    Report Type
                </FilterChip>

                <FilterChip
                    selected={filters.status !== null}
                    value={statusLabel}
                    isOpen={openFilter === 'status'}
                    onClick={() => setOpenFilter('status')}
                    onClear={(e) => {
                        e.stopPropagation();
                        setFilters(prev => ({ ...prev, status: null }));
                    }}
                >
                    Status
                </FilterChip>
            </div>

            <div className={styles.taskList}>
                {filteredTasks.length === 0 ? (
                    <EmptyState
                        icon="inbox"
                        title="No tasks found"
                        description="Try adjusting your filters to see more results."
                    />
                ) : (
                    filteredTasks.map((task) => {
                        const display = getDisplayLabel(task.status, { isReviewer: role.level >= 2 && task.status === 'Under Review' });
                        return (
                            <TaskCard
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                subtitle={task.subtitle}
                                status={display.label}
                                reportedBy={task.reportedBy}
                                reportedOn={task.reportedOn}
                                location={task.location}
                                iconName={task.iconName}
                                badgeColor={display.color}
                                onClick={handleTaskClick}
                                isSelected={selectedTask?.id === task.id}
                                compact
                            />
                        );
                    })
                )}
            </div>

            <MobileTaskDetail
                task={selectedTask}
                isOpen={selectedTask !== null}
                onClose={handleDetailClose}
            />

            <FilterBottomSheet
                isOpen={openFilter === 'reportType'}
                onClose={() => setOpenFilter(null)}
                title="Report Type"
                items={reportTypeItems}
                selectedValue={filters.reportType}
                onSelect={(value) => setFilters(prev => ({ ...prev, reportType: value }))}
            />

            <FilterBottomSheet
                isOpen={openFilter === 'status'}
                onClose={() => setOpenFilter(null)}
                title="Status"
                options={statusOptions}
                selectedValue={filters.status}
                onSelect={(value) => setFilters(prev => ({ ...prev, status: value }))}
            />
        </div>
    );
}
