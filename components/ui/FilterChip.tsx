'use client';

import React from 'react';
import styles from '@/components/ui/FilterChip.module.css';
import { Icon } from '@/components/ui/Icon';

export interface FilterChipProps {
    /** Filter label/name displayed in the chip */
    children: React.ReactNode;
    /** Selected value text (shown when single value is selected) */
    value?: string;
    /** Whether the filter is currently selected
     * @default false
     */
    selected?: boolean;
    /** Number of selected items (shown when multiple values are selected) */
    count?: number;
    /** Disabled state
     * @default false
     */
    disabled?: boolean;
    /** Whether the dropdown is currently open
     * @default false
     */
    isOpen?: boolean;
    /** Callback when the chip is clicked */
    onClick?: () => void;
    /** Callback when the clear button is clicked */
    onClear?: (e: React.MouseEvent) => void;
    /** Additional CSS class name */
    className?: string;
}

export default function FilterChip({
    children,
    value,
    selected = false,
    count,
    disabled = false,
    isOpen = false,
    onClick,
    onClear,
    className = '',
}: FilterChipProps) {
    const hasMultiple = count !== undefined && count > 0;
    const isActive = selected || hasMultiple;

    const containerClassNames = [
        styles.chip,
        isActive && styles.active,
        disabled && styles.disabled,
        className,
    ].filter(Boolean).join(' ');

    const handleClear = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onClear?.(e);
    };

    return (
        <div className={containerClassNames}>
            <button
                type="button"
                className={`${styles.mainPart} text-caption`}
                onClick={onClick}
                disabled={disabled}
            >
                <span className={styles.label}>{children}{isActive ? ':' : ''}</span>
                {hasMultiple ? (
                    <span className={styles.countIndicator}>{count}</span>
                ) : selected && value ? (
                    <span className={styles.value}>{value}</span>
                ) : null}
                <Icon name="arrow-down" size={16} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
            </button>

            {isActive && !disabled && (
                <>
                    <div className={styles.divider} />
                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={handleClear}
                        aria-label="Clear selection"
                    >
                        <Icon name="close" size={16} />
                    </button>
                </>
            )}
        </div>
    );
}
