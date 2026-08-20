'use client';

import React from 'react';
import styles from './Steps.module.css';
import Icon, { IconName } from '@/components/ui/Icon';
import type { AuditType } from '../../types';

interface CheckSheetOption {
    value: AuditType;
    label: string;
    description: string;
    icon: IconName;
    colorClass: string;
}

const CHECK_SHEET_OPTIONS: CheckSheetOption[] = [
    {
        value: 'etb',
        label: 'ETB',
        description: 'Electrical test bench tools — multimeters, insulation testers, cable cutters.',
        icon: 'pass-valid-line',
        colorClass: 'information',
    },
    {
        value: 'bcp-gci',
        label: 'BCP / GCI',
        description: 'Hydraulic and pressure tools — gauges, hose assemblies, torque wrenches.',
        icon: 'task-line',
        colorClass: 'notice',
    },
    {
        value: 'workshop',
        label: 'Workshop',
        description: 'Workshop equipment — bench grinders, drill press, welding machines.',
        icon: 'settings',
        colorClass: 'positive',
    },
    {
        value: 'rigging',
        label: 'Rigging & Lifting',
        description: 'Lifting hardware — chain blocks, wire rope slings, shackles, spreader beams.',
        icon: 'todo-line',
        colorClass: 'accent',
    },
];

export interface StepEntryProps {
    onSelect: (type: AuditType) => void;
}

export const StepEntry: React.FC<StepEntryProps> = ({ onSelect }) => {
    return (
        <div className={styles.entryContainer}>
            <div className={styles.entryHeaderWrapper}>
                <h2 className={['text-heading', styles.entryTitle].join(' ')}>
                    Select a Check Sheet
                </h2>
                <p className={['text-body', styles.entryDescription].join(' ')}>
                    Choose the audit type to load the right tool checklist.
                </p>
            </div>

            <div className={styles.cardGrid} role="radiogroup" aria-label="Check sheet type">
                {CHECK_SHEET_OPTIONS.map(option => (
                    <CheckSheetCard key={option.value} option={option} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
};

interface CheckSheetCardProps {
    option: CheckSheetOption;
    onSelect: (value: AuditType) => void;
}

const CheckSheetCard: React.FC<CheckSheetCardProps> = ({ option, onSelect }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(option.value);
        }
    };

    return (
        <div
            className={styles.typeCard}
            role="radio"
            aria-checked={false}
            tabIndex={0}
            onClick={() => onSelect(option.value)}
            onKeyDown={handleKeyDown}
        >
            <div className={[styles.typeCardIconBadge, styles[`typeCardIcon--${option.colorClass}`]].join(' ')}>
                <Icon name={option.icon} size={20} />
            </div>

            <div className={styles.typeCardContent}>
                <span className={['text-body-strong', styles.typeCardLabel].join(' ')}>
                    {option.label}
                </span>
                <span className={['text-caption', styles.typeCardDescription].join(' ')}>
                    {option.description}
                </span>
            </div>

            <div className={styles.typeCardArrow}>
                <Icon name="chevron-right" size={16} />
            </div>
        </div>
    );
};

export default StepEntry;
