import type { ToastVariant } from '@shared/lib/ui';

export interface ToastProps {
  variant?: ToastVariant;
  /**
   * Controlled on purpose. Left `undefined` reka manages `open` internally, but
   * the queue needs the entry to outlive its own dismissal: `Presence` only
   * holds the node for the exit animation while the component stays mounted.
   */
  open?: boolean;
}
