import React from 'react';
import styles from './PropsTable.module.css';
import componentPropsData from '@/public/component-props/all-components.json';

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
  /** Component name to auto-load props (e.g., "Button") - NEW automated way */
  component?: string;
  /** Array of property definitions - OLD manual way, kept for backward compatibility */
  data?: PropRow[];
  /** Optional title for the table */
  title?: string;
}

/**
 * PropsTable component for documenting component properties.
 * Displays a standardized table with prop name, type, default, and description.
 *
 * Usage:
 * - New (automated): <PropsTable component="Button" />
 * - Old (manual): <PropsTable data={[...]} />
 */
export function PropsTable({ component, data, title }: PropsTableProps) {
  // Auto-load props from extracted data if component name is provided
  let propsData: PropRow[] = data || [];

  if (component && !data) {
    const componentData = (componentPropsData as any)[component];

    if (componentData && componentData.props) {
      propsData = componentData.props.map((prop: any) => ({
        prop: prop.name,
        type: prop.type,
        default: prop.defaultValue,
        required: prop.required,
        description: prop.description,
      }));
    } else {
      console.warn(`PropsTable: No props found for component "${component}"`);
    }
  }

  if (propsData.length === 0) {
    return (
      <div className={styles.wrapper}>
        <p style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>
          No props documented for this component.
        </p>
      </div>
    );
  }

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
            {propsData.map((row, index) => (
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
