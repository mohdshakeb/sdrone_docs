'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './SearchInput.module.css';

export interface SearchInputProps {
    /** Current search value */
    value: string;
    /** Callback when search value changes (debounced) */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Debounce delay in milliseconds */
    debounceMs?: number;
}

/**
 * SearchInput - Text input with search icon, debounced input, and clear button
 */
export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = 'Search...',
    debounceMs = 300,
}) => {
    const [internalValue, setInternalValue] = useState(value);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Sync internal value when external value changes
    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    // Debounced onChange
    const debouncedOnChange = useCallback(
        (newValue: string) => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            debounceRef.current = setTimeout(() => {
                onChange(newValue);
            }, debounceMs);
        },
        [onChange, debounceMs]
    );

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        debouncedOnChange(newValue);
    };

    const handleClear = () => {
        setInternalValue('');
        onChange('');
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && internalValue) {
            e.stopPropagation();
            handleClear();
        }
    };

    return (
        <div className={styles.container}>
            <Icon name="search" size={16} className={styles.searchIcon} />
            <input
                type="text"
                className={`${styles.input} text-caption`}
                value={internalValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label={placeholder}
            />
            {internalValue && (
                <button
                    type="button"
                    className={styles.clearButton}
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    <Icon name="close" size={14} />
                </button>
            )}
        </div>
    );
};

export default SearchInput;
