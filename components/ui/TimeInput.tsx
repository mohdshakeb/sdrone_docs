'use client';

import React from 'react';
import styles from './TimeInput.module.css';

export type TimeInputSize = 'sm' | 'md' | 'lg';

export interface TimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
    /** Size variant of the input */
    size?: TimeInputSize;
    /** Whether the input has an error */
    hasError?: boolean;
    /** Full width input */
    fullWidth?: boolean;
}

const SIZE_TO_TYPOGRAPHY: Record<TimeInputSize, string> = {
    sm: 'text-caption',
    md: 'text-body',
    lg: 'text-body',
};

export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
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
                type="time"
                className={combinedClassName}
                {...props}
            />
        );
    }
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;
