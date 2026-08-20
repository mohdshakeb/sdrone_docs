'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useSafetyAlertForm } from './useSafetyAlertForm';
import AppHeader from '@/components/prototype/AppHeader';
import SafetyAlertForm from './components/SafetyAlertForm';
import SafetyAlertConfirmation from './components/SafetyAlertConfirmation';
import { useRole } from '@/components/prototype/RoleProvider';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export default function SafetyAlertPage() {
    const router = useRouter();
    const { role } = useRole();
    const form = useSafetyAlertForm();

    const handleBack = () => router.push('/sdrone');
    const handleViewAlerts = () => router.push('/sdrone/alerts');

    if (!role.permissions.canSendSafetyAlert) {
        return (
            <div className={styles.page}>
                <AppHeader
                    variant="innerPage"
                    innerPageTitle="Safety Alert"
                    onBack={handleBack}
                />
                <main className={styles.main}>
                    <div className={styles.accessDenied}>
                        <div className={styles.accessDeniedContent}>
                            <div className={styles.accessDeniedIcon}>
                                <Icon name="shield" size={32} />
                            </div>
                            <h1 className={['text-heading', styles.accessDeniedTitle].join(' ')}>
                                Access Restricted
                            </h1>
                            <p className={['text-body', styles.accessDeniedBody].join(' ')}>
                                Safety Alerts can only be sent by Safety Officers and HSE Managers.
                            </p>
                            <Button variant="secondary" onClick={handleBack}>
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (form.isSubmitted) {
        return (
            <div className={styles.page}>
                <AppHeader
                    variant="innerPage"
                    innerPageTitle="Safety Alert"
                    onBack={handleBack}
                />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <SafetyAlertConfirmation
                            recipientValues={form.data.targetAudience}
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
                innerPageTitle="Safety Alert"
                onBack={handleBack}
            />
            <main className={styles.main}>
                <div className={styles.container}>
                    <SafetyAlertForm
                        data={form.data}
                        onUpdate={form.updateField}
                        onToggleAudience={form.toggleAudience}
                        isValid={form.isValid}
                        onSubmit={form.submit}
                    />
                </div>
            </main>
        </div>
    );
}
