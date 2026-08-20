export interface SafetyAlertFormData {
    message: string;
    targetAudience: string[];
    attachments: File[];
}

export const initialSafetyAlertData: SafetyAlertFormData = {
    message: '',
    targetAudience: [],
    attachments: [],
};

export interface TargetAudienceGroup {
    label: string;
    options: { value: string; label: string }[];
}

export const TARGET_AUDIENCE_GROUPS: TargetAudienceGroup[] = [
    {
        label: 'Groups',
        options: [
            { value: 'all-staff', label: 'All Staff' },
            { value: 'all-field-workers', label: 'All Field Workers' },
            { value: 'all-reporting-managers', label: 'All Reporting Managers' },
            { value: 'all-safety-officers', label: 'All Safety Officers' },
        ],
    },
    {
        label: 'By Location',
        options: [
            { value: 'warehouse-a', label: 'Warehouse A' },
            { value: 'warehouse-b', label: 'Warehouse B' },
            { value: 'control-room', label: 'Control Room' },
            { value: 'loading-dock', label: 'Loading Dock' },
            { value: 'generator-room', label: 'Generator Room' },
            { value: 'lab-3', label: 'Lab 3' },
            { value: 'fueling-station', label: 'Fueling Station' },
            { value: 'deck-b', label: 'Deck B' },
            { value: 'office-block', label: 'Office Block' },
        ],
    },
];
