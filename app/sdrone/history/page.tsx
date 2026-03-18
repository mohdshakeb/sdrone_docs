'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/prototype/EmptyState';
import SegmentedTabs from '@/components/prototype/SegmentedTabs';
import ComposableFilterBar from '@/components/prototype/ComposableFilterBar';
import AdvancedFiltersModal from '@/components/prototype/AdvancedFiltersModal';
import HistoryTable from '@/components/prototype/HistoryTable';
import { MOCK_HISTORY_RECORDS, LOCATION_OPTIONS, REPORT_TYPE_ITEMS, REPORT_TYPE_ITEMS_ALL_TAB } from '@/data/mock-data';
import {
    HISTORY_TABS,
    RECORD_SUBTYPES,
    DEFAULT_FILTER_STATE,
    type HistoryRecord,
    type SortColumn,
    type SortDirection,
    type HistoryFilterState,
} from '@/types/history';
import { useRole } from '@/components/prototype/RoleProvider';
import { getVisibleRecords, getVisibleReportTypeItems, getVisibleHistoryTabs, getAdvancedFilterVisibility } from '@/utils/role-filters';
import { getHistoryStatusOptions, getHistoryStatusLabel, getStatusBadgeColor } from '@/types/status';
import type { AdvancedFilterValues } from '@/components/prototype/AdvancedFiltersModal';
import type { FilterConfig, FilterValues } from '@/components/prototype/ComposableFilterBar';
import type { DropdownItem } from '@/components/ui/Dropdown';
import styles from './page.module.css';

// Check if Type filter should be visible for the tab
const shouldShowTypeFilter = (tabId: string): boolean => {
    // Hide Type filter for Toolbox Talk tab (only one subtype)
    return tabId !== 'toolbox-talk';
};

// Get type items for the active tab
// When on "all" tab: show collapsed version (Permit to Work and Toolbox Talk without sub-categories)
// When on specific tab: show only subtypes for that category (no headers)
const getTypeItemsForTab = (activeTab: string): DropdownItem[] => {
    if (activeTab === 'all') {
        // Show all report types with headers, but collapsed Permit to Work and Toolbox Talk
        return REPORT_TYPE_ITEMS_ALL_TAB;
    }

    // Find the category for this tab
    const tab = HISTORY_TABS.find((t) => t.id === activeTab);
    if (!tab?.category) {
        return REPORT_TYPE_ITEMS;
    }

    // Get subtypes for this category
    const subtypes = RECORD_SUBTYPES[tab.category] || [];
    if (subtypes.length === 0) {
        return [];
    }

    // Check if we should hide icons (for Permit to Work tab)
    const isPermitTab = tab.category === 'Permit to Work';

    // Find matching items from REPORT_TYPE_ITEMS by matching labels to subtypes
    const filteredItems: DropdownItem[] = [];
    REPORT_TYPE_ITEMS.forEach((item) => {
        if (item.type === 'icon' || item.type === 'text') {
            // Check if this item's label matches any subtype in this category (strict match)
            const matchesSubtype = subtypes.some(
                (subtype) => item.label.trim().toLowerCase() === subtype.trim().toLowerCase()
            );

            if (matchesSubtype) {
                // If it's a permit tab, force type to 'text' to hide icons
                if (isPermitTab) {
                    filteredItems.push({ ...item, type: 'text' });
                } else {
                    filteredItems.push(item);
                }
            }
        }
    });

    return filteredItems;
};

