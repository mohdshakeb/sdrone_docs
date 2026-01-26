import React from 'react';
import styles from './Callout.module.css';
import { Icon } from '@/components/ui/Icon';

export interface CalloutProps {
  /** The content of the callout */
  children: React.ReactNode;
  /** Type of callout (affects color and icon) */
  type?: 'info' | 'warning' | 'error' | 'success' | 'note';
  /** Optional title */
  title?: string;
  /** Additional CSS class */
  className?: string;
}

const ICON_MAP = {
  info: 'alert' as const,
  warning: 'alert' as const,
  error: 'alert' as const,
  success: 'check' as const,
  note: 'file' as const,
};

/**
 * Callout component for important notes, warnings, and tips in documentation.
 * Provides visual emphasis for critical information.
 */
export function Callout({
  children,
  type = 'note',
  title,
  className = '',
}: CalloutProps) {
  const classNames = [
    styles.callout,
    styles[`type-${type}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {title && (
        <div className={styles.header}>
          <Icon name={ICON_MAP[type]} size={16} />
          <span className={styles.title}>{title}</span>
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
