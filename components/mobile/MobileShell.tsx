'use client';

import React from 'react';
import styles from './MobileShell.module.css';

interface MobileShellProps {
    children: React.ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.device}>
                <div className={styles.screen}>
                    {children}
                </div>
            </div>
        </div>
    );
}
