export interface SwitchProps {
  /** Required: a switch with no accessible name is unusable. */
  label: string;
  /** Hide the label visually but keep it for screen readers. */
  isLabelHidden?: boolean;
  isDisabled?: boolean;
}
