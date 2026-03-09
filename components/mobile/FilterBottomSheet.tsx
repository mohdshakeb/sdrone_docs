'use client';

import React, { useEffect, useRef } from 'react';
import styles from './FilterBottomSheet.module.css';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import type { DropdownItem } from '@/components/ui/DropdownMenu';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    /** Structured items with headers/dividers/icons */
    items?: DropdownItem[];
    /** Simple options (fallback when items not provided) */
    options?: FilterOption[];
    selectedValue: string | null;
    onSelect: (value: string | null) => void;
}

export default function FilterBottomSheet({
    isOpen,
    onClose,
    title,
    items,
    options,
    selectedValue,
    onSelect,
}: FilterBottomSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen && sheetRef.current) {
            sheetRef.current.focus({ preventScroll: true });
        }
    }, [isOpen]);

    const handleSelect = (value: string) => {
        // Toggle: if already selected, clear it
        onSelect(value === selectedValue ? null : value);
        onClose();
    };

    // Render structured items (headers, dividers, icons)
    const renderItems = () => {
        if (!items) return null;

        return items.map((item, index) => {
            if (item.type === 'divider') {
                return <div key={`divider-${index}`} className={styles.divider} />;
            }

            if (item.type === 'header') {
                return (
                    <div key={`header-${index}`} className={styles.sectionHeader}>
                        <span className="text-caption-strong">{item.label}</span>
                    </div>
                );
            }

            if (item.type === 'custom') return null;

            const isSelected = item.value === selectedValue;
            const icon = item.type === 'icon' ? item.icon : undefined;

            return (
                <button
                    key={item.value}
                    className={styles.optionItem}
                    data-selected={isSelected}
                    onClick={() => handleSelect(item.value)}
                    disabled={item.disabled}
                >
                    {icon && (
                        <div className={styles.optionIcon}>
                            <Icon name={icon as IconName} size={20} />
                        </div>
                    )}
                    <span className={`${styles.optionLabel} text-body`}>{item.label}</span>
                    {isSelected && (
                        <Icon name="check" size={20} className={styles.checkIcon} />
                    )}
                </button>
            );
        });
    };

    // Render simple options
    const renderOptions = () => {
        if (!options) return null;

        return options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
                <button
                    key={option.value}
                    className={styles.optionItem}
                    data-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                >
                    <span className={`${styles.optionLabel} text-body`}>{option.label}</span>
                    {isSelected && (
                        <Icon name="check" size={20} className={styles.checkIcon} />
                    )}
                </button>
            );
        });
    };

    return (
        <div
            className={styles.overlay}
            data-open={isOpen}
            onClick={onClose}
            aria-hidden={!isOpen}
        >
            <div
                ref={sheetRef}
                className={styles.sheet}
                data-open={isOpen}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
            >
                <div className={styles.handle} />

                <div className={styles.sheetHeader}>
                    <span className={`${styles.sheetTitle} text-body-strong`}>{title}</span>
                    {selectedValue && (
                        <button
                            className={styles.clearButton}
                            onClick={() => {
                                onSelect(null);
                                onClose();
                            }}
                        >
                            <span className="text-caption-strong">Clear</span>
                        </button>
                    )}
                </div>

                <div className={styles.optionList}>
                    {items ? renderItems() : renderOptions()}
                </div>
            </div>
        </div>
    );
}
