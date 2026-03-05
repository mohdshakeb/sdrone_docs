'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import FileInput from '@/components/ui/FileInput';
import styles from './Steps.module.css';
import type { ToolAuditFormData, StepErrors } from '../../types';

export interface StepAttachmentsProps {
    data: ToolAuditFormData;
    errors: StepErrors;
    onUpdate: <K extends keyof ToolAuditFormData>(field: K, value: ToolAuditFormData[K]) => void;
}

export const StepAttachments: React.FC<StepAttachmentsProps> = ({
    data,
    errors,
    onUpdate,
}) => {
    return (
        <div className={styles.fieldsWrapper}>
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

export default StepAttachments;
