'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import { Icon } from '@/components/ui/Icon';

export default function Sidebar({ className = '' }: { className?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className={styles.mobileToggle}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                <Icon name="menu" size={24} />
            </button>

            {/* Navigation */}
            <nav className={`${styles.nav} ${isOpen ? styles.open : ''} ${className}`}>
                <div className={styles.section}>
                    <h3 className={styles.heading}>Foundation</h3>
                    <ul className={styles.list}>
                        <li><Link href="/docs/colors" onClick={() => setIsOpen(false)}>Colors</Link></li>
                        <li><Link href="/docs/typography" onClick={() => setIsOpen(false)}>Typography</Link></li>
                        <li><Link href="/docs/spacing" onClick={() => setIsOpen(false)}>Spacing</Link></li>
                        <li><Link href="/docs/icons" onClick={() => setIsOpen(false)}>Icons</Link></li>
                    </ul>
                </div>
                <div className={styles.section}>
                    <h3 className={styles.heading}>Components</h3>
                    <ul className={styles.list}>
                        <li><Link href="/docs/buttons" onClick={() => setIsOpen(false)}>Buttons</Link></li>
                        <li><Link href="/docs/badge" onClick={() => setIsOpen(false)}>Badge</Link></li>
                        <li><Link href="/docs/filter-chip" onClick={() => setIsOpen(false)}>Filter Chip</Link></li>
                        <li><Link href="/docs/dropdown" onClick={() => setIsOpen(false)}>Dropdown Menu</Link></li>
                        <li><Link href="/docs/modal" onClick={() => setIsOpen(false)}>Modal</Link></li>
                        <li><Link href="/docs/inputs" onClick={() => setIsOpen(false)}>Inputs</Link></li>
                    </ul>
                </div>
            </nav>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 5
                    }}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
