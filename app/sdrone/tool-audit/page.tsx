'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useToolAuditForm } from './useToolAuditForm';
import type { StepId } from './types';

import AppHeader from '@/components/prototype/AppHeader';
import StepContainer from '@/components/prototype/form/StepContainer';
import ConfirmationScreen from './components/ConfirmationScreen';
import Icon from '@/components/ui/Icon';

import StepEntry from './components/steps/StepEntry';
import StepAuditDetails from './components/steps/StepAuditDetails';
import StepToolsChecklist from './components/steps/StepToolsChecklist';
import StepConclusion from './components/steps/StepConclusion';
import StepReview from './components/steps/StepReview';

// ── Sidebar ───────────────────────────────────────────────────────────────────

interface StepSidebarProps {
    steps: { id: StepId; title: string }[];
    currentStep: StepId;
    stepStatuses: Record<StepId, 'complete' | 'incomplete'>;
    isFormValid: boolean;
    onStepClick: (id: StepId) => void;
}

function StepSidebar({ steps, currentStep, stepStatuses, isFormValid, onStepClick }: StepSidebarProps) {
    const sidebarSteps = steps.filter(s => s.id !== 'entry');
    const formSteps = sidebarSteps.filter(s => s.id !== 'review');
    const reviewStep = sidebarSteps.find(s => s.id === 'review');

    return (
        <nav className={styles.sidebar} aria-label="Form steps">
            <ol className={styles.stepList}>
                {formSteps.map((step, index) => {
                    const isCurrent = step.id === currentStep;
                    const isComplete = stepStatuses[step.id] === 'complete';
                    return (
                        <li key={step.id}>
                            <button
                                className={[
                                    styles.stepItem,
                                    isCurrent ? styles.stepItemCurrent : '',
                                ].filter(Boolean).join(' ')}
                                onClick={() => onStepClick(step.id)}
                                aria-current={isCurrent ? 'step' : undefined}
                            >
                                <span className={[
                                    styles.stepBullet,
                                    isComplete && !isCurrent ? styles.stepBulletComplete : '',
                                ].filter(Boolean).join(' ')} aria-hidden="true">
                                    {isComplete && !isCurrent
                                        ? <Icon name="check" size={14} />
                                        : index + 1}
                                </span>
                                <span className={styles.stepName}>{step.title}</span>
                            </button>
                        </li>
                    );
                })}

                {reviewStep && (
                    <>
                        <li className={styles.stepDivider} aria-hidden="true" />
                        <li key="review">
                            <button
                                className={[
                                    styles.stepItem,
                                    currentStep === 'review' ? styles.stepItemCurrent : '',
                                    !isFormValid && currentStep !== 'review' ? styles.stepItemDisabled : '',
                                ].filter(Boolean).join(' ')}
                                onClick={() => isFormValid ? onStepClick('review') : undefined}
                                disabled={!isFormValid && currentStep !== 'review'}
                                aria-current={currentStep === 'review' ? 'step' : undefined}
                            >
                                <span className={[
                                    styles.stepBullet,
                                    stepStatuses['review'] === 'complete' && currentStep !== 'review' ? styles.stepBulletComplete : '',
                                ].filter(Boolean).join(' ')} aria-hidden="true">
                                    <Icon name="survey-line" size={14} />
                                </span>
                                <span className={styles.stepName}>{reviewStep.title}</span>
                            </button>
                        </li>
                    </>
                )}
            </ol>
        </nav>
    );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function ToolAuditPageLoading() {
    return (
        <div className={styles.page}>
            <AppHeader variant="form" formTitle="Tool Audit" />
            <div className={styles.loadingContainer}>
                <p className="text-body">Loading...</p>
            </div>
        </div>
    );
}

// ── Main content ──────────────────────────────────────────────────────────────

function ToolAuditPageContent() {
    const router = useRouter();
    const form = useToolAuditForm();

    const handleViewInbox = () => router.push('/sdrone');
    const handleCreateAnother = () => form.reset();
    const handleCancel = () => router.push('/sdrone');

    const isReviewStep = form.currentStep === 'review';

    const handlePrimaryAction = () => {
        if (isReviewStep) {
            form.submit();
        } else if (form.isFormValid) {
            form.goToStep('review');
        } else if (form.canGoNext) {
            if (!form.goNext()) {
                form.goToFirstError();
            }
        } else {
            form.goToFirstError();
        }
    };

    const primaryLabel = isReviewStep
        ? 'Submit Audit'
        : form.isFormValid
            ? 'Review'
            : 'Continue';

    if (form.isSubmitted) {
        return (
            <div className={styles.page}>
                <AppHeader variant="form" formTitle="Tool Audit" />
                <ConfirmationScreen
                    auditType={form.data.auditType}
                    onViewInbox={handleViewInbox}
                    onCreateAnother={handleCreateAnother}
                />
            </div>
        );
    }

    const renderStepContent = () => {
        switch (form.currentStep) {
            case 'entry':
                return <StepEntry onSelect={form.selectTypeAndAdvance} />;
            case 'audit-details':
                return <StepAuditDetails data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'tools-checklist':
                return (
                    <StepToolsChecklist
                        data={form.data}
                        errors={form.errors}
                        onConditionChange={form.updateToolCondition}
                        onRemarksChange={form.updateToolRemarks}
                        onImagesChange={form.updateToolImages}
                    />
                );
            case 'conclusion':
                return <StepConclusion data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'review':
                return <StepReview data={form.data} onGoToStep={form.goToStep} />;
            default:
                return null;
        }
    };

    // Entry step: full-width, no sidebar
    if (form.isFirstStep) {
        return (
            <div className={styles.page}>
                <AppHeader
                    variant="form"
                    formTitle="Tool Audit"
                    onFormBack={() => router.push('/sdrone')}
                    onFormCancel={handleCancel}
                    isEntryStep
                />
                <main className={styles.entryMain}>
                    <div className={styles.containerWide}>
                        {renderStepContent()}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <AppHeader
                variant="form"
                formTitle="Tool Audit"
                onFormBack={form.canGoBack ? form.goBack : () => router.push('/sdrone')}
                onFormCancel={handleCancel}
                onFormSubmit={handlePrimaryAction}
                submitLabel={primaryLabel}
                canSubmit={isReviewStep ? form.isFormValid : true}
            />

            <main className={styles.formMain}>
                <div className={styles.formWrapper}>
                    <div className={styles.formCard}>
                        <StepSidebar
                            steps={form.activeSteps}
                            currentStep={form.currentStep}
                            stepStatuses={form.stepStatuses}
                            isFormValid={form.isFormValid}
                            onStepClick={form.goToStep}
                        />

                        <div className={styles.formContent}>
                            <StepContainer
                                title={form.stepConfig.title}
                                stepNumber={form.currentStepIndex}
                                noBorder
                                showBack={false}
                                showNext={false}
                            >
                                {renderStepContent()}
                            </StepContainer>
                        </div>
                    </div>
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
