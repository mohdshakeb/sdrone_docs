'use client';

import React from 'react';
import styles from './TextInput.module.css';

export type TextInputSize = 'sm' | 'md' | 'lg';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** Size variant of the input */
    size?: TextInputSize;
    /** Whether the input has an error */
    hasError?: boolean;
    /** Full width input */
    fullWidth?: boolean;
}

const SIZE_TO_TYPOGRAPHY: Record<TextInputSize, string> = {
    sm: 'text-caption',
    md: 'text-body',
    lg: 'text-body',
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    ({ className = '', size = 'md', hasError = false, fullWidth = true, ...props }, ref) => {
        const combinedClassName = [
            styles.input,
            styles[size],
            hasError && styles.error,
            fullWidth && styles.fullWidth,
            SIZE_TO_TYPOGRAPHY[size],
            className,
        ].filter(Boolean).join(' ');

        return (
            <input
                ref={ref}
                type="text"
                className={combinedClassName}
                {...props}
            />
        );
    }
);

TextInput.displayName = 'TextInput';

export default TextInput;
