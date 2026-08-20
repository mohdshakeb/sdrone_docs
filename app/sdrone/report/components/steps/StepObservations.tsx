'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import styles from './Steps.module.css';
import type { IncidentFormData, StepErrors, IncidentType } from '../../types';

export interface StepObservationsProps {
    data: IncidentFormData;
    errors: StepErrors;
    inferredType: IncidentType;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

export const StepObservations: React.FC<StepObservationsProps> = ({
    data,
    errors,
    inferredType,
    onUpdate,
}) => {
    const isADR = inferredType === 'adr';

    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="rootCause"
                label="Root cause"
                required
                error={errors.rootCause}
                helpText="What was the underlying cause of this incident?"
            >
                <Textarea
                    value={data.rootCause}
                    onChange={e => onUpdate('rootCause', e.target.value)}
                    placeholder="Describe the root cause..."
                    rows={3}
                />
            </FormField>

            <FormField
                id="contributingFactorsText"
                label="Contributing factors"
                required
                error={errors.contributingFactorsText}
                helpText="What unsafe acts or conditions contributed to this incident?"
            >
                <Textarea
                    value={data.contributingFactorsText}
                    onChange={e => onUpdate('contributingFactorsText', e.target.value)}
                    placeholder="Describe contributing factors..."
                    rows={3}
                />
            </FormField>

            {!isADR && (
                <FormField
                    id="recommendedSolution"
                    label="Recommended solution"
                    error={errors.recommendedSolution}
                    helpText="What steps could prevent a similar incident in the future?"
                >
                    <Textarea
                        value={data.recommendedSolution}
                        onChange={e => onUpdate('recommendedSolution', e.target.value)}
                        placeholder="Describe your recommendations..."
                        rows={3}
                    />
                </FormField>
            )}

            {isADR && (
                <FormField
                    id="whyAnalysis"
                    label="Why analysis (5 Whys)"
                    error={errors.whyAnalysis}
                    helpText="Drill down to the root cause by asking 'why' repeatedly"
                >
                    <Textarea
                        value={data.whyAnalysis}
                        onChange={e => onUpdate('whyAnalysis', e.target.value)}
                        placeholder="Why did this happen? Why? Why?..."
                        rows={4}
                    />
                </FormField>
            )}
        </div>
    );
};

export default StepObservations;
