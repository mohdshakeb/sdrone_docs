import type { IconName } from '@/components/ui/Icon';
import type { BadgeColor } from '@/components/ui/Badge';
import type { DropdownItem } from '@/components/ui/Dropdown';
import type { HistoryRecord, IncidentDetail, ReviewComment } from '@/types/history';

/**
 * Mock data for S-Drone prototype
 * Contains hardcoded tasks and filter options for demonstration purposes
 */

// Task type definition
export interface Task {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  reportedBy: string;
  reportedOn: string;
  location: string;
  iconName: IconName;
  badgeColor: BadgeColor;
}

// Report type dropdown items (full version with all subtypes)
export const REPORT_TYPE_ITEMS: DropdownItem[] = [
  { type: 'header', label: 'Incidents' },
  { type: 'icon', value: 'near-miss', label: 'Near Miss', icon: 'barricade' },
  { type: 'icon', value: 'first-aid', label: 'First Aid', icon: 'first-aid' },
  { type: 'icon', value: 'first-incident', label: 'FIR', icon: 'fire' },
  { type: 'icon', value: 'accident-detail', label: 'ADR', icon: 'file-text' },
  { type: 'divider' },
  { type: 'header', label: 'Audits' },
  { type: 'icon', value: 'safety-audit', label: 'Safety Audit', icon: 'survey' },
  { type: 'icon', value: 'tool-audit', label: 'Tool Audit', icon: 'todo' },
  { type: 'divider' },
  { type: 'header', label: 'Compliance' },
  { type: 'icon', value: 'meetings', label: 'Meetings', icon: 'group' },
  { type: 'icon', value: 'health-check', label: 'Health Check', icon: 'dossier' },
  { type: 'icon', value: 'audit', label: 'Audit', icon: 'task' },
  { type: 'divider' },
  { type: 'header', label: 'Permit to Work' },
  { type: 'icon', value: 'general-work', label: 'General Work', icon: 'pass-valid' },
  { type: 'icon', value: 'cold-work', label: 'Cold Work', icon: 'pass-valid' },
  { type: 'icon', value: 'hot-work', label: 'Hot Work', icon: 'pass-valid' },
  { type: 'icon', value: 'height-work', label: 'Height Work', icon: 'pass-valid' },
  { type: 'divider' },
  { type: 'header', label: 'Toolbox Talk' },
  { type: 'icon', value: 'toolbox-talk', label: 'Toolbox Talk', icon: 'speak' },
];

// Report type dropdown items for "All" tab view (collapsed Permit to Work and Toolbox Talk without headers)
export const REPORT_TYPE_ITEMS_ALL_TAB: DropdownItem[] = [
  { type: 'header', label: 'Incidents' },
  { type: 'icon', value: 'near-miss', label: 'Near Miss', icon: 'barricade' },
  { type: 'icon', value: 'first-aid', label: 'First Aid', icon: 'first-aid' },
  { type: 'icon', value: 'first-incident', label: 'FIR', icon: 'fire' },
  { type: 'icon', value: 'accident-detail', label: 'ADR', icon: 'file-text' },
  { type: 'divider' },
  { type: 'header', label: 'Audits' },
  { type: 'icon', value: 'safety-audit', label: 'Safety Audit', icon: 'survey' },
  { type: 'icon', value: 'tool-audit', label: 'Tool Audit', icon: 'todo' },
  { type: 'divider' },
  { type: 'header', label: 'Compliance' },
  { type: 'icon', value: 'meetings', label: 'Meetings', icon: 'group' },
  { type: 'icon', value: 'health-check', label: 'Health Check', icon: 'dossier' },
  { type: 'icon', value: 'audit', label: 'Audit', icon: 'task' },
  { type: 'divider' },
  { type: 'icon', value: 'permit-to-work', label: 'Permit to Work', icon: 'pass-valid' },
  { type: 'divider' },
  { type: 'icon', value: 'toolbox-talk', label: 'Toolbox Talk', icon: 'speak' },
];

// Status dropdown options
export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'closed', label: 'Closed' },
];

// Mock tasks data
export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Short circuit in control panel',
    subtitle: 'First incident report',
    status: 'On Hold',
    reportedBy: 'Sanjay Mehta',
    reportedOn: 'Thu, 15 Jan',
    location: 'Control Room',
    iconName: 'fire',
    badgeColor: 'negative',
  },
  {
    id: 'task-2',
    title: 'Sprained ankle on slippery surface',
    subtitle: 'First Aid',
    status: 'Under Review',
    reportedBy: 'Anita Desai',
    reportedOn: 'Tue, 13 Jan',
    location: 'Loading Dock 2',
    iconName: 'first-aid',
    badgeColor: 'notice',
  },
  {
    id: 'task-3',
    title: 'Monthly site safety walkthrough',
    subtitle: 'Safety audit',
    status: 'Under Review',
    reportedBy: 'Karan Johar',
    reportedOn: 'Sat, 17 Jan',
    location: 'Full Facility',
    iconName: 'survey',
    badgeColor: 'information',
  },
  {
    id: 'task-4',
    title: 'Minor abrasion during cargo handling',
    subtitle: 'First Aid',
    status: 'Closed',
    reportedBy: 'Rahul Sharma',
    reportedOn: 'Mon, 12 Jan',
    location: 'Deck B, Sector 4',
    iconName: 'first-aid',
    badgeColor: 'positive',
  },
  {
    id: 'task-5',
    title: 'Oil spill near fuel tank',
    subtitle: 'First incident report',
    status: 'Under Review',
    reportedBy: 'Priya Rao',
    reportedOn: 'Fri, 16 Jan',
    location: 'Fueling Station',
    iconName: 'fire',
    badgeColor: 'notice',
  },
  {
    id: 'task-6',
    title: 'Emergency exit inspection',
    subtitle: 'Safety audit',
    status: 'Pending',
    reportedBy: 'Vikram Singh',
    reportedOn: 'Wed, 21 Jan',
    location: 'All Buildings',
    iconName: 'survey',
    badgeColor: 'neutral',
  },
  {
    id: 'task-7',
    title: 'Electrical hazard near generator',
    subtitle: 'Near miss',
    status: 'On Hold',
    reportedBy: 'Meera Patel',
    reportedOn: 'Thu, 15 Jan',
    location: 'Generator Room',
    iconName: 'barricade',
    badgeColor: 'negative',
  },
  {
    id: 'task-8',
    title: 'Chemical spill cleanup',
    subtitle: 'First incident report',
    status: 'Closed',
    reportedBy: 'Arjun Kumar',
    reportedOn: 'Mon, 12 Jan',
    location: 'Lab 3',
    iconName: 'fire',
    badgeColor: 'positive',
  },
];

