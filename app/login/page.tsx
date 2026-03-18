'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';
import { useTheme } from '@/components/ui/ThemeProvider';
import { EMAIL_TO_ROLE, ROLE_DEFINITIONS, DEFAULT_ROLE_LEVEL } from '@/types/roles';
import type { RoleLevel } from '@/types/roles';
import styles from './page.module.css';

const DEMO_ACCOUNTS = [
    { level: 1 as RoleLevel, email: 'rahul@sdrone.com' },
    { level: 2 as RoleLevel, email: 'priya@sdrone.com' },
    { level: 3 as RoleLevel, email: 'vikram@sdrone.com' },
];

export default function LoginPage() {
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Look up role by email, default to Level 2
        const roleLevel = EMAIL_TO_ROLE[email.toLowerCase().trim()] ?? DEFAULT_ROLE_LEVEL;
        localStorage.setItem('sdrone-role', String(roleLevel));

        // Mock login delay
        setTimeout(() => {
            setIsLoading(false);
            router.push('/sdrone');
        }, 1000);
    };

    const handleDemoAccountClick = (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('demo1234');
    };

    // Determine logo based on theme
    const logoSrc = theme === 'dark' ? '/logo_dark.png' : '/logo_light.png';

    return (
        <main className={styles.loginPage}>
            {/* Left Panel: Illustration */}
            <section className={styles.leftPanel}>
                <Image
                    src="/SAFETY DRONE.svg"
                    alt="Safety Drone Illustration"
                    width={600}
                    height={600}
                    className={styles.illustration}
                    priority
                />
            </section>

            {/* Right Panel: Login Form */}
            <section className={styles.rightPanel}>
                <div className={styles.loginContainer}>
                    <div className={styles.logoWrapper}>
                        {mounted && (
                            <Image
                                src={logoSrc}
                                alt="S-Drone Logo"
                                width={160}
                                height={40}
                                className={styles.logo}
                                priority
                            />
                        )}
                    </div>
                    <div className={styles.loginFormContainer}>
                    <div className={styles.header}>
                        <h1 className={`${styles.title} text-display`}>Welcome back</h1>
                        <p className={`${styles.subtitle} text-body`}>Login to your Safety Drone account</p>
                    </div>

                    <form className={styles.form} onSubmit={handleLogin}>
                        <FormField id="email" label="Email Address" required>
                            <TextInput
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </FormField>

                        <FormField id="password" label="Password" required>
                            <TextInput
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </FormField>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            isLoading={isLoading}
                        >
                            Sign in
                        </Button>
                    </form>

                    <div className={styles.footer}>
                        <div className={`${styles.divider} text-caption`}>
                            or continue with
                        </div>

                        <Button
                            variant="ghost"
                            fullWidth
                            onClick={() => {}}
                        >
                            Company SSO
                        </Button>

                        <p className="text-caption">
                            Don&apos;t have an account? <Button variant="link" size="sm" href="#" style={{ display: 'inline' }}>Contact your administrator</Button>
                        </p>
                    </div>
                    </div>

                    {/* Demo Accounts Section */}
                    <div className={styles.demoAccounts}>
                        <p className={`${styles.demoLabel} text-caption-strong`}>Demo Accounts</p>
                        <div className={styles.demoCards}>
                            {DEMO_ACCOUNTS.map(({ level, email: demoEmail }) => {
                                const role = ROLE_DEFINITIONS[level];
                                return (
                                    <button
                                        key={level}
                                        type="button"
                                        className={styles.demoCard}
                                        onClick={() => handleDemoAccountClick(demoEmail)}
                                    >
                                        <span className={`${styles.demoCardLevel} text-caption-strong`}>
                                            {role.label}
                                        </span>
                                        <span className={`${styles.demoCardName} text-body-strong`}>
                                            {role.userName}
                                        </span>
                                        <span className={`${styles.demoCardTitle} text-caption`}>
                                            {role.title}
                                        </span>
                                        <span className={`${styles.demoCardEmail} text-caption`}>
                                            {demoEmail}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
