import React from 'react';
import styles from './PropsTable.module.css';

export interface PropRow {
  /** Property name */
  prop: string;
  /** TypeScript type */
  type: string;
  /** Default value (optional) */
  default?: string;
  /** Whether the prop is required */
  required?: boolean;
  /** Description of the prop */
  description: string;
}

export interface PropsTableProps {
  /** Array of property definitions */
  data: PropRow[];
  /** Optional title for the table */
  title?: string;
}

/**
 * PropsTable component for documenting component properties.
 * Displays a standardized table with prop name, type, default, and description.
 */
export function PropsTable({ data, title }: PropsTableProps) {
  return (
    <div className={styles.wrapper}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>
                  <code className={styles.propName}>
                    {row.prop}
                    {row.required && <span className={styles.required}>*</span>}
                  </code>
                </td>
                <td>
                  <code className={styles.type}>{row.type}</code>
                </td>
                <td>
                  {row.default ? (
                    <code className={styles.default}>{row.default}</code>
                  ) : (
                    <span className={styles.empty}>—</span>
                  )}
                </td>
                <td className={styles.description}>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
