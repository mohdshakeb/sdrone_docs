'use client';

import React, { useState } from 'react';
import FilterChip from '@/components/ui/FilterChip';

export function FilterChipDemo() {
    return (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <FilterChip>Report Type</FilterChip>
            <FilterChip selected value="First Aid">Report Type</FilterChip>
            <FilterChip count={3}>Severity</FilterChip>
            <FilterChip disabled>Disabled</FilterChip>
        </div>
    );
}

export function FilterChipInteractive() {
    const [selection, setSelection] = useState<string | null>(null);
    const [count, setCount] = useState<number>(0);

    const handleReportTypeClick = () => {
        setSelection(prev => prev === 'First Aid' ? null : 'First Aid');
    };

    const handleClearSelection = () => {
        setSelection(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
                <FilterChip
                    selected={selection === 'First Aid'}
                    value="First Aid"
                    onClick={handleReportTypeClick}
                    onClear={handleClearSelection}
                >
                    Report Type
                </FilterChip>

                <FilterChip
                    count={count > 0 ? count : undefined}
                    onClick={() => setCount(prev => prev + 1)}
                    onClear={() => setCount(0)}
                >
                    Severity
                </FilterChip>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--fg-subtle)' }}>
                Prototype usage: Single selection vs Multiple selection
            </p>
        </div>
    );
}
