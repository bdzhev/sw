import type { SelectProps } from '@shared/ui/select';

export interface FormSelectProps extends Omit<SelectProps, 'hasError' | 'id'> {
  /** vee-validate field name. */
  name: string;
  /** Render the validation message under the field when there is one. */
  showError?: boolean;
}
