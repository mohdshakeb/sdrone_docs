'use client';

import { usePathname } from 'next/navigation';
import AppSidebar from '@/components/prototype/AppSidebar';
import AppHeader from '@/components/prototype/AppHeader';

export default function SDroneLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isReportPage = pathname?.startsWith('/sdrone/report');

    // Report page uses full-screen layout without sidebar
    if (isReportPage) {
        return <>{children}</>;
    }

    return (
        <div className="app-shell">
            <AppSidebar />
            <main className="main-content">
                <AppHeader />
                <div style={{ padding: 'var(--space-8)' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
