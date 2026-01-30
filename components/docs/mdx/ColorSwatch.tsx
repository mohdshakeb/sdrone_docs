'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const colorBoxRef = useRef<HTMLDivElement>(null);
  const [hexValue, setHexValue] = useState<string>('');

  useEffect(() => {
    if (showValue && colorBoxRef.current) {
      const computedColor = window.getComputedStyle(colorBoxRef.current).backgroundColor;
      const hex = rgbToHex(computedColor);
      setHexValue(hex);
    }
  }, [showValue, token]);

  // Convert RGB to Hex
  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (!match) return rgb;

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    const toHex = (n: number) => {
      const hex = n.toString(16).toUpperCase();
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <div className={`${styles.swatch} ${styles[`layout-${layout}`]}`}>
      <div
        ref={colorBoxRef}
        className={styles.colorBox}
        style={{ backgroundColor: `var(${token})` }}
        aria-label={`Color swatch for ${displayName}`}
      />
      <div className={styles.info}>
        <div className={styles.name}>{displayName}</div>
        <code className={styles.token}>{token}</code>
        {showValue && hexValue && (
          <div className={styles.value}>
            {hexValue}
          </div>
        )}
      </div>
    </div>
  );
}
