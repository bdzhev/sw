export interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  maxWidth?: number;
  disabled?: boolean;
  type?: string;
  autocomplete?: string;
  validateOnValueUpdate?: boolean;
  cleanErrorsOnFocus?: boolean;
  showError?: boolean;
}
