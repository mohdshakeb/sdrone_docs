'use client';

import React from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** Whether the textarea has an error */
    hasError?: boolean;
    /** Full width textarea */
    fullWidth?: boolean;
    /** Show character count */
    showCharCount?: boolean;
    /** Maximum character count (for display purposes) */
    maxLength?: number;
    /** Whether the textarea is resizable */
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            className = '',
            hasError = false,
            fullWidth = true,
            showCharCount = false,
            maxLength,
            resize = 'vertical',
            value,
            defaultValue,
            onChange,
            ...props
        },
        ref
    ) => {
        const [charCount, setCharCount] = React.useState(
            String(value ?? defaultValue ?? '').length
        );

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCharCount(e.target.value.length);
            onChange?.(e);
        };

        // Update char count when controlled value changes
        React.useEffect(() => {
            if (value !== undefined) {
                setCharCount(String(value).length);
            }
        }, [value]);

        const combinedClassName = [
            styles.textarea,
            'text-body',
            hasError && styles.error,
            fullWidth && styles.fullWidth,
            className,
        ].filter(Boolean).join(' ');

        const resizeStyle: React.CSSProperties = {
            resize: resize,
        };

        return (
            <div className={styles.wrapper}>
                <textarea
                    ref={ref}
                    className={combinedClassName}
                    style={resizeStyle}
                    value={value}
                    defaultValue={defaultValue}
                    onChange={handleChange}
                    maxLength={maxLength}
                    {...props}
                />
                {showCharCount && (
                    <div className={[styles.charCount, 'text-caption'].join(' ')}>
                        <span className={maxLength && charCount > maxLength ? styles.charCountOver : ''}>
                            {charCount}
                        </span>
                        {maxLength && <span>/{maxLength}</span>}
                    </div>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
