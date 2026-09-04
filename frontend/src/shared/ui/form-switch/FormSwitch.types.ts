import type { SwitchProps } from '@shared/ui/switch';

export interface FormSwitchProps extends SwitchProps {
  /** vee-validate field name. */
  name: string;
  /** Render the message. On by default — a silent invalid switch stalls the form. */
  showError?: boolean;
}
