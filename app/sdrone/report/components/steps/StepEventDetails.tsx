'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import FileInput from '@/components/ui/FileInput';
import styles from './Steps.module.css';
import type { IncidentFormData, StepErrors } from '../../types';

export interface StepEventDetailsProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

export const StepEventDetails: React.FC<StepEventDetailsProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="chronologyOfEvents"
                label="Chronology of events"
                required
                error={errors.chronologyOfEvents}
                helpText="Describe the sequence of events leading up to and following the incident"
            >
                <Textarea
                    value={data.chronologyOfEvents}
                    onChange={e => onUpdate('chronologyOfEvents', e.target.value)}
                    placeholder="08:30 — Worker arrived at station and began setup...&#10;08:45 — Equipment started..."
                    rows={6}
                />
            </FormField>

            <FormField
                id="photos"
                label="Incident photos"
                helpText="Attach photos from the scene. Optional but strongly recommended for ADR."
                error={errors.photos}
            >
                <FileInput
                    accept="image/*"
                    multiple
                    maxFiles={4}
                    files={data.photos}
                    onChange={files => onUpdate('photos', files)}
                />
            </FormField>
        </div>
    );
};

export default StepEventDetails;
