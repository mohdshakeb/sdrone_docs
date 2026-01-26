import React from 'react';
import styles from './ColorSwatch.module.css';

export interface ColorSwatchProps {
  /** CSS variable name (e.g., '--color-primary-500') */
  token: string;
  /** Display name for the color */
  name?: string;
  /** Whether to show the hex value */
  showValue?: boolean;
  /** Layout mode */
  layout?: 'inline' | 'card';
}

/**
 * ColorSwatch component for displaying color tokens with live previews.
 * Shows the actual color from the design token system.
 */
export function ColorSwatch({
  token,
  name,
  showValue = true,
  layout = 'card',
}: ColorSwatchProps) {
  const displayName = name || token;

  return (
    <div className={`${styles.swatch} ${styles[`layout-${layout}`]}`}>
      <div
        className={styles.colorBox}
        style={{ backgroundColor: `var(${token})` }}
        aria-label={`Color swatch for ${displayName}`}
      />
      <div className={styles.info}>
        <div className={styles.name}>{displayName}</div>
        <code className={styles.token}>{token}</code>
        {showValue && (
          <div
            className={styles.value}
            style={{ color: `var(${token})` }}
          >
            <span className={styles.colorPreview}>█</span> Live preview
          </div>
        )}
      </div>
    </div>
  );
}
