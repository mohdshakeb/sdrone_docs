'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import TimeInput from '@/components/ui/TimeInput';
import Select from '@/components/ui/Select';
import { siteOptions, workstationOptions } from '../../mockData';
import type { IncidentFormData, StepErrors, IncidentType } from '../../types';
import styles from './Steps.module.css';

export interface StepWhenWhereProps {
    data: IncidentFormData;
    errors: StepErrors;
    inferredType: IncidentType;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

export const StepWhenWhere: React.FC<StepWhenWhereProps> = ({
    data,
    errors,
    inferredType,
    onUpdate,
}) => {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className={styles.fieldsWrapper}>
            <div className={styles.fieldRow}>
                <FormField
                    id="dateOccurred"
                    label="Date"
                    required
                    error={errors.dateOccurred}
                >
                    <TextInput
                        type="date"
                        value={data.dateOccurred}
                        onChange={(e) => onUpdate('dateOccurred', e.target.value)}
                        hasError={!!errors.dateOccurred}
                        max={today}
                    />
                </FormField>

                <FormField
                    id="timeOccurred"
                    label="Time"
                    required
                    error={errors.timeOccurred}
                >
                    <TimeInput
                        value={data.timeOccurred}
                        onChange={(e) => onUpdate('timeOccurred', e.target.value)}
                        hasError={!!errors.timeOccurred}
                    />
                </FormField>
            </div>

            <FormField
                id="site"
                label="Site"
                required
                error={errors.site}
            >
                <Select
                    options={siteOptions}
                    value={data.site}
                    onChange={(e) => onUpdate('site', e.target.value)}
                    placeholder="Select a site"
                    hasError={!!errors.site}
                />
            </FormField>

            {inferredType === 'near-miss' && (
                <FormField
                    id="workstation"
                    label="Workstation"
                >
                    <Select
                        options={workstationOptions}
                        value={data.workstation}
                        onChange={(e) => onUpdate('workstation', e.target.value)}
                        placeholder="Select workstation"
                    />
                </FormField>
            )}

            {(inferredType === 'fir' || inferredType === 'adr') && (
                <FormField
                    id="exactPlace"
                    label="Exact place in company"
                    helpText="Branch, department, specific area"
                >
                    <TextInput
                        value={data.exactPlace}
                        onChange={(e) => onUpdate('exactPlace', e.target.value)}
                        placeholder="e.g., Conveyor Section, Bay 2"
                    />
                </FormField>
            )}

            <FormField
                id="area"
                label="Area / Location"
                helpText="Specific area within the site where the incident occurred"
            >
                <TextInput
                    value={data.area}
                    onChange={(e) => onUpdate('area', e.target.value)}
                    placeholder="e.g., Loading dock, Machine shop, Office B2"
                />
            </FormField>

            <FormField
                id="asset"
                label="Asset / Equipment"
                helpText="Any equipment or assets involved in the incident"
            >
                <TextInput
                    value={data.asset}
                    onChange={(e) => onUpdate('asset', e.target.value)}
                    placeholder="e.g., Forklift #12, Conveyor belt, None"
                />
            </FormField>
        </div>
    );
};

export default StepWhenWhere;
