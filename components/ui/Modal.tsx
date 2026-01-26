'use client';

import React from 'react';
import { ListModal, InfoModal, ActionModal } from './ModalVariants';
import type { ListModalProps, InfoModalProps, ActionModalProps } from './ModalVariants';

// Re-export types and ModalListItem for backward compatibility
export type { ModalListItem } from './ModalVariants';
export type { ListModalProps, InfoModalProps, ActionModalProps };

export type ModalProps = ListModalProps | InfoModalProps | ActionModalProps;

/**
 * Modal - Unified modal component that routes to appropriate variant
 *
 * Refactored for better maintainability:
 * - BaseModal: Handles common logic (portal, focus, animations)
 * - ListModal, InfoModal, ActionModal: Variant-specific implementations
 * - Modal: Simple router between variants
 *
 * Usage remains the same:
 * ```tsx
 * <Modal variant="list" items={...} onConfirm={...} />
 * <Modal variant="info" children={...} />
 * <Modal variant="action" onConfirm={...} children={...} />
 * ```
 */
export const Modal: React.FC<ModalProps> = (props) => {
  // Route to appropriate variant component
  switch (props.variant) {
    case 'list':
      return <ListModal {...props} />;
    case 'info':
      return <InfoModal {...props} />;
    case 'action':
      return <ActionModal {...props} />;
    default:
      return null;
  }
};

export default Modal;
