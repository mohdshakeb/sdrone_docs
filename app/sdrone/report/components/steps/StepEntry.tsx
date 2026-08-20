'use client';

import React from 'react';
import styles from './Steps.module.css';
import Icon, { IconName } from '@/components/ui/Icon';
import { useRole } from '@/components/prototype/RoleProvider';

interface IncidentTypeOption {
    value: string;
    label: string;
    description: string;
    icon: IconName;
    colorClass: string;
    disabled?: boolean;
}

const BASE_INCIDENT_OPTIONS: IncidentTypeOption[] = [
    {
        value: 'unsure',
        label: 'Not sure? Just report it',
        description: "Answer a few questions and we'll determine the type.",
        icon: 'survey',
        colorClass: 'accent',
    },
    {
        value: 'near-miss',
        label: 'Near Miss / Hazard',
        description: 'A close call — no injury, but something could have gone wrong.',
        icon: 'barricade',
        colorClass: 'notice',
    },
    {
        value: 'first-aid',
        label: 'First Aid',
        description: 'Minor injury treated on-site without hospital care.',
        icon: 'first-aid',
        colorClass: 'positive',
    },
    {
        value: 'fir',
        label: 'First Incident Report (FIR)',
        description: 'Injury needing medical treatment beyond first aid.',
        icon: 'dossier',
        colorClass: 'information',
    },
    {
        value: 'adr',
        label: 'Accident Detail Report (ADR)',
        description: 'Serious incident requiring hospital care or authority reporting.',
        icon: 'fire',
        colorClass: 'negative',
    },
];

export interface StepEntryProps {
    onSelect: (type: string) => void;
}

export const StepEntry: React.FC<StepEntryProps> = ({ onSelect }) => {
    const { role } = useRole();
    const canSubmitADR = role.permissions.canSubmitADR;

    const options: IncidentTypeOption[] = BASE_INCIDENT_OPTIONS.map(option => {
        if (option.value === 'adr' && !canSubmitADR) {
            return { ...option, disabled: true };
        }
        return option;
    });

    const guidedOption = options[0];
    const specificOptions = options.slice(1);

    return (
        <div className={styles.entryContainer}>
            <div className={styles.entryHeaderWrapper}>
                <h2 className={['text-heading', styles.entryTitle].join(' ')}>
                    What are you reporting?
                </h2>
                <p className={['text-body', styles.entryDescription].join(' ')}>
                    Select the type of incident to open the right form.
                </p>
            </div>

            <div className={styles.cardGrid} role="radiogroup" aria-label="What type of incident are you reporting?">
                {specificOptions.map(option => (
                    <TypeCard key={option.value} option={option} onSelect={onSelect} />
                ))}
            </div>

            <GuidedRow option={guidedOption} onSelect={onSelect} />
        </div>
    );
};

interface TypeCardProps {
    option: IncidentTypeOption;
    onSelect: (value: string) => void;
}

const TypeCard: React.FC<TypeCardProps> = ({ option, onSelect }) => {
    const cardClasses = [
        styles.typeCard,
        option.disabled && styles.typeCardDisabled,
    ].filter(Boolean).join(' ');

    const handleClick = () => {
        if (!option.disabled) onSelect(option.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !option.disabled) {
            e.preventDefault();
            onSelect(option.value);
        }
    };

    return (
        <div
            className={cardClasses}
            role="radio"
            aria-checked={false}
            aria-disabled={option.disabled}
            tabIndex={option.disabled ? -1 : 0}
            onClick={handleClick}
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
                {option.disabled
                    ? <Icon name="alert" size={16} />
                    : <Icon name="chevron-right" size={16} />
                }
            </div>
        </div>
    );
};

interface GuidedRowProps {
    option: IncidentTypeOption;
    onSelect: (value: string) => void;
}

const GuidedRow: React.FC<GuidedRowProps> = ({ option, onSelect }) => {
    const handleClick = () => onSelect(option.value);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(option.value);
        }
    };

    return (
        <div
            className={styles.guidedRow}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <div className={styles.guidedRowIcon}>
                <Icon name={option.icon} size={16} />
            </div>
            <div className={styles.guidedRowContent}>
                <span className={['text-body-strong', styles.guidedRowLabel].join(' ')}>
                    Not sure which type?
                </span>
                <span className={['text-caption', styles.guidedRowDescription].join(' ')}>
                    {option.description}
                </span>
            </div>
            <div className={styles.guidedRowArrow}>
                <Icon name="chevron-right" size={16} />
            </div>
        </div>
    );
};

export default StepEntry;
