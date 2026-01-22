'use client';

import React, { useState } from 'react';
import FilterChip from '@/components/ui/FilterChip';

export function FilterChipDemo() {
    return (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <FilterChip>Default</FilterChip>
            <FilterChip selected>Selected</FilterChip>
            <FilterChip selected count={3}>Multiple (3)</FilterChip>
            <FilterChip disabled>Disabled</FilterChip>
        </div>
    );
}

export function FilterChipInteractive() {
    const [selected, setSelected] = useState(false);
    return (
        <div style={{ marginBottom: '24px' }}>
            <FilterChip
                selected={selected}
                onClick={() => setSelected(!selected)}
            >
                Click me
            </FilterChip>
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--fg-subtle)' }}>
                State: {selected ? 'Selected' : 'Default'}
            </p>
        </div>
    );
}
