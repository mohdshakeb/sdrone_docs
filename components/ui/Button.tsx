import React from 'react';
import Link from 'next/link';
import styles from '@/components/ui/Button.module.css';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

// Map button sizes to typography utility classes
const SIZE_TO_TYPOGRAPHY: Record<ButtonSize, string> = {
    xs: 'text-caption-strong',
    sm: 'text-caption-strong',
    md: 'text-body-strong',
    lg: 'text-body-base',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'negative' | 'notice' | 'positive';
    size?: ButtonSize;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    href?: string;
    target?: string;
    children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    ({ className = '', variant = 'primary', size = 'md', leadingIcon, trailingIcon, href, children, ...props }, ref) => {
        const hasLeadingIcon = !!leadingIcon && !!children;
        const hasTrailingIcon = !!trailingIcon && !!children;

        const combinedClassName = [
            styles.button,
            styles[variant],
            styles[size],
            hasLeadingIcon && styles.hasLeadingIcon,
            hasTrailingIcon && styles.hasTrailingIcon,
            SIZE_TO_TYPOGRAPHY[size],
            className
        ].filter(Boolean).join(' ');
        const content = (
            <>
                {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
                {children}
                {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
            </>
        );

        if (href) {
            return (
                <Link
                    href={href}
                    className={combinedClassName}
                    // @ts-ignore - ref type mismatch between button and anchor is tricky in simple forwardRef
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    {...props as React.AnchorHTMLAttributes<HTMLAnchorElement>}
                >
                    {content}
                </Link>
            );
        }

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                className={combinedClassName}
                {...props}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
