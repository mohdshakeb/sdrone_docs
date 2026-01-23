'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';
import { useTheme } from '@/components/ui/ThemeProvider';
import styles from './Header.module.css';

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                {/* Placeholder Logo / Brand */}
                <Link href="/" className={styles.brand}>
                    Design System
                </Link>
            </div>

            <div className={styles.right}>
                {/* Theme Toggle - render placeholder or consistent state on server */}
                <button className={styles.iconButton} onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}>
                    {!mounted ? (
                        <div style={{ width: 20, height: 20 }} /> // Placeholder to prevent layout shift
                    ) : theme === 'light' ? (
                        <Icon name="moon" size={20} />
                    ) : (
                        <Icon name="sun" size={20} />
                    )}
                </button>

                {/* Prototype Button */}
                <Button size="sm" variant="primary" href="/sdrone" target="_blank">
                    Prototype
                </Button>
            </div>
        </header>
    );
}
