import type { NumberFieldProps } from '@shared/ui/number-field';

export interface FormNumberFieldProps extends NumberFieldProps {
  /** vee-validate field name. */
  name: string;
  /** Render the message and reserve room for it. */
  showError?: boolean;
}
