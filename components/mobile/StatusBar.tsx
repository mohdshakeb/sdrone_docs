import React from 'react';
import styles from './StatusBar.module.css';

export default function StatusBar() {
    return (
        <div className={styles.statusBar}>
            <span className={`${styles.time} text-caption-strong`}>9:41</span>
            <div className={styles.icons}>
                {/* Signal bars */}
                <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden="true">
                    <rect x="0" y="9" width="3" height="3" rx="0.5" opacity="1" />
                    <rect x="4.5" y="6" width="3" height="6" rx="0.5" opacity="1" />
                    <rect x="9" y="3" width="3" height="9" rx="0.5" opacity="1" />
                    <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="1" />
                </svg>
                {/* WiFi */}
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
                    <path d="M8 9.6a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8ZM4.46 7.54a5 5 0 0 1 7.08 0l-.94.94a3.67 3.67 0 0 0-5.2 0l-.94-.94ZM1.93 5.01a8.33 8.33 0 0 1 12.14 0l-.94.94a7 7 0 0 0-10.26 0l-.94-.94Z" />
                </svg>
                {/* Battery */}
                <svg width="27" height="12" viewBox="0 0 27 12" fill="currentColor" aria-hidden="true">
                    <rect x="0.5" y="0.5" width="23" height="11" rx="2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
                    <rect x="24.5" y="3.5" width="2" height="5" rx="1" opacity="0.4" />
                    <rect x="2" y="2" width="20" height="8" rx="1" />
                </svg>
            </div>
        </div>
    );
}
