'use client';

import React, { useState } from 'react';
import TaskCard from '@/components/prototype/TaskCard';
import FilterChip from '@/components/ui/FilterChip';
import type { IconName } from '@/components/ui/Icon';
import type { BadgeColor } from '@/components/ui/Badge';

interface Task {
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

const TASKS: Task[] = [
    {
        id: 'task-1',
        title: "Short circuit in control panel",
        subtitle: "First incident report",
        status: "Critical",
        reportedBy: "Sanjay Mehta",
        reportedOn: "Thu, 15 Jan",
        location: "Control Room",
        iconName: "fire",
        badgeColor: "negative"
    },
    {
        id: 'task-2',
        title: "Sprained ankle on slippery surface",
        subtitle: "First Aid",
        status: "Awaiting Review",
        reportedBy: "Anita Desai",
        reportedOn: "Tue, 13 Jan",
        location: "Loading Dock 2",
        iconName: "first-aid",
        badgeColor: "notice"
    },
    {
        id: 'task-3',
        title: "Monthly site safety walkthrough",
        subtitle: "Safety audit",
        status: "In Progress",
        reportedBy: "Karan Johar",
        reportedOn: "Sat, 17 Jan",
        location: "Full Facility",
        iconName: "survey",
        badgeColor: "information"
    },
    {
        id: 'task-4',
        title: "Minor abrasion during cargo handling",
        subtitle: "First Aid",
        status: "Completed",
        reportedBy: "Rahul Sharma",
        reportedOn: "Mon, 12 Jan",
        location: "Deck B, Sector 4",
        iconName: "first-aid",
        badgeColor: "positive"
    },
    {
        id: 'task-5',
        title: "Oil spill near fuel tank",
        subtitle: "First incident report",
        status: "Awaiting Review",
        reportedBy: "Priya Rao",
        reportedOn: "Fri, 16 Jan",
        location: "Fueling Station",
        iconName: "fire",
        badgeColor: "notice"
    },
    {
        id: 'task-6',
        title: "Emergency exit inspection",
        subtitle: "Safety audit",
        status: "Awaiting Review",
        reportedBy: "Meera Nair",
        reportedOn: "Sun, 18 Jan",
        location: "Sector 1 & 2",
        iconName: "survey",
        badgeColor: "notice"
    },
    {
        id: 'task-7',
        title: "Finger cut from sharp edge",
        subtitle: "First Aid",
        status: "In Progress",
        reportedBy: "Brijesh Kumar",
        reportedOn: "Wed, 14 Jan",
        location: "Maintenance Bay",
        iconName: "first-aid",
        badgeColor: "information"
    },
    {
        id: 'task-8',
        title: "Power tools calibration check",
        subtitle: "Tool audit",
        status: "Scheduled",
        reportedBy: "Arjun Kapoor",
        reportedOn: "Mon, 19 Jan",
        location: "Workshop",
        iconName: "survey",
        badgeColor: "neutral"
    },
    {
        id: 'task-9',
        title: "Head injury during maintenance work",
        subtitle: "First incident report",
        status: "Awaiting Review",
        reportedBy: "Brijesh Kumar",
        reportedOn: "Thu, 8 Jan",
        location: "Site 3, Zone 5",
        iconName: "fire",
        badgeColor: "notice"
    },
    {
        id: 'task-10',
        title: "Eye irritation from dust",
        subtitle: "First Aid",
        status: "Awaiting Review",
        reportedBy: "Vikram Singh",
        reportedOn: "Wed, 14 Jan",
        location: "Site 3, Zone 5",
        iconName: "first-aid",
        badgeColor: "notice"
    }
];

export default function InboxPage() {
    const [reportType, setReportType] = useState<string | null>(null);
    const [isStatusActive, setIsStatusActive] = useState(true);
    const [statusCount] = useState(2);

    return (
        <div>
            {/* Filters - Sticky below header (64px) */}
            <div style={{
                position: 'sticky',
                top: '64px',
                zIndex: 4,
                display: 'flex',
                gap: 'var(--space-2)',
                paddingBottom: 'var(--space-4)', // 16px bottom padding
                paddingTop: 'var(--space-2)',    // 8px top padding
                marginTop: 'calc(var(--space-2) * -1)',
                backgroundColor: 'var(--bg-page)',
                marginBottom: 'calc(var(--space-12) - var(--space-2))'
            }}>
                <FilterChip
                    selected={!!reportType}
                    value={reportType || undefined}
                    onClick={() => setReportType(prev => prev ? null : 'First Aid')}
                    onClear={() => setReportType(null)}
                >
                    Report Type
                </FilterChip>
                <FilterChip
                    selected={isStatusActive}
                    count={isStatusActive ? statusCount : undefined}
                    onClick={() => setIsStatusActive(!isStatusActive)}
                    onClear={() => setIsStatusActive(false)}
                >
                    Status
                </FilterChip>
            </div>

            {/* Task Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingBottom: 'var(--space-12)' }}>
                {TASKS.map((task) => (
                    <TaskCard
                        key={task.id}
                        title={task.title}
                        subtitle={task.subtitle}
                        status={task.status}
                        reportedBy={task.reportedBy}
                        reportedOn={task.reportedOn}
                        location={task.location}
                        iconName={task.iconName}
                        badgeColor={task.badgeColor}
                    />
                ))}
            </div>
        </div>
    );
}
