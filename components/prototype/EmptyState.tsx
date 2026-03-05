import React from 'react';
import { Icon, IconName } from '@/components/ui/Icon';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: IconName;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon = 'inbox' }) => {
    return (
        <div className={styles.container}>
            <div className={styles.iconCircle}>
                <Icon name={icon} size={32} />
            </div>
            <h2 className={`text-heading ${styles.title}`}>{title}</h2>
            <p className={`text-body ${styles.description}`}>{description}</p>
        </div>
    );
};

export default EmptyState;