// Location options for filters
export const LOCATION_OPTIONS = [
  { value: 'warehouse-a', label: 'Warehouse A' },
  { value: 'warehouse-b', label: 'Warehouse B' },
  { value: 'control-room', label: 'Control Room' },
  { value: 'loading-dock', label: 'Loading Dock' },
  { value: 'generator-room', label: 'Generator Room' },
  { value: 'lab-3', label: 'Lab 3' },
  { value: 'fueling-station', label: 'Fueling Station' },
  { value: 'deck-b', label: 'Deck B' },
  { value: 'office-block', label: 'Office Block' },
];

// Person options for advanced filters
export const PERSON_OPTIONS = [
  { value: 'sanjay-mehta', label: 'Sanjay Mehta' },
  { value: 'anita-desai', label: 'Anita Desai' },
  { value: 'rahul-sharma', label: 'Rahul Sharma' },
  { value: 'priya-rao', label: 'Priya Rao' },
  { value: 'vikram-singh', label: 'Vikram Singh' },
  { value: 'karan-johar', label: 'Karan Johar' },
  { value: 'meera-patel', label: 'Dr. Meera Patel' },
  { value: 'arjun-kumar', label: 'Arjun Kumar' },
];

// Severity options for advanced filters
export const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

// SLA breached options for advanced filters
export const SLA_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

