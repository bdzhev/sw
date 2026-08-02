export interface NumberFieldProps {
  /** Required: the field needs an accessible name. */
  label: string;
  isLabelHidden?: boolean;
  min?: number;
  max?: number;
  step?: number;
  isDisabled?: boolean;
  /** Render the −/+ buttons. Off for a plain entry box. */
  hasStepper?: boolean;
  /** Decrement/increment need their own names when the stepper is shown. */
  decrementLabel?: string;
  incrementLabel?: string;
}
