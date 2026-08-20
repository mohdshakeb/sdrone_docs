'use client';

import React from 'react';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import RadioGroup from '@/components/ui/RadioGroup';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { MOCK_EMPLOYEES } from '@/data/mock-data';
import { bodyPartOptions } from '../../mockData';
import type { IncidentFormData, StepErrors, InjuredEmployee, IncidentType } from '../../types';
import styles from './Steps.module.css';

export interface StepInjuredEmployeeProps {
    data: IncidentFormData;
    errors: StepErrors;
    inferredType: IncidentType;
    onUpdate: <K extends keyof IncidentFormData>(field: K, value: IncidentFormData[K]) => void;
}

const employeeOptions = [
    { value: '', label: 'Select employee' },
    ...MOCK_EMPLOYEES.map(e => ({ value: e.id, label: `${e.name} — ${e.role}` })),
];

const lossTimeOptions = [
    { value: 'yes', label: 'Yes', description: 'Employee missed work days' },
    { value: 'no',  label: 'No',  description: 'No time lost from work' },
];

function createEmptyEmployee(): InjuredEmployee {
    return {
        id: crypto.randomUUID(),
        employeeId: '',
        hourWorkStarted: '',
        activityAtTime: '',
        injuryDescription: '',
        bodyPart: '',
        bodyPartOther: '',
        treatment: '',
        usedFirstAidBox: '',
        medicineDetails: '',
        doctorHospital: '',
        lossTime: null,
        lossTimeDays: null,
    };
}

