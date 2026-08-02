import type { ButtonSize, ButtonVariant, ButtonWidth } from './Button.types';

export const textClasses: Record<ButtonSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base font-medium',
  lg: 'text-lg font-medium',
};

export const widthClasses: Record<ButtonWidth, string> = {
  fit: 'w-fit',
  full: 'w-full',
  fullOnMobile: 'w-full sm:w-fit',
};

export const paddingClasses: Record<ButtonSize, string> = {
  xs: 'px-3 py-1',
  sm: 'px-4 py-2',
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3',
};

export const equalPaddingClasses: Record<ButtonSize, string> = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export const roundClasses: Record<ButtonSize, string> = {
  xs: 'rounded-sm',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
};

export const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-none text-accent-primary inset-ring-2 ring-accent-primary hover:bg-accent-secondary hover:inset-ring-0',
  secondary: 'bg-bg-raised hover:bg-bg-raised-hover text-primary',
  transparent: 'bg-transparent text-secondary hover:text-primary hover:bg-primary/10',
  /** Dim until hovered — the old icon-button default, now a colour like any other. */
  neutral: 'bg-transparent text-muted hover:text-primary hover:bg-primary/10',
  accent: 'bg-transparent text-branding hover:bg-branding/10',
  warning: 'bg-transparent text-warning hover:bg-warning/10',
  danger:
    'bg-none text-danger inset-ring-danger inset-ring-2 ring-danger hover:bg-danger hover:text-primary hover:inset-ring-0',
};
