/**
 * Mock data for incident report form
 */

import type { SiteOption, BodyPartOption, InjuredEmployee, Witness } from './types';

export interface WorkstationOption {
    value: string;
    label: string;
}

export const workstationOptions: WorkstationOption[] = [
    { value: 'conveyor-section', label: 'Conveyor Section' },
    { value: 'pallet-storage', label: 'Pallet Storage' },
    { value: 'loading-bay', label: 'Loading Bay' },
    { value: 'packaging-station', label: 'Packaging Station' },
    { value: 'dock-entrance', label: 'Dock Entrance' },
    { value: 'lab-bench', label: 'Lab Bench' },
    { value: 'chemical-storage', label: 'Chemical Storage' },
    { value: 'transfer-station', label: 'Transfer Station' },
    { value: 'generator-bay', label: 'Generator Bay' },
    { value: 'fuel-transfer-station', label: 'Fuel Transfer Station' },
    { value: 'office-workstation', label: 'Office Workstation' },
    { value: 'other', label: 'Other' },
];

export const siteOptions: SiteOption[] = [
    { value: 'warehouse-a', label: 'Warehouse A' },
    { value: 'warehouse-b', label: 'Warehouse B' },
    { value: 'loading-dock', label: 'Loading Dock' },
    { value: 'lab-3', label: 'Lab 3' },
    { value: 'fueling-station', label: 'Fueling Station' },
    { value: 'generator-room', label: 'Generator Room' },
    { value: 'main-office', label: 'Main Office' },
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

export const injuryOptions = [
    { value: 'yes', label: 'Yes', description: 'Someone was injured' },
    { value: 'no',  label: 'No',  description: 'No injuries occurred' },
];

export const treatmentLocationOptions = [
    { value: 'on-site', label: 'On-site', description: 'Treated on-site by first aider' },
    { value: 'hospital', label: 'Hospital / doctor', description: 'Taken to a doctor or hospital' },
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

// FIR records available for ADR pre-fill
export interface FIRReference {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    exactPlace: string;
    injuredEmployees: InjuredEmployee[];
    witnesses: Witness[];
    machineryInvolved: boolean;
    machineName: string;
    machineMoving: boolean;
    propertyLoss: string;
}

export const MOCK_FIR_REFERENCES: FIRReference[] = [
    {
        id: 'fir-001',
        title: 'Equipment malfunction — Conveyor Section, Warehouse A',
        date: '2026-03-10',
        location: 'Warehouse A',
        description: 'Conveyor belt malfunction resulted in worker injury. Emergency stop activated. Worker transported to hospital.',
        exactPlace: 'Conveyor Section, Bay 2',
        injuredEmployees: [{
            id: 'ie-1',
            employeeId: 'emp-003',
            hourWorkStarted: '07:00',
            activityAtTime: 'Operating conveyor belt',
            injuryDescription: 'Laceration to right hand from moving belt',
            bodyPart: 'hand',
            bodyPartOther: '',
            treatment: '',
            usedFirstAidBox: '',
            medicineDetails: '',
            doctorHospital: 'City General Hospital',
            lossTime: true,
            lossTimeDays: 5,
        }],
        witnesses: [{ id: 'w-1', type: 'employee', employeeId: 'emp-001' }],
        machineryInvolved: true,
        machineName: 'Conveyor Belt CB-04',
        machineMoving: true,
        propertyLoss: 'Belt drive mechanism damaged — estimated repair cost ₹45,000',
    },
    {
        id: 'fir-002',
        title: 'Chemical spill — Lab 3',
        date: '2026-01-12',
        location: 'Lab 3',
        description: 'Mild acidic solution spilled during container transfer. Area decontaminated. No injuries.',
        exactPlace: 'Chemical Storage Transfer Station',
        injuredEmployees: [],
        witnesses: [{ id: 'w-2', type: 'employee', employeeId: 'emp-008' }],
        machineryInvolved: false,
        machineName: '',
        machineMoving: false,
        propertyLoss: 'Flooring tiles in transfer area corroded — replacement required',
    },
    {
        id: 'fir-003',
        title: 'Oil spill — Fueling Station',
        date: '2026-01-16',
        location: 'Fueling Station',
        description: 'Hydraulic oil leak from cracked transfer pump line. Approximately 5 litres spilled on concrete pad.',
        exactPlace: 'Tank Farm, Pump Station 2',
        injuredEmployees: [],
        witnesses: [],
        machineryInvolved: true,
        machineName: 'Fuel Transfer Pump FTP-02',
        machineMoving: true,
        propertyLoss: 'Hydraulic line and pump seal replacement — estimated ₹12,000',
    },
];