export const StepInjuredEmployee: React.FC<StepInjuredEmployeeProps> = ({
    data,
    errors,
    inferredType,
    onUpdate,
}) => {
    const isFirstAid = inferredType === 'first-aid';
    const isRepeatable = inferredType === 'fir' || inferredType === 'adr';

    const employees = data.injuredEmployees.length > 0
        ? data.injuredEmployees
        : [createEmptyEmployee()];

    // Sync initial empty row into state on first render
    React.useEffect(() => {
        if (data.injuredEmployees.length === 0) {
            onUpdate('injuredEmployees', [createEmptyEmployee()]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateEmployee = (index: number, field: keyof InjuredEmployee, value: unknown) => {
        const updated = employees.map((emp, i) =>
            i === index ? { ...emp, [field]: value } : emp
        );
        onUpdate('injuredEmployees', updated);
    };

    const addEmployee = () => {
        onUpdate('injuredEmployees', [...employees, createEmptyEmployee()]);
    };

    const removeEmployee = (index: number) => {
        const updated = employees.filter((_, i) => i !== index);
        onUpdate('injuredEmployees', updated.length > 0 ? updated : [createEmptyEmployee()]);
    };

    const getError = (index: number, field: string) =>
        errors[`injuredEmployees[${index}].${field}`];

    return (
        <div className={styles.fieldsWrapper}>
            {employees.map((emp, index) => (
                <div key={emp.id} className={styles.repeatableCard}>
                    {isRepeatable && employees.length > 1 && (
                        <div className={styles.repeatableCardHeader}>
                            <span className={['text-caption-strong', styles.repeatableCardTitle].join(' ')}>
                                Injured Person {index + 1}
                            </span>
                            <button
                                type="button"
                                className={styles.removeRowBtn}
                                onClick={() => removeEmployee(index)}
                                aria-label="Remove this injured person"
                            >
                                <Icon name="close" size={16} />
                            </button>
                        </div>
                    )}

                    <FormField
                        id={`employeeId-${index}`}
                        label="Employee"
                        required
                        error={getError(index, 'employeeId')}
                    >
                        <Select
                            options={employeeOptions}
                            value={emp.employeeId}
                            onChange={e => updateEmployee(index, 'employeeId', e.target.value)}
                            hasError={!!getError(index, 'employeeId')}
                        />
                    </FormField>

                    {!isFirstAid && (
                        <div className={styles.fieldRow}>
                            <FormField
                                id={`hourWorkStarted-${index}`}
                                label="Hour work started"
                                required
                                error={getError(index, 'hourWorkStarted')}
                            >
                                <TextInput
                                    type="time"
                                    value={emp.hourWorkStarted}
                                    onChange={e => updateEmployee(index, 'hourWorkStarted', e.target.value)}
                                    hasError={!!getError(index, 'hourWorkStarted')}
                                />
                            </FormField>
                            <FormField
                                id={`activityAtTime-${index}`}
                                label="Activity at time of incident"
                                required
                                error={getError(index, 'activityAtTime')}
                            >
                                <TextInput
                                    value={emp.activityAtTime}
                                    onChange={e => updateEmployee(index, 'activityAtTime', e.target.value)}
                                    placeholder="e.g., Operating conveyor belt"
                                    hasError={!!getError(index, 'activityAtTime')}
                                />
                            </FormField>
                        </div>
                    )}

                    <FormField
                        id={`injuryDescription-${index}`}
                        label="Nature and extent of injury"
                        required
                        error={getError(index, 'injuryDescription')}
                    >
                        <Textarea
                            value={emp.injuryDescription}
                            onChange={e => updateEmployee(index, 'injuryDescription', e.target.value)}
                            placeholder="Describe the injury — nature, location on body, severity..."
                            rows={2}
                        />
                    </FormField>

                    <FormField
                        id={`bodyPart-${index}`}
                        label="Body part affected"
                        required
                        error={getError(index, 'bodyPart')}
                    >
                        <Select
                            options={bodyPartOptions}
                            value={emp.bodyPart}
                            onChange={e => updateEmployee(index, 'bodyPart', e.target.value)}
                            placeholder="Select body part"
                            hasError={!!getError(index, 'bodyPart')}
                        />
                    </FormField>

                    {emp.bodyPart === 'other' && (
                        <FormField
                            id={`bodyPartOther-${index}`}
                            label="Specify body part"
                            required
                            error={getError(index, 'bodyPartOther')}
                        >
                            <TextInput
                                value={emp.bodyPartOther}
                                onChange={e => updateEmployee(index, 'bodyPartOther', e.target.value)}
                                placeholder="e.g., Lower back, right side"
                                hasError={!!getError(index, 'bodyPartOther')}
                            />
                        </FormField>
                    )}

                    {isFirstAid && (
                        <>
                            <FormField
                                id={`treatment-${index}`}
                                label="Treatment"
                                error={getError(index, 'treatment')}
                            >
                                <Textarea
                                    value={emp.treatment}
                                    onChange={e => updateEmployee(index, 'treatment', e.target.value)}
                                    placeholder="e.g., Wound cleaned with antiseptic, sterile dressing applied"
                                    rows={2}
                                    maxLength={500}
                                    showCharCount
                                />
                            </FormField>

                            <FormField
                                id={`usedFirstAidBox-${index}`}
                                label="Has used medicines from First Aid Box or visited Hospital?"
                                error={getError(index, 'usedFirstAidBox')}
                            >
                                <Textarea
                                    value={emp.usedFirstAidBox}
                                    onChange={e => updateEmployee(index, 'usedFirstAidBox', e.target.value)}
                                    placeholder="e.g., Antiseptic from first aid box used. No hospital visit required."
                                    rows={2}
                                />
                            </FormField>

                            <FormField
                                id={`medicineDetails-${index}`}
                                label="Medicine Details"
                                error={getError(index, 'medicineDetails')}
                            >
                                <Textarea
                                    value={emp.medicineDetails}
                                    onChange={e => updateEmployee(index, 'medicineDetails', e.target.value)}
                                    placeholder="e.g., Betadine antiseptic, sterile gauze pad, adhesive bandage"
                                    rows={2}
                                />
                            </FormField>
                        </>
                    )}

                    {!isFirstAid && (
                        <>
                            <FormField
                                id={`doctorHospital-${index}`}
                                label="Doctor / hospital attended"
                                required
                                error={getError(index, 'doctorHospital')}
                            >
                                <TextInput
                                    value={emp.doctorHospital}
                                    onChange={e => updateEmployee(index, 'doctorHospital', e.target.value)}
                                    placeholder="e.g., City General Hospital"
                                    hasError={!!getError(index, 'doctorHospital')}
                                />
                            </FormField>

                            <FormField
                                id={`lossTime-${index}`}
                                label="Loss of time from work?"
                                required
                                error={getError(index, 'lossTime')}
                            >
                                <RadioGroup
                                    name={`lossTime-${index}`}
                                    options={lossTimeOptions}
                                    value={emp.lossTime === null ? undefined : emp.lossTime ? 'yes' : 'no'}
                                    onChange={v => updateEmployee(index, 'lossTime', v === 'yes')}
                                    hasError={!!getError(index, 'lossTime')}
                                />
                            </FormField>

                            {emp.lossTime === true && (
                                <FormField
                                    id={`lossTimeDays-${index}`}
                                    label="Number of days lost"
                                    required
                                    error={getError(index, 'lossTimeDays')}
                                >
                                    <TextInput
                                        type="number"
                                        value={emp.lossTimeDays !== null ? String(emp.lossTimeDays) : ''}
                                        onChange={e => updateEmployee(index, 'lossTimeDays', e.target.value ? Number(e.target.value) : null)}
                                        placeholder="0"
                                        hasError={!!getError(index, 'lossTimeDays')}
                                    />
                                </FormField>
                            )}
                        </>
                    )}
                </div>
            ))}

            {isRepeatable && (
                <div className={styles.addRowWrapper}>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={addEmployee}
                        leadingIcon={<Icon name="add" size={16} />}
                    >
                        Add another injured person
                    </Button>
                </div>
            )}
        </div>
    );
};

export default StepInjuredEmployee;
