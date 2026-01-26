import React from 'react';
import styles from './VariantCard.module.css';

export interface VariantCardProps {
  /** Variant name/title */
  title: string;
  /** Description of the variant */
  description?: string;
  /** Visual example */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

/**
 * VariantCard component for documenting individual component variants.
 * Shows a title, description, and visual example in a structured card layout.
 */
export function VariantCard({
  title,
  description,
  children,
  className = '',
}: VariantCardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div className={styles.example}>{children}</div>
    </div>
  );
}
