'use client';

import React, { useEffect, useState } from 'react';
import styles from './TaskDetailPanel.module.css';
import { Icon } from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import AuditTrail from '@/components/prototype/AuditTrail';
import { useRole } from '@/components/prototype/RoleProvider';
import { getEnrichedTask } from '@/data/mock-data';
import { STATUS_BADGE_COLORS } from '@/types/history';
import type { ReviewComment } from '@/types/history';

interface TaskDetailPanelProps {
    taskId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function TaskDetailPanel({ taskId, isOpen, onClose }: TaskDetailPanelProps) {
    const { role } = useRole();
    const [localComments, setLocalComments] = useState<ReviewComment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [isReviewed, setIsReviewed] = useState(false);

    // Reset state when task changes
    useEffect(() => {
        setLocalComments([]);
        setCommentText('');
        setIsReviewed(false);
    }, [taskId]);

    // Escape key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const enriched = taskId ? getEnrichedTask(taskId) : null;

    if (!enriched) {
        return (
            <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`} />
        );
    }

    const { task, record, incidentDetail, reviewComments } = enriched;
    const status = record.status;
    const canReview = role.permissions.canReview;
    const isClosed = status === 'Closed';
    const isPending = status === 'Pending';
    const isOnHold = status === 'On Hold';
    const isReportedBy = record.reportedBy.name === role.userName;

    // For Pending non-incidents, reportedBy = assigner (not submitter)
    const isAssigner = isPending && isReportedBy && record.category !== 'Incident';
    // For all other statuses, reportedBy = submitter
    const isSubmitter = !isPending && isReportedBy;

    // Merge persisted + local comments
    const allComments = [...reviewComments, ...localComments];

    // Show comment input for non-submitter reviewers on active records
    const showCommentInput = !isSubmitter && !isAssigner && canReview && !isClosed;

    const handleAddComment = () => {
        if (!commentText.trim()) return;

        const newComment: ReviewComment = {
            id: `local-${Date.now()}`,
            author: { name: role.userName, role: role.title },
            text: commentText.trim(),
            timestamp: new Date().toISOString(),
        };

        setLocalComments((prev) => [...prev, newComment]);
        setCommentText('');
    };

    const handleAction = (action: string) => {
        // For Send Back and Escalate, auto-add the comment since it's mandatory
        if ((action === 'Send Back' || action === 'Escalate') && commentText.trim()) {
            handleAddComment();
        }
        alert(`"${action}" action would be performed on "${record.title}".`);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Progressive footer actions based on viewer relationship + status + review state
    const renderFooterActions = (): React.ReactNode => {
        if (isClosed) return null;

        // Assigner on Pending (non-incident): can discard
        if (isAssigner) {
            return (
                <Button size="sm" variant="secondary" onClick={() => handleAction('Discard')}>
                    Discard
                </Button>
            );
        }

        // Submitter on On Hold: can re-submit
        if (isSubmitter && isOnHold) {
            return (
                <Button size="sm" variant="primary" onClick={() => handleAction('Re-Submit')}>
                    Re-Submit
                </Button>
            );
        }

        // Submitter on other statuses: no actions
        if (isSubmitter || (isPending && !isAssigner)) return null;

        // Reviewer on Under Review or Escalated: progressive flow
        if (canReview && (status === 'Under Review' || status === 'Escalated')) {
            if (!isReviewed) {
                // Step 1: Send Back (needs comment) or Mark as Reviewed
                return (
                    <>
                        <Button
                            size="sm"
                            variant="secondary"
                            disabled={!commentText.trim()}
                            onClick={() => handleAction('Send Back')}
                        >
                            Send Back
                        </Button>
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setIsReviewed(true)}
                        >
                            Mark as Reviewed
                        </Button>
                    </>
                );
            } else {
                // Step 2: Escalate (L2 only, needs comment) + Close
                const showEscalate = status === 'Under Review' && role.permissions.canEscalate;
                return (
                    <>
                        {showEscalate && (
                            <Button
                                size="sm"
                                variant="secondary"
                                disabled={!commentText.trim()}
                                onClick={() => handleAction('Escalate')}
                            >
                                Escalate
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAction('Close')}
                        >
                            Close
                        </Button>
                    </>
                );
            }
        }

        return null;
    };

    const footerContent = renderFooterActions();

    return (
        <div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.iconContainer}>
                        <Icon name={task.iconName} size={24} />
                    </div>
                    <h2 className={`${styles.title} text-body-strong`}>{task.title}</h2>
                </div>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close panel"
                >
                    <Icon name="close" size={20} />
                </button>
            </div>

            {/* Scrollable body */}
            <div className={styles.body}>
                {/* Status & Classification */}
                <div className={styles.section}>
                    <div className={styles.statusRow}>
                        <span className="text-caption">Status</span>
                        <Badge color={STATUS_BADGE_COLORS[status]} size="small" emphasis="subtle">
                            {status}
                        </Badge>
                    </div>
                    <p className={`${styles.classificationText} text-caption`}>
                        {record.category} &mdash; {record.type}
                    </p>
                </div>

                {/* Details */}
                <div className={styles.section}>
                    <h3 className={`${styles.sectionTitle} text-caption-strong`}>Details</h3>
                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                            <span className={`${styles.detailLabel} text-caption`}>Location</span>
                            <span className={`${styles.detailValue} text-body`}>
                                {record.location.name}
                                {record.location.area && ` - ${record.location.area}`}
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={`${styles.detailLabel} text-caption`}>Reported By</span>
                            <span className={`${styles.detailValueStacked} text-body`}>
                                {record.reportedBy.name}
                                <span className={styles.roleText}>{record.reportedBy.role}</span>
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={`${styles.detailLabel} text-caption`}>Created</span>
                            <span className={`${styles.detailValueStacked} text-body`}>
                                {formatDate(record.createdAt)}
                                <span className={styles.timeText}>{formatTime(record.createdAt)}</span>
                            </span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={`${styles.detailLabel} text-caption`}>Last Updated</span>
                            <span className={`${styles.detailValueStacked} text-body`}>
                                {formatDate(record.updatedAt)}
                                <span className={styles.timeText}>{formatTime(record.updatedAt)}</span>
                            </span>
                        </div>
                        {record.owner && (
                            <div className={styles.detailItem}>
                                <span className={`${styles.detailLabel} text-caption`}>Current Owner</span>
                                <span className={`${styles.detailValueStacked} text-body`}>
                                    {record.owner.name}
                                    <span className={styles.roleText}>{record.owner.role}</span>
                                </span>
                            </div>
                        )}
                        {record.closedBy && (
                            <div className={styles.detailItem}>
                                <span className={`${styles.detailLabel} text-caption`}>Closed By</span>
                                <span className={`${styles.detailValueStacked} text-body`}>
                                    {record.closedBy.name}
                                    <span className={styles.roleText}>{record.closedBy.role}</span>
                                    <span className={styles.timeText}>{formatDate(record.closedBy.timestamp)}</span>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* What Happened */}
                <div className={styles.section}>
                    <h3 className={`${styles.sectionTitle} text-caption-strong`}>What Happened</h3>
                    <p className={`${styles.sectionText} text-body`}>
                        {incidentDetail.description}
                    </p>
                    {incidentDetail.immediateAction && (
                        <>
                            <h4 className={`${styles.sectionSubtitle} text-caption-strong`}>Immediate Action Taken</h4>
                            <p className={`${styles.sectionText} text-body`}>
                                {incidentDetail.immediateAction}
                            </p>
                        </>
                    )}
                </div>

                {/* When & Where */}
                <div className={styles.section}>
                    <h3 className={`${styles.sectionTitle} text-caption-strong`}>When &amp; Where</h3>
                    <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                            <span className={`${styles.detailLabel} text-caption`}>Date</span>
                            <span className={`${styles.detailValue} text-body`}>{incidentDetail.dateOccurred}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={`${styles.detailLabel} text-caption`}>Time</span>
                            <span className={`${styles.detailValue} text-body`}>{incidentDetail.timeOccurred}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={`${styles.detailLabel} text-caption`}>Site</span>
                            <span className={`${styles.detailValue} text-body`}>{incidentDetail.site}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={`${styles.detailLabel} text-caption`}>Area</span>
                            <span className={`${styles.detailValue} text-body`}>{incidentDetail.area}</span>
                        </div>
                        {incidentDetail.asset && (
                            <div className={styles.detailItem}>
                                <span className={`${styles.detailLabel} text-caption`}>Asset / Equipment</span>
                                <span className={`${styles.detailValue} text-body`}>{incidentDetail.asset}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Injury Information (conditional) */}
                {incidentDetail.wasInjured && (
                    <div className={styles.section}>
                        <h3 className={`${styles.sectionTitle} text-caption-strong`}>Injury Information</h3>
                        <div className={styles.detailGrid}>
                            {incidentDetail.injuredEmployee && (
                                <div className={styles.detailItem}>
                                    <span className={`${styles.detailLabel} text-caption`}>Employee</span>
                                    <span className={`${styles.detailValue} text-body`}>{incidentDetail.injuredEmployee}</span>
                                </div>
                            )}
                            {incidentDetail.bodyPart && (
                                <div className={styles.detailItem}>
                                    <span className={`${styles.detailLabel} text-caption`}>Body Part</span>
                                    <span className={`${styles.detailValue} text-body`}>{incidentDetail.bodyPart}</span>
                                </div>
                            )}
                            {incidentDetail.treatment && (
                                <div className={styles.detailItem}>
                                    <span className={`${styles.detailLabel} text-caption`}>Treatment</span>
                                    <span className={`${styles.detailValue} text-body`}>{incidentDetail.treatment}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Contributing Factors */}
                {incidentDetail.contributingFactor && (
                    <div className={styles.section}>
                        <h3 className={`${styles.sectionTitle} text-caption-strong`}>Contributing Factors</h3>
                        <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                                <span className={`${styles.detailLabel} text-caption`}>Factor Type</span>
                                <span className={`${styles.detailValue} text-body`}>{incidentDetail.contributingFactor}</span>
                            </div>
                        </div>
                        {incidentDetail.contributingNotes && (
                            <p className={`${styles.sectionText} text-body`} style={{ marginTop: 'var(--space-2)' }}>
                                {incidentDetail.contributingNotes}
                            </p>
                        )}
                    </div>
                )}

                {/* Evidence */}
                {(incidentDetail.photoCount > 0 || incidentDetail.attachmentCount > 0) && (
                    <div className={styles.section}>
                        <h3 className={`${styles.sectionTitle} text-caption-strong`}>Evidence</h3>
                        <div className={styles.evidenceList}>
                            {incidentDetail.photoCount > 0 && (
                                <div className={styles.evidenceItem}>
                                    <Icon name="image" size={16} />
                                    <span className="text-body">{incidentDetail.photoCount} photo{incidentDetail.photoCount !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                            {incidentDetail.attachmentCount > 0 && (
                                <div className={styles.evidenceItem}>
                                    <Icon name="file" size={16} />
                                    <span className="text-body">{incidentDetail.attachmentCount} attachment{incidentDetail.attachmentCount !== 1 ? 's' : ''}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Corrective Action */}
                {incidentDetail.correctiveAction && (
                    <div className={styles.section}>
                        <h3 className={`${styles.sectionTitle} text-caption-strong`}>Corrective Action</h3>
                        <p className={`${styles.sectionText} text-body`}>
                            {incidentDetail.correctiveAction}
                        </p>
                    </div>
                )}

                {/* Review Comments */}
                <div className={styles.section}>
                    <h3 className={`${styles.sectionTitle} text-caption-strong`}>Review Comments</h3>

                    {allComments.length === 0 ? (
                        <p className={`${styles.noComments} text-body`}>No review comments yet.</p>
                    ) : (
                        <div className={styles.commentList}>
                            {allComments.map((comment) => (
                                <div key={comment.id} className={styles.commentItem}>
                                    <div className={styles.commentHeader}>
                                        <span className="text-body-strong">{comment.author.name}</span>
                                        <span className={`${styles.commentRole} text-caption`}>{comment.author.role}</span>
                                        <span className={`${styles.commentTime} text-caption`}>
                                            {formatDate(comment.timestamp)} {formatTime(comment.timestamp)}
                                        </span>
                                    </div>
                                    <p className={`${styles.commentText} text-body`}>
                                        {comment.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add comment form — visible to non-submitter reviewers on active records */}
                    {showCommentInput && (
                        <div className={styles.addComment}>
                            <textarea
                                className={`${styles.commentInput} text-body`}
                                placeholder="Add a review comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                rows={3}
                            />
                            <div className={styles.addCommentActions}>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim()}
                                >
                                    Add Comment
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Audit Trail */}
                {record.auditTrail.length > 0 && (
                    <AuditTrail entries={record.auditTrail} />
                )}
            </div>

            {/* Sticky footer with progressive actions */}
            {footerContent && (
                <div className={styles.footer}>
                    {footerContent}
                </div>
            )}
        </div>
    );
}
