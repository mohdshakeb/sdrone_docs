/**
 * Mock data for incident report form dropdowns
 */

import type { SiteOption, BodyPartOption } from './types';

export const siteOptions: SiteOption[] = [
    { value: 'site-a', label: 'Site A - Main Facility' },
    { value: 'site-b', label: 'Site B - Warehouse' },
    { value: 'site-c', label: 'Site C - Office Complex' },
    { value: 'site-d', label: 'Site D - Manufacturing Plant' },
    { value: 'site-e', label: 'Site E - Distribution Center' },
];

export const bodyPartOptions: BodyPartOption[] = [
    { value: 'head', label: 'Head' },
    { value: 'face', label: 'Face' },
    { value: 'eyes', label: 'Eyes' },
    { value: 'ears', label: 'Ears' },
    { value: 'neck', label: 'Neck' },
    { value: 'shoulder', label: 'Shoulder' },
    { value: 'upper-arm', label: 'Upper Arm' },
    { value: 'elbow', label: 'Elbow' },
    { value: 'forearm', label: 'Forearm' },
    { value: 'wrist', label: 'Wrist' },
    { value: 'hand', label: 'Hand' },
    { value: 'finger', label: 'Finger(s)' },
    { value: 'chest', label: 'Chest' },
    { value: 'abdomen', label: 'Abdomen' },
    { value: 'back-upper', label: 'Upper Back' },
    { value: 'back-lower', label: 'Lower Back' },
    { value: 'hip', label: 'Hip' },
    { value: 'thigh', label: 'Thigh' },
    { value: 'knee', label: 'Knee' },
    { value: 'lower-leg', label: 'Lower Leg' },
    { value: 'ankle', label: 'Ankle' },
    { value: 'foot', label: 'Foot' },
    { value: 'toe', label: 'Toe(s)' },
    { value: 'multiple', label: 'Multiple Areas' },
    { value: 'other', label: 'Other' },
];

export const contributingFactorOptions = [
    {
        value: 'UA' as const,
        label: 'Unsafe Act (UA)',
        description: 'An action or behavior that could lead to an incident',
    },
    {
        value: 'UC' as const,
        label: 'Unsafe Condition (UC)',
        description: 'A physical condition or circumstance that could lead to an incident',
    },
    {
        value: 'both' as const,
        label: 'Both',
        description: 'Both an unsafe act and unsafe condition contributed',
    },
];

export const treatmentOptions = [
    {
        value: 'first-aid' as const,
        label: 'First Aid',
        description: 'Minor treatment administered on-site',
    },
    {
        value: 'medical' as const,
        label: 'Medical Treatment',
        description: 'Treatment by a medical professional',
    },
    {
        value: 'hospital' as const,
        label: 'Hospital Treatment',
        description: 'Treatment requiring hospital visit',
    },
];

export const injuryOptions = [
    {
        value: 'yes',
        label: 'Yes',
        description: 'Someone was injured',
    },
    {
        value: 'no',
        label: 'No',
        description: 'No injuries occurred',
    },
];

// Incident type labels for display
export const incidentTypeLabels: Record<string, string> = {
    'near-miss': 'Near Miss',
    'first-aid': 'First Aid',
    'fir': 'First Injury Report (FIR)',
    'adr': 'Accident/Dangerous Occurrence (ADR)',
};

// Incident type badge colors
export const incidentTypeBadgeColors: Record<string, 'notice' | 'positive' | 'negative' | 'information'> = {
    'near-miss': 'notice',
    'first-aid': 'positive',
    'fir': 'negative',
    'adr': 'negative',
};
