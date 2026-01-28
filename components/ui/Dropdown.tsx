'use client';

import React, { useRef } from 'react';
import FilterChip from '@/components/ui/FilterChip';
import DropdownMenu, { type DropdownOption, type DropdownItem } from '@/components/ui/DropdownMenu';
import CalendarPanel, { formatDate } from '@/components/ui/CalendarPanel';
import { useDropdownState } from '@/components/ui/hooks/useDropdownState';
import { useClickOutside } from '@/components/ui/hooks/useClickOutside';
import styles from '@/components/ui/FilterChip.module.css';

// Helper to check if item is selectable and get its label
function getSelectableLabel(items: DropdownItem[], value: string | null | undefined): string | undefined {
    if (value === null || value === undefined) return undefined;
    for (const item of items) {
        if (item.type === 'divider' || item.type === 'header') continue;
        if (item.type === 'custom') {
            if (item.value === value) return item.value; // Custom items use value as label
        } else {
            if (item.value === value) return item.label;
        }
    }
    return undefined;
}

// Discriminated union for dropdown variants
interface DropdownListProps {
    variant?: 'list';
    label: string;
    /** @deprecated Use `items` instead */
    options?: DropdownOption[];
    /** New discriminated union items prop */
    items?: DropdownItem[];
    value?: string | null;
    /** Override the displayed value in FilterChip (useful for multiselect) */
    displayValue?: string | null;
    /** Array of selected values for multiselect checkmarks */
    selectedValues?: string[];
    onChange?: (value: string | null) => void;
    disabled?: boolean;
}

interface DropdownDateProps {
    variant: 'date';
    label: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

type DropdownProps = DropdownListProps | DropdownDateProps;

export default function Dropdown(props: DropdownProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { isOpen, close, toggle } = useDropdownState();
    useClickOutside<HTMLDivElement>(wrapperRef, close, isOpen);

    // Date variant
    if (props.variant === 'date') {
        const handleDateChange = (date: Date) => {
            props.onChange(date);
            close();
        };

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation();
            props.onChange(null);
        };

        return (
            <div ref={wrapperRef} className={styles.wrapper}>
                <FilterChip
                    selected={props.value !== null}
                    value={props.value ? formatDate(props.value) : undefined}
                    isOpen={isOpen}
                    disabled={props.disabled}
                    onClick={toggle}
                    onClear={handleClear}
                >
                    {props.label}
                </FilterChip>
                <CalendarPanel
                    isOpen={isOpen}
                    value={props.value}
                    onChange={handleDateChange}
                    minDate={props.minDate}
                    maxDate={props.maxDate}
                />
            </div>
        );
    }

    // Default: list variant
    const normalizedItems: DropdownItem[] = props.items ?? (props.options?.map(opt => ({
        type: 'text' as const,
        value: opt.value,
        label: opt.label,
        disabled: opt.disabled,
    })) ?? []);

    const selectedLabel = getSelectableLabel(normalizedItems, props.value);
    const hasValue = props.value !== null && props.value !== undefined;
    // Use displayValue override if provided, otherwise use computed selectedLabel
    const displayedValue = props.displayValue !== undefined ? (props.displayValue ?? undefined) : selectedLabel;
    const hasDisplayValue = props.displayValue !== undefined ? props.displayValue !== null : hasValue;

    const handleSelect = (selectedValue: string) => {
        props.onChange?.(selectedValue);
        close();
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onChange?.(null);
    };

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <FilterChip
                selected={hasDisplayValue}
                value={displayedValue}
                isOpen={isOpen}
                disabled={props.disabled}
                onClick={toggle}
                onClear={handleClear}
            >
                {props.label}
            </FilterChip>
            <DropdownMenu
                options={props.options}
                items={props.items}
                selectedValue={props.value ?? undefined}
                selectedValues={props.selectedValues}
                onSelect={handleSelect}
                isOpen={isOpen}
                onClose={close}
            />
        </div>
    );
}

// Re-export types for convenience
export type { DropdownOption, DropdownItem };
