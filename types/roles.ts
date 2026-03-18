/**
 * Role-Based Access Control types and definitions for S-Drone prototype.
 * Three role levels control what actions users can perform.
 */

export type RoleLevel = 1 | 2 | 3;

export interface RolePermissions {
    /** Can submit Near Miss and First Aid incidents */
    canSubmitIncident: boolean;
    /** Can submit FIR and ADR incidents (requires Level 2+) */
    canSubmitAllIncidents: boolean;
    /** Can submit audits (Safety Audit, Tool Audit) */
    canSubmitAudit: boolean;
    /** Can submit compliance reports (Meetings, Health Check, Audit) */
    canSubmitCompliance: boolean;
    /** Can submit Permit to Work types */
    canSubmitPermit: boolean;
    /** Can submit Toolbox Talk */
    canSubmitToolboxTalk: boolean;
    /** Can assign records to others */
    canAssign: boolean;
    /** Can review records */
    canReview: boolean;
    /** Can close records */
    canClose: boolean;
    /** Can escalate records to Level 3 management */
    canEscalate: boolean;
}

export interface RoleDefinition {
    level: RoleLevel;
    id: string;
    label: string;
    title: string;
    userName: string;
    userEmail: string;
    description: string;
    permissions: RolePermissions;
}

export const ROLE_DEFINITIONS: Record<RoleLevel, RoleDefinition> = {
    1: {
        level: 1,
        id: 'field-worker',
        label: 'Level 1',
        title: 'Field Worker',
        userName: 'Rahul Sharma',
        userEmail: 'rahul@sdrone.com',
        description: 'Can submit limited report types',
        permissions: {
            canSubmitIncident: true,
            canSubmitAllIncidents: false,
            canSubmitAudit: true,
            canSubmitCompliance: false,
            canSubmitPermit: false,
            canSubmitToolboxTalk: false,
            canAssign: false,
            canReview: false,
            canClose: false,
            canEscalate: false,
        },
    },
    2: {
        level: 2,
        id: 'safety-officer',
        label: 'Level 2',
        title: 'Safety Officer',
        userName: 'Priya Rao',
        userEmail: 'priya@sdrone.com',
        description: 'Can submit, assign, review, close, and escalate reports',
        permissions: {
            canSubmitIncident: true,
            canSubmitAllIncidents: true,
            canSubmitAudit: true,
            canSubmitCompliance: true,
            canSubmitPermit: true,
            canSubmitToolboxTalk: true,
            canAssign: true,
            canReview: true,
            canClose: true,
            canEscalate: true,
        },
    },
    3: {
        level: 3,
        id: 'hse-manager',
        label: 'Level 3',
        title: 'HSE Manager',
        userName: 'Vikram Singh',
        userEmail: 'vikram@sdrone.com',
        description: 'Can submit, assign, review, and close all reports',
        permissions: {
            canSubmitIncident: true,
            canSubmitAllIncidents: true,
            canSubmitAudit: true,
            canSubmitCompliance: true,
            canSubmitPermit: true,
            canSubmitToolboxTalk: true,
            canAssign: true,
            canReview: true,
            canClose: true,
            canEscalate: false,
        },
    },
};

/** Map email addresses to role levels for login lookup */
export const EMAIL_TO_ROLE: Record<string, RoleLevel> = {
    'rahul@sdrone.com': 1,
    'priya@sdrone.com': 2,
    'vikram@sdrone.com': 3,
};

/** Default role level when email doesn't match */
export const DEFAULT_ROLE_LEVEL: RoleLevel = 2;
