'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { RoleDefinition, RoleLevel } from '@/types/roles';
import { ROLE_DEFINITIONS, DEFAULT_ROLE_LEVEL } from '@/types/roles';

interface RoleContextType {
    role: RoleDefinition;
    setRoleLevel: (level: RoleLevel) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = 'sdrone-role';

export function RoleProvider({ children }: { children: React.ReactNode }) {
    const [roleLevel, setRoleLevelState] = useState<RoleLevel>(DEFAULT_ROLE_LEVEL);

    // Read role from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = Number(stored) as RoleLevel;
            if (parsed === 1 || parsed === 2 || parsed === 3) {
                setRoleLevelState(parsed);
            }
        }
    }, []);

    const setRoleLevel = useCallback((level: RoleLevel) => {
        setRoleLevelState(level);
        localStorage.setItem(STORAGE_KEY, String(level));
    }, []);

    const role = ROLE_DEFINITIONS[roleLevel];

    return (
        <RoleContext.Provider value={{ role, setRoleLevel }}>
            {children}
        </RoleContext.Provider>
    );
}

export function useRole() {
    const context = useContext(RoleContext);
    if (context === undefined) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}

/** Safe version that returns null when outside a RoleProvider (e.g., docs layout) */
export function useOptionalRole() {
    return useContext(RoleContext) ?? null;
}
