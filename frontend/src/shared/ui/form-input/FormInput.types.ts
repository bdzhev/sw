import type { InputProps } from '@shared/ui/input';

export interface FormInputProps extends Omit<InputProps, 'hasError'> {
  /** vee-validate field name. */
  name: string;
  /** Validate on every keystroke rather than on blur/submit. */
  validateOnValueUpdate?: boolean;
  /** Clear the field's errors when it takes focus. */
  cleanErrorsOnFocus?: boolean;
  /** Render the validation message under the field when there is one. */
  showError?: boolean;
}
