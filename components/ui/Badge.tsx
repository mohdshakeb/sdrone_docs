'use client';

import React from 'react';
import styles from '@/components/ui/Badge.module.css';

export type BadgeColor = 'information' | 'negative' | 'neutral' | 'notice' | 'positive' | 'primary';
export type BadgeSize = 'xsmall' | 'small' | 'medium' | 'large';
export type BadgeEmphasis = 'subtle' | 'intense';

// Map badge sizes to typography utility classes
const SIZE_TO_TYPOGRAPHY: Record<BadgeSize, string> = {
    xsmall: 'text-caption-small',
    small: 'text-caption-strong',
    medium: 'text-caption-strong',
    large: 'text-body-strong',
};

interface BadgeProps {
    children: React.ReactNode;
    color?: BadgeColor;
    size?: BadgeSize;
    emphasis?: BadgeEmphasis;
    className?: string;
}

export default function Badge({
    children,
    color = 'neutral',
    size = 'medium',
    emphasis = 'subtle',
    className = '',
}: BadgeProps) {
    const classNames = [
        styles.badge,
        styles[size],
        styles[`${color}_${emphasis}`],
        SIZE_TO_TYPOGRAPHY[size],
        className,
    ].filter(Boolean).join(' ');

    return (
        <span className={classNames}>
            {children}
        </span>
    );
}
