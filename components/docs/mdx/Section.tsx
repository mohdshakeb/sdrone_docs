import React from 'react';
import styles from './Section.module.css';

export interface SectionProps {
  /** The content of the section */
  children: React.ReactNode;
  /** Whether to show a divider at the bottom */
  divider?: boolean;
  /** Spacing size */
  spacing?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}

/**
 * Section component for consistent spacing and dividers between documentation sections.
 * Provides standard margin and optional horizontal divider.
 */
export function Section({
  children,
  divider = false,
  spacing = 'md',
  className = '',
}: SectionProps) {
  const classNames = [
    styles.section,
    styles[`spacing-${spacing}`],
    divider && styles.divider,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <section className={classNames}>{children}</section>;
}
