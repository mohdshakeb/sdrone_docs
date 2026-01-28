'use client';

import React from 'react';
import styles from './FormField.module.css';

export interface FormFieldProps {
    /** Unique identifier for associating label with input */
    id: string;
    /** Label text displayed above the input */
    label?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Error message to display */
    error?: string;
    /** Help text displayed below the input */
    helpText?: string;
    /** Hide the label visually (still accessible to screen readers) */
    hideLabel?: boolean;
    /** Children - the actual input element */
    children: React.ReactNode;
    /** Additional className for the wrapper */
    className?: string;
    /** Current character count for display */
    charCount?: number;
    /** Maximum character count to display alongside charCount */
    maxLength?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    required = false,
    error,
    helpText,
    hideLabel = false,
    children,
    className = '',
    charCount,
    maxLength,
}) => {
    const errorId = error ? `${id}-error` : undefined;
    const helpId = helpText ? `${id}-help` : undefined;
    const describedBy = [errorId, helpId].filter(Boolean).join(' ') || undefined;

    const wrapperClassName = [
        styles.formField,
        error && styles.hasError,
        className,
    ].filter(Boolean).join(' ');

    const labelClassName = [
        styles.label,
        'text-body-strong',
        hideLabel && styles.visuallyHidden,
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClassName}>
            {label && (
                <label htmlFor={id} className={labelClassName}>
                    {label}
                    {required && <span className={styles.required} aria-hidden="true">*</span>}
                </label>
            )}

            {/* Clone children to inject ARIA attributes */}
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<{
                        id?: string;
                        'aria-describedby'?: string;
                        'aria-invalid'?: boolean;
                    }>, {
                        id,
                        'aria-describedby': describedBy,
                        'aria-invalid': !!error,
                    });
                }
                return child;
            })}

            {(error || helpText || (charCount !== undefined)) && (
                <div className={styles.footer}>
                    <div className={styles.messages}>
                        {error && (
                            <p id={errorId} className={[styles.error, 'text-caption'].join(' ')} role="alert">
                                {error}
                            </p>
                        )}

                        {helpText && !error && (
                            <p id={helpId} className={[styles.helpText, 'text-caption'].join(' ')}>
                                {helpText}
                            </p>
                        )}
                    </div>

                    {charCount !== undefined && (
                        <div className={[styles.charCount, 'text-caption'].join(' ')}>
                            <span className={maxLength && charCount > maxLength ? styles.charCountOver : ''}>
                                {charCount}
                            </span>
                            {maxLength && <span>/{maxLength}</span>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FormField;
