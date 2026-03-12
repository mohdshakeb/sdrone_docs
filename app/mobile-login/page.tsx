'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MobileShell from '@/components/mobile/MobileShell';
import FormField from '@/components/ui/FormField';
import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';
import { useTheme } from '@/components/ui/ThemeProvider';
import styles from './page.module.css';

export default function MobileLoginPage() {
    const router = useRouter();
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock login delay
        setTimeout(() => {
            setIsLoading(false);
            router.push('/mobile');
        }, 1000);
    };

    // Determine logo based on theme
    const logoSrc = theme === 'dark' ? '/logo_dark.png' : '/logo_light.png';

    return (
        <MobileShell>
            <main className={styles.loginPage}>
                {/* Background Illustration */}
                <div className={styles.background}>
                    <Image
                        src="/SAFETY DRONE.svg"
                        alt="Safety Drone Illustration"
                        fill
                        className={styles.illustration}
                        priority
                    />
                </div>

                {/* Login Form Container */}
                <div className={styles.loginContainer}>
                    <div className={styles.loginFormContainer}>
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

                        <div className={styles.header}>
                            <h1 className={`${styles.title} text-heading`}>Welcome back</h1>
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

                            <Button variant="ghost" fullWidth>
                                Company SSO
                            </Button>

                            <p className={styles.helpText}>
                                Don&apos;t have an account?{' '}
                                <Button variant="link" size="sm" href="#">
                                    Contact your administrator
                                </Button>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </MobileShell>
    );
}
