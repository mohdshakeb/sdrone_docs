'use client';

import React, { useRef, useState, useCallback } from 'react';
import styles from './FileInput.module.css';
import Icon from './Icon';

export interface FileInputProps {
    /** Unique identifier */
    id?: string;
    /** Accepted file types (e.g., 'image/*', '.pdf,.doc') */
    accept?: string;
    /** Allow multiple file selection */
    multiple?: boolean;
    /** Maximum number of files allowed */
    maxFiles?: number;
    /** Maximum file size in bytes */
    maxSize?: number;
    /** Current files (controlled) */
    files?: File[];
    /** Callback when files change */
    onChange?: (files: File[]) => void;
    /** Whether the field has an error */
    hasError?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Custom placeholder text */
    placeholder?: string;
    /** Help text shown below dropzone */
    helpText?: string;
    /** Additional className */
    className?: string;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (file: File): 'image' | 'file' => {
    if (file.type.startsWith('image/')) {
        return 'image';
    }
    return 'file';
};

export const FileInput: React.FC<FileInputProps> = ({
    id,
    accept,
    multiple = false,
    maxFiles = 10,
    maxSize,
    files = [],
    onChange,
    hasError = false,
    disabled = false,
    placeholder = 'Drag files here or click to browse',
    helpText,
    className = '',
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFiles = useCallback((newFiles: FileList | null) => {
        if (!newFiles || disabled) return;

        const fileArray = Array.from(newFiles);
        let validFiles = fileArray;

        // Filter by max size if specified
        if (maxSize) {
            validFiles = validFiles.filter(file => file.size <= maxSize);
        }

        // Limit total files
        const totalFiles = multiple ? [...files, ...validFiles] : validFiles.slice(0, 1);
        const limitedFiles = totalFiles.slice(0, maxFiles);

        onChange?.(limitedFiles);
    }, [disabled, files, maxFiles, maxSize, multiple, onChange]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragOver(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        // Reset input so same file can be selected again
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [handleFiles]);

    const handleClick = useCallback(() => {
        if (!disabled) {
            inputRef.current?.click();
        }
    }, [disabled]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
        }
    }, [disabled]);

    const handleRemove = useCallback((index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        onChange?.(newFiles);
    }, [files, onChange]);

    const dropzoneClassName = [
        styles.dropzone,
        isDragOver && styles.dragOver,
        hasError && styles.error,
        disabled && styles.disabled,
        className,
    ].filter(Boolean).join(' ');

    const canAddMore = multiple && files.length < maxFiles;

    return (
        <div className={styles.wrapper}>
            {/* Dropzone - only show if no files or can add more */}
            {(files.length === 0 || canAddMore) && (
                <div
                    className={dropzoneClassName}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    aria-disabled={disabled}
                >
                    <input
                        ref={inputRef}
                        id={id}
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        onChange={handleInputChange}
                        className={styles.input}
                        disabled={disabled}
                        aria-hidden="true"
                        tabIndex={-1}
                    />
                    <div className={styles.dropzoneContent}>
                        <Icon name="upload" size={32} className={styles.uploadIcon} />
                        <p className={[styles.placeholder, 'text-body'].join(' ')}>{placeholder}</p>
                        {helpText && (
                            <p className={[styles.helpText, 'text-caption'].join(' ')}>{helpText}</p>
                        )}
                    </div>
                </div>
            )}

            {/* File list */}
            {files.length > 0 && (
                <ul className={styles.fileList}>
                    {files.map((file, index) => (
                        <li key={`${file.name}-${index}`} className={styles.fileItem}>
                            <Icon name={getFileIcon(file)} size={20} className={styles.fileIcon} />
                            <div className={styles.fileInfo}>
                                <span className={[styles.fileName, 'text-body'].join(' ')}>
                                    {file.name}
                                </span>
                                <span className={[styles.fileSize, 'text-caption'].join(' ')}>
                                    {formatFileSize(file.size)}
                                </span>
                            </div>
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={() => handleRemove(index)}
                                aria-label={`Remove ${file.name}`}
                                disabled={disabled}
                            >
                                <Icon name="close" size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* File count indicator */}
            {multiple && files.length > 0 && (
                <p className={[styles.fileCount, 'text-caption'].join(' ')}>
                    {files.length} of {maxFiles} files
                </p>
            )}
        </div>
    );
};

export default FileInput;