// Mock history records
export const MOCK_HISTORY_RECORDS: HistoryRecord[] = [
  {
    id: 'rec-001',
    title: 'Near miss at Warehouse A loading bay',
    description:
      'Forklift operator narrowly avoided collision with pedestrian worker near loading bay entrance. Root cause identified as inadequate signage and floor markings.',
    category: 'Incident',
    type: 'Near Miss',
    status: 'Closed',
    location: { name: 'Warehouse A', area: 'Loading Bay' },
    reportedBy: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' },
    owner: { name: 'Priya Rao', role: 'Safety Officer' },
    closedBy: { name: 'Priya Rao', role: 'Safety Officer', timestamp: '2026-01-20T14:30:00Z' },
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-20T14:30:00Z',
    auditTrail: [
      {
        id: 'at-001-1',
        action: 'Record created',
        actor: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' },
        timestamp: '2026-01-15T09:00:00Z',
      },
      {
        id: 'at-001-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-16T10:15:00Z',
      },
      {
        id: 'at-001-3',
        action: 'Status changed to Closed',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-20T14:30:00Z',
      },
    ],
  },
  {
    id: 'rec-002',
    title: 'First aid administered for minor cut',
    description:
      'Worker sustained minor laceration on left hand while handling packaging materials. First aid administered on site, no further medical attention required.',
    category: 'Incident',
    type: 'First Aid',
    status: 'Closed',
    location: { name: 'Warehouse B', area: 'Packaging Station' },
    reportedBy: { name: 'Anita Desai', role: 'Team Lead' },
    closedBy: { name: 'Vikram Singh', role: 'HSE Manager', timestamp: '2026-01-18T16:00:00Z' },
    createdAt: '2026-01-17T11:30:00Z',
    updatedAt: '2026-01-18T16:00:00Z',
    auditTrail: [
      {
        id: 'at-002-1',
        action: 'Record created',
        actor: { name: 'Anita Desai', role: 'Team Lead' },
        timestamp: '2026-01-17T11:30:00Z',
      },
      {
        id: 'at-002-2',
        action: 'Status changed to Closed',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-18T16:00:00Z',
      },
    ],
  },
  {
    id: 'rec-003',
    title: 'FIR: Equipment malfunction causing injury',
    description:
      'Conveyor belt malfunction resulted in worker injury. Emergency stop was activated. Worker transported to hospital for examination. Investigation ongoing.',
    category: 'Incident',
    type: 'FIR',
    status: 'Under Review',
    location: { name: 'Warehouse A', area: 'Conveyor Section' },
    reportedBy: { name: 'Rahul Sharma', role: 'Shift Manager' },
    owner: { name: 'Vikram Singh', role: 'HSE Manager' },
    createdAt: '2026-03-10T08:45:00Z',
    updatedAt: '2026-03-10T14:00:00Z',
    auditTrail: [
      {
        id: 'at-003-1',
        action: 'Record created',
        actor: { name: 'Rahul Sharma', role: 'Shift Manager' },
        timestamp: '2026-03-10T08:45:00Z',
      },
      {
        id: 'at-003-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-03-10T14:00:00Z',
      },
      {
        id: 'at-003-3',
        action: 'Ownership assigned to Vikram Singh',
        actor: { name: 'System', role: 'Automated' },
        timestamp: '2026-03-10T14:00:00Z',
      },
    ],
  },
  {
    id: 'rec-004',
    title: 'Q1 Safety Audit - Control Room',
    description:
      'Quarterly safety audit of control room facilities. Checked fire extinguishers, emergency exits, electrical panels, and safety signage.',
    category: 'Audit',
    type: 'Safety Audit',
    status: 'Closed',
    location: { name: 'Control Room' },
    reportedBy: { name: 'Priya Rao', role: 'Safety Officer' },
    closedBy: { name: 'Priya Rao', role: 'Safety Officer', timestamp: '2026-01-10T17:00:00Z' },
    createdAt: '2026-01-08T09:00:00Z',
    updatedAt: '2026-01-10T17:00:00Z',
    auditTrail: [
      {
        id: 'at-004-1',
        action: 'Record created',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-08T09:00:00Z',
      },
      {
        id: 'at-004-2',
        action: 'Status changed to Closed',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-10T17:00:00Z',
      },
    ],
  },
  {
    id: 'rec-005',
    title: 'Tool Audit - Warehouse Equipment',
    description:
      'Monthly audit of warehouse tools and equipment. Identified 3 items requiring maintenance and 1 item for replacement.',
    category: 'Audit',
    type: 'Tool Audit',
    status: 'On Hold',
    location: { name: 'Warehouse A' },
    reportedBy: { name: 'Karan Johar', role: 'Equipment Manager' },
    owner: { name: 'Karan Johar', role: 'Equipment Manager' },
    createdAt: '2026-01-19T10:00:00Z',
    updatedAt: '2026-01-21T09:30:00Z',
    auditTrail: [
      {
        id: 'at-005-1',
        action: 'Record created',
        actor: { name: 'Karan Johar', role: 'Equipment Manager' },
        timestamp: '2026-01-19T10:00:00Z',
      },
      {
        id: 'at-005-2',
        action: 'Status changed to On Hold',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-21T09:30:00Z',
      },
    ],
  },
  {
    id: 'rec-006',
    title: 'Monthly Safety Committee Meeting',
    description:
      'Regular monthly safety committee meeting. Discussed incident trends, upcoming training, and new safety initiatives.',
    category: 'Compliance',
    type: 'Meetings',
    status: 'Closed',
    location: { name: 'Office Block', area: 'Conference Room A' },
    reportedBy: { name: 'Vikram Singh', role: 'HSE Manager' },
    closedBy: { name: 'Vikram Singh', role: 'HSE Manager', timestamp: '2026-01-14T12:00:00Z' },
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-01-14T12:00:00Z',
    auditTrail: [
      {
        id: 'at-006-1',
        action: 'Record created',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-14T09:00:00Z',
      },
      {
        id: 'at-006-2',
        action: 'Status changed to Closed',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-14T12:00:00Z',
      },
    ],
  },
  {
    id: 'rec-007',
    title: 'Employee Health Check - Q1',
    description:
      'Quarterly health screening for warehouse staff. 45 employees completed health assessments.',
    category: 'Compliance',
    type: 'Health Check',
    status: 'Closed',
    location: { name: 'Office Block', area: 'Medical Room' },
    reportedBy: { name: 'Dr. Meera Patel', role: 'Occupational Health' },
    closedBy: { name: 'Dr. Meera Patel', role: 'Occupational Health', timestamp: '2026-01-12T17:00:00Z' },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-12T17:00:00Z',
    auditTrail: [
      {
        id: 'at-007-1',
        action: 'Record created',
        actor: { name: 'Dr. Meera Patel', role: 'Occupational Health' },
        timestamp: '2026-01-10T08:00:00Z',
      },
      {
        id: 'at-007-2',
        action: 'Status changed to Closed',
        actor: { name: 'Dr. Meera Patel', role: 'Occupational Health' },
        timestamp: '2026-01-12T17:00:00Z',
      },
    ],
  },
  {
    id: 'rec-008',
    title: 'Hot Work Permit - Welding Operations',
    description:
      'Permit for welding work on storage rack repairs in Warehouse B. Duration: 2 days. Fire watch assigned.',
    category: 'Permit to Work',
    type: 'Hot Work',
    status: 'Closed',
    location: { name: 'Warehouse B', area: 'Storage Section' },
    reportedBy: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
    closedBy: { name: 'Priya Rao', role: 'Safety Officer', timestamp: '2026-01-16T18:00:00Z' },
    createdAt: '2026-01-14T07:00:00Z',
    updatedAt: '2026-01-16T18:00:00Z',
    auditTrail: [
      {
        id: 'at-008-1',
        action: 'Record created',
        actor: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
        timestamp: '2026-01-14T07:00:00Z',
      },
      {
        id: 'at-008-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
        timestamp: '2026-01-14T07:30:00Z',
      },
      {
        id: 'at-008-3',
        action: 'Status changed to Closed',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-16T18:00:00Z',
      },
    ],
  },
  {
    id: 'rec-009',
    title: 'Height Work Permit - Roof Maintenance',
    description:
      'Permit for roof inspection and gutter cleaning. Fall protection equipment required. Duration: 1 day.',
    category: 'Permit to Work',
    type: 'Height Work',
    status: 'Under Review',
    location: { name: 'Warehouse A', area: 'Roof Access' },
    reportedBy: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' },
    owner: { name: 'Priya Rao', role: 'Safety Officer' },
    createdAt: '2026-03-11T08:00:00Z',
    updatedAt: '2026-03-11T08:00:00Z',
    auditTrail: [
      {
        id: 'at-009-1',
        action: 'Record created',
        actor: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' },
        timestamp: '2026-03-11T08:00:00Z',
      },
      {
        id: 'at-009-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-03-11T08:00:00Z',
      },
    ],
  },
  {
    id: 'rec-010',
    title: 'Weekly Toolbox Talk - PPE Compliance',
    description:
      'Weekly safety briefing covering proper PPE usage, inspection procedures, and recent incident learnings.',
    category: 'Toolbox Talk',
    type: 'Toolbox Talk',
    status: 'Closed',
    location: { name: 'Warehouse A', area: 'Break Room' },
    reportedBy: { name: 'Anita Desai', role: 'Team Lead' },
    closedBy: { name: 'Anita Desai', role: 'Team Lead', timestamp: '2026-01-20T08:30:00Z' },
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-20T08:30:00Z',
    auditTrail: [
      {
        id: 'at-010-1',
        action: 'Record created',
        actor: { name: 'Anita Desai', role: 'Team Lead' },
        timestamp: '2026-01-20T08:00:00Z',
      },
      {
        id: 'at-010-2',
        action: 'Status changed to Closed',
        actor: { name: 'Anita Desai', role: 'Team Lead' },
        timestamp: '2026-01-20T08:30:00Z',
      },
    ],
  },
  {
    id: 'rec-011',
    title: 'Near miss - Unsecured load',
    description:
      'Pallet load shifted during transport, nearly falling. Investigation found improper securing technique used.',
    category: 'Incident',
    type: 'Near Miss',
    status: 'On Hold',
    location: { name: 'Loading Dock', area: 'Bay 3' },
    reportedBy: { name: 'Rahul Sharma', role: 'Shift Manager' },
    owner: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' },
    createdAt: '2026-03-10T14:00:00Z',
    updatedAt: '2026-03-12T09:00:00Z',
    auditTrail: [
      {
        id: 'at-011-1',
        action: 'Record created',
        actor: { name: 'Rahul Sharma', role: 'Shift Manager' },
        timestamp: '2026-03-10T14:00:00Z',
      },
      {
        id: 'at-011-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-03-11T08:00:00Z',
      },
      {
        id: 'at-011-3',
        action: 'Status changed to On Hold',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-03-12T09:00:00Z',
      },
      {
        id: 'at-011-4',
        action: 'Ownership assigned to Sanjay Mehta',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-03-12T09:00:00Z',
      },
    ],
  },
  {
    id: 'rec-012',
    title: 'General Work Permit - Electrical Panel',
    description:
      'Permit for routine electrical panel maintenance in Generator Room. Lockout/tagout procedures required.',
    category: 'Permit to Work',
    type: 'General Work',
    status: 'Under Review',
    location: { name: 'Generator Room' },
    reportedBy: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
    createdAt: '2026-03-14T07:00:00Z',
    updatedAt: '2026-03-14T07:00:00Z',
    auditTrail: [
      {
        id: 'at-012-1',
        action: 'Record created',
        actor: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
        timestamp: '2026-03-14T07:00:00Z',
      },
      {
        id: 'at-012-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
        timestamp: '2026-03-14T07:00:00Z',
      },
    ],
  },
  {
    id: 'rec-013',
    title: 'Compliance Audit - Fire Safety',
    description:
      'Annual fire safety compliance audit. Reviewed fire detection systems, suppression equipment, and evacuation procedures.',
    category: 'Compliance',
    type: 'Audit',
    status: 'Escalated',
    location: { name: 'Warehouse A' },
    reportedBy: { name: 'Priya Rao', role: 'Safety Officer' },
    owner: { name: 'Vikram Singh', role: 'HSE Manager' },
    createdAt: '2026-03-07T09:00:00Z',
    updatedAt: '2026-03-07T09:00:00Z',
    auditTrail: [
      {
        id: 'at-013-1',
        action: 'Record created',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-03-05T09:00:00Z',
      },
      {
        id: 'at-013-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-03-06T10:00:00Z',
      },
      {
        id: 'at-013-3',
        action: 'Status changed to Escalated',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-03-07T09:00:00Z',
      },
    ],
  },
  {
    id: 'rec-014',
    title: 'Cold Work Permit - Pipe Fitting',
    description:
      'Permit for pipe fitting work in cold storage area. Special PPE required for low temperature environment.',
    category: 'Permit to Work',
    type: 'Cold Work',
    status: 'Closed',
    location: { name: 'Warehouse B', area: 'Cold Storage' },
    reportedBy: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
    closedBy: { name: 'Priya Rao', role: 'Safety Officer', timestamp: '2026-01-11T16:00:00Z' },
    createdAt: '2026-01-09T06:00:00Z',
    updatedAt: '2026-01-11T16:00:00Z',
    auditTrail: [
      {
        id: 'at-014-1',
        action: 'Record created',
        actor: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
        timestamp: '2026-01-09T06:00:00Z',
      },
      {
        id: 'at-014-2',
        action: 'Status changed to Closed',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-11T16:00:00Z',
      },
    ],
  },
  {
    id: 'rec-015',
    title: 'Toolbox Talk - Emergency Procedures',
    description:
      'Safety briefing on updated emergency evacuation procedures and assembly points.',
    category: 'Toolbox Talk',
    type: 'Toolbox Talk',
    status: 'Pending',
    location: { name: 'Warehouse B' },
    reportedBy: { name: 'Anita Desai', role: 'Team Lead' },
    createdAt: '2026-03-12T07:00:00Z',
    updatedAt: '2026-03-12T07:00:00Z',
    auditTrail: [
      {
        id: 'at-015-1',
        action: 'Record created',
        actor: { name: 'Anita Desai', role: 'Team Lead' },
        timestamp: '2026-03-12T07:00:00Z',
      },
    ],
  },
  {
    id: 'rec-016',
    title: 'Safety Audit - Generator Room',
    description:
      'Comprehensive safety audit of generator room including fuel storage, ventilation, and emergency shutoffs.',
    category: 'Audit',
    type: 'Safety Audit',
    status: 'Under Review',
    location: { name: 'Generator Room' },
    reportedBy: { name: 'Priya Rao', role: 'Safety Officer' },
    owner: { name: 'Vikram Singh', role: 'HSE Manager' },
    createdAt: '2026-03-06T09:00:00Z',
    updatedAt: '2026-03-08T14:00:00Z',
    auditTrail: [
      {
        id: 'at-016-1',
        action: 'Record created',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-03-06T09:00:00Z',
      },
      {
        id: 'at-016-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-03-08T14:00:00Z',
      },
    ],
  },
  // ── Additional records for Rahul Sharma (Level 1 demo data) ──
  {
    id: 'rec-017',
    title: 'Near miss - Forklift blind spot',
    description:
      'Pedestrian nearly struck by forklift turning corner in Warehouse B. Recommending convex mirrors at blind corners.',
    category: 'Incident',
    type: 'Near Miss',
    status: 'Under Review',
    location: { name: 'Warehouse B', area: 'Aisle 4' },
    reportedBy: { name: 'Rahul Sharma', role: 'Field Worker' },
    createdAt: '2026-03-08T10:00:00Z',
    updatedAt: '2026-03-08T10:00:00Z',
    auditTrail: [
      {
        id: 'at-017-1',
        action: 'Record created',
        actor: { name: 'Rahul Sharma', role: 'Field Worker' },
        timestamp: '2026-03-08T10:00:00Z',
      },
    ],
  },
  {
    id: 'rec-018',
    title: 'First aid - Minor burn from hot surface',
    description:
      'Worker touched uninsulated pipe near boiler room. First aid applied on site. Area marked for insulation repair.',
    category: 'Incident',
    type: 'First Aid',
    status: 'Pending',
    location: { name: 'Generator Room', area: 'Boiler Section' },
    reportedBy: { name: 'Rahul Sharma', role: 'Field Worker' },
    owner: { name: 'Rahul Sharma', role: 'Field Worker' },
    createdAt: '2026-03-15T15:30:00Z',
    updatedAt: '2026-03-15T15:30:00Z',
    auditTrail: [
      {
        id: 'at-018-1',
        action: 'Record created',
        actor: { name: 'Rahul Sharma', role: 'Field Worker' },
        timestamp: '2026-03-15T15:30:00Z',
      },
    ],
  },
  {
    id: 'rec-019',
    title: 'Tool Audit - Deck B power tools',
    description:
      'Monthly inspection of power tools on Deck B. Two angle grinders need guard replacement. One drill battery recalled.',
    category: 'Audit',
    type: 'Tool Audit',
    status: 'On Hold',
    location: { name: 'Deck B', area: 'Tool Crib' },
    reportedBy: { name: 'Rahul Sharma', role: 'Field Worker' },
    owner: { name: 'Rahul Sharma', role: 'Field Worker' },
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-23T10:00:00Z',
    auditTrail: [
      {
        id: 'at-019-1',
        action: 'Record created',
        actor: { name: 'Rahul Sharma', role: 'Field Worker' },
        timestamp: '2026-01-20T08:00:00Z',
      },
      {
        id: 'at-019-2',
        action: 'Status changed to On Hold',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-23T10:00:00Z',
      },
    ],
  },
  {
    id: 'rec-020',
    title: 'Near miss - Loose scaffolding plank',
    description:
      'Scaffolding plank was not properly secured on loading dock. Discovered during routine check before shift start.',
    category: 'Incident',
    type: 'Near Miss',
    status: 'Closed',
    location: { name: 'Loading Dock', area: 'Bay 1' },
    reportedBy: { name: 'Rahul Sharma', role: 'Field Worker' },
    closedBy: { name: 'Priya Rao', role: 'Safety Officer', timestamp: '2026-01-19T14:00:00Z' },
    createdAt: '2026-01-18T07:00:00Z',
    updatedAt: '2026-01-19T14:00:00Z',
    auditTrail: [
      {
        id: 'at-020-1',
        action: 'Record created',
        actor: { name: 'Rahul Sharma', role: 'Field Worker' },
        timestamp: '2026-01-18T07:00:00Z',
      },
      {
        id: 'at-020-2',
        action: 'Status changed to Closed',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-19T14:00:00Z',
      },
    ],
  },
  {
    id: 'rec-021',
    title: 'Tool Audit - Loading dock equipment',
    description:
      'Quarterly check of pallet jacks and hand trucks. All items passed inspection.',
    category: 'Audit',
    type: 'Tool Audit',
    status: 'Closed',
    location: { name: 'Loading Dock' },
    reportedBy: { name: 'Rahul Sharma', role: 'Field Worker' },
    closedBy: { name: 'Priya Rao', role: 'Safety Officer', timestamp: '2026-01-15T16:00:00Z' },
    createdAt: '2026-01-13T09:00:00Z',
    updatedAt: '2026-01-15T16:00:00Z',
    auditTrail: [
      {
        id: 'at-021-1',
        action: 'Record created',
        actor: { name: 'Rahul Sharma', role: 'Field Worker' },
        timestamp: '2026-01-13T09:00:00Z',
      },
      {
        id: 'at-021-2',
        action: 'Status changed to Closed',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-15T16:00:00Z',
      },
    ],
  },
];

