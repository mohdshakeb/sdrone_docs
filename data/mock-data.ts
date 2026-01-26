import type { IconName } from '@/components/ui/Icon';
import type { BadgeColor } from '@/components/ui/Badge';
import type { DropdownItem } from '@/components/ui/Dropdown';

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
