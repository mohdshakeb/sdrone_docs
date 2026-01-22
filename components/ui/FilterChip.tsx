'use client';

import React from 'react';
import styles from '@/components/ui/FilterChip.module.css';
import { Icon } from '@/components/ui/Icon';

interface FilterChipProps {
    children: React.ReactNode;
    selected?: boolean;
    count?: number; // For multiple selected indication
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
}

export default function FilterChip({
    children,
    selected = false,
    count,
    disabled = false,
    onClick,
    className = '',
}: FilterChipProps) {
    const hasMultiple = count !== undefined && count > 0;

    const classNames = [
        styles.chip,
        selected && styles.selected,
        hasMultiple && styles.multiple,
        disabled && styles.disabled,
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type="button"
            className={`${classNames} text-caption-strong`}
            onClick={onClick}
            disabled={disabled}
            aria-pressed={selected}
        >
            <span className={styles.label}>{children}</span>
            {hasMultiple && (
                <span className={`${styles.count} text-caption-small`}>{count}</span>
            )}
            <Icon name="arrow-down" size={16} className={styles.icon} />
        </button>
    );
}
