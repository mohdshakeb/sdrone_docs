'use client';

import React from 'react';
import styles from './Steps.module.css';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import RadioGroup, { RadioOption } from '@/components/ui/RadioGroup';

const incidentTypeOptions: RadioOption[] = [
    { value: 'unsure', label: 'Just report an Incident', description: 'We\'ll help determine the type based on your answers' },
    { value: 'near-miss', label: 'Near Miss / Hazard', description: 'An event that could have caused injury or damage' },
    { value: 'first-aid', label: 'First Aid', description: 'Minor injury requiring basic first aid' },
    { value: 'fir', label: 'First Incident Report (FIR)', description: 'Injury requiring medical treatment', disabled: true },
    { value: 'adr', label: 'Accident/Dangerous Occurrence (ADR)', description: 'Serious incident requiring hospital treatment', disabled: true },
];

export interface StepEntryProps {
    onStart: () => void;
    selectedType: string | null;
    onTypeChange: (type: string) => void;
}

export const StepEntry: React.FC<StepEntryProps> = ({ onStart, selectedType, onTypeChange }) => {
    return (
        <div className={styles.entryContainer}>
            <div className={styles.entryIconWrapper}>
                <div className={styles.entryIcon}>
                    <Icon name="survey" size={32} />
                </div>
            </div>

            <div className={styles.entryHeaderWrapper}>
                <h2 className={['text-heading', styles.entryTitle].join(' ')}>
                    Report an Incident
                </h2>
                <p className={['text-body', styles.entryDescription].join(' ')}>
                    Use this form to report safety incidents, near misses, or hazardous conditions.
                    Your report helps us maintain a safe workplace for everyone.
                </p>
            </div>

            <div className={styles.entryFormWrapper}>
                <div className={styles.typeSelection}>
                    <RadioGroup
                        name="incidentType"
                        options={incidentTypeOptions}
                        value={selectedType ?? undefined}
                        onChange={onTypeChange}
                        aria-label="What type of incident are you reporting?"
                    />
                </div>
            </div>

            <div className={styles.entryActionWrapper}>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={onStart}
                    disabled={!selectedType}
                    trailingIcon={<Icon name="arrow-right" size={20} />}
                >
                    Start Report
                </Button>
            </div>
        </div>
    );
};

export default StepEntry;
