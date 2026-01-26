import Dropdown from '@/components/ui/Dropdown';

interface DatePickerDropdownProps {
    label: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
    disabled?: boolean;
    minDate?: Date;
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
