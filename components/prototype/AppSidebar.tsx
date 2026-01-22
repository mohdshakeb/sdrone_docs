'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './AppSidebar.module.css';
import { Icon } from '@/components/ui/Icon';

const NAV_ITEMS = [
    { label: 'Inbox', href: '/sdrone', icon: 'inbox' },
    { label: 'History', href: '/sdrone/history', icon: 'archive' },
    { label: 'Alerts', href: '/sdrone/alerts', icon: 'alert' },
    { label: 'Insights', href: '/sdrone/insights', icon: 'chart' },
    { label: 'Settings', href: '/sdrone/settings', icon: 'settings' },
] as const;

import { useTheme } from '@/components/ui/ThemeProvider';

export default function AppSidebar({ className = '' }: { className?: string }) {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className={`${styles.nav} ${className}`}>
            <div className={styles.logoContainer}>
                <Link href="/sdrone" style={{ display: 'flex' }}>
                    <img
                        src="/logo_light.png"
                        alt="Logo"
                        className={styles.logoLight}
                        style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                    />
                    <img
                        src="/logo_dark.png"
                        alt="Logo"
                        className={styles.logoDark}
                        style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                    />
                </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.link} text-body-strong`}
                            data-active={isActive}
                        >
                            <span className={styles.icon}>
                                <Icon name={item.icon as any} size={20} />
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'var(--bg-strong)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '9999px',
                        width: '100%',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--space-2)',
                        cursor: 'pointer',
                        color: 'var(--fg-neutral)',
                        transition: 'all 0.2s ease'
                    }}
                    className="text-caption-strong"
                >
                    {!mounted ? (
                        <div style={{ width: 20, height: 20 }} />
                    ) : theme === 'light' ? (
                        <>
                            <Icon name="moon" size={20} />
                            <span>Switch to Dark</span>
                        </>
                    ) : (
                        <>
                            <Icon name="sun" size={20} />
                            <span>Switch to Light</span>
                        </>
                    )}
                </button>
            </div>
        </nav >
    );
}

