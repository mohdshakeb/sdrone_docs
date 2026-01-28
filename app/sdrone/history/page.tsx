'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/prototype/EmptyState';
import SegmentedTabs from '@/components/prototype/SegmentedTabs';
import ComposableFilterBar from '@/components/prototype/ComposableFilterBar';
import AdvancedFiltersModal from '@/components/prototype/AdvancedFiltersModal';
import HistoryTable from '@/components/prototype/HistoryTable';
import { MOCK_HISTORY_RECORDS, LOCATION_OPTIONS } from '@/data/mock-data';
import {
    HISTORY_TABS,
    RECORD_SUBTYPES,
    RECORD_STATUSES,
    DEFAULT_FILTER_STATE,
    type HistoryRecord,
    type RecordCategory,
    type SortColumn,
    type SortDirection,
    type HistoryFilterState,
} from '@/types/history';
import type { AdvancedFilterValues } from '@/components/prototype/AdvancedFiltersModal';
import type { FilterConfig, FilterValues } from '@/components/prototype/ComposableFilterBar';
import type { DropdownItem } from '@/components/ui/Dropdown';
import styles from './page.module.css';

// Get subtypes for the active tab
const getSubtypesForTab = (tabId: string): string[] => {
    const tab = HISTORY_TABS.find((t) => t.id === tabId);
    if (!tab || !tab.category) {
        // "All" tab - return all subtypes
        return Object.values(RECORD_SUBTYPES).flat();
    }
    return RECORD_SUBTYPES[tab.category] || [];
};

// Check if Type filter should be visible for the tab
const shouldShowTypeFilter = (tabId: string): boolean => {
    // Hide Type filter for Toolbox Talk tab (only one subtype)
    return tabId !== 'toolbox-talk';
};

// Get grouped type items with section headers for dropdowns
const getGroupedTypeItems = (activeTab: string): DropdownItem[] => {
    if (activeTab === 'all') {
        // All categories - show all with headers, single items without header
        const items: DropdownItem[] = [];
        let isFirst = true;
        Object.entries(RECORD_SUBTYPES).forEach(([category, subtypes]) => {
            if (!isFirst) items.push({ type: 'divider' });

            if (subtypes.length === 1) {
                // Single subtype - add without header (like Toolbox Talk)
                items.push({ type: 'text', value: subtypes[0], label: subtypes[0] });
            } else {
                // Multiple subtypes - add with header
                items.push({ type: 'header', label: category });
                subtypes.forEach((subtype) => {
                    items.push({ type: 'text', value: subtype, label: subtype });
                });
            }
            isFirst = false;
        });
        return items;
    } else {
        // Single category - just list subtypes without header
        const subtypes = getSubtypesForTab(activeTab);
        return subtypes.map((st) => ({ type: 'text', value: st, label: st }));
    }
};

