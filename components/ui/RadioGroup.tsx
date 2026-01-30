'use client';

import React from 'react';
import styles from './RadioGroup.module.css';

/** Option item for RadioGroup component */
export interface RadioOption {
    /** Unique value for the radio option */
    value: string;
    /** Display label for the radio option */
    label: string;
    /** Optional description text shown below the label */
    description?: string;
    /** Whether the option is disabled */
    disabled?: boolean;
}

export interface RadioGroupProps {
    /** Unique name for the radio group */
    name: string;
    /** Available options */
    options: RadioOption[];
    /** Currently selected value */
    value?: string;
    /** Callback when selection changes */
    onChange?: (value: string) => void;
    /** Layout direction */
    direction?: 'vertical' | 'horizontal';
    /** Whether the field has an error */
    hasError?: boolean;
    /** Disable all options */
    disabled?: boolean;
    /** Additional className */
    className?: string;
    /** ARIA label for the group */
    'aria-label'?: string;
    /** ARIA labelledby for the group */
    'aria-labelledby'?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    name,
    options,
    value,
    onChange,
    direction = 'vertical',
    hasError = false,
    disabled = false,
    className = '',
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}) => {
    const handleChange = (optionValue: string) => {
        if (!disabled) {
            onChange?.(optionValue);
        }
    };

    const groupClassName = [
        styles.group,
        styles[direction],
        className,
    ].filter(Boolean).join(' ');

    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={groupClassName}
        >
            {options.map((option) => {
                const isSelected = value === option.value;
                const isDisabled = disabled || option.disabled;

                const optionClassName = [
                    styles.option,
                    isSelected && styles.selected,
                    isDisabled && styles.disabled,
                    hasError && styles.error,
                ].filter(Boolean).join(' ');

                return (
                    <label key={option.value} className={optionClassName}>
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={() => handleChange(option.value)}
                            className={styles.input}
                        />
                        <span className={styles.radio}>
                            <span className={styles.radioDot} />
                        </span>
                        <span className={styles.content}>
                            <span className={[styles.label, 'text-body'].join(' ')}>
                                {option.label}
                            </span>
                            {option.description && (
                                <span className={[styles.description, 'text-caption'].join(' ')}>
                                    {option.description}
                                </span>
                            )}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};

export default RadioGroup;
