'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import FileInput from '@/components/ui/FileInput';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useRole } from '@/components/prototype/RoleProvider';
import type { SafetyAlertFormData } from '../types';
import { TARGET_AUDIENCE_GROUPS } from '../types';
import styles from './SafetyAlertForm.module.css';

export interface SafetyAlertFormProps {
    data: SafetyAlertFormData;
    onUpdate: <K extends keyof SafetyAlertFormData>(field: K, value: SafetyAlertFormData[K]) => void;
    onToggleAudience: (value: string) => void;
    isValid: boolean;
    onSubmit: () => void;
}

export const SafetyAlertForm: React.FC<SafetyAlertFormProps> = ({
    data,
    onUpdate,
    onToggleAudience,
    isValid,
    onSubmit,
}) => {
    const { role } = useRole();

    const allOptions = TARGET_AUDIENCE_GROUPS.flatMap(g => g.options);
    const selectedLabels = data.targetAudience
        .map(v => allOptions.find(o => o.value === v)?.label)
        .filter(Boolean) as string[];

    return (
        <div className={styles.wrapper}>
            {/* Reporter context strip */}
            <div className={styles.contextStrip}>
                <div className={styles.contextItem}>
                    <Icon name="user" size={16} />
                    <span className="text-body-strong">{role.userName}</span>
                    <span className={['text-caption', styles.contextRole].join(' ')}>{role.title}</span>
                </div>
            </div>

            <div className={styles.fields}>
                <FormField
                    id="message"
                    label="Alert message"
                    required
                    helpText="Be clear and direct — this will be sent to all selected recipients"
                >
                    <Textarea
                        value={data.message}
                        onChange={e => onUpdate('message', e.target.value)}
                        placeholder="e.g., All personnel must wear heat-resistant gloves in the Generator Room effective immediately..."
                        rows={5}
                    />
                </FormField>

                <FormField
                    id="targetAudience"
                    label="Target audience"
                    required
                    helpText="Select who should receive this alert"
                >
                    <div className={styles.audienceGroups}>
                        {TARGET_AUDIENCE_GROUPS.map(group => (
                            <div key={group.label} className={styles.audienceGroup}>
                                <span className={['text-caption', styles.audienceGroupLabel].join(' ')}>
                                    {group.label}
                                </span>
                                <div className={styles.audienceOptions}>
                                    {group.options.map(option => {
                                        const checked = data.targetAudience.includes(option.value);
                                        return (
                                            <label
                                                key={option.value}
                                                className={styles.audienceOption}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => onToggleAudience(option.value)}
                                                />
                                                <span className={[
                                                    'text-body',
                                                    styles.audienceOptionLabel,
                                                    checked ? styles.checked : '',
                                                ].filter(Boolean).join(' ')}>
                                                    {option.label}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedLabels.length > 0 && (
                        <div className={styles.selectedSummary}>
                            {selectedLabels.map(label => (
                                <span key={label} className={styles.selectedTag}>
                                    <Icon name="check" size={14} />
                                    {label}
                                </span>
                            ))}
                        </div>
                    )}
                </FormField>

                <FormField
                    id="attachments"
                    label="Attachments"
                    helpText="Optional — supporting documents or images"
                >
                    <FileInput
                        accept="image/*,.pdf,.doc,.docx"
                        multiple
                        maxFiles={5}
                        files={data.attachments}
                        onChange={files => onUpdate('attachments', files)}
                        placeholder="Attach files (optional)"
                    />
                </FormField>
            </div>

            <div className={styles.sendWrapper}>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={onSubmit}
                    disabled={!isValid}
                    leadingIcon={<Icon name="alert" size={20} />}
                >
                    Send Safety Alert
                </Button>
            </div>
        </div>
    );
};

export default SafetyAlertForm;
