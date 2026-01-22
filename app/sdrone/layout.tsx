import AppSidebar from '@/components/prototype/AppSidebar';
import AppHeader from '@/components/prototype/AppHeader';

export default function SDroneLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
    )
}
