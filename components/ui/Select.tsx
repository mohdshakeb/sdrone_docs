'use client';

import React from 'react';
import styles from './Select.module.css';

/** Option item for Select component */
export interface SelectOption {
    /** Unique value for the option */
    value: string;
    /** Display label for the option */
    label: string;
    /** Whether the option is disabled */
    disabled?: boolean;
}

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    /** Available options */
    options: SelectOption[];
    /** Placeholder text (shown as disabled first option) */
    placeholder?: string;
    /** Size variant */
    size?: SelectSize;
    /** Whether the select has an error */
    hasError?: boolean;
    /** Full width select */
    fullWidth?: boolean;
}

const SIZE_TO_TYPOGRAPHY: Record<SelectSize, string> = {
    sm: 'text-caption',
    md: 'text-body',
    lg: 'text-body',
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            options,
            placeholder,
            size = 'md',
            hasError = false,
            fullWidth = true,
            className = '',
            value,
            ...props
        },
        ref
    ) => {
        const combinedClassName = [
            styles.select,
            styles[size],
            hasError && styles.error,
            fullWidth && styles.fullWidth,
            SIZE_TO_TYPOGRAPHY[size],
            (!value || value === '') && styles.placeholder,
            className,
        ].filter(Boolean).join(' ');

        return (
            <div className={[styles.wrapper, fullWidth && styles.fullWidth].filter(Boolean).join(' ')}>
                <select
                    ref={ref}
                    className={combinedClassName}
                    value={value}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className={styles.arrow}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M2.5 4.5L6 8L9.5 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
