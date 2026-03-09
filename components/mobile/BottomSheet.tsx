'use client';

import React, { useEffect, useRef } from 'react';
import styles from './BottomSheet.module.css';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

export interface BottomSheetAction {
    label: string;
    icon: IconName;
    onClick: () => void;
}

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    actions: BottomSheetAction[];
}

export default function BottomSheet({ isOpen, onClose, title, actions }: BottomSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Focus the sheet when opened
    useEffect(() => {
        if (isOpen && sheetRef.current) {
            sheetRef.current.focus({ preventScroll: true });
        }
    }, [isOpen]);

    return (
        <div
            className={styles.overlay}
            data-open={isOpen}
            onClick={onClose}
            aria-hidden={!isOpen}
        >
            <div
                ref={sheetRef}
                className={styles.sheet}
                data-open={isOpen}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title || 'Actions'}
                tabIndex={-1}
            >
                <div className={styles.handle} />

                {title && (
                    <div className={styles.sheetHeader}>
                        <span className={`${styles.sheetTitle} text-caption-strong`}>{title}</span>
                    </div>
                )}

                <div className={styles.actionList}>
                    {actions.map((action) => (
                        <button
                            key={action.label}
                            className={styles.actionItem}
                            onClick={() => {
                                action.onClick();
                                onClose();
                            }}
                        >
                            <div className={styles.actionIcon}>
                                <Icon name={action.icon} size={20} />
                            </div>
                            <span className="text-body-strong">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