// ── Enriched task data for TaskDetailPanel ──

// HistoryRecord for each inbox task (keyed by task ID)
export const MOCK_TASK_RECORDS: Record<string, HistoryRecord> = {
  'task-1': {
    id: 'task-1',
    title: 'Short circuit in control panel',
    description: 'Electrical short circuit occurred in the main control panel during routine operations. Sparks were observed and the circuit breaker tripped automatically. Area was evacuated immediately. Electrician was called to assess damage.',
    category: 'Incident',
    type: 'FIR',
    status: 'On Hold',
    location: { name: 'Control Room', area: 'Main Panel Section' },
    reportedBy: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' },
    owner: { name: 'Priya Rao', role: 'Safety Officer' },
    createdAt: '2026-01-15T08:30:00Z',
    updatedAt: '2026-01-18T10:00:00Z',
    auditTrail: [
      { id: 'at-t1-1', action: 'Record created', actor: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' }, timestamp: '2026-01-15T08:30:00Z' },
      { id: 'at-t1-2', action: 'Status changed to Under Review', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-15T14:00:00Z' },
      { id: 'at-t1-3', action: 'Review comment added', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-16T09:00:00Z' },
      { id: 'at-t1-4', action: 'Status changed to On Hold — awaiting electrician report', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-18T10:00:00Z' },
    ],
  },
  'task-2': {
    id: 'task-2',
    title: 'Sprained ankle on slippery surface',
    description: 'Worker slipped on wet floor near Loading Dock 2 and sustained a sprained right ankle. First aid was administered on site. Worker was given ice pack and compression bandage. No further medical attention required.',
    category: 'Incident',
    type: 'First Aid',
    status: 'Under Review',
    location: { name: 'Loading Dock 2', area: 'Entrance Ramp' },
    reportedBy: { name: 'Anita Desai', role: 'Team Lead' },
    owner: { name: 'Priya Rao', role: 'Safety Officer' },
    createdAt: '2026-01-13T11:00:00Z',
    updatedAt: '2026-01-14T09:00:00Z',
    auditTrail: [
      { id: 'at-t2-1', action: 'Record created', actor: { name: 'Anita Desai', role: 'Team Lead' }, timestamp: '2026-01-13T11:00:00Z' },
      { id: 'at-t2-2', action: 'Status changed to Under Review', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-14T09:00:00Z' },
    ],
  },
  'task-3': {
    id: 'task-3',
    title: 'Monthly site safety walkthrough',
    description: 'Comprehensive monthly safety walkthrough of the full facility. Inspected fire extinguishers, emergency exits, electrical panels, ventilation systems, PPE stations, and safety signage across all areas.',
    category: 'Audit',
    type: 'Safety Audit',
    status: 'Under Review',
    location: { name: 'Full Facility' },
    reportedBy: { name: 'Karan Johar', role: 'Equipment Manager' },
    owner: { name: 'Vikram Singh', role: 'HSE Manager' },
    createdAt: '2026-01-17T09:00:00Z',
    updatedAt: '2026-01-18T11:00:00Z',
    auditTrail: [
      { id: 'at-t3-1', action: 'Record created', actor: { name: 'Karan Johar', role: 'Equipment Manager' }, timestamp: '2026-01-17T09:00:00Z' },
      { id: 'at-t3-2', action: 'Status changed to Under Review', actor: { name: 'Vikram Singh', role: 'HSE Manager' }, timestamp: '2026-01-18T11:00:00Z' },
    ],
  },
  'task-4': {
    id: 'task-4',
    title: 'Minor abrasion during cargo handling',
    description: 'Worker sustained a minor skin abrasion on left forearm while handling rough-edged cargo containers in Deck B, Sector 4. Container edges had exposed metal burrs from shipping damage.',
    category: 'Incident',
    type: 'First Aid',
    status: 'Closed',
    location: { name: 'Deck B', area: 'Sector 4' },
    reportedBy: { name: 'Rahul Sharma', role: 'Field Worker' },
    owner: { name: 'Priya Rao', role: 'Safety Officer' },
    closedBy: { name: 'Priya Rao', role: 'Safety Officer', timestamp: '2026-01-14T16:00:00Z' },
    createdAt: '2026-01-12T10:30:00Z',
    updatedAt: '2026-01-14T16:00:00Z',
    auditTrail: [
      { id: 'at-t4-1', action: 'Record created', actor: { name: 'Rahul Sharma', role: 'Field Worker' }, timestamp: '2026-01-12T10:30:00Z' },
      { id: 'at-t4-2', action: 'Status changed to Under Review', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-12T14:00:00Z' },
      { id: 'at-t4-3', action: 'Review comment added', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-13T10:00:00Z' },
      { id: 'at-t4-4', action: 'Status changed to Closed', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-14T16:00:00Z' },
    ],
  },
  'task-5': {
    id: 'task-5',
    title: 'Oil spill near fuel tank',
    description: 'Hydraulic oil leak detected near the main fuel storage tank. Approximately 5 litres of oil spilled onto the concrete pad. Spill kit deployed immediately. Area cordoned off and absorbent material applied.',
    category: 'Incident',
    type: 'FIR',
    status: 'Under Review',
    location: { name: 'Fueling Station', area: 'Tank Farm' },
    reportedBy: { name: 'Priya Rao', role: 'Safety Officer' },
    owner: { name: 'Vikram Singh', role: 'HSE Manager' },
    createdAt: '2026-01-16T07:45:00Z',
    updatedAt: '2026-01-17T09:00:00Z',
    auditTrail: [
      { id: 'at-t5-1', action: 'Record created', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-16T07:45:00Z' },
      { id: 'at-t5-2', action: 'Status changed to Under Review', actor: { name: 'Vikram Singh', role: 'HSE Manager' }, timestamp: '2026-01-17T09:00:00Z' },
    ],
  },
  'task-6': {
    id: 'task-6',
    title: 'Emergency exit inspection',
    description: 'Scheduled inspection of all emergency exits across office and warehouse buildings. Checking signage visibility, door functionality, obstruction clearance, and emergency lighting.',
    category: 'Audit',
    type: 'Safety Audit',
    status: 'Pending',
    location: { name: 'All Buildings' },
    reportedBy: { name: 'Vikram Singh', role: 'HSE Manager' },
    owner: { name: 'Priya Rao', role: 'Safety Officer' },
    createdAt: '2026-01-21T08:00:00Z',
    updatedAt: '2026-01-21T08:00:00Z',
    auditTrail: [
      { id: 'at-t6-1', action: 'Record created', actor: { name: 'Vikram Singh', role: 'HSE Manager' }, timestamp: '2026-01-21T08:00:00Z' },
      { id: 'at-t6-2', action: 'Assigned to Priya Rao', actor: { name: 'Vikram Singh', role: 'HSE Manager' }, timestamp: '2026-01-21T08:00:00Z' },
    ],
  },
  'task-7': {
    id: 'task-7',
    title: 'Electrical hazard near generator',
    description: 'Exposed wiring found near the backup generator during routine checks. Wire insulation had degraded, creating a shock hazard. Area was immediately cordoned off and generator shut down pending repairs.',
    category: 'Incident',
    type: 'Near Miss',
    status: 'On Hold',
    location: { name: 'Generator Room', area: 'Backup Unit' },
    reportedBy: { name: 'Dr. Meera Patel', role: 'Occupational Health' },
    owner: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' },
    createdAt: '2026-01-15T13:00:00Z',
    updatedAt: '2026-01-17T11:00:00Z',
    auditTrail: [
      { id: 'at-t7-1', action: 'Record created', actor: { name: 'Dr. Meera Patel', role: 'Occupational Health' }, timestamp: '2026-01-15T13:00:00Z' },
      { id: 'at-t7-2', action: 'Status changed to Under Review', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-15T16:00:00Z' },
      { id: 'at-t7-3', action: 'Review comment added', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-16T10:00:00Z' },
      { id: 'at-t7-4', action: 'Status changed to On Hold — awaiting electrician assessment', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-17T11:00:00Z' },
      { id: 'at-t7-5', action: 'Ownership assigned to Sanjay Mehta', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-17T11:00:00Z' },
    ],
  },
  'task-8': {
    id: 'task-8',
    title: 'Chemical spill cleanup',
    description: 'Chemical reagent spill in Lab 3 during transfer between containers. Approximately 2 litres of mild acidic solution spilled. Emergency spill response protocol activated. Area decontaminated within 45 minutes.',
    category: 'Incident',
    type: 'FIR',
    status: 'Closed',
    location: { name: 'Lab 3', area: 'Chemical Storage' },
    reportedBy: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
    owner: { name: 'Priya Rao', role: 'Safety Officer' },
    closedBy: { name: 'Vikram Singh', role: 'HSE Manager', timestamp: '2026-01-15T17:00:00Z' },
    createdAt: '2026-01-12T09:00:00Z',
    updatedAt: '2026-01-15T17:00:00Z',
    auditTrail: [
      { id: 'at-t8-1', action: 'Record created', actor: { name: 'Arjun Kumar', role: 'Maintenance Lead' }, timestamp: '2026-01-12T09:00:00Z' },
      { id: 'at-t8-2', action: 'Status changed to Under Review', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-12T11:00:00Z' },
      { id: 'at-t8-3', action: 'Review comment added', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-13T09:30:00Z' },
      { id: 'at-t8-4', action: 'Escalated to HSE Manager', actor: { name: 'Priya Rao', role: 'Safety Officer' }, timestamp: '2026-01-14T08:00:00Z' },
      { id: 'at-t8-5', action: 'Review comment added', actor: { name: 'Vikram Singh', role: 'HSE Manager' }, timestamp: '2026-01-15T10:00:00Z' },
      { id: 'at-t8-6', action: 'Status changed to Closed', actor: { name: 'Vikram Singh', role: 'HSE Manager' }, timestamp: '2026-01-15T17:00:00Z' },
    ],
  },
};

// Incident detail (form data) for each inbox task
export const MOCK_INCIDENT_DETAILS: Record<string, IncidentDetail> = {
  'task-1': {
    description: 'Electrical short circuit occurred in the main control panel during routine operations. Sparks were observed and the circuit breaker tripped automatically. Area was evacuated immediately.',
    immediateAction: 'Power supply to the panel was isolated. Area evacuated and cordoned off. Electrician called for emergency assessment.',
    dateOccurred: '2026-01-15',
    timeOccurred: '08:15',
    site: 'Site A - Manufacturing',
    area: 'Control Room - Main Panel Section',
    asset: 'Control Panel CP-04',
    wasInjured: true,
    injuredEmployee: 'Ravi Verma',
    bodyPart: 'Hand',
    treatment: 'Medical treatment (clinic/doctor visit)',
    contributingFactor: 'Unsafe Condition (UC)',
    contributingNotes: 'Panel wiring was overdue for inspection. Last maintenance was 8 months ago against the 6-month schedule.',
    photoCount: 3,
    attachmentCount: 1,
    correctiveAction: 'Immediate electrical panel inspection schedule review. All panels to be inspected within 2 weeks. Maintenance schedule to be updated to quarterly.',
  },
  'task-2': {
    description: 'Worker slipped on wet floor near Loading Dock 2 entrance ramp and sustained a sprained right ankle. The floor was wet due to recent rainfall and inadequate drainage near the dock entrance.',
    immediateAction: 'First aid administered on site — ice pack applied, compression bandage wrapped around ankle. Worker rested for 30 minutes before being assessed.',
    dateOccurred: '2026-01-13',
    timeOccurred: '10:45',
    site: 'Site B - Warehouse',
    area: 'Loading Dock 2 - Entrance Ramp',
    wasInjured: true,
    injuredEmployee: 'Deepak Nair',
    bodyPart: 'Ankle',
    treatment: 'First aid only',
    contributingFactor: 'Unsafe Condition (UC)',
    contributingNotes: 'Drainage grate near dock entrance was partially blocked with debris. Anti-slip mats were not in place despite wet weather protocol.',
    photoCount: 2,
    attachmentCount: 0,
    correctiveAction: 'Clear drainage grate immediately. Deploy anti-slip mats at all dock entrances during wet weather. Add wet weather protocol reminder to daily briefings.',
  },
  'task-3': {
    description: 'Comprehensive monthly safety walkthrough of the full facility. Inspected fire extinguishers, emergency exits, electrical panels, ventilation systems, PPE stations, and safety signage across all areas.',
    immediateAction: 'Noted 4 findings requiring follow-up: 2 expired fire extinguishers (Warehouse A Bay 2, Office Block Floor 2), 1 blocked emergency exit (Warehouse B south side), 1 damaged safety sign (Loading Dock 1).',
    dateOccurred: '2026-01-17',
    timeOccurred: '09:00',
    site: 'Site A - Manufacturing',
    area: 'Full Facility',
    wasInjured: false,
    contributingFactor: 'Unsafe Condition (UC)',
    contributingNotes: 'Recurring issue with fire extinguisher expiry tracking. Current paper-based system is unreliable.',
    photoCount: 8,
    attachmentCount: 2,
    correctiveAction: 'Replace expired fire extinguishers within 48 hours. Clear blocked exit immediately. Replace damaged signage. Evaluate digital tracking system for fire equipment.',
  },
  'task-4': {
    description: 'Worker sustained a minor skin abrasion on left forearm while handling rough-edged cargo containers in Deck B, Sector 4. Container edges had exposed metal burrs from shipping damage.',
    immediateAction: 'Wound cleaned with antiseptic, dressed with sterile bandage. Worker assessed and cleared to return to duties with protective arm sleeve.',
    dateOccurred: '2026-01-12',
    timeOccurred: '10:20',
    site: 'Site B - Warehouse',
    area: 'Deck B - Sector 4',
    asset: 'Cargo Container Batch #2024-1198',
    wasInjured: true,
    injuredEmployee: 'Rahul Sharma',
    bodyPart: 'Arm',
    treatment: 'First aid only',
    contributingFactor: 'Both',
    contributingNotes: 'Container had damaged edges (UC). Worker was not wearing required arm protection for handling rough cargo (UA).',
    photoCount: 1,
    attachmentCount: 0,
    correctiveAction: 'Inspect all incoming containers for sharp edges before unloading. Reinforce PPE requirements for cargo handling — arm protection mandatory.',
  },
  'task-5': {
    description: 'Hydraulic oil leak detected near the main fuel storage tank at the fueling station. Approximately 5 litres of oil spilled onto the concrete pad. The leak originated from a cracked hydraulic line on the fuel transfer pump.',
    immediateAction: 'Spill kit deployed immediately. Area cordoned off with hazard tape. Absorbent material applied to contain spread. Fuel transfer operations suspended pending repair.',
    dateOccurred: '2026-01-16',
    timeOccurred: '07:30',
    site: 'Site A - Manufacturing',
    area: 'Fueling Station - Tank Farm',
    asset: 'Fuel Transfer Pump FTP-02',
    wasInjured: false,
    contributingFactor: 'Unsafe Condition (UC)',
    contributingNotes: 'Hydraulic line had visible wear but was not flagged during last monthly equipment inspection. Inspection checklist did not include hydraulic line condition.',
    photoCount: 5,
    attachmentCount: 1,
    correctiveAction: 'Replace all hydraulic lines on fuel transfer pumps. Update monthly inspection checklist to include hydraulic line condition assessment. Schedule environmental impact assessment.',
  },
  'task-6': {
    description: 'Scheduled inspection of all emergency exits across office and warehouse buildings. Checking signage visibility, door functionality, obstruction clearance, and emergency lighting.',
    immediateAction: 'Inspection schedule prepared and communicated to all building managers. Checklist distributed.',
    dateOccurred: '2026-01-21',
    timeOccurred: '09:00',
    site: 'Site A - Manufacturing',
    area: 'All Buildings',
    wasInjured: false,
    photoCount: 0,
    attachmentCount: 1,
    correctiveAction: 'Complete inspection of all emergency exits and compile findings report within 5 working days.',
  },
  'task-7': {
    description: 'Exposed wiring found near the backup generator during routine checks. Wire insulation had degraded due to heat exposure, creating a potential shock hazard. No one was injured but the risk of electrocution was significant.',
    immediateAction: 'Area immediately cordoned off. Generator shut down and locked out. Warning signs posted. Electrician contacted for emergency assessment.',
    dateOccurred: '2026-01-15',
    timeOccurred: '13:00',
    site: 'Site A - Manufacturing',
    area: 'Generator Room - Backup Unit',
    asset: 'Backup Generator BG-01',
    wasInjured: false,
    contributingFactor: 'Unsafe Condition (UC)',
    contributingNotes: 'Generator is located in a high-temperature area. Wire insulation rating may not be adequate for the ambient temperature. Last electrical inspection was 4 months ago.',
    photoCount: 4,
    attachmentCount: 0,
    correctiveAction: 'Rewire backup generator with high-temperature rated insulation. Review all electrical installations in high-heat areas. Add temperature-rated insulation check to inspection protocol.',
  },
  'task-8': {
    description: 'Chemical reagent spill in Lab 3 during transfer between containers. Approximately 2 litres of mild acidic solution (pH 3.5 dilute hydrochloric acid) spilled onto the lab bench and floor.',
    immediateAction: 'Emergency spill response protocol activated. Neutralizing agent applied. Area ventilated. Spill contained and decontaminated within 45 minutes. All personnel evacuated during cleanup.',
    dateOccurred: '2026-01-12',
    timeOccurred: '08:45',
    site: 'Site A - Manufacturing',
    area: 'Lab 3 - Chemical Storage',
    asset: 'Chemical Transfer Station CTS-02',
    wasInjured: false,
    contributingFactor: 'Both',
    contributingNotes: 'Transfer funnel was cracked (UC) and worker attempted transfer without secondary containment tray (UA). Transfer procedure was not followed as documented.',
    photoCount: 3,
    attachmentCount: 2,
    correctiveAction: 'Replace all cracked transfer equipment immediately. Retrain all lab staff on chemical transfer procedures. Install secondary containment trays at all transfer stations. Add pre-transfer equipment check to procedure.',
  },
};

// Review comments for inbox tasks (from L2/L3 reviewers)
export const MOCK_REVIEW_COMMENTS: Record<string, ReviewComment[]> = {
  'task-1': [
    {
      id: 'rc-t1-1',
      author: { name: 'Priya Rao', role: 'Safety Officer' },
      text: 'Reviewed the incident details. The control panel wiring maintenance schedule was clearly overdue. Requesting electrician\'s full assessment report before proceeding.',
      timestamp: '2026-01-16T09:00:00Z',
    },
    {
      id: 'rc-t1-2',
      author: { name: 'Priya Rao', role: 'Safety Officer' },
      text: 'Putting on hold until we receive the electrician\'s detailed assessment. The injured worker (Ravi Verma) has been seen at the clinic — minor burn, cleared to return in 3 days.',
      timestamp: '2026-01-18T10:00:00Z',
    },
  ],
  'task-2': [],
  'task-3': [],
  'task-4': [
    {
      id: 'rc-t4-1',
      author: { name: 'Priya Rao', role: 'Safety Officer' },
      text: 'Confirmed the container batch had shipping damage. PPE compliance issue noted — Rahul was not wearing the required arm protection. Added to the next safety briefing agenda.',
      timestamp: '2026-01-13T10:00:00Z',
    },
    {
      id: 'rc-t4-2',
      author: { name: 'Priya Rao', role: 'Safety Officer' },
      text: 'Corrective actions completed: container inspection process updated, PPE requirements reinforced in team briefing. Closing this record.',
      timestamp: '2026-01-14T16:00:00Z',
    },
  ],
  'task-5': [],
  'task-6': [],
  'task-7': [
    {
      id: 'rc-t7-1',
      author: { name: 'Priya Rao', role: 'Safety Officer' },
      text: 'High-risk finding. The degraded insulation near the backup generator is a significant shock hazard. Prioritising electrician assessment. Generator must remain locked out until repairs are complete.',
      timestamp: '2026-01-16T10:00:00Z',
    },
  ],
  'task-8': [
    {
      id: 'rc-t8-1',
      author: { name: 'Priya Rao', role: 'Safety Officer' },
      text: 'Chemical spill protocol was followed correctly. However, the root cause (cracked funnel + missing containment tray) indicates a procedural gap. Escalating to HSE Manager for review.',
      timestamp: '2026-01-13T09:30:00Z',
    },
    {
      id: 'rc-t8-2',
      author: { name: 'Vikram Singh', role: 'HSE Manager' },
      text: 'Reviewed. The procedural gaps are concerning. All corrective actions must be completed within 1 week. I\'ve approved the equipment replacement order. Closing with mandatory follow-up audit in 30 days.',
      timestamp: '2026-01-15T10:00:00Z',
    },
  ],
};

// Helper: get enriched task data for the detail panel
export interface EnrichedTaskData {
  task: Task;
  record: HistoryRecord;
  incidentDetail: IncidentDetail;
  reviewComments: ReviewComment[];
}

export function getEnrichedTask(taskId: string): EnrichedTaskData | null {
  const task = MOCK_TASKS.find(t => t.id === taskId);
  const record = MOCK_TASK_RECORDS[taskId];
  const incidentDetail = MOCK_INCIDENT_DETAILS[taskId];

  if (!task || !record || !incidentDetail) return null;

  return {
    task,
    record,
    incidentDetail,
    reviewComments: MOCK_REVIEW_COMMENTS[taskId] || [],
  };
}
