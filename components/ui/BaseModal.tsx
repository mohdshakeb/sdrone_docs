'use client';

import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import Icon from './Icon';
import { useFocusTrap } from './hooks/useFocusTrap';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * BaseModal - Low-level modal component handling:
 * - Portal rendering
 * - Animation states
 * - Focus management
 * - Body scroll lock
 * - Backdrop and keyboard interactions
 */
export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  showCloseButton = true,
  size = 'md',
  className = '',
  children,
  footer,
}) => {
  // State for managing portal mounting and animations
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Focus trap
  useFocusTrap(dialogRef, isOpen && isAnimating);

  // Handle component mounting (SSR safety)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 150); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle focus management and body scroll lock
  useEffect(() => {
    if (!isOpen || !shouldRender) return;

    // Save currently focused element
    lastFocusedElementRef.current = document.activeElement as HTMLElement;

    // Focus first element in modal
    setTimeout(() => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    }, 50);

    // Lock body scroll and prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      lastFocusedElementRef.current?.focus();
    };
  }, [isOpen, shouldRender]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render anything on server or if modal shouldn't be visible
  if (!mounted || !shouldRender) {
    return null;
  }

  const modalContent = (
    <div
      className={`${styles.backdrop} ${isAnimating ? styles.backdropOpen : ''}`}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={`${styles.dialog} ${styles[size]} ${isAnimating ? styles.dialogOpen : ''
          } ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="modal-title" className={`${styles.title} text-heading`}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close modal"
            >
              <Icon name="close" size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className={`${styles.body} text-body`}>{children}</div>

        {/* Footer (if provided) */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
