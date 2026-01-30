'use client';

import React from 'react';
import AppSidebar from '@/components/prototype/AppSidebar';
import AppHeader from '@/components/prototype/AppHeader';

export default function NavigationShowcase() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* App Sidebar Preview */}
            <section>
                <div style={{
                    position: 'relative',
                    height: '400px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex'
                }}>
                    <div style={{ transform: 'translate(0, 0)', width: '240px', height: '100%' }}>
                        <AppSidebar className="demo-sidebar" />
                    </div>

                    <div style={{ flex: 1, backgroundColor: 'var(--bg-canvas)', padding: 0 /* Reset padding to allow full header width */ }}>
                        <AppHeader />
                        <div style={{ padding: '24px' }}>
                            <div style={{ padding: '24px', border: '1px dashed var(--border-subtle)', borderRadius: '8px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-subtle)' }}>
                                Page Content Area
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
        /* 
           We use a transform on the wrapper div to force fixed children 
           to be contained within it (creating a new containing block).
           But we also need to ensure the sidebar takes 100% height of PARENT, not viewport.
        */
        .demo-sidebar {
            position: absolute !important; /* Override fixed */
            height: 100% !important;
            z-index: 1 !important;
        }
      `}</style>
        </div>
    );
}
