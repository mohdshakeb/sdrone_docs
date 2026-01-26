'use client';

import React, { useState } from 'react';
import styles from './CodeBlock.module.css';
import { Icon } from '@/components/ui/Icon';

export interface CodeBlockProps {
  /** The code content to display */
  children: React.ReactNode;
  /** Optional language identifier */
  language?: string;
  /** Optional filename to display in header */
  filename?: string;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Maximum height before scrolling */
  maxHeight?: string;
}

/**
 * CodeBlock component for displaying code with syntax highlighting and copy functionality.
 * Supports optional language tag, filename, and line numbers.
 */
export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
  maxHeight,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract text content from children
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      if (props.children) {
        return getTextContent(props.children);
      }
    }
    return '';
  };

  const codeText = getTextContent(children);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const hasHeader = language || filename;

  return (
    <div className={styles.wrapper}>
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {filename && <span className={styles.filename}>{filename}</span>}
            {language && <span className={styles.language}>{language}</span>}
          </div>
          <button
            onClick={handleCopy}
            className={styles.copyButton}
            aria-label="Copy code to clipboard"
            title="Copy code"
          >
            <Icon name={copied ? 'check' : 'file'} size={16} />
            <span className={styles.copyText}>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      )}
      <div className={styles.codeContainer} style={{ maxHeight }}>
        <pre className={styles.pre}>
          <code className={styles.code}>{children}</code>
        </pre>
        {!hasHeader && (
          <button
            onClick={handleCopy}
            className={styles.floatingCopyButton}
            aria-label="Copy code to clipboard"
            title="Copy code"
          >
            <Icon name={copied ? 'check' : 'file'} size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
