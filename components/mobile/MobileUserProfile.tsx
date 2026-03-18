'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/components/prototype/RoleProvider';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Icon } from '@/components/ui/Icon';
import Badge from '@/components/ui/Badge';
import styles from './MobileUserProfile.module.css';

interface MobileUserProfileProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileUserProfile({ isOpen, onClose }: MobileUserProfileProps) {
    const router = useRouter();
    const { role } = useRole();
    const { theme, toggleTheme } = useTheme();
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Focus modal when opened
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus({ preventScroll: true });
        }
    }, [isOpen]);

    const handleLogout = () => {
        localStorage.removeItem('sdrone-role');
        router.push('/mobile-login');
        onClose();
    };

    const handleSettings = () => {
        router.push('/mobile/settings');
        onClose();
    };

    const handleThemeToggle = () => {
        toggleTheme();
    };

    // Calculate user initials
    const userInitials = role.userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <div
            className={styles.overlay}
            data-open={isOpen}
            onClick={onClose}
            aria-hidden={!isOpen}
        >
            <div
                ref={modalRef}
                className={styles.modal}
                data-open={isOpen}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="User Profile"
                tabIndex={-1}
            >
                {/* Header */}
                <div className={styles.header}>
                    <span className={`${styles.headerTitle} text-body-strong`}>Profile</span>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close profile"
                    >
                        <Icon name="close" size={20} />
                    </button>
                </div>

                {/* User Details Section */}
                <div className={styles.userSection}>
                    <div className={styles.avatar}>
                        <span className={styles.avatarText}>{userInitials}</span>
                    </div>
                    <h2 className={`${styles.userName} text-heading`}>{role.userName}</h2>
                    <p className={`${styles.userEmail} text-body`}>{role.userEmail}</p>
                    <Badge color="primary" size="small">{role.title}</Badge>
                </div>

                {/* Menu Items */}
                <div className={styles.menuSection}>
                    <button className={styles.menuItem} onClick={handleSettings}>
                        <div className={styles.menuItemIcon}>
                            <Icon name="settings" size={20} />
                        </div>
                        <span className="text-body-strong">Settings</span>
                        <Icon name="arrow-right" size={16} className={styles.menuItemChevron} />
                    </button>

                    <button className={styles.menuItem} onClick={handleThemeToggle}>
                        <div className={styles.menuItemIcon}>
                            <Icon name={theme === 'light' ? 'moon' : 'sun'} size={20} />
                        </div>
                        <span className="text-body-strong">
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                        <Icon name="arrow-right" size={16} className={styles.menuItemChevron} />
                    </button>
                </div>

                {/* Logout Button */}
                <div className={styles.footer}>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <Icon name="logout" size={20} />
                        <span className="text-body-strong">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
