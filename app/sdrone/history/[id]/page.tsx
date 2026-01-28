'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import AppHeader from '@/components/prototype/AppHeader';
import NextStepBanner from '@/components/prototype/NextStepBanner';
import RecordDetailContent from '@/components/prototype/RecordDetailContent';
import AuditTrail from '@/components/prototype/AuditTrail';
import { MOCK_HISTORY_RECORDS } from '@/data/mock-data';
import styles from './page.module.css';

export default function HistoryDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    // Find the record
    const record = MOCK_HISTORY_RECORDS.find((r) => r.id === id);

    // Handle not found
    if (!record) {
        notFound();
    }

    // Handle back navigation
    const handleBack = () => {
        router.push('/sdrone/history');
    };

    // Handle export PDF (mock action)
    const handleExportPdf = () => {
        // In a real app, this would trigger PDF generation
        alert('Export as PDF functionality would be implemented here.');
    };

    // Handle next step action (mock action)
    const handleNextStepAction = () => {
        alert('Action functionality would be implemented here.');
    };

    // Breadcrumbs
    const breadcrumbs = [
        { label: 'History', href: '/sdrone/history' },
        { label: record.type },
    ];

    // Mock user role for demonstration
    const userRole = 'Safety Officer';

    return (
        <div className={styles.page}>
            {/* Custom header for detail page */}
            <AppHeader
                variant="innerPage"
                innerPageTitle={record.title}
                breadcrumbs={breadcrumbs}
                onBack={handleBack}
                onExportPdf={handleExportPdf}
            />

            <div className={styles.content}>
                {/* Next Step Banner */}
                {record.status !== 'Closed' && (
                    <NextStepBanner
                        record={record}
                        userRole={userRole}
                        onAction={handleNextStepAction}
                    />
                )}

                {/* Record Details */}
                <RecordDetailContent record={record} />

                {/* Audit Trail */}
                <AuditTrail entries={record.auditTrail} />
            </div>
        </div>
    );
}
