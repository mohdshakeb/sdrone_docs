'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import styles from '@/components/ui/DropdownMenu.module.css';

export interface DropdownOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface DropdownMenuProps {
    options: DropdownOption[];
    selectedValue?: string;
    onSelect: (value: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function DropdownMenu({
    options,
    selectedValue,
    onSelect,
    isOpen,
    onClose,
}: DropdownMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const focusedIndexRef = useRef<number>(-1);

    const getFocusableOptions = useCallback(() => {
        return options.map((opt, idx) => ({ ...opt, index: idx })).filter(opt => !opt.disabled);
    }, [options]);

    const focusOption = useCallback((index: number) => {
        const buttons = menuRef.current?.querySelectorAll('button');
        if (buttons && buttons[index]) {
            buttons[index].focus();
            focusedIndexRef.current = index;
        }
    }, []);

    useEffect(() => {
        if (!isOpen) {
            focusedIndexRef.current = -1;
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const focusableOptions = getFocusableOptions();
            if (focusableOptions.length === 0) return;

            switch (event.key) {
                case 'Escape':
                    event.preventDefault();
                    onClose();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    {
                        const currentIdx = focusedIndexRef.current;
                        const nextFocusable = focusableOptions.find(opt => opt.index > currentIdx);
                        if (nextFocusable) {
                            focusOption(nextFocusable.index);
                        } else if (focusableOptions.length > 0) {
                            focusOption(focusableOptions[0].index);
                        }
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    {
                        const currentIdx = focusedIndexRef.current;
                        const prevFocusable = [...focusableOptions].reverse().find(opt => opt.index < currentIdx);
                        if (prevFocusable) {
                            focusOption(prevFocusable.index);
                        } else if (focusableOptions.length > 0) {
                            focusOption(focusableOptions[focusableOptions.length - 1].index);
                        }
                    }
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (focusedIndexRef.current >= 0 && !options[focusedIndexRef.current]?.disabled) {
                        onSelect(options[focusedIndexRef.current].value);
                    }
                    break;
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        // Focus first focusable option on open
        const focusableOptions = getFocusableOptions();
        if (focusableOptions.length > 0) {
            // Focus the selected option if there is one, otherwise first option
            const selectedIdx = options.findIndex(opt => opt.value === selectedValue && !opt.disabled);
            if (selectedIdx >= 0) {
                focusOption(selectedIdx);
            } else {
                focusOption(focusableOptions[0].index);
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, options, selectedValue, getFocusableOptions, focusOption, onSelect]);

    const handleOptionClick = (option: DropdownOption) => {
        if (option.disabled) return;
        onSelect(option.value);
    };

    const menuClassNames = [
        styles.menu,
        isOpen && styles.menuOpen,
    ].filter(Boolean).join(' ');

    return (
        <div ref={menuRef} className={menuClassNames} role="listbox">
            {options.map((option, index) => {
                const optionClassNames = [
                    styles.option,
                    'text-caption',
                    option.value === selectedValue && styles.optionSelected,
                    option.disabled && styles.optionDisabled,
                ].filter(Boolean).join(' ');

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={option.value === selectedValue}
                        aria-disabled={option.disabled}
                        className={optionClassNames}
                        onClick={() => handleOptionClick(option)}
                        tabIndex={isOpen ? 0 : -1}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
