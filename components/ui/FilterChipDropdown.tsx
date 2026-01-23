'use client';

import React, { useState, useRef, useEffect } from 'react';
import FilterChip from '@/components/ui/FilterChip';
import DropdownMenu, { type DropdownOption } from '@/components/ui/DropdownMenu';
import styles from '@/components/ui/FilterChip.module.css';

interface FilterChipDropdownProps {
    label: string;
    options: DropdownOption[];
    value?: string | null;
    onChange?: (value: string | null) => void;
    disabled?: boolean;
}

export default function FilterChipDropdown({
    label,
    options,
    value,
    onChange,
    disabled = false,
}: FilterChipDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const hasValue = value !== null && value !== undefined;

    const handleChipClick = () => {
        if (!disabled) {
            setIsOpen(prev => !prev);
        }
    };

    const handleSelect = (selectedValue: string) => {
        onChange?.(selectedValue);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(null);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    // Handle click outside to close
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <FilterChip
                selected={hasValue}
                value={selectedOption?.label}
                isOpen={isOpen}
                disabled={disabled}
                onClick={handleChipClick}
                onClear={handleClear}
            >
                {label}
            </FilterChip>
            <DropdownMenu
                options={options}
                selectedValue={value ?? undefined}
                onSelect={handleSelect}
                isOpen={isOpen}
                onClose={handleClose}
            />
        </div>
    );
}

export type { DropdownOption };