export default function HistoryPage() {
    const router = useRouter();
    const { role } = useRole();

    // State
    const [activeTab, setActiveTab] = useState('all');
    const [filters, setFilters] = useState<HistoryFilterState>(DEFAULT_FILTER_STATE);
    const [sortColumn, setSortColumn] = useState<SortColumn>('updatedAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);

    // Role-aware data
    const visibleTabs = useMemo(() => getVisibleHistoryTabs(role.level), [role.level]);
    const statusOptions = useMemo(() => getHistoryStatusOptions(role.level), [role.level]);
    const advancedFilterVisibility = useMemo(() => getAdvancedFilterVisibility(role.level), [role.level]);
    const hideOwnerColumn = role.level === 1;

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

        // Get type items, then filter by role
        const tabTypeItems = getTypeItemsForTab(activeTab);
        const roleTypeItems = getVisibleReportTypeItems(tabTypeItems, role.level);

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
                items: roleTypeItems,
                visible: showTypeFilter,
            },
            {
                id: 'statuses',
                type: 'multiselect',
                label: 'Status',
                options: statusOptions.map((s) => ({ value: s.value, label: s.label })),
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
    }, [activeTab, role.level, statusOptions]);

    // Convert filters to FilterValues for ComposableFilterBar
    const filterValues: FilterValues = {
        search: filters.search,
        types: filters.types,
        statuses: filters.statuses,
        location: filters.location,
        dateRange: filters.dateRange,
    };

    // Count active advanced filters (only count visible ones)
    const advancedFilterCount = useMemo(() => {
        let count = 0;
        if (advancedFilterVisibility.reportedBy && filters.reportedBy) count++;
        if (advancedFilterVisibility.owner && filters.owner) count++;
        if (advancedFilterVisibility.closedBy && filters.closedBy) count++;
        if (advancedFilterVisibility.severity && filters.severity) count++;
        if (advancedFilterVisibility.slaBreached && filters.slaBreached !== null) count++;
        if (advancedFilterVisibility.recordId && filters.recordId) count++;
        return count;
    }, [filters, advancedFilterVisibility]);

    // Filter and sort records
    const filteredRecords = useMemo(() => {
        // Start with role-filtered records
        let records = getVisibleRecords(MOCK_HISTORY_RECORDS, role);

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

        // Filter by types (match dropdown value to record type label)
        if (filters.types && filters.types.length > 0) {
            records = records.filter((r) => {
                // Check if any selected type matches the record type
                return filters.types.some((selectedValue) => {
                    // Special handling for collapsed "Permit to Work" - match any permit subtype
                    if (selectedValue === 'permit-to-work') {
                        const permitTypes = ['general work', 'cold work', 'hot work', 'height work'];
                        return permitTypes.some(permitType =>
                            r.type.toLowerCase().includes(permitType) ||
                            permitType.includes(r.type.toLowerCase())
                        );
                    }

                    // Use the items list based on current tab
                    const itemsList = activeTab === 'all' ? REPORT_TYPE_ITEMS_ALL_TAB : REPORT_TYPE_ITEMS;
                    const item = itemsList.find(
                        (i) => i.type !== 'divider' && i.type !== 'header' && i.value === selectedValue
                    );
                    if (!item || item.type === 'divider' || item.type === 'header') return false;
                    const itemLabel = (item as { label: string }).label;
                    return r.type.toLowerCase().includes(itemLabel.toLowerCase()) ||
                        itemLabel.toLowerCase().includes(r.type.toLowerCase());
                });
            });
        }

        // Filter by statuses (map display label back to canonical status)
        if (filters.statuses && filters.statuses.length > 0) {
            records = records.filter((r) => {
                // Check if the record's canonical status matches any selected value
                return filters.statuses.includes(r.status);
            });
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
    }, [activeTab, filters, sortColumn, sortDirection, role]);

    // Show empty state if no records
    const showEmptyState = filteredRecords.length === 0;

    return (
        <div className={styles.container}>
            {/* Segmented Tabs */}
            <div className={styles.tabsContainer}>
                <SegmentedTabs
                    tabs={visibleTabs}
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
            <div className={styles.tableContainer}>
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
                        hideOwnerColumn={hideOwnerColumn}
                        roleLevel={role.level}
                    />
                )}
            </div>

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
                visibility={advancedFilterVisibility}
            />
        </div>
    );
}
