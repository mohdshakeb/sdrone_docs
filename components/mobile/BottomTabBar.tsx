'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomTabBar.module.css';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

interface TabItem {
    label: string;
    href: string;
    icon: IconName;
}

const TAB_ITEMS: TabItem[] = [
    { label: 'Home', href: '/mobile', icon: 'home' },
    { label: 'Inbox', href: '/mobile/inbox', icon: 'inbox' },
    { label: 'History', href: '/mobile/history', icon: 'archive' },
    { label: 'Alert', href: '/mobile/alerts', icon: 'alert' },
    { label: 'Menu', href: '/mobile/menu', icon: 'menu' },
];

export default function BottomTabBar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/mobile') {
            return pathname === '/mobile';
        }
        return pathname?.startsWith(href) ?? false;
    };

    return (
        <nav className={styles.tabBar} aria-label="Main navigation">
            <div className={styles.tabs}>
                {TAB_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={styles.tab}
                        data-active={isActive(item.href)}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                        <Icon name={item.icon} size={20} />
                        <span className={`${styles.label} text-caption-small`}>{item.label}</span>
                    </Link>
                ))}
            </div>
            <div className={styles.homeIndicator} />
        </nav>
    );
}
