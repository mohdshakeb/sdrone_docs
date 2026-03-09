'use client';

import React, { useRef, useState, useEffect, ReactNode, UIEvent } from 'react';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

export default function ScrollArea({ children, className = '', onScroll, ...props }: ScrollAreaProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollRatio, setScrollRatio] = useState(0);
    const [thumbHeight, setThumbHeight] = useState(0);
    const [showScrollbar, setShowScrollbar] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateScrollbar = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

        if (scrollHeight > clientHeight) {
            setShowScrollbar(true);
            const ratio = scrollTop / (scrollHeight - clientHeight);
            setScrollRatio(ratio || 0);

            const heightRatio = clientHeight / scrollHeight;
            setThumbHeight(Math.max(heightRatio * clientHeight, 30));
        } else {
            setShowScrollbar(false);
        }
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        updateScrollbar();
        setIsScrolling(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsScrolling(false), 800);
        if (onScroll) onScroll(e);
    };

    useEffect(() => {
        updateScrollbar();

        const resizeObserver = new ResizeObserver(() => {
            updateScrollbar();
        });

        if (scrollRef.current) {
            resizeObserver.observe(scrollRef.current);
            if (scrollRef.current.firstElementChild) {
                resizeObserver.observe(scrollRef.current.firstElementChild);
            }
        }

        return () => {
            resizeObserver.disconnect();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [children]);

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <style>{`
                .hide-native-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-native-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div
                ref={scrollRef}
                className={"hide-native-scrollbar " + className}
                style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}
                onScroll={handleScroll}
                {...props}
            >
                {children}
            </div>

            {showScrollbar && (
                <div
                    style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bottom: 4,
                        width: 4,
                        pointerEvents: 'none',
                        zIndex: 100,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: scrollRatio * 100 + '%',
                            transform: 'translateY(-' + (scrollRatio * 100) + '%)',
                            right: 0,
                            width: '100%',
                            height: thumbHeight,
                            backgroundColor: 'var(--fg-muted)',
                            borderRadius: 4,
                            opacity: isScrolling ? 0.6 : 0,
                            transition: 'opacity 0.3s ease',
                        }}
                    />
                </div>
            )}
        </div>
    );
}
