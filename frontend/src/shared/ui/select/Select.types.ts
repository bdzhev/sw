export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  name: string;
  options: SelectOption[];
  placeholder?: string;
  /** Rendered above the trigger, and its accessible name. */
  label?: string;
  isLabelHidden?: boolean;
}
