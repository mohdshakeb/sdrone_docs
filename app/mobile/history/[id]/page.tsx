'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import NextStepBanner from '@/components/prototype/NextStepBanner';
import RecordDetailContent from '@/components/prototype/RecordDetailContent';
import AuditTrail from '@/components/prototype/AuditTrail';
import { MOCK_HISTORY_RECORDS } from '@/data/mock-data';
import styles from './page.module.css';

export default function MobileHistoryDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const record = MOCK_HISTORY_RECORDS.find((r) => r.id === id);

    if (!record) {
        notFound();
    }

    const handleNextStepAction = () => {
        alert('Action functionality would be implemented here.');
    };

    const userRole = 'Safety Officer';

    return (
        <div className={styles.content}>
            {record.status !== 'Closed' && (
                <NextStepBanner
                    record={record}
                    userRole={userRole}
                    onAction={handleNextStepAction}
                />
            )}

            <RecordDetailContent record={record} />
            <AuditTrail entries={record.auditTrail} />
        </div>
    );
}
