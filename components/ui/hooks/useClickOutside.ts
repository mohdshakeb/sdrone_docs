import { useEffect, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null> | RefObject<T>,
    callback: () => void,
    enabled = true
) {
    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref, callback, enabled]);
}
