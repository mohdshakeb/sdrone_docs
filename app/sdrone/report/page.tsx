'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { useIncidentForm } from './useIncidentForm';
import type { IncidentType } from './types';

// Components
import AppHeader from '@/components/prototype/AppHeader';
import ProgressBar from './components/ProgressBar';
import StepContainer from './components/StepContainer';
import ConfirmationScreen from './components/ConfirmationScreen';

// Steps
import StepEntry from './components/steps/StepEntry';
import StepWhatHappened from './components/steps/StepWhatHappened';
import StepWhenWhere from './components/steps/StepWhenWhere';
import StepInjuryCheck from './components/steps/StepInjuryCheck';
import StepInjuryDetails from './components/steps/StepInjuryDetails';
import StepFirstAidSpecifics from './components/steps/StepFirstAidSpecifics';
import StepContributingFactors from './components/steps/StepContributingFactors';
import StepEvidence from './components/steps/StepEvidence';
import StepCorrectiveAction from './components/steps/StepCorrectiveAction';
import StepReview from './components/steps/StepReview';

// Loading component for Suspense fallback
function ReportPageLoading() {
    return (
        <div className={styles.page}>
            <AppHeader
                variant="form"
                formTitle="Report Incident"
                currentStep={1}
                totalSteps={8}
            />
            <div className={styles.loadingContainer}>
                <p className="text-body">Loading...</p>
            </div>
        </div>
    );
}

// Inner component that uses useSearchParams
function ReportPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get preset type from URL if provided
    const typeParam = searchParams.get('type') as IncidentType | null;
    const presetType = typeParam && ['near-miss', 'first-aid', 'fir', 'adr'].includes(typeParam)
        ? typeParam
        : null;

    const form = useIncidentForm({ presetType });

    // Navigate to inbox
    const handleViewInbox = () => {
        router.push('/sdrone');
    };

    // Reset form and start over
    const handleCreateAnother = () => {
        form.reset();
    };

    // Handle submit
    const handleSubmit = () => {
        form.submit();
    };

    // Get form title based on incident type
    const getFormTitle = () => {
        if (form.selectedType === 'unsure') return 'Report Incident';
        if (form.inferredType === 'near-miss') return 'Near Miss Report';
        if (form.inferredType === 'first-aid') return 'First Aid Report';
        if (form.inferredType === 'fir') return 'First Incident Report';
        if (form.inferredType === 'adr') return 'Accident Detail Report';
        return 'Report Incident';
    };

    // Show confirmation screen after submission
    if (form.isSubmitted) {
        return (
            <div className={styles.page}>
                <AppHeader
                    variant="form"
                    formTitle={getFormTitle()}
                    currentStep={form.totalSteps}
                    totalSteps={form.totalSteps}
                />
                <ConfirmationScreen
                    incidentType={form.inferredType}
                    onViewInbox={handleViewInbox}
                    onCreateAnother={handleCreateAnother}
                />
            </div>
        );
    }

    // Render current step content
    const renderStepContent = () => {
        switch (form.currentStep) {
            case 0:
                return (
                    <StepEntry
                        onStart={() => form.goNext()}
                        selectedType={form.selectedType}
                        onTypeChange={form.setSelectedType}
                    />
                );
            case 1:
                return (
                    <StepWhatHappened
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 2:
                return (
                    <StepWhenWhere
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 3:
                return (
                    <StepInjuryCheck
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 4:
                return (
                    <StepInjuryDetails
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 5:
                return (
                    <StepFirstAidSpecifics
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 6:
                return (
                    <StepContributingFactors
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 7:
                return (
                    <StepEvidence
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 8:
                return (
                    <StepCorrectiveAction
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 9:
                return (
                    <StepReview
                        data={form.data}
                        inferredType={form.inferredType}
                    />
                );
            default:
                return null;
        }
    };

    // Handle cancel - go back to inbox
    const handleCancel = () => {
        router.push('/sdrone');
    };

    return (
        <div className={styles.page}>
            <AppHeader
                variant="form"
                formTitle={getFormTitle()}
                currentStep={form.currentStepIndex}
                totalSteps={form.totalSteps}
                onFormBack={form.canGoBack ? form.goBack : () => router.push('/sdrone')}
                onFormCancel={handleCancel}
                onFormSubmit={handleSubmit}
                isEntryStep={form.isFirstStep}
                isReviewStep={form.isReviewStep}
            />

            {/* Hide progress bar on entry step */}
            {!form.isFirstStep && (
                <div className={styles.progressBarContainer}>
                    <ProgressBar
                        currentStep={form.currentStepIndex}
                        totalSteps={form.totalSteps}
                    />
                </div>
            )}

            <main className={styles.main}>
                <div className={styles.container}>
                    {form.isFirstStep ? (
                        // Entry step has no wrapper
                        renderStepContent()
                    ) : (
                        <StepContainer
                            title={form.stepConfig.title}
                            isReviewStep={form.isReviewStep}
                            showBack={form.canGoBack}
                            onBack={form.goBack}
                            onNext={form.goNext}
                            onSubmit={handleSubmit}
                            nextLabel={form.currentStep === 8 ? 'Review' : undefined}
                        >
                            {renderStepContent()}
                        </StepContainer>
                    )}
                </div>
            </main>
        </div>
    );
}

// Main export with Suspense boundary
export default function ReportPage() {
    return (
        <Suspense fallback={<ReportPageLoading />}>
            <ReportPageContent />
        </Suspense>
    );
}
