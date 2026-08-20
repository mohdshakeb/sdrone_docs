'use client';

import React from 'react';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import { MOCK_EMPLOYEES } from '@/data/mock-data';
import {
    siteOptions,
    bodyPartOptions,
    workstationOptions,
    incidentTypeLabels,
    incidentTypeBadgeColors,
    MOCK_FIR_REFERENCES,
} from '../../mockData';
import type { IncidentFormData, IncidentType, StepId } from '../../types';
import styles from './Steps.module.css';

export interface StepReviewProps {
    data: IncidentFormData;
    inferredType: IncidentType;
    onGoToStep?: (step: StepId) => void;
}

const getLabel = (options: { value: string; label: string }[], value: string): string =>
    options.find(o => o.value === value)?.label ?? value;

const getEmployeeName = (id: string): string =>
    MOCK_EMPLOYEES.find(e => e.id === id)?.name ?? id;

const formatDate = (s: string): string => {
    if (!s) return '';
    return new Date(s).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
};

const formatTime = (s: string): string => {
    if (!s) return '';
    const [h, m] = s.split(':');
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
};

const formatSubmitDT = (d: Date): string =>
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' at ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

export const StepReview: React.FC<StepReviewProps> = ({ data, inferredType, onGoToStep }) => {
    const badgeColor = incidentTypeBadgeColors[inferredType];
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => { setMounted(true); }, []);

    const reportMetadata = React.useMemo(() => ({
        reportId: 'INC-2026-00123',
        reportedBy: 'Rahul Sharma',
        reporterRole: 'Field Worker',
        submittedAt: new Date(2026, 5, 13, 14, 0),
        submissionLocation: 'Warehouse A',
    }), []);

    const EditBtn = ({ step }: { step: StepId }) =>
        onGoToStep ? (
            <button className={styles.reviewEditBtn} onClick={() => onGoToStep(step)} aria-label={`Edit ${step}`}>
                <Icon name="todo-line" size={14} />
                Edit
            </button>
        ) : null;

    if (!mounted) {
        return <div className={styles.reviewContainer}>Loading review...</div>;
    }

    const hasInjuries = data.injuredEmployees.length > 0;
    const hasWitnesses = data.witnesses.length > 0;
    const hasCorrectiveActions = data.correctiveActions.length > 0;
    const hasInvestigationTeam = data.investigationTeam.length > 0;

    const firRef = data.firReference
        ? MOCK_FIR_REFERENCES.find(f => f.id === data.firReference)
        : null;

    return (
        <div className={styles.reviewContainer}>
            {/* Report Details */}
            <div className={styles.reviewSection}>
                <div className={styles.reviewSectionHeader}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Report Details
                    </h3>
                </div>
                <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Report ID</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{reportMetadata.reportId}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Reported By</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{reportMetadata.reportedBy}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Role</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{reportMetadata.reporterRole}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Submitted</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{formatSubmitDT(reportMetadata.submittedAt)}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Location</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{reportMetadata.submissionLocation}</span>
                    </div>
                </div>
            </div>

            {/* Incident Classification */}
            <div className={styles.reviewSection}>
                <div className={styles.reviewSectionHeader}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        Incident Classification
                    </h3>
                </div>
                <Badge color={badgeColor}>{incidentTypeLabels[inferredType]}</Badge>
            </div>

            {/* FIR Reference (ADR only) */}
            {firRef && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                            FIR Reference
                        </h3>
                        <EditBtn step="fir-reference" />
                    </div>
                    <p className={['text-body', styles.reviewText].join(' ')}>{firRef.title}</p>
                </div>
            )}

            {/* What Happened */}
            <div className={styles.reviewSection}>
                <div className={styles.reviewSectionHeader}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                        What Happened
                    </h3>
                    <EditBtn step="what-happened" />
                </div>
                <p className={['text-body', styles.reviewText].join(' ')}>{data.description || '—'}</p>
                {data.immediateAction && (
                    <>
                        <h4 className={['text-caption', styles.reviewSubtitle].join(' ')}>Immediate Action</h4>
                        <p className={['text-body', styles.reviewText].join(' ')}>{data.immediateAction}</p>
                    </>
                )}
            </div>

            {/* When & Where */}
            <div className={styles.reviewSection}>
                <div className={styles.reviewSectionHeader}>
                    <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>When & Where</h3>
                    <EditBtn step="when-where" />
                </div>
                <div className={styles.reviewGrid}>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Date</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{formatDate(data.dateOccurred)}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Time</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{formatTime(data.timeOccurred)}</span>
                    </div>
                    <div className={styles.reviewItem}>
                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Site</span>
                        <span className={['text-body', styles.reviewValue].join(' ')}>{getLabel(siteOptions, data.site)}</span>
                    </div>
                    {data.workstation && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Workstation</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>{getLabel(workstationOptions, data.workstation)}</span>
                        </div>
                    )}
                    {data.area && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Area</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>{data.area}</span>
                        </div>
                    )}
                    {data.exactPlace && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Exact Place</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>{data.exactPlace}</span>
                        </div>
                    )}
                    {data.asset && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Asset</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>{data.asset}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Injured Employees */}
            {hasInjuries && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>
                            Injured {data.injuredEmployees.length === 1 ? 'Employee' : 'Employees'}
                        </h3>
                        <EditBtn step="injured-employee" />
                    </div>
                    {data.injuredEmployees.map((emp, i) => (
                        <div key={emp.id} className={i > 0 ? styles.reviewSubsection : undefined}>
                            {data.injuredEmployees.length > 1 && (
                                <h4 className={['text-caption', styles.reviewSubtitle].join(' ')}>Person {i + 1}</h4>
                            )}
                            <div className={styles.reviewGrid}>
                                <div className={styles.reviewItem}>
                                    <span className={['text-caption', styles.reviewLabel].join(' ')}>Employee</span>
                                    <span className={['text-body', styles.reviewValue].join(' ')}>{getEmployeeName(emp.employeeId)}</span>
                                </div>
                                <div className={styles.reviewItem}>
                                    <span className={['text-caption', styles.reviewLabel].join(' ')}>Body Part</span>
                                    <span className={['text-body', styles.reviewValue].join(' ')}>
                                        {emp.bodyPart === 'other' && emp.bodyPartOther
                                            ? `Other — ${emp.bodyPartOther}`
                                            : getLabel(bodyPartOptions, emp.bodyPart)}
                                    </span>
                                </div>
                                {emp.injuryDescription && (
                                    <div className={styles.reviewItem}>
                                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Injury</span>
                                        <span className={['text-body', styles.reviewValue].join(' ')}>{emp.injuryDescription}</span>
                                    </div>
                                )}
                                {emp.doctorHospital && (
                                    <div className={styles.reviewItem}>
                                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Doctor / Hospital</span>
                                        <span className={['text-body', styles.reviewValue].join(' ')}>{emp.doctorHospital}</span>
                                    </div>
                                )}
                                {emp.lossTime !== null && (
                                    <div className={styles.reviewItem}>
                                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Loss of Time</span>
                                        <span className={['text-body', styles.reviewValue].join(' ')}>
                                            {emp.lossTime ? `Yes — ${emp.lossTimeDays} day(s)` : 'No'}
                                        </span>
                                    </div>
                                )}
                                {emp.treatment && (
                                    <div className={styles.reviewItem}>
                                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Treatment</span>
                                        <span className={['text-body', styles.reviewValue].join(' ')}>{emp.treatment}</span>
                                    </div>
                                )}
                                {emp.usedFirstAidBox && (
                                    <div className={styles.reviewItem}>
                                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Used First Aid Box / Hospital</span>
                                        <span className={['text-body', styles.reviewValue].join(' ')}>{emp.usedFirstAidBox}</span>
                                    </div>
                                )}
                                {emp.medicineDetails && (
                                    <div className={styles.reviewItem}>
                                        <span className={['text-caption', styles.reviewLabel].join(' ')}>Medicine Details</span>
                                        <span className={['text-body', styles.reviewValue].join(' ')}>{emp.medicineDetails}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Witnesses */}
            {hasWitnesses && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>Witnesses</h3>
                        <EditBtn step="witnesses" />
                    </div>
                    <div className={styles.reviewGrid}>
                        {data.witnesses.map((w, i) => (
                            <div key={w.id} className={styles.reviewItem}>
                                <span className={['text-caption', styles.reviewLabel].join(' ')}>Witness {i + 1}</span>
                                <span className={['text-body', styles.reviewValue].join(' ')}>
                                    {w.type === 'employee'
                                        ? getEmployeeName(w.employeeId ?? '')
                                        : w.name || '—'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reason & Loss */}
            {(inferredType === 'fir' || inferredType === 'adr') && data.machineryInvolved !== null && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>Reason & Loss</h3>
                        <EditBtn step="reason-and-loss" />
                    </div>
                    <div className={styles.reviewGrid}>
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Machinery Involved</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>{data.machineryInvolved ? 'Yes' : 'No'}</span>
                        </div>
                        {data.machineryInvolved && (
                            <>
                                <div className={styles.reviewItem}>
                                    <span className={['text-caption', styles.reviewLabel].join(' ')}>Machine</span>
                                    <span className={['text-body', styles.reviewValue].join(' ')}>{data.machineName}</span>
                                </div>
                                <div className={styles.reviewItem}>
                                    <span className={['text-caption', styles.reviewLabel].join(' ')}>Machine Moving</span>
                                    <span className={['text-body', styles.reviewValue].join(' ')}>{data.machineMoving ? 'Yes' : 'No'}</span>
                                </div>
                            </>
                        )}
                        {data.propertyLoss && (
                            <div className={styles.reviewItem}>
                                <span className={['text-caption', styles.reviewLabel].join(' ')}>Property Loss</span>
                                <span className={['text-body', styles.reviewValue].join(' ')}>{data.propertyLoss}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Observations */}
            {(data.rootCause || data.contributingFactorsText) && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>Observations</h3>
                        <EditBtn step="observations" />
                    </div>
                    {data.rootCause && (
                        <>
                            <h4 className={['text-caption', styles.reviewSubtitle].join(' ')}>Root Cause</h4>
                            <p className={['text-body', styles.reviewText].join(' ')}>{data.rootCause}</p>
                        </>
                    )}
                    {data.contributingFactorsText && (
                        <>
                            <h4 className={['text-caption', styles.reviewSubtitle].join(' ')}>Contributing Factors</h4>
                            <p className={['text-body', styles.reviewText].join(' ')}>{data.contributingFactorsText}</p>
                        </>
                    )}
                    {data.recommendedSolution && (
                        <>
                            <h4 className={['text-caption', styles.reviewSubtitle].join(' ')}>Recommended Solution</h4>
                            <p className={['text-body', styles.reviewText].join(' ')}>{data.recommendedSolution}</p>
                        </>
                    )}
                    {data.whyAnalysis && (
                        <>
                            <h4 className={['text-caption', styles.reviewSubtitle].join(' ')}>Why Analysis</h4>
                            <p className={['text-body', styles.reviewText].join(' ')}>{data.whyAnalysis}</p>
                        </>
                    )}
                </div>
            )}

            {/* Event Details (ADR) */}
            {data.chronologyOfEvents && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>Event Details</h3>
                        <EditBtn step="event-details" />
                    </div>
                    <p className={['text-body', styles.reviewText].join(' ')}>{data.chronologyOfEvents}</p>
                </div>
            )}

            {/* Corrective Actions */}
            {(hasCorrectiveActions || data.correctiveActionText) && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>Corrective Actions</h3>
                        <EditBtn step="corrective-actions" />
                    </div>
                    {data.correctiveActionText && (
                        <p className={['text-body', styles.reviewText].join(' ')}>{data.correctiveActionText}</p>
                    )}
                    {hasCorrectiveActions && (
                        <div className={styles.reviewList}>
                            {data.correctiveActions.map((a, i) => (
                                <div key={a.id} className={styles.reviewListItem}>
                                    <span className={['text-body', styles.reviewValue].join(' ')}>{i + 1}. {a.action}</span>
                                    <span className={['text-caption', styles.reviewLabel].join(' ')}>
                                        {getEmployeeName(a.responsibilityEmployeeId)}
                                        {a.timeline ? ` · Due ${a.timeline}` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Investigation Team (ADR) */}
            {hasInvestigationTeam && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>Investigation Team</h3>
                        <EditBtn step="investigation-team" />
                    </div>
                    <div className={styles.reviewGrid}>
                        {data.investigationTeam.map((m, i) => (
                            <div key={m.id} className={styles.reviewItem}>
                                <span className={['text-caption', styles.reviewLabel].join(' ')}>Member {i + 1}</span>
                                <span className={['text-body', styles.reviewValue].join(' ')}>{getEmployeeName(m.employeeId)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Evidence */}
            {(data.photos.length > 0 || data.attachments.length > 0) && (
                <div className={styles.reviewSection}>
                    <div className={styles.reviewSectionHeader}>
                        <h3 className={['text-caption-strong', styles.reviewSectionTitle].join(' ')}>Evidence</h3>
                        <EditBtn step="evidence" />
                    </div>
                    {data.photos.length > 0 && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Photos</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.photos.length} file{data.photos.length !== 1 ? 's' : ''} attached
                            </span>
                        </div>
                    )}
                    {data.attachments.length > 0 && (
                        <div className={styles.reviewItem}>
                            <span className={['text-caption', styles.reviewLabel].join(' ')}>Attachments</span>
                            <span className={['text-body', styles.reviewValue].join(' ')}>
                                {data.attachments.length} file{data.attachments.length !== 1 ? 's' : ''} attached
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StepReview;
