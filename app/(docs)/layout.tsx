import Sidebar from '@/components/docs/Sidebar'
import AppHeader from '@/components/prototype/AppHeader'

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="app-shell" data-docs="true">
            <Sidebar />
            <main className="main-content">
                <AppHeader variant="docs" />
                <div className="docs-content" style={{ padding: 'var(--space-8) var(--space-8) var(--space-12) var(--space-8)' }}>
                    {children}
                </div>
            </main>
        </div>
    )
}
