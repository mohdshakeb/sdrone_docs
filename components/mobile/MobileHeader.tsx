'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useOptionalRole } from '@/components/prototype/RoleProvider';
import styles from './MobileHeader.module.css';
import { Icon } from '@/components/ui/Icon';

interface MobileHeaderProps {
    title: string;
    variant?: 'default' | 'detail';
    showLogo?: boolean;
    onPlusPress?: () => void;
    onAvatarPress?: () => void;
    rightAction?: React.ReactNode;
}

export default function MobileHeader({ title, variant = 'default', showLogo = false, onPlusPress, onAvatarPress, rightAction }: MobileHeaderProps) {
    const router = useRouter();
    const roleContext = useOptionalRole();

    // Calculate user initials from role context
    const userInitials = roleContext?.role.userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() ?? 'JD';

    if (variant === 'detail') {
        return (
            <header className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={() => router.back()}
                    aria-label="Go back"
                >
                    <Icon name="arrow-left" size={20} />
                </button>
                <span className={`${styles.titleLeft} text-body-strong`}>{title}</span>
                <div className={styles.rightSlot}>
                    {rightAction}
                </div>
            </header>
        );
    }

    return (
        <header className={styles.header}>
            <div className={styles.leftGroup}>
                <button
                    className={styles.avatar}
                    onClick={onAvatarPress}
                    aria-label="Open profile"
                >
                    <span className={`${styles.avatarText} text-caption-strong`}>{userInitials}</span>
                </button>
                {showLogo ? (
                    <div className={styles.logoWrapper}>
                        <img src="/logo_light.png" alt="S-Drone" className={styles.logoLight} />
                        <img src="/logo_dark.png" alt="S-Drone" className={styles.logoDark} />
                    </div>
                ) : (
                    <span className={`${styles.titleLeft} text-body-strong`}>{title}</span>
                )}
            </div>

            <div className={styles.rightGroup}>
                <button
                    className={styles.headerButton}
                    onClick={onPlusPress}
                    aria-label="Create new"
                >
                    <Icon name="add" size={20} />
                </button>
                <button
                    className={`${styles.headerButton} ${styles.sosButton}`}
                    aria-label="SOS"
                >
                    <Icon name="sos" size={20} />
                </button>
            </div>
        </header>
    );
}
