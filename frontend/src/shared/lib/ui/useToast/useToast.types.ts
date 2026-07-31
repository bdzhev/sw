export type ToastVariant = 'error' | 'neutral';

export interface ToastEntry {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

export type ShowToastOptions = Omit<ToastEntry, 'id' | 'variant'> & {
  variant?: ToastVariant;
};
