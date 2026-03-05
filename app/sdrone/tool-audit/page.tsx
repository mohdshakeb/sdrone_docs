'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useToolAuditForm } from './useToolAuditForm';

// Components
import AppHeader from '@/components/prototype/AppHeader';
import ProgressBar from '@/components/prototype/form/ProgressBar';
import StepContainer from '@/components/prototype/form/StepContainer';
import ConfirmationScreen from './components/ConfirmationScreen';

// Steps
import StepEntry from './components/steps/StepEntry';
import StepAuditDetails from './components/steps/StepAuditDetails';
import StepToolsChecklist from './components/steps/StepToolsChecklist';
import StepObservationsActions from './components/steps/StepObservationsActions';
import StepAttachments from './components/steps/StepAttachments';
import StepReview from './components/steps/StepReview';

function ToolAuditPageLoading() {
    return (
        <div className={styles.page}>
            <AppHeader
                variant="form"
                formTitle="Tool Audit"
                currentStep={1}
                totalSteps={6}
            />
            <div className={styles.loadingContainer}>
                <p className="text-body">Loading...</p>
            </div>
        </div>
    );
}

function ToolAuditPageContent() {
    const router = useRouter();
    const form = useToolAuditForm();

    const handleViewInbox = () => {
        router.push('/sdrone');
    };

    const handleCreateAnother = () => {
        form.reset();
    };

    const handleSubmit = () => {
        form.submit();
    };

    const handleCancel = () => {
        router.push('/sdrone');
    };

    // Show confirmation screen after submission
    if (form.isSubmitted) {
        return (
            <div className={styles.page}>
                <AppHeader
                    variant="form"
                    formTitle="Tool Audit"
                    currentStep={form.totalSteps}
                    totalSteps={form.totalSteps}
                />
                <ConfirmationScreen
                    auditType={form.data.auditType}
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
                    <StepEntry onStart={() => form.goNext()} />
                );
            case 1:
                return (
                    <StepAuditDetails
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 2:
                return (
                    <StepToolsChecklist
                        data={form.data}
                        errors={form.errors}
                        onConditionChange={form.updateToolCondition}
                        onRemarksChange={form.updateToolRemarks}
                        onImagesChange={form.updateToolImages}
                    />
                );
            case 3:
                return (
                    <StepObservationsActions
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                        onAddAction={form.addAction}
                        onRemoveAction={form.removeAction}
                        onUpdateAction={form.updateAction}
                    />
                );
            case 4:
                return (
                    <StepAttachments
                        data={form.data}
                        errors={form.errors}
                        onUpdate={form.updateField}
                    />
                );
            case 5:
                return (
                    <StepReview data={form.data} />
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.page}>
            <AppHeader
                variant="form"
                formTitle="Tool Audit"
                currentStep={form.currentStepIndex}
                totalSteps={form.totalSteps}
                onFormBack={form.canGoBack ? form.goBack : () => router.push('/sdrone')}
                onFormCancel={handleCancel}
                onFormSubmit={handleSubmit}
                isEntryStep={form.isFirstStep}
                isReviewStep={form.isReviewStep}
                submitLabel="Submit Audit"
            />

            {/* Hide progress bar on entry step */}
            {!form.isFirstStep && (
                <ProgressBar
                    currentStep={form.currentStepIndex}
                    totalSteps={form.totalSteps}
                />
            )}

            <main className={styles.main}>
                <div className={styles.container}>
                    {form.isFirstStep ? (
                        renderStepContent()
                    ) : (
                        <StepContainer
                            title={form.stepConfig.title}
                            isReviewStep={form.isReviewStep}
                            showBack={form.canGoBack}
                            onBack={form.goBack}
                            onNext={form.goNext}
                            onSubmit={handleSubmit}
                            nextLabel={form.isReviewStep ? 'Submit Audit' : form.currentStep === 4 ? 'Review' : undefined}
                        >
                            {renderStepContent()}
                        </StepContainer>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function ToolAuditPage() {
    return (
        <Suspense fallback={<ToolAuditPageLoading />}>
            <ToolAuditPageContent />
        </Suspense>
    );
}
