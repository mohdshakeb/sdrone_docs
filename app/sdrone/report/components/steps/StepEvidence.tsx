'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import FileInput from '@/components/ui/FileInput';
import type { IncidentFormData, StepErrors } from '../../types';

export interface StepEvidenceProps {
    data: IncidentFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

export const StepEvidence: React.FC<StepEvidenceProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    return (
        <>
            <FormField
                id="photos"
                label="Photos"
                helpText="Upload photos of the incident scene, damaged equipment, or injuries (if appropriate)"
            >
                <FileInput
                    id="photos"
                    accept="image/*"
                    multiple
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024} // 10MB
                    files={data.photos}
                    onChange={(files) => onUpdate('photos', files)}
                    placeholder="Drag photos here or click to browse"
                    helpText="Max 5 photos, up to 10MB each"
                />
            </FormField>

            <FormField
                id="attachments"
                label="Other Attachments"
                helpText="Upload any relevant documents such as witness statements or equipment logs"
            >
                <FileInput
                    id="attachments"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    multiple
                    maxFiles={3}
                    maxSize={5 * 1024 * 1024} // 5MB
                    files={data.attachments}
                    onChange={(files) => onUpdate('attachments', files)}
                    placeholder="Drag documents here or click to browse"
                    helpText="Max 3 files, up to 5MB each (PDF, DOC, XLS, TXT)"
                />
            </FormField>
        </>
    );
};

export default StepEvidence;
