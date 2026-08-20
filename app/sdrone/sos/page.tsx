'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useSOSForm } from './useSOSForm';
import AppHeader from '@/components/prototype/AppHeader';
import SOSForm from './components/SOSForm';
import SOSConfirmation from './components/SOSConfirmation';

export default function SOSPage() {
    const router = useRouter();
    const form = useSOSForm();

    const handleBack = () => router.push('/sdrone');
    const handleViewAlerts = () => router.push('/sdrone/alerts');

    if (form.isSubmitted) {
        return (
            <div className={styles.page}>
                <AppHeader
                    variant="innerPage"
                    innerPageTitle="SOS"
                    onBack={handleBack}
                />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <SOSConfirmation
                            onViewAlerts={handleViewAlerts}
                            onSendAnother={form.reset}
                        />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <AppHeader
                variant="innerPage"
                innerPageTitle="SOS"
                onBack={handleBack}
            />
            <main className={styles.main}>
                <div className={styles.container}>
                    <SOSForm
                        data={form.data}
                        onUpdate={form.updateField}
                        onSubmit={form.submit}
                    />
                </div>
            </main>
        </div>
    );
}
