import type { IconName } from '@/components/ui/Icon';
import type { BadgeColor } from '@/components/ui/Badge';

// Record Categories (high-level groupings)
export type RecordCategory =
    | 'Incident'
    | 'Audit'
    | 'Compliance'
    | 'Permit to Work'
    | 'Toolbox Talk';

// Record Subtypes mapped to categories
export const RECORD_SUBTYPES: Record<RecordCategory, string[]> = {
    Incident: ['Near Miss', 'First Aid', 'FIR'],
    Audit: ['Safety Audit', 'Tool Audit'],
    Compliance: ['Meetings', 'Health Check', 'Audit'],
    'Permit to Work': ['General Work', 'Cold Work', 'Hot Work', 'Height Work'],
    'Toolbox Talk': ['Toolbox Talk'],
};

// All subtypes flattened
export const ALL_SUBTYPES = Object.values(RECORD_SUBTYPES).flat();

// Record status values
export type RecordStatus =
    | 'Draft'
    | 'Submitted'
    | 'Under Review'
    | 'Action Required'
    | 'Closed'
    | 'Escalated';

export const RECORD_STATUSES: RecordStatus[] = [
    'Draft',
    'Submitted',
    'Under Review',
    'Action Required',
    'Closed',
    'Escalated',
];

// Map status to badge color
export const STATUS_BADGE_COLORS: Record<RecordStatus, BadgeColor> = {
    Draft: 'neutral',
    Submitted: 'information',
    'Under Review': 'notice',
    'Action Required': 'negative',
    Closed: 'positive',
    Escalated: 'negative',
};

// Map category to icon
export const CATEGORY_ICONS: Record<RecordCategory, IconName> = {
    Incident: 'alert',
    Audit: 'survey',
    Compliance: 'check',
    'Permit to Work': 'file',
    'Toolbox Talk': 'inbox',
};

// Person reference
export interface PersonRef {
    name: string;
    role: string;
}

// Location reference
export interface LocationRef {
    name: string;
    area?: string;
}

// Audit trail entry
export interface AuditTrailEntry {
    id: string;
    action: string;
    actor: PersonRef;
    timestamp: string; // ISO date string
}

// Main history record interface
export interface HistoryRecord {
    id: string;
    title: string;
    description: string;
    category: RecordCategory;
    type: string; // subtype (Near Miss, First Aid, etc.)
    status: RecordStatus;
    location: LocationRef;
    reportedBy: PersonRef;
    owner?: PersonRef;
    closedBy?: PersonRef & { timestamp: string };
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    auditTrail: AuditTrailEntry[];
}

// Filter state for History page
export interface HistoryFilterState {
    search: string;
    types: string[];
    statuses: RecordStatus[];
    location: string | null;
    dateRange: string | null;
    // Advanced filters
    reportedBy: string | null;
    owner: string | null;
    closedBy: string | null;
    severity: string | null;
    slaBreached: boolean | null;
    recordId: string;
}

// Initial/default filter state
export const DEFAULT_FILTER_STATE: HistoryFilterState = {
    search: '',
    types: [],
    statuses: [],
    location: null,
    dateRange: null,
    reportedBy: null,
    owner: null,
    closedBy: null,
    severity: null,
    slaBreached: null,
    recordId: '',
};

// Sort configuration
export type SortColumn = 'title' | 'type' | 'status' | 'location' | 'owner' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
    column: SortColumn;
    direction: SortDirection;
}

// Tab configuration for segmented tabs
export interface TabConfig {
    id: string;
    label: string;
    category?: RecordCategory; // undefined for "All" tab
}

export const HISTORY_TABS: TabConfig[] = [
    { id: 'all', label: 'All' },
    { id: 'incident', label: 'Incident', category: 'Incident' },
    { id: 'audit', label: 'Audit', category: 'Audit' },
    { id: 'compliance', label: 'Compliance', category: 'Compliance' },
    { id: 'toolbox-talk', label: 'Toolbox Talk', category: 'Toolbox Talk' },
    { id: 'permit', label: 'Permit to Work', category: 'Permit to Work' },
];
