export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  /**
   * Rendered on the trigger, so an outside `<label for>` resolves.
   * Omit and one is generated.
   */
  id?: string;
  options: SelectOption[];
  placeholder?: string;
  /** Rendered above the trigger, and its accessible name. */
  label?: string;
  isLabelHidden?: boolean;
  /** Paints the error ring. The message itself belongs to the caller. */
  hasError?: boolean;
  isDisabled?: boolean;
}
