/**
 * `md` is the default entry box. `sm` is for a tight row of them — the header's
 * five stat fields at phone width, where five `md` boxes cannot fit one line.
 */
export type NumberFieldSize = 'sm' | 'md';

export interface NumberFieldProps {
  /** Required: the field needs an accessible name. */
  label: string;
  size?: NumberFieldSize;
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
