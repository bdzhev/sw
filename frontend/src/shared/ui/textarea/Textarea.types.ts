export interface TextareaProps {
  name: string;
  label?: string;
  /** Keep the name for screen readers, drop it visually. */
  isLabelHidden?: boolean;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  showError?: boolean;
}
