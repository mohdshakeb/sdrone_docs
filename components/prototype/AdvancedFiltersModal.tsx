'use client';

import React, { useState, useEffect } from 'react';
import { BaseModal } from '@/components/ui/BaseModal';
import Dropdown from '@/components/ui/Dropdown';
import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';
import styles from './AdvancedFiltersModal.module.css';

export interface AdvancedFilterValues {
    reportedBy: string | null;
    owner: string | null;
    closedBy: string | null;
    severity: string | null;
    slaBreached: boolean | null;
    recordId: string;
}

export interface AdvancedFiltersModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback to close the modal */
    onClose: () => void;
    /** Current filter values */
    values: AdvancedFilterValues;
    /** Callback when filters are applied */
    onApply: (values: AdvancedFilterValues) => void;
}

// Mock options for filters
const PERSON_OPTIONS = [
    { value: 'sanjay-mehta', label: 'Sanjay Mehta' },
    { value: 'anita-desai', label: 'Anita Desai' },
    { value: 'rahul-sharma', label: 'Rahul Sharma' },
    { value: 'priya-rao', label: 'Priya Rao' },
    { value: 'vikram-singh', label: 'Vikram Singh' },
    { value: 'karan-johar', label: 'Karan Johar' },
    { value: 'meera-patel', label: 'Dr. Meera Patel' },
    { value: 'arjun-kumar', label: 'Arjun Kumar' },
];

const SEVERITY_OPTIONS = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
];

const SLA_OPTIONS = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
];

const DEFAULT_VALUES: AdvancedFilterValues = {
    reportedBy: null,
    owner: null,
    closedBy: null,
    severity: null,
    slaBreached: null,
    recordId: '',
};

/**
 * AdvancedFiltersModal - Modal for advanced filter options
 * Includes: Reported by, Owner, Closed by, Severity, SLA breached, Record ID
 */
export const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
    isOpen,
    onClose,
    values,
    onApply,
}) => {
    const [localValues, setLocalValues] = useState<AdvancedFilterValues>(values);

    // Sync local values when modal opens or external values change
    useEffect(() => {
        if (isOpen) {
            setLocalValues(values);
        }
    }, [isOpen, values]);

    const handleChange = (field: keyof AdvancedFilterValues, value: string | boolean | null) => {
        setLocalValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleApply = () => {
        onApply(localValues);
        onClose();
    };

    const handleClear = () => {
        setLocalValues(DEFAULT_VALUES);
    };

    const hasActiveFilters =
        localValues.reportedBy !== null ||
        localValues.owner !== null ||
        localValues.closedBy !== null ||
        localValues.severity !== null ||
        localValues.slaBreached !== null ||
        localValues.recordId !== '';

    const footer = (
        <div className={styles.footer}>
            <Button
                variant="secondary"
                size="sm"
                onClick={handleClear}
                disabled={!hasActiveFilters}
            >
                Clear All
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply}>
                Apply Filters
            </Button>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Advanced Filters"
            size="md"
            footer={footer}
        >
            <div className={styles.content}>
                <div className={styles.filterGroup}>
                    <label className={`${styles.label} text-caption-strong`}>
                        Reported By
                    </label>
                    <Dropdown
                        label="Select person"
                        options={PERSON_OPTIONS}
                        value={localValues.reportedBy}
                        onChange={(value) => handleChange('reportedBy', value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label className={`${styles.label} text-caption-strong`}>
                        Owner
                    </label>
                    <Dropdown
                        label="Select person"
                        options={PERSON_OPTIONS}
                        value={localValues.owner}
                        onChange={(value) => handleChange('owner', value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label className={`${styles.label} text-caption-strong`}>
                        Closed By
                    </label>
                    <Dropdown
                        label="Select person"
                        options={PERSON_OPTIONS}
                        value={localValues.closedBy}
                        onChange={(value) => handleChange('closedBy', value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label className={`${styles.label} text-caption-strong`}>
                        Severity
                    </label>
                    <Dropdown
                        label="Select severity"
                        options={SEVERITY_OPTIONS}
                        value={localValues.severity}
                        onChange={(value) => handleChange('severity', value)}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label className={`${styles.label} text-caption-strong`}>
                        SLA Breached
                    </label>
                    <Dropdown
                        label="Select"
                        options={SLA_OPTIONS}
                        value={
                            localValues.slaBreached === null
                                ? null
                                : localValues.slaBreached.toString()
                        }
                        onChange={(value) =>
                            handleChange('slaBreached', value === null ? null : value === 'true')
                        }
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label className={`${styles.label} text-caption-strong`}>
                        Record ID
                    </label>
                    <TextInput
                        placeholder="Enter record ID (exact match)"
                        value={localValues.recordId}
                        onChange={(e) => handleChange('recordId', e.target.value)}
                    />
                </div>
            </div>
        </BaseModal>
    );
};

export default AdvancedFiltersModal;
