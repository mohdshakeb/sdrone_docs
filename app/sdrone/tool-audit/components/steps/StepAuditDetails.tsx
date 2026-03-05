'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import TimeInput from '@/components/ui/TimeInput';
import Select from '@/components/ui/Select';
import { auditTypeOptions, locationOptions, cseNameOptions } from '../../mockData';
import type { ToolAuditFormData, StepErrors } from '../../types';
import styles from './Steps.module.css';

export interface StepAuditDetailsProps {
    data: ToolAuditFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof ToolAuditFormData>(field: K, value: ToolAuditFormData[K]) => void;
}

export const StepAuditDetails: React.FC<StepAuditDetailsProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="auditType"
                label="Audit Type"
                required
                error={errors.auditType}
            >
                <Select
                    options={auditTypeOptions}
                    value={data.auditType}
                    onChange={(e) => onUpdate('auditType', e.target.value as ToolAuditFormData['auditType'])}
                    placeholder="Select audit type"
                    hasError={!!errors.auditType}
                />
            </FormField>

            <div className={styles.fieldRow}>
                <FormField
                    id="auditDate"
                    label="Date"
                    required
                    error={errors.auditDate}
                >
                    <TextInput
                        type="date"
                        value={data.auditDate}
                        onChange={(e) => onUpdate('auditDate', e.target.value)}
                        hasError={!!errors.auditDate}
                        max={today}
                    />
                </FormField>

                <FormField
                    id="auditTime"
                    label="Time"
                    required
                    error={errors.auditTime}
                >
                    <TimeInput
                        value={data.auditTime}
                        onChange={(e) => onUpdate('auditTime', e.target.value)}
                        hasError={!!errors.auditTime}
                    />
                </FormField>
            </div>

            <FormField
                id="auditLocation"
                label="Location"
                required
                error={errors.auditLocation}
            >
                <Select
                    options={locationOptions}
                    value={data.auditLocation}
                    onChange={(e) => onUpdate('auditLocation', e.target.value)}
                    placeholder="Select a location"
                    hasError={!!errors.auditLocation}
                />
            </FormField>

            <FormField
                id="cseName"
                label="CSE Name"
                required
                error={errors.cseName}
            >
                <Select
                    options={cseNameOptions}
                    value={data.cseName}
                    onChange={(e) => onUpdate('cseName', e.target.value)}
                    placeholder="Select CSE"
                    hasError={!!errors.cseName}
                />
            </FormField>
        </div>
    );
};

export default StepAuditDetails;
