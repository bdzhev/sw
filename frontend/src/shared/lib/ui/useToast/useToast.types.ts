export type ToastVariant = 'error' | 'neutral';

export interface ToastEntry {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
  /**
   * Flipped to false on dismiss, and the entry stays in the queue after that.
   * reka's `Presence` keeps the node mounted while `data-state="closed"`
   * animates, so removing the entry on dismiss unmounts it from underneath and
   * the exit animation never gets a frame.
   */
  isOpen: boolean;
}

export type ShowToastOptions = Omit<ToastEntry, 'id' | 'variant' | 'isOpen'> & {
  variant?: ToastVariant;
};
