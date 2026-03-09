import React from 'react';
import EmptyState from '@/components/prototype/EmptyState';

export default function MobileSettingsPage() {
    return (
        <EmptyState
            title="Application Settings"
            description="Configure your preferences, notification settings, and fleet parameters here."
            icon="settings"
        />
    );
}
