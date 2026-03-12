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
    /** Visual style variant of the button
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary' | 'negative' | 'notice' | 'positive' | 'ghost' | 'link';
    /** Size of the button
     * @default 'md'
     */
    size?: ButtonSize;
    /** Whether the button only contains an icon (for square/circular layout)
     * @default false
     */
    iconOnly?: boolean;
    /** Icon displayed before the button text */
    leadingIcon?: React.ReactNode;
    /** Icon displayed after the button text */
    trailingIcon?: React.ReactNode;
    /** When provided, renders the button as a Next.js Link */
    href?: string;
    /** Link target attribute (only used when href is provided) */
    target?: string;
    /** Rel attribute for security (e.g., 'noopener noreferrer') */
    rel?: string;
    /** Whether the button should take up the full width of its container */
    fullWidth?: boolean;
    /** Whether the button is in a loading state */
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    ({
        className = '',
        variant = 'primary',
        size = 'md',
        iconOnly = false,
        leadingIcon,
        trailingIcon,
        href,
        target,
        rel,
        children,
        fullWidth = false,
        isLoading = false,
        disabled,
        ...props
    }, ref) => {
        const hasLeadingIcon = !!leadingIcon && !!children;
        const hasTrailingIcon = !!trailingIcon && !!children;

        const combinedClassName = [
            styles.button,
            styles[variant],
            styles[size],
            iconOnly && styles.iconOnly,
            hasLeadingIcon && styles.hasLeadingIcon,
            hasTrailingIcon && styles.hasTrailingIcon,
            fullWidth && styles.fullWidth,
            isLoading && styles.isLoading,
            SIZE_TO_TYPOGRAPHY[size],
            className
        ].filter(Boolean).join(' ');
        const content = (
            <>
                {isLoading ? (
                    <span className={styles.spinner} />
                ) : (
                    <>
                        {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
                        {children}
                        {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
                    </>
                )}
            </>
        );


        if (href) {
            return (
                <Link
                    href={href}
                    className={combinedClassName}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    rel={rel}
                    target={target}
                    {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
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
