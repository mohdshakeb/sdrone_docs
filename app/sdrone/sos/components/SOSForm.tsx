'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import Textarea from '@/components/ui/Textarea';
import FileInput from '@/components/ui/FileInput';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useRole } from '@/components/prototype/RoleProvider';
import type { SOSFormData } from '../types';
import styles from './SOSForm.module.css';

export interface SOSFormProps {
    data: SOSFormData;
    onUpdate: <K extends keyof SOSFormData>(field: K, value: SOSFormData[K]) => void;
    onSubmit: () => void;
}

export const SOSForm: React.FC<SOSFormProps> = ({ data, onUpdate, onSubmit }) => {
    const { role } = useRole();

    return (
        <div className={styles.wrapper}>
            {/* Reporter context strip */}
            <div className={styles.contextStrip}>
                <div className={styles.contextItem}>
                    <Icon name="user" size={16} />
                    <span className="text-body-strong">{role.userName}</span>
                    <span className={['text-caption', styles.contextRole].join(' ')}>{role.title}</span>
                </div>
                <div className={styles.contextItem}>
                    <Icon name="pin" size={16} />
                    <span className="text-body">Warehouse A</span>
                    <span className={['text-caption', styles.contextHint].join(' ')}>auto-detected</span>
                </div>
            </div>

            <div className={styles.fields}>
                <FormField
                    id="description"
                    label="Emergency description"
                    helpText="Optional — describe what's happening so responders can prepare"
                >
                    <Textarea
                        value={data.description}
                        onChange={e => onUpdate('description', e.target.value)}
                        placeholder="e.g., Worker down near Bay 3, possible heat exhaustion..."
                        rows={4}
                    />
                </FormField>

                <FormField
                    id="photos"
                    label="Photos"
                    helpText="Optional — up to 4 photos"
                >
                    <FileInput
                        accept="image/*"
                        multiple
                        maxFiles={4}
                        files={data.photos}
                        onChange={files => onUpdate('photos', files)}
                        placeholder="Attach photos (optional)"
                    />
                </FormField>
            </div>

            <div className={styles.sendWrapper}>
                <Button
                    variant="negative"
                    size="lg"
                    onClick={onSubmit}
                    leadingIcon={<Icon name="sos" size={20} />}
                >
                    SEND SOS
                </Button>
            </div>
        </div>
    );
};

export default SOSForm;
