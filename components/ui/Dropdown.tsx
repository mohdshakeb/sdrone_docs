'use client';

import React, { useRef, useState, useEffect } from 'react';
import FilterChip from '@/components/ui/FilterChip';
import DropdownMenu, { type DropdownOption, type DropdownItem } from '@/components/ui/DropdownMenu';
import SelectBottomSheet from '@/components/ui/SelectBottomSheet';
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
    count?: number;
    onChange?: (value: string | null) => void;
    disabled?: boolean;
    /** Hide the clear button (for non-filter use cases like view selectors) */
    hideClearButton?: boolean;
    /** Hide the label, show only the value (for compact selectors) */
    hideLabel?: boolean;
    /** Use neutral color for value instead of accent color */
    neutralValue?: boolean;
    /** Force bottom sheet on mobile (default: true) */
    useBottomSheetOnMobile?: boolean;
}

interface DropdownDateProps {
    variant: 'date';
    label: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    /** Hide the clear button (for non-filter use cases like view selectors) */
    hideClearButton?: boolean;
}

type DropdownProps = DropdownListProps | DropdownDateProps;

export default function Dropdown(props: DropdownProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { isOpen, close, toggle } = useDropdownState();
    useClickOutside<HTMLDivElement>(wrapperRef, close, isOpen);

    // Mobile detection
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
                    hideClearButton={props.hideClearButton}
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

    // Determine if we should use bottom sheet
    const useBottomSheet = isMobile && (props.useBottomSheetOnMobile !== false);

    return (
        <>
            <div ref={wrapperRef} className={styles.wrapper}>
                <FilterChip
                    selected={hasDisplayValue}
                    value={displayedValue}
                    count={props.count}
                    isOpen={isOpen}
                    disabled={props.disabled}
                    onClick={toggle}
                    onClear={handleClear}
                    hideClearButton={props.hideClearButton}
                    hideLabel={props.hideLabel}
                    neutralValue={props.neutralValue}
                >
                    {props.label}
                </FilterChip>
                {!useBottomSheet && (
                    <DropdownMenu
                        options={props.options}
                        items={props.items}
                        selectedValue={props.value ?? undefined}
                        selectedValues={props.selectedValues}
                        onSelect={handleSelect}
                        isOpen={isOpen}
                        onClose={close}
                    />
                )}
            </div>
            {useBottomSheet && props.options && (
                <SelectBottomSheet
                    isOpen={isOpen}
                    onClose={close}
                    title={props.label}
                    options={props.options}
                    selectedValue={props.value ?? undefined}
                    onSelect={handleSelect}
                />
            )}
        </>
    );
}

// Re-export types for convenience
export type { DropdownOption, DropdownItem };
