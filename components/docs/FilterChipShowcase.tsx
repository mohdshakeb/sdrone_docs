'use client';

import React, { useState } from 'react';
import FilterChip from '@/components/ui/FilterChip';
import FilterChipDropdown from '@/components/ui/FilterChipDropdown';

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

const REPORT_TYPE_OPTIONS = [
    { value: 'first-aid', label: 'First Aid' },
    { value: 'first-incident', label: 'First incident report' },
    { value: 'accident-detail', label: 'Accident detail report' },
    { value: 'near-miss', label: 'Near miss' },
    { value: 'tool-audit', label: 'Tool audit' },
    { value: 'safety-audit', label: 'Safety audit' },
];

const STATUS_OPTIONS = [
    { value: 'critical', label: 'Critical' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'awaiting-review', label: 'Awaiting Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'scheduled', label: 'Scheduled' },
];

export function FilterChipDropdownDemo() {
    const [reportType, setReportType] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <FilterChipDropdown
                    label="Report Type"
                    options={REPORT_TYPE_OPTIONS}
                    value={reportType}
                    onChange={setReportType}
                />
                <FilterChipDropdown
                    label="Status"
                    options={STATUS_OPTIONS}
                    value={status}
                    onChange={setStatus}
                />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--fg-subtle)' }}>
                Click a chip to open dropdown. Arrow keys navigate, Enter selects, Escape closes.
            </p>
        </div>
    );
}
