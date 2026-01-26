'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import styles from '@/components/ui/DropdownMenu.module.css';
import Icon, { type IconName } from '@/components/ui/Icon';

// Legacy interface for backward compatibility
export interface DropdownOption {
    value: string;
    label: string;
    disabled?: boolean;
}

// Base for selectable items
interface DropdownOptionBase {
    value: string;
    disabled?: boolean;
}

// Text-only (backward compatible)
export interface DropdownTextOption extends DropdownOptionBase {
    type?: 'text';
    label: string;
}

// Text with icon
export interface DropdownIconOption extends DropdownOptionBase {
    type: 'icon';
    label: string;
    icon: IconName;
}

// Non-selectable items
export interface DropdownDivider {
    type: 'divider';
}

export interface DropdownHeader {
    type: 'header';
    label: string;
}

// Custom rendered item
export interface DropdownCustomOption extends DropdownOptionBase {
    type: 'custom';
    render: (props: { selected: boolean; disabled: boolean }) => React.ReactNode;
}

// Union type for all item variants
export type DropdownItem =
    | DropdownTextOption
    | DropdownIconOption
    | DropdownDivider
    | DropdownHeader
    | DropdownCustomOption;

// Helper to check if item is selectable
function isSelectableItem(item: DropdownItem): item is DropdownTextOption | DropdownIconOption | DropdownCustomOption {
    return item.type !== 'divider' && item.type !== 'header';
}

// Normalize legacy options to DropdownItem[]
function normalizeItems(options?: DropdownOption[], items?: DropdownItem[]): DropdownItem[] {
    if (items) return items;
    if (options) {
        return options.map(opt => ({
            type: 'text' as const,
            value: opt.value,
            label: opt.label,
            disabled: opt.disabled,
        }));
    }
    return [];
}

interface DropdownMenuProps {
    /** @deprecated Use `items` instead */
    options?: DropdownOption[];
    /** New discriminated union items prop */
    items?: DropdownItem[];
    selectedValue?: string;
    onSelect: (value: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function DropdownMenu({
    options,
    items,
    selectedValue,
    onSelect,
    isOpen,
    onClose,
}: DropdownMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const focusedIndexRef = useRef<number>(-1);

    // Normalize to items array
    const normalizedItems = normalizeItems(options, items);

    const getFocusableOptions = useCallback(() => {
        return normalizedItems
            .map((item, idx) => ({ item, index: idx }))
            .filter(({ item }) => isSelectableItem(item) && !item.disabled);
    }, [normalizedItems]);

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
                    {
                        const focusedItem = normalizedItems[focusedIndexRef.current];
                        if (focusedIndexRef.current >= 0 && focusedItem && isSelectableItem(focusedItem) && !focusedItem.disabled) {
                            onSelect(focusedItem.value);
                        }
                    }
                    break;
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        // Focus first focusable option on open - REMOVED to prevent auto-highlighting
        // Navigation should be user-initiated (hover or arrow keys)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, normalizedItems, selectedValue, getFocusableOptions, focusOption, onSelect]);

    const handleItemClick = (item: DropdownItem) => {
        if (!isSelectableItem(item) || item.disabled) return;
        onSelect(item.value);
    };

    const menuClassNames = [
        styles.menu,
        isOpen && styles.menuOpen,
    ].filter(Boolean).join(' ');

    // Render individual item based on type
    const renderItem = (item: DropdownItem, index: number) => {
        // Divider
        if (item.type === 'divider') {
            return <div key={`divider-${index}`} className={styles.divider} role="separator" />;
        }

        // Header
        if (item.type === 'header') {
            return (
                <div key={`header-${index}`} className={`${styles.header} text-caption-small`}>
                    {item.label}
                </div>
            );
        }

        // Selectable items (text, icon, custom)
        const isSelected = item.value === selectedValue;
        const isDisabled = item.disabled ?? false;

        const optionClassNames = [
            styles.option,
            'text-caption',
            isSelected && styles.optionSelected,
            isDisabled && styles.optionDisabled,
            item.type === 'icon' && styles.optionWithIcon,
        ].filter(Boolean).join(' ');

        // Custom render
        if (item.type === 'custom') {
            return (
                <button
                    key={item.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                    disabled={isDisabled}
                    className={optionClassNames}
                    onClick={() => handleItemClick(item)}
                    tabIndex={isOpen ? 0 : -1}
                >
                    {item.render({ selected: isSelected, disabled: isDisabled })}
                </button>
            );
        }

        // Text or Icon
        return (
            <button
                key={item.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={isDisabled}
                disabled={isDisabled}
                className={optionClassNames}
                onClick={() => handleItemClick(item)}
                tabIndex={isOpen ? 0 : -1}
            >
                {item.type === 'icon' && (
                    <Icon
                        name={item.icon}
                        size={16}
                        className={`${styles.optionIcon} ${isSelected ? styles.optionIconSelected : ''}`}
                    />
                )}
                {item.label}
            </button>
        );
    };

    return (
        <div ref={menuRef} className={menuClassNames} role="listbox">
            {normalizedItems.map((item, index) => renderItem(item, index))}
        </div>
    );
}
