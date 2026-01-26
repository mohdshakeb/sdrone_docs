'use client';

import React, { useState, useEffect } from 'react';
import { BaseModal } from './BaseModal';
import Button from './Button';
import styles from './Modal.module.css';

// List item for list-based modals
export interface ModalListItem {
  value: string;
  label: string;
  disabled?: boolean;
}

// List Modal Props
export interface ListModalProps {
  variant: 'list';
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: ModalListItem[];
  selectedValue?: string;
  onConfirm: (value: string) => void;
  confirmLabel?: string;
  cancelLabel?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Info Modal Props
export interface InfoModalProps {
  variant: 'info';
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  dismissLabel?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Action Modal Props
export interface ActionModalProps {
  variant: 'action';
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'negative' | 'positive';
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * ListModal - Selection modal with list of options
 */
export const ListModal: React.FC<Omit<ListModalProps, 'variant'>> = ({
  isOpen,
  onClose,
  title,
  items,
  selectedValue = '',
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  showCloseButton = true,
  size = 'md',
  className = '',
}) => {
  const [internalSelectedValue, setInternalSelectedValue] = useState<string>(selectedValue);

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setInternalSelectedValue(selectedValue || '');
    }
  }, [isOpen, selectedValue]);

  // Handle arrow key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const selectableItems = items.filter((item) => !item.disabled);
        const currentIndex = selectableItems.findIndex(
          (item) => item.value === internalSelectedValue
        );

        let nextIndex = currentIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % selectableItems.length;
        } else {
          nextIndex = (currentIndex - 1 + selectableItems.length) % selectableItems.length;
        }

        setInternalSelectedValue(selectableItems[nextIndex].value);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, internalSelectedValue]);

  const handleConfirm = () => {
    if (internalSelectedValue) {
      onConfirm(internalSelectedValue);
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button variant="primary" onClick={handleConfirm} disabled={!internalSelectedValue}>
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showCloseButton={showCloseButton}
      size={size}
      className={className}
      footer={footer}
    >
      <ul className={styles.listItems} role="listbox">
        {items.map((item) => (
          <li
            key={item.value}
            role="option"
            aria-selected={internalSelectedValue === item.value}
            aria-disabled={item.disabled}
            className={`${styles.listItem} text-body ${internalSelectedValue === item.value ? styles.listItemSelected : ''
              } ${item.disabled ? styles.listItemDisabled : ''}`}
            onClick={() => !item.disabled && setInternalSelectedValue(item.value)}
            tabIndex={item.disabled ? -1 : 0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) {
                e.preventDefault();
                setInternalSelectedValue(item.value);
              }
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </BaseModal>
  );
};

/**
 * InfoModal - Display information with dismiss button
 */
export const InfoModal: React.FC<Omit<InfoModalProps, 'variant'>> = ({
  isOpen,
  onClose,
  title,
  children,
  dismissLabel = 'OK',
  showCloseButton = true,
  size = 'md',
  className = '',
}) => {
  const footer = (
    <Button variant="primary" onClick={onClose}>
      {dismissLabel}
    </Button>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showCloseButton={showCloseButton}
      size={size}
      className={className}
      footer={footer}
    >
      <div className={styles.content}>{children}</div>
    </BaseModal>
  );
};

/**
 * ActionModal - Confirmation dialog for user actions
 */
export const ActionModal: React.FC<Omit<ActionModalProps, 'variant'>> = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  showCloseButton = true,
  size = 'md',
  className = '',
}) => {
  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      showCloseButton={showCloseButton}
      size={size}
      className={className}
      footer={footer}
    >
      <div className={styles.content}>{children}</div>
    </BaseModal>
  );
};
