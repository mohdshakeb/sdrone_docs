import React from 'react';
import styles from './Preview.module.css';

export interface DocItemProps {
    children: React.ReactNode;
    className?: string;
    label?: string;
}

/**
 * DocItem is a utility component for use within Preview blocks.
 * It provides a vertical stack that centers its children (e.g., a Label and a Component)
 * while ensuring that the internal layout of the component itself is preserved.
 */
export function DocItem({ children, className = '', label }: DocItemProps) {
    return (
        <div className={`${styles['doc-item']} ${className}`}>
            {label && <h4 className="text-caption-strong" style={{ marginBottom: '12px' }}>{label}</h4>}
            {children}
        </div>
    );
}
