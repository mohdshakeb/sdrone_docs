'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AppSidebar.module.css';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { useTheme } from '@/components/ui/ThemeProvider';
import UserMenu from './UserMenu';

interface NavItem {
    label: string;
    href: string;
    icon: IconName;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Home', href: '/sdrone', icon: 'home' },
    { label: 'Inbox', href: '/sdrone/inbox', icon: 'inbox' },
    { label: 'History', href: '/sdrone/history', icon: 'archive' },
    { label: 'Alerts', href: '/sdrone/alerts', icon: 'alert' },
    { label: 'Insights', href: '/sdrone/insights', icon: 'chart' },
    { label: 'Settings', href: '/sdrone/settings', icon: 'settings' },
];

export default function AppSidebar({ className = '' }: { className?: string }) {
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className={`${styles.nav} ${className}`}>
            <div className={styles.logoContainer}>
                <Link href="/sdrone" className={styles.logoLink}>
                    <img
                        src="/logo_light.png"
                        alt="Logo"
                        className={styles.logoLight}
                    />
                    <img
                        src="/logo_dark.png"
                        alt="Logo"
                        className={styles.logoDark}
                    />
                </Link>
            </div>

            <div className={styles.navContainer}>
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
                                <Icon name={item.icon} size={20} />
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className={styles.themeToggleContainer}>
                <UserMenu />
            </div>
        </nav >
    );
}

