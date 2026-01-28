'use client';

import React from 'react';
import styles from './SegmentedTabs.module.css';

export interface TabItem {
    id: string;
    label: string;
}

export interface SegmentedTabsProps {
    /** Array of tab items to display */
    tabs: TabItem[];
    /** Currently active tab ID */
    activeTab: string;
    /** Callback when tab is changed */
    onChange: (tabId: string) => void;
}

/**
 * SegmentedTabs - Horizontal tab bar for filtering content by category
 * Used for type filtering in History page
 */
export const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
    tabs,
    activeTab,
    onChange,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(tabId);
        }
    };

    return (
        <div className={styles.container} role="tablist" aria-label="Filter by type">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={isActive}
                        className={`${styles.tab} ${isActive ? styles.tabActive : ''} text-body`}
                        onClick={() => onChange(tab.id)}
                        onKeyDown={(e) => handleKeyDown(e, tab.id)}
                        tabIndex={isActive ? 0 : -1}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default SegmentedTabs;
