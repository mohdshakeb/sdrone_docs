import type { IconName } from '@/components/ui/Icon';
import type { BadgeColor } from '@/components/ui/Badge';
import type { DropdownItem } from '@/components/ui/Dropdown';
import type { HistoryRecord } from '@/types/history';

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

// Report type dropdown items
export const REPORT_TYPE_ITEMS: DropdownItem[] = [
  { type: 'header', label: 'Incidents' },
  { type: 'icon', value: 'first-aid', label: 'First Aid', icon: 'first-aid' },
  { type: 'icon', value: 'first-incident', label: 'First incident report', icon: 'fire' },
  { type: 'icon', value: 'accident-detail', label: 'Accident detail report', icon: 'sos' },
  { type: 'icon', value: 'near-miss', label: 'Near miss', icon: 'alert' },
  { type: 'divider' },
  { type: 'header', label: 'Audits' },
  { type: 'icon', value: 'tool-audit', label: 'Tool audit', icon: 'settings' },
  { type: 'icon', value: 'safety-audit', label: 'Safety audit', icon: 'survey' },
];

// Status dropdown options
export const STATUS_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'awaiting-review', label: 'Awaiting Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'scheduled', label: 'Scheduled' },
];

// Mock tasks data
export const MOCK_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Short circuit in control panel',
    subtitle: 'First incident report',
    status: 'Critical',
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
    status: 'Awaiting Review',
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
    status: 'In Progress',
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
    status: 'Completed',
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
    status: 'Awaiting Review',
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
    status: 'Scheduled',
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
    status: 'Critical',
    reportedBy: 'Meera Patel',
    reportedOn: 'Thu, 15 Jan',
    location: 'Generator Room',
    iconName: 'alert',
    badgeColor: 'negative',
  },
  {
    id: 'task-8',
    title: 'Chemical spill cleanup',
    subtitle: 'First incident report',
    status: 'Completed',
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
    createdAt: '2026-01-22T08:45:00Z',
    updatedAt: '2026-01-24T10:00:00Z',
    auditTrail: [
      {
        id: 'at-003-1',
        action: 'Record created',
        actor: { name: 'Rahul Sharma', role: 'Shift Manager' },
        timestamp: '2026-01-22T08:45:00Z',
      },
      {
        id: 'at-003-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-22T14:00:00Z',
      },
      {
        id: 'at-003-3',
        action: 'Ownership assigned to Vikram Singh',
        actor: { name: 'System', role: 'Automated' },
        timestamp: '2026-01-22T14:00:00Z',
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
    status: 'Action Required',
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
        action: 'Status changed to Action Required',
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
        action: 'Status changed to Submitted',
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
    createdAt: '2026-01-24T08:00:00Z',
    updatedAt: '2026-01-24T10:00:00Z',
    auditTrail: [
      {
        id: 'at-009-1',
        action: 'Record created',
        actor: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' },
        timestamp: '2026-01-24T08:00:00Z',
      },
      {
        id: 'at-009-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-24T10:00:00Z',
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
    status: 'Action Required',
    location: { name: 'Loading Dock', area: 'Bay 3' },
    reportedBy: { name: 'Rahul Sharma', role: 'Shift Manager' },
    owner: { name: 'Sanjay Mehta', role: 'Warehouse Supervisor' },
    createdAt: '2026-01-23T14:00:00Z',
    updatedAt: '2026-01-25T09:00:00Z',
    auditTrail: [
      {
        id: 'at-011-1',
        action: 'Record created',
        actor: { name: 'Rahul Sharma', role: 'Shift Manager' },
        timestamp: '2026-01-23T14:00:00Z',
      },
      {
        id: 'at-011-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-24T08:00:00Z',
      },
      {
        id: 'at-011-3',
        action: 'Status changed to Action Required',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-25T09:00:00Z',
      },
      {
        id: 'at-011-4',
        action: 'Ownership assigned to Sanjay Mehta',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-25T09:00:00Z',
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
    status: 'Submitted',
    location: { name: 'Generator Room' },
    reportedBy: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
    createdAt: '2026-01-26T07:00:00Z',
    updatedAt: '2026-01-26T07:00:00Z',
    auditTrail: [
      {
        id: 'at-012-1',
        action: 'Record created',
        actor: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
        timestamp: '2026-01-26T07:00:00Z',
      },
      {
        id: 'at-012-2',
        action: 'Status changed to Submitted',
        actor: { name: 'Arjun Kumar', role: 'Maintenance Lead' },
        timestamp: '2026-01-26T07:00:00Z',
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
    createdAt: '2026-01-05T09:00:00Z',
    updatedAt: '2026-01-15T11:00:00Z',
    auditTrail: [
      {
        id: 'at-013-1',
        action: 'Record created',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-05T09:00:00Z',
      },
      {
        id: 'at-013-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-07T10:00:00Z',
      },
      {
        id: 'at-013-3',
        action: 'Status changed to Escalated',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-15T11:00:00Z',
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
    status: 'Draft',
    location: { name: 'Warehouse B' },
    reportedBy: { name: 'Anita Desai', role: 'Team Lead' },
    createdAt: '2026-01-27T07:00:00Z',
    updatedAt: '2026-01-27T07:00:00Z',
    auditTrail: [
      {
        id: 'at-015-1',
        action: 'Record created',
        actor: { name: 'Anita Desai', role: 'Team Lead' },
        timestamp: '2026-01-27T07:00:00Z',
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
    createdAt: '2026-01-25T09:00:00Z',
    updatedAt: '2026-01-26T14:00:00Z',
    auditTrail: [
      {
        id: 'at-016-1',
        action: 'Record created',
        actor: { name: 'Priya Rao', role: 'Safety Officer' },
        timestamp: '2026-01-25T09:00:00Z',
      },
      {
        id: 'at-016-2',
        action: 'Status changed to Under Review',
        actor: { name: 'Vikram Singh', role: 'HSE Manager' },
        timestamp: '2026-01-26T14:00:00Z',
      },
    ],
  },
];
