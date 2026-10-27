export interface CheckboxProps {
  /** Required: the box needs an accessible name even when the label is hidden. */
  label: string;
  /** Hide the label visually — for a checkbox in a table cell whose column already names it. */
  isLabelHidden?: boolean;
  isDisabled?: boolean;
}
