'use client';

import React, { useState, useEffect } from 'react';
import { BaseModal } from '@/components/ui/BaseModal';
import Dropdown from '@/components/ui/Dropdown';
import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';
import { PERSON_OPTIONS, SEVERITY_OPTIONS, SLA_OPTIONS } from '@/data/mock-data';
import { AdvancedFilterVisibility } from '@/utils/role-filters';
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
    /** Which filter fields are visible based on role */
    visibility?: AdvancedFilterVisibility;
}

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
    visibility,
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
                {(!visibility || visibility.reportedBy) && (
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
                )}

                {(!visibility || visibility.owner) && (
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
                )}

                {(!visibility || visibility.closedBy) && (
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
                )}

                {(!visibility || visibility.severity) && (
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
                )}

                {(!visibility || visibility.slaBreached) && (
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
                )}

                {(!visibility || visibility.recordId) && (
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
                )}
            </div>
        </BaseModal>
    );
};

export default AdvancedFiltersModal;
