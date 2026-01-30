'use client';

import React from 'react';
import { useTheme } from '@/components/ui/ThemeProvider';

export default function SemanticColorTable() {
    const { theme } = useTheme();

    // We need to handle the initial mount to avoid hydration mismatch, 
    // but since this is documentation, defaulting to light or current is fine 
    // as long as we use the 'mounted' pattern if needed.
    // Using the same pattern as Header to be safe.
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // or loading skeleton

    const isDark = theme === 'dark';

    const lightBackgrounds = [
        { name: 'bg-canvas', ref: 'warm-50', desc: 'Main page background' },
        { name: 'bg-subtle', ref: 'white', desc: 'Secondary backgrounds' },
        { name: 'bg-emphasis', ref: 'warm-100', desc: 'Contrasting elements' },
        { name: 'bg-surface', ref: 'white', desc: 'Surface elements (Cards, Chips)' },
        { name: 'bg-accent', ref: 'primary-600', desc: 'Primary actions' },
        { name: 'bg-accent-soft', ref: 'primary-alpha-20', desc: 'Light accent backgrounds' },
        { name: 'border-emphasis', ref: 'warm-400', desc: 'Strong borders' },
        { name: 'border-subtle', ref: 'warm-100', desc: 'Subtle separators' },
    ];

    const darkBackgrounds = [
        { name: 'bg-canvas', ref: 'cool-950', desc: 'Main page background' },
        { name: 'bg-subtle', ref: 'cool-900', desc: 'Secondary backgrounds' },
        { name: 'bg-emphasis', ref: 'cool-800', desc: 'Contrasting elements' },
        { name: 'bg-surface', ref: 'cool-800', desc: 'Surface elements (Cards, Chips)' },
        { name: 'bg-accent', ref: 'primary-600', desc: 'Primary actions' },
        { name: 'bg-accent-soft', ref: 'primary-alpha-20', desc: 'Light accent backgrounds' },
        { name: 'border-emphasis', ref: 'cool-400', desc: 'Strong borders' },
        { name: 'border-subtle', ref: 'cool-800', desc: 'Subtle separators' },
    ];

    const lightForegrounds = [
        { name: 'fg-default', ref: 'warm-900', bg: 'var(--color-warm-50)' },
        { name: 'fg-subtle', ref: 'warm-600', bg: 'var(--color-warm-50)' },
        { name: 'fg-muted', ref: 'warm-300', bg: 'var(--color-warm-50)' },
        { name: 'fg-accent', ref: 'primary-500', bg: 'var(--color-warm-50)' },
        { name: 'fg-accent-emphasis', ref: 'primary-900', bg: 'var(--color-primary-alpha-20)' },
        { name: 'fg-on-accent', ref: 'white', bg: 'var(--color-primary-600)' },
    ];

    const darkForegrounds = [
        { name: 'fg-default', ref: 'cool-50', bg: 'var(--color-cool-950)' },
        { name: 'fg-subtle', ref: 'cool-400', bg: 'var(--color-cool-950)' },
        { name: 'fg-muted', ref: 'cool-500', bg: 'var(--color-cool-950)' },
        { name: 'fg-accent', ref: 'primary-500', bg: 'var(--color-cool-950)' },
        { name: 'fg-accent-emphasis', ref: 'primary-50', bg: 'var(--color-primary-600)' },
        { name: 'fg-on-accent', ref: 'white', bg: 'var(--color-primary-600)' },
    ];

    const backgrounds = isDark ? darkBackgrounds : lightBackgrounds;
    const foregrounds = isDark ? darkForegrounds : lightForegrounds;

    return (
        <div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', marginBottom: '24px', border: '1px solid var(--border-subtle)' }}>
                <strong>Current Theme:</strong> {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </div>

            <h3>Backgrounds & Borders</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '32px' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Token</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Refers To</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Preview</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {backgrounds.map(token => (
                        <tr key={token.name}>
                            <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}><code>--{token.name}</code></td>
                            <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9em', color: 'var(--fg-subtle)' }}>{token.ref}</td>
                            <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-subtle)',
                                    backgroundColor: `var(--color-${token.ref})`
                                }} />
                            </td>
                            <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>{token.desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Foregrounds (Text)</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Token</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Refers To</th>
                        <th style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>Preview</th>
                    </tr>
                </thead>
                <tbody>
                    {foregrounds.map(token => (
                        <tr key={token.name}>
                            <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}><code>--{token.name}</code></td>
                            <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9em', color: 'var(--fg-subtle)' }}>{token.ref}</td>
                            <td style={{ padding: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div style={{
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-subtle)',
                                    backgroundColor: token.bg,
                                    color: `var(--color-${token.ref})`,
                                    fontWeight: 500
                                }}>
                                    The quick brown fox
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
