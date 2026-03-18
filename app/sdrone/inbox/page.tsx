'use client';

import React, { useState, useMemo } from 'react';
import TaskCard from '@/components/prototype/TaskCard';
import ComposableFilterBar from '@/components/prototype/ComposableFilterBar';
import type { FilterConfig, FilterValues } from '@/components/prototype/ComposableFilterBar';
import TaskDetailPanel from '@/components/prototype/TaskDetailPanel';
import EmptyState from '@/components/prototype/EmptyState';
import { MOCK_TASKS, REPORT_TYPE_ITEMS_ALL_TAB } from '@/data/mock-data';
import { useRole } from '@/components/prototype/RoleProvider';
import { getVisibleTasks, getVisibleReportTypeItems } from '@/utils/role-filters';
import { getInboxStatusOptions, getInboxStatusLabel, getDisplayLabel } from '@/types/status';
import styles from './page.module.css';

export default function InboxPage() {
  const { role } = useRole();
  const [filters, setFilters] = useState<{ reportType: string | null; status: string | null }>({
    reportType: null,
    status: null,
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Role-aware options
  const reportTypeItems = useMemo(
    () => getVisibleReportTypeItems(REPORT_TYPE_ITEMS_ALL_TAB, role.level),
    [role.level]
  );
  const statusOptions = useMemo(() => getInboxStatusOptions(role.level), [role.level]);

  // Handle filter changes
  const handleFilterChange = (filterId: string, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  // Filter configurations
  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      id: 'reportType',
      type: 'dropdown',
      label: 'Report Type',
      items: reportTypeItems,
    },
    {
      id: 'status',
      type: 'dropdown',
      label: 'Status',
      options: statusOptions,
    },
  ], [reportTypeItems, statusOptions]);

  // Filter values for ComposableFilterBar
  const filterValues: FilterValues = {
    reportType: filters.reportType,
    status: filters.status,
  };

  // Filter tasks based on role + selected filters
  const filteredTasks = useMemo(() => {
    // Start with role-filtered tasks
    let tasks = getVisibleTasks(MOCK_TASKS, role);

    // Filter by report type
    if (filters.reportType) {
      tasks = tasks.filter((task) => {
        // Special handling for collapsed "Permit to Work"
        if (filters.reportType === 'permit-to-work') {
          const permitSubtypes = ['general work', 'cold work', 'hot work', 'height work', 'permit to work'];
          return permitSubtypes.some(subtype =>
            task.subtitle.toLowerCase().includes(subtype) ||
            subtype.includes(task.subtitle.toLowerCase())
          );
        }

        // Find the report type item to get its label
        const item = reportTypeItems.find(
          (i) =>
            i.type !== 'divider' &&
            i.type !== 'header' &&
            i.value === filters.reportType
        );
        if (!item || item.type === 'divider' || item.type === 'header') return true;

        const itemLabel = item.type === 'icon' || item.type === 'text' ? item.label : '';
        return (
          task.subtitle.toLowerCase().includes(itemLabel.toLowerCase()) ||
          itemLabel.toLowerCase().includes(task.subtitle.toLowerCase())
        );
      });
    }

    // Filter by status (map display label back to raw status)
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
  }, [filters.reportType, filters.status, role, reportTypeItems, statusOptions]);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handlePanelClose = () => {
    setSelectedTaskId(null);
  };

  const isPanelOpen = selectedTaskId !== null;

  return (
    <div className={`${styles.pageContainer} ${isPanelOpen ? styles.pageContainerWithPanel : ''}`}>
      {/* Filters - Sticky below header */}
      <div className={styles.filterContainer}>
        <ComposableFilterBar
          filters={filterConfigs}
          values={filterValues}
          onChange={handleFilterChange}
        />
      </div>

      {/* Task Cards */}
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
                isSelected={selectedTaskId === task.id}
              />
            );
          })
        )}
      </div>

      <TaskDetailPanel
        taskId={selectedTaskId}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />
    </div>
  );
}