export default function HistoryPage() {
    const router = useRouter();

    // State
    const [activeTab, setActiveTab] = useState('all');
    const [filters, setFilters] = useState<HistoryFilterState>(DEFAULT_FILTER_STATE);
    const [sortColumn, setSortColumn] = useState<SortColumn>('updatedAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

    // Handle tab change
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        // Reset type filter when changing tabs
        setFilters((prev) => ({ ...prev, types: [] }));
    };

    // Handle primary filter changes
    const handleFilterChange = (filterId: string, value: unknown) => {
        setFilters((prev) => {
            // Convert null to empty array for array fields
            let normalizedValue = value;
            if ((filterId === 'types' || filterId === 'statuses') && value === null) {
                normalizedValue = [];
            }
            return {
                ...prev,
                [filterId]: normalizedValue,
            };
        });
    };

    // Handle advanced filter apply
    const handleAdvancedApply = (values: AdvancedFilterValues) => {
        setFilters((prev) => ({
            ...prev,
            ...values,
        }));
    };

    // Handle sort
    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            // Toggle direction
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Handle row click
    const handleRowClick = (record: HistoryRecord) => {
        router.push(`/sdrone/history/${record.id}`);
    };

    // Build filter configs for ComposableFilterBar
    const filterConfigs: FilterConfig[] = useMemo(() => {
        const showTypeFilter = shouldShowTypeFilter(activeTab);

        return [
            {
                id: 'search',
                type: 'search',
                label: 'Search',
                placeholder: 'Search by title, description, or ID...',
            },
            {
                id: 'types',
                type: 'multiselect',
                label: 'Type',
                items: getGroupedTypeItems(activeTab),
                visible: showTypeFilter,
            },
            {
                id: 'statuses',
                type: 'multiselect',
                label: 'Status',
                options: RECORD_STATUSES.map((s) => ({ value: s, label: s })),
            },
            {
                id: 'location',
                type: 'dropdown',
                label: 'Location',
                options: LOCATION_OPTIONS,
            },
            {
                id: 'dateRange',
                type: 'daterange',
                label: 'Date',
            },
        ];
    }, [activeTab]);

    // Convert filters to FilterValues for ComposableFilterBar
    const filterValues: FilterValues = {
        search: filters.search,
        types: filters.types,
        statuses: filters.statuses,
        location: filters.location,
        dateRange: filters.dateRange,
    };

    // Count active advanced filters
    const advancedFilterCount = useMemo(() => {
        let count = 0;
        if (filters.reportedBy) count++;
        if (filters.owner) count++;
        if (filters.closedBy) count++;
        if (filters.severity) count++;
        if (filters.slaBreached !== null) count++;
        if (filters.recordId) count++;
        return count;
    }, [filters]);

    // Filter and sort records
    const filteredRecords = useMemo(() => {
        let records = [...MOCK_HISTORY_RECORDS];

        // Filter by tab (category)
        const tab = HISTORY_TABS.find((t) => t.id === activeTab);
        if (tab?.category) {
            records = records.filter((r) => r.category === tab.category);
        }

        // Filter by search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            records = records.filter(
                (r) =>
                    r.title.toLowerCase().includes(searchLower) ||
                    r.description.toLowerCase().includes(searchLower) ||
                    r.id.toLowerCase().includes(searchLower)
            );
        }

        // Filter by types
        if (filters.types && filters.types.length > 0) {
            records = records.filter((r) => filters.types.includes(r.type));
        }

        // Filter by statuses
        if (filters.statuses && filters.statuses.length > 0) {
            records = records.filter((r) => filters.statuses.includes(r.status));
        }

        // Filter by location
        if (filters.location) {
            records = records.filter((r) =>
                r.location.name.toLowerCase().includes(filters.location!.toLowerCase())
            );
        }

        // Filter by record ID (exact match)
        if (filters.recordId) {
            records = records.filter((r) => r.id === filters.recordId);
        }

        // Sort
        records.sort((a, b) => {
            let comparison = 0;

            switch (sortColumn) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'type':
                    comparison = a.type.localeCompare(b.type);
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                case 'location':
                    comparison = a.location.name.localeCompare(b.location.name);
                    break;
                case 'owner':
                    const ownerA = a.closedBy?.name || a.owner?.name || a.reportedBy.name;
                    const ownerB = b.closedBy?.name || b.owner?.name || b.reportedBy.name;
                    comparison = ownerA.localeCompare(ownerB);
                    break;
                case 'updatedAt':
                default:
                    comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return records;
    }, [activeTab, filters, sortColumn, sortDirection]);

    // Show empty state if no records
    const showEmptyState = filteredRecords.length === 0;

    return (
        <div className={styles.container}>
            {/* Segmented Tabs */}
            <div className={styles.tabsContainer}>
                <SegmentedTabs
                    tabs={HISTORY_TABS}
                    activeTab={activeTab}
                    onChange={handleTabChange}
                />
            </div>

            {/* Filter Bar */}
            <div className={styles.filterContainer}>
                <ComposableFilterBar
                    filters={filterConfigs}
                    values={filterValues}
                    onChange={handleFilterChange}
                    showAdvancedButton
                    onAdvancedClick={() => setAdvancedFiltersOpen(true)}
                    advancedFilterCount={advancedFilterCount}
                />
            </div>

            {/* Table or Empty State */}
            {showEmptyState ? (
                <EmptyState
                    title="No records found"
                    description="Try adjusting filters or search"
                    icon="archive"
                />
            ) : (
                <HistoryTable
                    records={filteredRecords}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onRowClick={handleRowClick}
                />
            )}

            {/* Advanced Filters Modal */}
            <AdvancedFiltersModal
                isOpen={advancedFiltersOpen}
                onClose={() => setAdvancedFiltersOpen(false)}
                values={{
                    reportedBy: filters.reportedBy,
                    owner: filters.owner,
                    closedBy: filters.closedBy,
                    severity: filters.severity,
                    slaBreached: filters.slaBreached,
                    recordId: filters.recordId,
                }}
                onApply={handleAdvancedApply}
            />
        </div>
    );
}
