'use client';

import React from 'react';
import Dropdown, { type DropdownItem } from '@/components/ui/Dropdown';
import styles from './FilterBar.module.css';

export interface FilterBarProps {
  /** Report type filter value */
  reportType: string | null;
  /** Status filter value */
  status: string | null;
  /** Callback when report type changes */
  onReportTypeChange: (value: string | null) => void;
  /** Callback when status changes */
  onStatusChange: (value: string | null) => void;
  /** Report type dropdown items */
  reportTypeItems: DropdownItem[];
  /** Status dropdown options */
  statusOptions: Array<{ value: string; label: string }>;
}

/**
 * FilterBar - Reusable filter bar component for task lists
 * Provides type and status filtering with consistent UI
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  reportType,
  status,
  onReportTypeChange,
  onStatusChange,
  reportTypeItems,
  statusOptions,
}) => {
  return (
    <div className={styles.filterBar}>
      <Dropdown
        label="Type"
        items={reportTypeItems}
        value={reportType}
        onChange={onReportTypeChange}
      />
      <Dropdown label="Status" options={statusOptions} value={status} onChange={onStatusChange} />
    </div>
  );
};

export default FilterBar;
