'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { useIncidentForm } from './useIncidentForm';
import type { IncidentType, StepId } from './types';

import AppHeader from '@/components/prototype/AppHeader';
import StepContainer from '@/components/prototype/form/StepContainer';
import ConfirmationScreen from './components/ConfirmationScreen';
import Icon from '@/components/ui/Icon';

import StepEntry from './components/steps/StepEntry';
import StepFIRReference from './components/steps/StepFIRReference';
import StepWhatHappened from './components/steps/StepWhatHappened';
import StepWhenWhere from './components/steps/StepWhenWhere';
import StepInjuryCheck from './components/steps/StepInjuryCheck';
import StepInjuredEmployee from './components/steps/StepInjuredEmployee';
import StepWitnesses from './components/steps/StepWitnesses';
import StepReasonAndLoss from './components/steps/StepReasonAndLoss';
import StepObservations from './components/steps/StepObservations';
import StepEventDetails from './components/steps/StepEventDetails';
import StepCorrectiveActions from './components/steps/StepCorrectiveActions';
import StepInvestigationTeam from './components/steps/StepInvestigationTeam';
import StepEvidence from './components/steps/StepEvidence';
import StepReview from './components/steps/StepReview';

// ── Sidebar step navigator ────────────────────────────────────────────────────

interface StepSidebarProps {
    steps: { id: StepId; title: string }[];
    currentStep: StepId;
    stepStatuses: Record<StepId, 'complete' | 'incomplete'>;
    isFormValid: boolean;
    onStepClick: (id: StepId) => void;
}

function StepSidebar({ steps, currentStep, stepStatuses, isFormValid, onStepClick }: StepSidebarProps) {
    const sidebarSteps = steps.filter(s => s.id !== 'entry');
    // Exclude review from the numbered steps
    const formSteps = sidebarSteps.filter(s => s.id !== 'review');
    const reviewStep = sidebarSteps.find(s => s.id === 'review');

    return (
        <nav className={styles.sidebar} aria-label="Form steps">
            <ol className={styles.stepList}>
                {formSteps.map((step, index) => {
                    const isCurrent = step.id === currentStep;
                    const isComplete = stepStatuses[step.id] === 'complete';
                    const itemClass = [
                        styles.stepItem,
                        isCurrent ? styles.stepItemCurrent : '',
                    ].filter(Boolean).join(' ');
                    const bulletClass = [
                        styles.stepBullet,
                        isComplete && !isCurrent ? styles.stepBulletComplete : '',
                    ].filter(Boolean).join(' ');

                    return (
                        <li key={step.id}>
                            <button
                                className={itemClass}
                                onClick={() => onStepClick(step.id)}
                                aria-current={isCurrent ? 'step' : undefined}
                            >
                                <span className={bulletClass} aria-hidden="true">
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

function ReportPageLoading() {
    return (
        <div className={styles.page}>
            <AppHeader variant="form" formTitle="Report Incident" />
            <div className={styles.loadingContainer}>
                <p className="text-body">Loading...</p>
            </div>
        </div>
    );
}

// ── Main content ──────────────────────────────────────────────────────────────

function ReportPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const typeParam = searchParams.get('type') as IncidentType | null;
    const presetType = typeParam && ['near-miss', 'first-aid', 'fir', 'adr'].includes(typeParam)
        ? typeParam
        : null;

    const form = useIncidentForm({ presetType });

    const handleViewInbox = () => router.push('/sdrone');
    const handleCreateAnother = () => form.reset();
    const handleCancel = () => router.push('/sdrone');

    const isReviewStep = form.currentStep === 'review';

    // Header primary button behaviour:
    // - Review step → "Submit Report"
    // - Form fully valid (any step) → "Review" (jump straight to review)
    // - Form incomplete, can go next → "Continue" (advance one step)
    // - Form incomplete, last content step → "Continue" (navigates to first error step)
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
        ? 'Submit Report'
        : form.isFormValid
            ? 'Review'
            : 'Continue';

    const getFormTitle = () => {
        if (form.isFirstStep) return 'Incident Reporting';
        if (form.selectedType === 'unsure') return 'Report Incident';
        switch (form.inferredType) {
            case 'near-miss': return 'Near Miss Report';
            case 'first-aid': return 'First Aid Report';
            case 'fir':       return 'First Incident Report';
            case 'adr':       return 'Accident Detail Report';
        }
        return 'Report Incident';
    };

    if (form.isSubmitted) {
        return (
            <div className={styles.page}>
                <AppHeader variant="form" formTitle={getFormTitle()} />
                <ConfirmationScreen
                    incidentType={form.inferredType}
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
            case 'fir-reference':
                return <StepFIRReference data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'what-happened':
                return <StepWhatHappened data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'when-where':
                return <StepWhenWhere data={form.data} errors={form.errors} inferredType={form.inferredType} onUpdate={form.updateField} />;
            case 'injury-check':
                return <StepInjuryCheck data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'injured-employee':
                return <StepInjuredEmployee data={form.data} errors={form.errors} inferredType={form.inferredType} onUpdate={form.updateField} />;
            case 'witnesses':
                return <StepWitnesses data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'reason-and-loss':
                return <StepReasonAndLoss data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'observations':
                return <StepObservations data={form.data} errors={form.errors} inferredType={form.inferredType} onUpdate={form.updateField} />;
            case 'event-details':
                return <StepEventDetails data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'corrective-actions':
                return <StepCorrectiveActions data={form.data} errors={form.errors} inferredType={form.inferredType} onUpdate={form.updateField} />;
            case 'investigation-team':
                return <StepInvestigationTeam data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'evidence':
                return <StepEvidence data={form.data} errors={form.errors} onUpdate={form.updateField} />;
            case 'review':
                return <StepReview data={form.data} inferredType={form.inferredType} onGoToStep={form.goToStep} />;
            default:
                return null;
        }
    };

    // Entry step: full-width type selection (different layout)
    if (form.isFirstStep) {
        return (
            <div className={styles.page}>
                <AppHeader
                    variant="form"
                    formTitle={getFormTitle()}
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

    // The display step number (1-based, excluding entry which is index 0)
    const displayStepNumber = form.currentStepIndex;

    return (
        <div className={styles.page}>
            <AppHeader
                variant="form"
                formTitle={getFormTitle()}
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
                                stepNumber={displayStepNumber}
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

export default function ReportPage() {
    return (
        <Suspense fallback={<ReportPageLoading />}>
            <ReportPageContent />
        </Suspense>
    );
}
