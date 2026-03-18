'use client';

import { usePathname } from 'next/navigation';
import AppSidebar from '@/components/prototype/AppSidebar';
import AppHeader from '@/components/prototype/AppHeader';
import { RoleProvider } from '@/components/prototype/RoleProvider';

export default function SDroneLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isFullScreenForm = pathname?.startsWith('/sdrone/report')
        || pathname?.startsWith('/sdrone/tool-audit');

    // Full-screen form pages use layout without sidebar
    if (isFullScreenForm) {
        return <RoleProvider>{children}</RoleProvider>;
    }

    return (
        <RoleProvider>
            <div className="app-shell">
                <AppSidebar />
                <main className="main-content">
                    <AppHeader />
                    <div>
                        {children}
                    </div>
                </main>
            </div>
        </RoleProvider>
    );
}
