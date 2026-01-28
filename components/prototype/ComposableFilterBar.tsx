'use client';

import React from 'react';
import Dropdown, { type DropdownItem } from '@/components/ui/Dropdown';
import Button from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import SearchInput from './SearchInput';
import styles from './ComposableFilterBar.module.css';

// Filter configuration types
export type FilterType = 'search' | 'dropdown' | 'multiselect' | 'daterange';

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    id: string;
    type: FilterType;
    label: string;
    placeholder?: string;
    options?: FilterOption[];
    /** Structured items with headers/dividers (takes precedence over options) */
    items?: DropdownItem[];
    /** For conditional visibility based on other filter state */
    visible?: boolean;
}

export interface FilterValues {
    [key: string]: string | string[] | null;
}

export interface ComposableFilterBarProps {
    /** Filter configurations */
    filters: FilterConfig[];
    /** Current filter values */
    values: FilterValues;
    /** Callback when a filter value changes */
    onChange: (filterId: string, value: string | string[] | null) => void;
    /** Callback when advanced filters button is clicked */
    onAdvancedClick?: () => void;
    /** Whether to show the advanced filters button */
    showAdvancedButton?: boolean;
    /** Number of active advanced filters (for badge) */
    advancedFilterCount?: number;
}

/**
 * ComposableFilterBar - Generic, configuration-driven filter bar
 * Supports search, dropdown, multiselect, and date range filters
 */
export const ComposableFilterBar: React.FC<ComposableFilterBarProps> = ({
    filters,
    values,
    onChange,
    onAdvancedClick,
    showAdvancedButton = false,
    advancedFilterCount = 0,
}) => {
    const renderFilter = (config: FilterConfig) => {
        // Skip hidden filters
        if (config.visible === false) {
            return null;
        }

        switch (config.type) {
            case 'search':
                return (
                    <SearchInput
                        key={config.id}
                        value={(values[config.id] as string) || ''}
                        onChange={(value) => onChange(config.id, value)}
                        placeholder={config.placeholder || config.label}
                    />
                );

            case 'dropdown':
                return (
                    <div key={config.id} className={styles.filterItem}>
                        <Dropdown
                            label={config.label}
                            options={config.options?.map((opt) => ({
                                value: opt.value,
                                label: opt.label,
                            })) || []}
                            items={config.items}
                            value={(values[config.id] as string) || null}
                            onChange={(value) => onChange(config.id, value)}
                        />
                    </div>
                );

            case 'multiselect':
                // For multiselect, we'll use a modified dropdown
                // that shows "First Item +N" format
                const selectedValues = (values[config.id] as string[]) || [];
                const count = selectedValues.length;

                // Compute display value for FilterChip
                let displayValue: string | undefined;
                if (count > 0) {
                    // Find first selected option from either items or options
                    let firstLabel = selectedValues[0];
                    if (config.items) {
                        const firstItem = config.items.find(
                            (item) => item.type !== 'divider' && item.type !== 'header' && item.value === selectedValues[0]
                        );
                        if (firstItem && firstItem.type !== 'divider' && firstItem.type !== 'header') {
                            // Handle different item types
                            if (firstItem.type === 'text' || firstItem.type === 'icon') {
                                firstLabel = firstItem.label;
                            } else {
                                // Custom type - use value as fallback
                                firstLabel = firstItem.value;
                            }
                        }
                    } else if (config.options) {
                        const firstOption = config.options.find((opt) => opt.value === selectedValues[0]);
                        firstLabel = firstOption?.label || selectedValues[0];
                    }
                    displayValue = count > 1 ? `${firstLabel} +${count - 1}` : firstLabel;
                }

                return (
                    <div key={config.id} className={styles.filterItem}>
                        <Dropdown
                            label={config.label}
                            options={config.options?.map((opt) => ({
                                value: opt.value,
                                label: opt.label,
                            })) || []}
                            items={config.items}
                            value={selectedValues[0] || null}
                            displayValue={displayValue || null}
                            selectedValues={selectedValues}
                            onChange={(value) => {
                                if (value === null) {
                                    // Clear all selected values
                                    onChange(config.id, []);
                                } else {
                                    // Toggle value in array
                                    const newValues = selectedValues.includes(value)
                                        ? selectedValues.filter((v) => v !== value)
                                        : [...selectedValues, value];
                                    onChange(config.id, newValues);
                                }
                            }}
                        />
                    </div>
                );

            case 'daterange':
                // For date range, we'll use a simplified dropdown for now
                // A full date picker implementation would require more components
                const dateOptions = [
                    { value: 'today', label: 'Today' },
                    { value: 'yesterday', label: 'Yesterday' },
                    { value: 'last7days', label: 'Last 7 days' },
                    { value: 'last30days', label: 'Last 30 days' },
                    { value: 'thisMonth', label: 'This month' },
                    { value: 'lastMonth', label: 'Last month' },
                ];

                return (
                    <div key={config.id} className={styles.filterItem}>
                        <Dropdown
                            label={config.label}
                            options={dateOptions}
                            items={config.items}
                            value={(values[config.id] as string) || null}
                            onChange={(value) => onChange(config.id, value)}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                {filters.map(renderFilter)}
            </div>

            {showAdvancedButton && onAdvancedClick && (
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={onAdvancedClick}
                    leadingIcon={<Icon name="filter" size={16} />}
                >
                    {advancedFilterCount > 0 ? `Filters (${advancedFilterCount})` : 'Filters'}
                </Button>
            )}
        </div>
    );
};

export default ComposableFilterBar;
