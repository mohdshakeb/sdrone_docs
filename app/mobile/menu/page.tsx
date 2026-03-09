'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import styles from './page.module.css';

interface MenuItem {
    label: string;
    icon: IconName;
    href: string;
    description: string;
}

const MENU_ITEMS: MenuItem[] = [
    {
        label: 'Insights',
        icon: 'chart',
        href: '/mobile/insights',
        description: 'Performance analytics & trends',
    },
    {
        label: 'Settings',
        icon: 'settings',
        href: '/mobile/settings',
        description: 'Preferences & configuration',
    },
];

export default function MobileMenuPage() {
    return (
        <div className={styles.container}>
            <nav className={styles.menuList} aria-label="Menu">
                {MENU_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={styles.menuItem}
                    >
                        <div className={styles.menuIcon}>
                            <Icon name={item.icon} size={20} />
                        </div>
                        <div className={styles.menuContent}>
                            <span className={`${styles.menuLabel} text-body-strong`}>{item.label}</span>
                            <span className={`${styles.menuDescription} text-caption`}>{item.description}</span>
                        </div>
                        <Icon name="arrow-right" size={16} />
                    </Link>
                ))}
            </nav>
        </div>
    );
}
