import React from 'react';
import EmptyState from '@/components/prototype/EmptyState';

export default function HistoryPage() {
    return (
        <EmptyState
            title="No History Yet"
            description="Your completed tasks and past activities will appear here once you start processing items."
            icon="archive"
        />
    );
}
