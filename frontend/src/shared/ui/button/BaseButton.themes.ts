export const textClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base font-medium',
  lg: 'text-lg font-medium',
};

export const paddingClasses = {
  equalPadding: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  },
  xs: 'px-3 py-1',
  sm: 'px-4 py-2',
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3',
};

export const roundClasses = {
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
};

/**
 * TODO - maybe move the text hover to base.
 * decide, when you ll get to the secondary variant.
 */
export const variantClasses = {
  primary:
    'bg-none text-accent-primary inset-ring-2 ring-accent-primary hover:bg-accent-secondary hover:inset-ring-0',
  secondary: 'bg-secondary-button hover:bg-secondary-button-hover text-primary',
  transparent: 'bg-transparent text-secondary hover:text-primary',
  danger:
    'bg-none text-danger inset-ring-danger inset-ring-2 ring-danger hover:bg-danger hover:text-primary hover:inset-ring-0',
};
