/**
 * Role-based data filtering utilities.
 *
 * Used across Dashboard, Inbox, and History pages to filter
 * tasks, records, report types, and tabs based on the active role.
 */

import type { RoleLevel, RoleDefinition } from '@/types/roles';
import type { HistoryRecord, RecordCategory, TabConfig } from '@/types/history';
import type { Task } from '@/data/mock-data';
import type { DropdownItem } from '@/components/ui/Dropdown';
import { HISTORY_TABS } from '@/types/history';
import { L1_HIDDEN_INBOX_STATUSES, L1_HIDDEN_HISTORY_STATUSES } from '@/types/status';

// ── Report type visibility ─────────────────────────────────────

/** Categories visible to Level 1 */
const L1_VISIBLE_CATEGORIES: RecordCategory[] = ['Incident', 'Audit'];

/** Inbox task subtypes visible to Level 1 (lowercase for matching) */
const L1_VISIBLE_TASK_SUBTYPES = [
    'near miss',
    'first aid',
    'tool audit',
];

/** Report type dropdown values visible to Level 1 */
const L1_VISIBLE_REPORT_VALUES = new Set([
    'near-miss',
    'first-aid',
    'tool-audit',
]);

/** Categories visible per role level */
export function getVisibleCategories(roleLevel: RoleLevel): RecordCategory[] {
    if (roleLevel === 1) return L1_VISIBLE_CATEGORIES;
    return ['Incident', 'Audit', 'Compliance', 'Permit to Work', 'Toolbox Talk'];
}

// ── Task filtering (Inbox) ─────────────────────────────────────

/** Filter MOCK_TASKS based on role */
export function getVisibleTasks(tasks: Task[], role: RoleDefinition): Task[] {
    if (role.level === 1) {
        return tasks.filter(task => {
            // Filter by visible subtypes
            const subtitleLower = task.subtitle.toLowerCase();
            const isVisibleType = L1_VISIBLE_TASK_SUBTYPES.some(s => subtitleLower.includes(s));
            // Hide statuses not visible to L1
            const isVisibleStatus = !L1_HIDDEN_INBOX_STATUSES.includes(task.status);
            return isVisibleType && isVisibleStatus;
        });
    }
    // Level 2 & 3 see all tasks
    return tasks;
}

// ── Record filtering (History & Dashboard) ─────────────────────

/** Filter MOCK_HISTORY_RECORDS based on role */
export function getVisibleRecords(records: HistoryRecord[], role: RoleDefinition): HistoryRecord[] {
    if (role.level === 1) {
        return records.filter(r => {
            // Only own reports
            const isOwnReport = r.reportedBy.name === role.userName;
            // Only visible categories
            const isVisibleCategory = L1_VISIBLE_CATEGORIES.includes(r.category);
            // Hide escalated records
            const isVisibleStatus = !L1_HIDDEN_HISTORY_STATUSES.includes(r.status);
            return isOwnReport && isVisibleCategory && isVisibleStatus;
        });
    }
    // Level 2 & 3 see all records
    return records;
}

// ── Report type dropdown items ─────────────────────────────────

/** Filter report type dropdown items for role */
export function getVisibleReportTypeItems(items: DropdownItem[], roleLevel: RoleLevel): DropdownItem[] {
    if (roleLevel !== 1) return items;

    // For Level 1: keep only Near Miss, First Aid, Tool Audit
    // Group items by section, then only include sections with visible items
    const sections: { header: DropdownItem | null; items: DropdownItem[] }[] = [];
    let current: { header: DropdownItem | null; items: DropdownItem[] } = { header: null, items: [] };

    for (const item of items) {
        if (item.type === 'header') {
            sections.push(current);
            current = { header: item, items: [] };
        } else if (item.type === 'divider') {
            continue;
        } else if ((item.type === 'icon' || item.type === 'text') && item.value && L1_VISIBLE_REPORT_VALUES.has(item.value)) {
            current.items.push(item);
        }
    }
    sections.push(current);

    // Build result from sections that have visible items
    const result: DropdownItem[] = [];
    for (const section of sections) {
        if (section.items.length === 0) continue;
        if (result.length > 0) result.push({ type: 'divider' });
        if (section.header) result.push(section.header);
        result.push(...section.items);
    }

    return result;
}

// ── History tabs ───────────────────────────────────────────────

/** Get visible history tabs for role */
export function getVisibleHistoryTabs(roleLevel: RoleLevel): TabConfig[] {
    if (roleLevel === 1) {
        return HISTORY_TABS.filter(tab =>
            tab.id === 'all' || tab.category === 'Incident' || tab.category === 'Audit'
        );
    }
    return HISTORY_TABS;
}

// ── Advanced filters visibility ────────────────────────────────

export interface AdvancedFilterVisibility {
    reportedBy: boolean;
    owner: boolean;
    closedBy: boolean;
    severity: boolean;
    slaBreached: boolean;
    recordId: boolean;
}

/** Get which advanced filter fields to show per role */
export function getAdvancedFilterVisibility(roleLevel: RoleLevel): AdvancedFilterVisibility {
    if (roleLevel === 1) {
        return {
            reportedBy: false,
            owner: false,
            closedBy: false,
            severity: false,
            slaBreached: false,
            recordId: true,
        };
    }
    if (roleLevel === 2) {
        return {
            reportedBy: true,
            owner: true,
            closedBy: false,
            severity: true,
            slaBreached: true,
            recordId: true,
        };
    }
    // Level 3: all filters
    return {
        reportedBy: true,
        owner: true,
        closedBy: true,
        severity: true,
        slaBreached: true,
        recordId: true,
    };
}
