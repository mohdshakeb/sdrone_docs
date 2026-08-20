'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import TextInput from '@/components/ui/TextInput';
import FileInput from '@/components/ui/FileInput';
import styles from './Steps.module.css';
import type { ToolAuditFormData, StepErrors } from '../../types';

export interface StepConclusionProps {
    data: ToolAuditFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof ToolAuditFormData>(field: K, value: ToolAuditFormData[K]) => void;
}

export const StepConclusion: React.FC<StepConclusionProps> = ({ data, errors, onUpdate }) => {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className={styles.fieldsWrapper}>
            <FormField
                id="observations"
                label="Observations"
                helpText="General observations about the audit findings"
            >
                <Textarea
                    value={data.observations}
                    onChange={(e) => onUpdate('observations', e.target.value)}
                    placeholder="Enter any overall observations..."
                    rows={3}
                    maxLength={200}
                    showCharCount
                />
            </FormField>

            <FormField
                id="actionRequired"
                label="Action Required"
                helpText="Describe the corrective or follow-up action needed"
            >
                <Textarea
                    value={data.actionRequired}
                    onChange={(e) => onUpdate('actionRequired', e.target.value)}
                    placeholder="Describe the action required..."
                    rows={3}
                    maxLength={200}
                    showCharCount
                />
            </FormField>

            <FormField
                id="responsibility"
                label="Responsibility"
                helpText="Who is responsible for completing this action"
            >
                <Textarea
                    value={data.responsibility}
                    onChange={(e) => onUpdate('responsibility', e.target.value)}
                    placeholder="Name or team responsible..."
                    rows={2}
                    maxLength={200}
                    showCharCount
                />
            </FormField>

            <FormField
                id="targetDate"
                label="Target Date"
                required
                error={errors.targetDate}
            >
                <TextInput
                    type="date"
                    value={data.targetDate}
                    onChange={(e) => onUpdate('targetDate', e.target.value)}
                    hasError={!!errors.targetDate}
                    min={today}
                />
            </FormField>

            <FormField
                id="attachments"
                label="Attachments"
                helpText="Upload any supporting documents for this audit"
            >
                <FileInput
                    id="attachments"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,image/*"
                    multiple
                    maxFiles={10}
                    maxSize={10 * 1024 * 1024}
                    files={data.attachments}
                    onChange={(files) => onUpdate('attachments', files)}
                    placeholder="Drag files here or click to browse"
                    helpText="Max 10 files, up to 10MB each"
                />
            </FormField>
        </div>
    );
};

export default StepConclusion;
