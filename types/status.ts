/**
 * Status display utilities.
 *
 * The system has 5 canonical statuses. Display labels are contextual:
 * - Attention labels (Overdue, Updated) replace status when more critical
 * - Contextual labels (Assigned to you, Awaiting Review) replace status
 *   based on the viewer's relationship to the record
 * - Otherwise the canonical status name is shown
 */

import type { RoleLevel } from '@/types/roles';
import type { RecordStatus } from '@/types/history';
import type { BadgeColor } from '@/components/ui/Badge';

// ── Display label types ─────────────────────────────────────────

export type DisplayLabel =
    | 'Assigned to you'
    | 'Awaiting Review'
    | 'Overdue'
    | 'Updated'
    | RecordStatus;

export interface DisplayLabelInfo {
    label: DisplayLabel;
    color: BadgeColor;
}

// ── Badge colors ────────────────────────────────────────────────

/** Get badge color for a canonical status */
export function getStatusBadgeColor(status: RecordStatus): BadgeColor {
    const colorMap: Record<RecordStatus, BadgeColor> = {
        'Pending': 'neutral',
        'Under Review': 'notice',
        'On Hold': 'negative',
        'Escalated': 'negative',
        'Closed': 'positive',
    };
    return colorMap[status] ?? 'neutral';
}

// ── Contextual display label ────────────────────────────────────

/** Display label color for contextual/attention labels */
const DISPLAY_LABEL_COLORS: Record<string, BadgeColor> = {
    'Overdue': 'negative',
    'Updated': 'neutral',
    'Assigned to you': 'notice',
    'Awaiting Review': 'information',
};

/**
 * Get the best display label for a record/task based on context.
 *
 * Priority stack (highest wins):
 * 1. Overdue — if record open > 14 days
 * 2. Updated — if content changed since viewer last looked
 * 3. Assigned to you — replaces Pending for the assignee
 *    Awaiting Review — replaces Under Review for the reviewer
 * 4. Canonical status name — fallback
 */
export function getDisplayLabel(
    status: RecordStatus | string,
    context: {
        isAssignee?: boolean;
        isReviewer?: boolean;
        recordAgeDays?: number;
        isUpdated?: boolean;
    } = {},
): DisplayLabelInfo {
    const { isAssignee, isReviewer, recordAgeDays, isUpdated } = context;
    const isActive = status !== 'Closed';

    // Priority 1: Overdue
    if (isActive && recordAgeDays !== undefined && recordAgeDays > 14) {
        return { label: 'Overdue', color: DISPLAY_LABEL_COLORS['Overdue'] };
    }

    // Priority 2: Updated
    if (isActive && isUpdated) {
        return { label: 'Updated', color: DISPLAY_LABEL_COLORS['Updated'] };
    }

    // Priority 3: Contextual labels
    if (status === 'Pending' && isAssignee) {
        return { label: 'Assigned to you', color: DISPLAY_LABEL_COLORS['Assigned to you'] };
    }
    if (status === 'Under Review' && isReviewer) {
        return { label: 'Awaiting Review', color: DISPLAY_LABEL_COLORS['Awaiting Review'] };
    }

    // Priority 4: Canonical status
    return { label: status as RecordStatus, color: getStatusBadgeColor(status as RecordStatus) };
}

// ── Status label helpers (simplified — no per-role mapping) ─────

/** Get status label for inbox tasks. Returns canonical name (no mapping). */
export function getInboxStatusLabel(status: string, _roleLevel: RoleLevel): string {
    return status;
}

/** Get status label for history records. Returns canonical name (no mapping). */
export function getHistoryStatusLabel(status: RecordStatus, _roleLevel: RoleLevel): string {
    return status;
}

// ── Filter options ──────────────────────────────────────────────

/** Get inbox status filter options. Same for all roles (L1 hides via visibility rules). */
export function getInboxStatusOptions(_roleLevel: RoleLevel): { value: string; label: string }[] {
    return [
        { value: 'pending', label: 'Pending' },
        { value: 'under-review', label: 'Under Review' },
        { value: 'on-hold', label: 'On Hold' },
        { value: 'closed', label: 'Closed' },
    ];
}

/** Get history status filter options per role. */
export function getHistoryStatusOptions(roleLevel: RoleLevel): { value: RecordStatus; label: string }[] {
    const options: { value: RecordStatus; label: string }[] = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Under Review', label: 'Under Review' },
        { value: 'On Hold', label: 'On Hold' },
        { value: 'Closed', label: 'Closed' },
    ];
    // L2/L3 also see Escalated
    if (roleLevel >= 2) {
        options.splice(3, 0, { value: 'Escalated', label: 'Escalated' });
    }
    return options;
}

// ── Visibility rules ────────────────────────────────────────────

/** Statuses hidden from Level 1 in inbox tasks */
export const L1_HIDDEN_INBOX_STATUSES: string[] = [];

/** Statuses hidden from Level 1 in history records */
export const L1_HIDDEN_HISTORY_STATUSES: RecordStatus[] = ['Escalated'];
