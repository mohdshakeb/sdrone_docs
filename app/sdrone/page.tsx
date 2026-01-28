'use client';

import React, { useState, useMemo } from 'react';
import TaskCard from '@/components/prototype/TaskCard';
import ComposableFilterBar from '@/components/prototype/ComposableFilterBar';
import type { FilterConfig, FilterValues } from '@/components/prototype/ComposableFilterBar';
import TaskDetailPanel from '@/components/prototype/TaskDetailPanel';
import EmptyState from '@/components/prototype/EmptyState';
import { MOCK_TASKS, REPORT_TYPE_ITEMS, STATUS_OPTIONS, Task } from '@/data/mock-data';
import styles from './page.module.css';

/**
 * Inbox Page - S-Drone task list with filtering
 *
 * Refactored for better separation of concerns:
 * - Data moved to data/mock-data.ts
 * - Uses ComposableFilterBar for consistent filtering UX
 * - Page focused on layout and state management
 */
export default function InboxPage() {
  const [filters, setFilters] = useState<{ reportType: string | null; status: string | null }>({
    reportType: null,
    status: null,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
      items: REPORT_TYPE_ITEMS,
    },
    {
      id: 'status',
      type: 'dropdown',
      label: 'Status',
      options: STATUS_OPTIONS,
    },
  ], []);

  // Filter values for ComposableFilterBar
  const filterValues: FilterValues = {
    reportType: filters.reportType,
    status: filters.status,
  };

  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    let tasks = [...MOCK_TASKS];

    // Filter by report type
    if (filters.reportType) {
      tasks = tasks.filter((task) => {
        // Find the report type item to get its label
        const item = REPORT_TYPE_ITEMS.find(
          (item) =>
            item.type !== 'divider' &&
            item.type !== 'header' &&
            item.value === filters.reportType
        );
        if (!item || item.type === 'divider' || item.type === 'header') return true;

        // Match the task subtitle with the item label
        const itemLabel = item.type === 'icon' || item.type === 'text' ? item.label : '';
        return (
          task.subtitle.toLowerCase().includes(itemLabel.toLowerCase()) ||
          itemLabel.toLowerCase().includes(task.subtitle.toLowerCase())
        );
      });
    }

    // Filter by status
    if (filters.status) {
      // Find the status option to get its label
      const statusOption = STATUS_OPTIONS.find((opt) => opt.value === filters.status);
      if (statusOption) {
        tasks = tasks.filter((task) => task.status === statusOption.label);
      }
    }

    return tasks;
  }, [filters.reportType, filters.status]);

  const handleTaskClick = (taskId: string) => {
    const task = MOCK_TASKS.find(t => t.id === taskId);
    setSelectedTask(task || null);
  };

  const handlePanelClose = () => {
    setSelectedTask(null);
  };

  const isPanelOpen = selectedTask !== null;

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
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              subtitle={task.subtitle}
              status={task.status}
              reportedBy={task.reportedBy}
              reportedOn={task.reportedOn}
              location={task.location}
              iconName={task.iconName}
              badgeColor={task.badgeColor}
              onClick={handleTaskClick}
              isSelected={selectedTask?.id === task.id}
            />
          ))
        )}
      </div>

      <TaskDetailPanel
        task={selectedTask}
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
      />
    </div>
  );
}
