import React from 'react';
import styles from './Preview.module.css';

export interface PreviewProps {
  /** The content to display in the preview */
  children: React.ReactNode;
  /** Layout mode for arranging children */
  layout?: 'grid-2' | 'grid-3' | 'grid-4' | 'flex-wrap' | 'stack';
  /** Background variant */
  background?: 'default' | 'subtle' | 'strong';
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Gap between items */
  gap?: 'none' | 'sm' | 'md' | 'lg';
  /** Alignment of items */
  align?: 'start' | 'center' | 'end';
  /** Additional CSS class */
  className?: string;
}

/**
 * Preview component for displaying visual examples in documentation.
 * Supports multiple layout modes and responsive behavior.
 */
export function Preview({
  children,
  layout = 'flex-wrap',
  background = 'default',
  padding = 'md',
  gap = 'md',
  align = 'center',
  className = '',
}: PreviewProps) {
  const classNames = [
    styles.preview,
    styles[`layout-${layout}`],
    styles[`bg-${background}`],
    styles[`padding-${padding}`],
    styles[`gap-${gap}`],
    styles[`align-${align}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}>{children}</div>;
}
