'use client';

import React, { useEffect, useRef } from 'react';
import styles from './SelectBottomSheet.module.css';
import type { DropdownOption } from './DropdownMenu';

interface SelectBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    options: DropdownOption[];
    selectedValue?: string | null;
    onSelect: (value: string) => void;
}

export default function SelectBottomSheet({
    isOpen,
    onClose,
    title,
    options,
    selectedValue,
    onSelect,
}: SelectBottomSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Focus the sheet when opened
    useEffect(() => {
        if (isOpen && sheetRef.current) {
            sheetRef.current.focus({ preventScroll: true });
        }
    }, [isOpen]);

    const handleSelect = (value: string) => {
        onSelect(value);
        onClose();
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
                aria-label={title || 'Select option'}
                tabIndex={-1}
            >
                <div className={styles.handle} />

                {title && (
                    <div className={styles.sheetHeader}>
                        <span className={`${styles.sheetTitle} text-caption-strong`}>{title}</span>
                    </div>
                )}

                <div className={styles.optionList}>
                    {options.map((option) => {
                        const isSelected = option.value === selectedValue;
                        return (
                            <button
                                key={option.value}
                                className={`${styles.optionItem} ${isSelected ? styles.optionItemSelected : ''}`}
                                onClick={() => handleSelect(option.value)}
                                disabled={option.disabled}
                            >
                                <span className="text-body">{option.label}</span>
                                {isSelected && (
                                    <div className={styles.checkmark}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path
                                                d="M16.6667 5L7.50004 14.1667L3.33337 10"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
