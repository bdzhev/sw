import type { InputProps } from '@shared/ui/input';

export interface FormInputProps extends Omit<InputProps, 'hasError'> {
  /** vee-validate field name. */
  name: string;
  label?: string;
  /** Validate on every keystroke rather than on blur/submit. */
  validateOnValueUpdate?: boolean;
  /** Clear the field's errors when it takes focus. */
  cleanErrorsOnFocus?: boolean;
  /** Render the message and reserve room for it. */
  showError?: boolean;
}
