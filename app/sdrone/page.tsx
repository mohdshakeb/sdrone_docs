'use client';

import React, { useState } from 'react';
import TaskCard from '@/components/prototype/TaskCard';
import FilterBar from '@/components/prototype/FilterBar';
import { MOCK_TASKS, REPORT_TYPE_ITEMS, STATUS_OPTIONS } from '@/data/mock-data';
import styles from './page.module.css';

/**
 * Inbox Page - S-Drone task list with filtering
 *
 * Refactored for better separation of concerns:
 * - Data moved to data/mock-data.ts
 * - FilterBar extracted to components/prototype/FilterBar.tsx
 * - Page focused on layout and state management
 */
export default function InboxPage() {
  const [reportType, setReportType] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className={styles.pageContainer}>
      {/* Filters - Sticky below header */}
      <div className={styles.filterContainer}>
        <FilterBar
          reportType={reportType}
          status={status}
          onReportTypeChange={setReportType}
          onStatusChange={setStatus}
          reportTypeItems={REPORT_TYPE_ITEMS}
          statusOptions={STATUS_OPTIONS}
        />
      </div>

      {/* Task Cards */}
      <div className={styles.taskList}>
        {MOCK_TASKS.map((task) => (
          <TaskCard
            key={task.id}
            title={task.title}
            subtitle={task.subtitle}
            status={task.status}
            reportedBy={task.reportedBy}
            reportedOn={task.reportedOn}
            location={task.location}
            iconName={task.iconName}
            badgeColor={task.badgeColor}
          />
        ))}
      </div>
    </div>
  );
}
