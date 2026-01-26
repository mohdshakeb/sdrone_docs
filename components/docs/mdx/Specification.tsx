import React from 'react';
import styles from './Specification.module.css';

export interface SpecRow {
  /** Property/attribute name */
  property: string;
  /** Value */
  value: string;
  /** Optional description */
  description?: string;
  /** Optional color swatch (CSS variable) */
  color?: string;
}

export interface SpecificationProps {
  /** Array of specification rows */
  data: SpecRow[];
  /** Optional title */
  title?: string;
  /** Whether to show color swatches */
  showColors?: boolean;
}

/**
 * Specification component for design specification tables.
 * Displays design details like sizes, spacing, colors with optional swatches.
 */
export function Specification({
  data,
  title,
  showColors = false,
}: SpecificationProps) {
  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {showColors && <th>Preview</th>}
              <th>Property</th>
              <th>Value</th>
              {data.some((row) => row.description) && <th>Description</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {showColors && (
                  <td>
                    {row.color && (
                      <div
                        className={styles.colorSwatch}
                        style={{ backgroundColor: `var(${row.color})` }}
                        aria-label={`Color swatch for ${row.property}`}
                      />
                    )}
                  </td>
                )}
                <td>
                  <code className={styles.property}>{row.property}</code>
                </td>
                <td>
                  <code className={styles.value}>{row.value}</code>
                </td>
                {data.some((r) => r.description) && (
                  <td className={styles.description}>{row.description || '—'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
