import Sidebar from '@/components/docs/Sidebar'
import Header from '@/components/docs/Header'

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="app-shell">
            <Sidebar />
            <main className="main-content">
                <Header />
                <div style={{ padding: 'var(--space-8)' }}>
                    {children}
                </div>
            </main>
        </div>
    )
}
