import React from 'react';
import EmptyState from '@/components/prototype/EmptyState';

export default function AlertsPage() {
    return (
        <EmptyState
            title="All Clear"
            description="There are no active alerts or system notifications at this time."
            icon="alert"
        />
    );
}
