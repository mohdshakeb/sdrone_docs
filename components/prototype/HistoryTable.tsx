'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import type { HistoryRecord, SortColumn, SortDirection } from '@/types/history';
import type { RoleLevel } from '@/types/roles';
import { getHistoryStatusLabel, getStatusBadgeColor } from '@/types/status';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used by other imports from this module path
import styles from './HistoryTable.module.css';

export interface HistoryTableProps {
    /** Records to display */
    records: HistoryRecord[];
    /** Current sort column */
    sortColumn: SortColumn;
    /** Current sort direction */
    sortDirection: SortDirection;
    /** Callback when sort changes */
    onSort: (column: SortColumn) => void;
    /** Callback when row is clicked */
    onRowClick: (record: HistoryRecord) => void;
    /** Hide the Owner column (Level 1 users) */
    hideOwnerColumn?: boolean;
    /** Current role level for status label mapping */
    roleLevel?: RoleLevel;
}

// Helper to format relative time
const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
};

// Helper to format absolute date
const formatAbsoluteDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Column definitions
const COLUMNS: Array<{ key: SortColumn; label: string; sortable: boolean }> = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'owner', label: 'Owner / Closed By', sortable: true },
    { key: 'updatedAt', label: 'Last Updated', sortable: true },
];

/**
 * HistoryTable - Table component for displaying history records
 * Features sortable columns and clickable rows
 */
export const HistoryTable: React.FC<HistoryTableProps> = ({
    records,
    sortColumn,
    sortDirection,
    onSort,
    onRowClick,
    hideOwnerColumn = false,
    roleLevel = 2,
}) => {
    // Filter columns based on role
    const visibleColumns = hideOwnerColumn
        ? COLUMNS.filter((col) => col.key !== 'owner')
        : COLUMNS;
    const handleRowKeyDown = (e: React.KeyboardEvent, record: HistoryRecord) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRowClick(record);
        }
    };

    const renderSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) {
            return null;
        }
        return (
            <Icon
                name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                size={14}
                className={styles.sortIcon}
            />
        );
    };

    const getOwnerOrClosedBy = (record: HistoryRecord): string => {
        if (record.status === 'Closed' && record.closedBy) {
            return record.closedBy.name;
        }
        return record.owner?.name || record.reportedBy.name;
    };

    const getOwnerTooltip = (record: HistoryRecord): string => {
        if (record.status === 'Closed' && record.closedBy) {
            return `Closed by ${record.closedBy.name} (${record.closedBy.role}) on ${formatAbsoluteDate(record.closedBy.timestamp)}`;
        }
        if (record.owner) {
            return `Owner: ${record.owner.name} (${record.owner.role})`;
        }
        return `Reported by: ${record.reportedBy.name} (${record.reportedBy.role})`;
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        {visibleColumns.map((col) => (
                            <th
                                key={col.key}
                                className={`${styles.th} ${col.sortable ? styles.sortable : ''} text-caption-small`}
                                onClick={() => col.sortable && onSort(col.key)}
                                aria-sort={
                                    sortColumn === col.key
                                        ? sortDirection === 'asc'
                                            ? 'ascending'
                                            : 'descending'
                                        : undefined
                                }
                            >
                                <span className={styles.thContent}>
                                    {col.label}
                                    {renderSortIcon(col.key)}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {records.map((record) => (
                        <tr
                            key={record.id}
                            className={styles.tr}
                            onClick={() => onRowClick(record)}
                            onKeyDown={(e) => handleRowKeyDown(e, record)}
                            tabIndex={0}
                            role="button"
                            aria-label={`View details for ${record.title}`}
                        >
                            <td className={`${styles.td} ${styles.titleCell} text-caption`}>
                                <span className={styles.titleText} title={record.title}>
                                    {record.title}
                                </span>
                            </td>
                            <td className={`${styles.td} text-caption`}>
                                {record.type}
                            </td>
                            <td className={styles.td}>
                                <Badge
                                    color={getStatusBadgeColor(record.status)}
                                    size="small"
                                >
                                    {getHistoryStatusLabel(record.status, roleLevel)}
                                </Badge>
                            </td>
                            <td className={`${styles.td} text-caption`}>
                                <span className={styles.locationText}>
                                    {record.location.name}
                                    {record.location.area && (
                                        <span className={styles.locationArea}>
                                            {record.location.area}
                                        </span>
                                    )}
                                </span>
                            </td>
                            {!hideOwnerColumn && (
                                <td
                                    className={`${styles.td} text-caption`}
                                    title={getOwnerTooltip(record)}
                                >
                                    {getOwnerOrClosedBy(record)}
                                </td>
                            )}
                            <td
                                className={`${styles.td} text-caption`}
                                title={formatAbsoluteDate(record.updatedAt)}
                            >
                                {formatRelativeTime(record.updatedAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;
