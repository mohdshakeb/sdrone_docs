'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import styles from './PhotoGrid.module.css';

interface PhotoGridProps {
    id: string;
    files: File[];
    onChange?: (files: File[]) => void;
    maxFiles?: number;
    hasError?: boolean;
    helpText?: string;
    readOnly?: boolean;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
    id,
    files,
    onChange,
    maxFiles = 5,
    hasError,
    helpText,
    readOnly = false,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const objectUrls = useMemo(
        () => files.map(f => URL.createObjectURL(f)),
        [files],
    );

    useEffect(() => {
        return () => {
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [objectUrls]);

    const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const incoming = Array.from(e.target.files ?? []);
        const merged = [...files, ...incoming].slice(0, maxFiles);
        onChange?.(merged);
        e.target.value = '';
    };

    const handleDelete = (index: number) => {
        onChange?.(files.filter((_, i) => i !== index));
    };

    const canAdd = !readOnly && files.length < maxFiles;

    return (
        <div className={styles.wrapper}>
            {!readOnly && (
                <span className={['text-caption', styles.label].join(' ')}>
                    Photos ({files.length}/{maxFiles})
                </span>
            )}
            <div className={styles.grid}>
                {objectUrls.map((url, i) => (
                    <div key={i} className={styles.thumb}>
                        <img src={url} alt={files[i].name} className={styles.thumbImg} />
                        {!readOnly && (
                            <button
                                type="button"
                                className={styles.deleteBtn}
                                onClick={() => handleDelete(i)}
                                aria-label={`Remove photo ${i + 1}`}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
                {canAdd && (
                    <button
                        type="button"
                        className={[styles.addSlot, hasError && styles.addSlotError].filter(Boolean).join(' ')}
                        onClick={() => inputRef.current?.click()}
                        aria-label="Add photo"
                    >
                        +
                    </button>
                )}
            </div>
            {helpText && !readOnly && (
                <span className={['text-caption', styles.helpText].join(' ')}>{helpText}</span>
            )}
            {!readOnly && (
                <input
                    ref={inputRef}
                    id={id}
                    type="file"
                    accept="image/*"
                    multiple
                    className={styles.hiddenInput}
                    onChange={handleAdd}
                />
            )}
        </div>
    );
};

export default PhotoGrid;
