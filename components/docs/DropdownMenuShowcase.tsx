'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import DropdownMenu, { type DropdownItem } from '@/components/ui/DropdownMenu';

// Basic text options
const TEXT_OPTIONS: DropdownItem[] = [
    { type: 'text', value: 'option-1', label: 'Option 1' },
    { type: 'text', value: 'option-2', label: 'Option 2' },
    { type: 'text', value: 'option-3', label: 'Option 3' },
    { type: 'text', value: 'disabled', label: 'Disabled Option', disabled: true },
];

// Icon options with sections
const ICON_OPTIONS: DropdownItem[] = [
    { type: 'header', label: 'Incidents' },
    { type: 'icon', value: 'first-aid', label: 'First Aid', icon: 'first-aid' },
    { type: 'icon', value: 'fire', label: 'Fire Incident', icon: 'fire' },
    { type: 'icon', value: 'sos', label: 'SOS Emergency', icon: 'sos' },
    { type: 'divider' },
    { type: 'header', label: 'Reports' },
    { type: 'icon', value: 'survey', label: 'Survey', icon: 'survey' },
    { type: 'icon', value: 'chart', label: 'Analytics', icon: 'chart' },
];

// Mixed options
const MIXED_OPTIONS: DropdownItem[] = [
    { type: 'icon', value: 'inbox', label: 'Inbox', icon: 'inbox' },
    { type: 'icon', value: 'archive', label: 'Archive', icon: 'archive' },
    { type: 'divider' },
    { type: 'text', value: 'settings', label: 'Settings' },
    { type: 'text', value: 'help', label: 'Help & Support' },
];

export function DropdownMenuBasicDemo() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);

    const handleSelect = (value: string) => {
        setSelected(value);
        setIsOpen(false);
    };

    const getSelectedLabel = () => {
        const item = TEXT_OPTIONS.find(o => {
            if (o.type === 'divider' || o.type === 'header') return false;
            return o.value === selected;
        });
        if (!item || item.type === 'divider' || item.type === 'header') return 'Select Option';
        if (item.type === 'custom') return item.value;
        return item.label;
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '200px' }}>
            <Button
                variant="secondary"
                size="md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {getSelectedLabel()}
            </Button>
            <DropdownMenu
                items={TEXT_OPTIONS}
                selectedValue={selected}
                onSelect={handleSelect}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
}

export function DropdownMenuIconDemo() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string | undefined>('first-aid');

    const handleSelect = (value: string) => {
        setSelected(value);
        setIsOpen(false);
    };

    const getSelectedLabel = () => {
        const item = ICON_OPTIONS.find(o => {
            if (o.type === 'divider' || o.type === 'header') return false;
            return o.value === selected;
        });
        if (!item || item.type === 'divider' || item.type === 'header') return 'Select Type';
        if (item.type === 'custom') return item.value;
        return item.label;
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '280px' }}>
            <Button
                variant="secondary"
                size="md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {getSelectedLabel()}
            </Button>
            <DropdownMenu
                items={ICON_OPTIONS}
                selectedValue={selected}
                onSelect={handleSelect}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
}

export function DropdownMenuMixedDemo() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);

    const handleSelect = (value: string) => {
        setSelected(value);
        setIsOpen(false);
    };

    const getSelectedLabel = () => {
        const item = MIXED_OPTIONS.find(o => {
            if (o.type === 'divider' || o.type === 'header') return false;
            return o.value === selected;
        });
        if (!item || item.type === 'divider' || item.type === 'header') return 'Actions';
        if (item.type === 'custom') return item.value;
        return item.label;
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '220px' }}>
            <Button
                variant="secondary"
                size="md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {getSelectedLabel()}
            </Button>
            <DropdownMenu
                items={MIXED_OPTIONS}
                selectedValue={selected}
                onSelect={handleSelect}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
}
