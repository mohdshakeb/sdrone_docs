import Dropdown from '@/components/ui/Dropdown';

export interface DatePickerDropdownProps {
    /** Label for the date picker */
    label: string;
    /** Currently selected date value */
    value: Date | null;
    /** Callback when date selection changes */
    onChange: (value: Date | null) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Minimum selectable date */
    minDate?: Date;
    /** Maximum selectable date */
    maxDate?: Date;
}

/**
 * @deprecated Use `Dropdown` component with variant="date" instead.
 * This component is a backward-compatible wrapper around the new unified Dropdown component.
 *
 * Migration example:
 * ```tsx
 * // Old
 * <DatePickerDropdown label="Date" value={date} onChange={setDate} />
 *
 * // New
 * <Dropdown variant="date" label="Date" value={date} onChange={setDate} />
 * ```
 */
export default function DatePickerDropdown(props: DatePickerDropdownProps) {
    return <Dropdown variant="date" {...props} />;
}
