'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import MobileShell from '@/components/mobile/MobileShell';
import StatusBar from '@/components/mobile/StatusBar';
import MobileHeader from '@/components/mobile/MobileHeader';
import BottomTabBar from '@/components/mobile/BottomTabBar';
import BottomSheet from '@/components/mobile/BottomSheet';
import type { BottomSheetAction } from '@/components/mobile/BottomSheet';
import styles from './layout.module.css';

const PAGE_TITLES: Record<string, string> = {
    '/mobile': 'S-Drone',
    '/mobile/inbox': 'Inbox',
    '/mobile/history': 'History',
    '/mobile/alerts': 'Alerts',
    '/mobile/insights': 'Insights',
    '/mobile/settings': 'Settings',
    '/mobile/menu': 'Menu',
};

export default function MobileLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sheetOpen, setSheetOpen] = useState(false);

    // Determine page title
    const title = PAGE_TITLES[pathname ?? ''] ?? 'S-Drone';

    // Detail pages have back button and no bottom tabs
    const isDetailPage = /^\/mobile\/history\/[^/]+$/.test(pathname ?? '');

    // Pages accessed from Menu that should show detail-style header with back
    const isSubPage = pathname === '/mobile/insights' || pathname === '/mobile/settings';

    const sheetActions: BottomSheetAction[] = [
        {
            label: 'Report Incident',
            icon: 'fire',
            onClick: () => router.push('/sdrone/report'),
        },
        {
            label: 'Create New',
            icon: 'add',
            onClick: () => router.push('/sdrone/tool-audit'),
        },
    ];

    const headerVariant = isDetailPage || isSubPage ? 'detail' : 'default';
    const showTabs = !isDetailPage && !isSubPage;
    const isHome = pathname === '/mobile';

    return (
        <MobileShell>
            <StatusBar />
            <MobileHeader
                title={isDetailPage ? 'Record Detail' : title}
                variant={headerVariant}
                showLogo={isHome}
                onPlusPress={() => setSheetOpen(true)}
            />
            <div className={styles.content}>
                {children}
            </div>
            {showTabs && <BottomTabBar />}
            <BottomSheet
                isOpen={sheetOpen}
                onClose={() => setSheetOpen(false)}
                title="Quick Actions"
                actions={sheetActions}
            />
        </MobileShell>
    );
}
