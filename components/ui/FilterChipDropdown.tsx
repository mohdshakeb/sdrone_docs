import Dropdown, { type DropdownOption, type DropdownItem } from '@/components/ui/Dropdown';

interface FilterChipDropdownProps {
    label: string;
    /** @deprecated Use `items` instead */
    options?: DropdownOption[];
    /** New discriminated union items prop */
    items?: DropdownItem[];
    value?: string | null;
    onChange?: (value: string | null) => void;
    disabled?: boolean;
}

/**
 * @deprecated Use `Dropdown` component with variant="list" instead.
 * This component is a backward-compatible wrapper around the new unified Dropdown component.
 *
 * Migration example:
 * ```tsx
 * // Old
 * <FilterChipDropdown label="Type" options={...} value={...} onChange={...} />
 *
 * // New
 * <Dropdown label="Type" options={...} value={...} onChange={...} />
 * ```
 */
export default function FilterChipDropdown(props: FilterChipDropdownProps) {
    return <Dropdown variant="list" {...props} />;
}

export type { DropdownOption, DropdownItem };
