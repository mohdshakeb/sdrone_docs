import React from 'react';
import { Icon, IconName } from '@/components/ui/Icon';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: IconName;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon = 'inbox' }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            textAlign: 'center',
            padding: 'var(--space-8)',
            color: 'var(--fg-subtle)'
        }}>
            <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-emphasis)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
                color: 'var(--fg-muted)'
            }}>
                <Icon name={icon} size={32} />
            </div>
            <h2 className="text-heading" style={{ color: 'var(--fg-default)', marginBottom: 'var(--space-2)' }}>{title}</h2>
            <p className="text-body" style={{ maxWidth: '400px' }}>{description}</p>
        </div>
    );
};

export default EmptyState;
