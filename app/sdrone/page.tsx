'use client';

import React, { useState } from 'react';
import TaskCard from '@/components/prototype/TaskCard';
import FilterChip from '@/components/ui/FilterChip';

const TASKS = [
    {
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
        title: "Eye irritation from dust",
        subtitle: "First Aid",
        status: "Awaiting Review",
        reportedBy: "Vikram Singh",
        reportedOn: "Wed, 14 Jan",
        location: "Site 3, Zone 5",
        iconName: "first-aid",
        badgeColor: "notice"
    }
] as const;

export default function InboxPage() {
    const [reportTypeSelected, setReportTypeSelected] = useState(false);
    const [statusSelected, setStatusSelected] = useState(true);
    const [statusCount] = useState(2); // Example: 2 statuses selected

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
                    selected={reportTypeSelected}
                    onClick={() => setReportTypeSelected(!reportTypeSelected)}
                >
                    Report Type
                </FilterChip>
                <FilterChip
                    selected={statusSelected}
                    count={statusSelected ? statusCount : undefined}
                    onClick={() => setStatusSelected(!statusSelected)}
                >
                    Status
                </FilterChip>
            </div>

            {/* Task Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingBottom: 'var(--space-12)' }}>
                {TASKS.map((task, index) => (
                    <TaskCard
                        key={index}
                        title={task.title}
                        subtitle={task.subtitle}
                        status={task.status}
                        reportedBy={task.reportedBy}
                        reportedOn={task.reportedOn}
                        location={task.location}
                        iconName={task.iconName as any}
                        badgeColor={task.badgeColor as any}
                    />
                ))}
            </div>
        </div>
    );
}
