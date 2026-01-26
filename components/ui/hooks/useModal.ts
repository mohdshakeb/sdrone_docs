import { useState } from 'react';

export interface UseModalReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

export function useModal(initialOpen = false): UseModalReturn {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen(prev => !prev);

    return { isOpen, open, close, toggle };
}
