'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Icon } from '@/components/ui/Icon';
import styles from './UserMenu.module.css';

interface UserMenuProps {
    name?: string;
    email?: string;
    avatarUrl?: string;
}

export default function UserMenu({
    name = 'Shakeb Mohd',
    email = 'shakeb@mohd.com',
    avatarUrl = ''
}: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        router.push('/login');
    };

    const handleSettings = () => {
        router.push('/sdrone/settings');
        setIsOpen(false);
    };

    const userInitials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className={styles.container} ref={menuRef}>
            <button 
                className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className={styles.avatar}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className={styles.avatarImage} />
                    ) : (
                        <div className={styles.avatarFallback}>{userInitials}</div>
                    )}
                </div>
                <div className={styles.info}>
                    <span className={`${styles.name} text-body-strong`}>{name}</span>
                    <span className={`${styles.email} text-caption`}>{email}</span>
                </div>
                <Icon 
                    name="chevron-up" 
                    size={16} 
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} 
                />
            </button>

            {isOpen && (
                <div className={styles.menu}>
                    <button className={styles.menuItem} onClick={handleSettings}>
                        <Icon name="settings" size={16} />
                        <span>Settings</span>
                    </button>
                    
                    <button className={styles.menuItem} onClick={toggleTheme}>
                        <Icon name={theme === 'light' ? 'moon' : 'sun'} size={16} />
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                    
                    <div className={styles.divider} />
                    
                    <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
                        <Icon name="logout" size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
}
