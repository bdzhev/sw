import type { TextTheme } from '@shared/ui/text';

import type { StatusKey } from './StatusBar.types';

/**
 * The dot is `bg-current`, so one `text-*` drives both the fill and the
 * `currentColor` glow — no second colour to keep in step.
 */
export const dotClasses: Record<StatusKey, string> = {
  idle: 'text-secondary',
  pending: 'text-secondary',
  saving: 'animate-pulse text-warning shadow-[0_0_8px_currentColor]',
  saved: 'text-accent-primary shadow-[0_0_10px_currentColor]',
  error: 'animate-pulse text-danger shadow-[0_0_10px_currentColor]',
};

export const labelThemes: Record<StatusKey, TextTheme> = {
  idle: 'secondary',
  pending: 'secondary',
  saving: 'warning',
  saved: 'accent',
  error: 'danger',
};

/** Upward glow, so the bar reads as lit from its own edge rather than boxed. */
export const barClasses: Record<StatusKey, string> = {
  idle: 'border-border',
  pending: 'border-border',
  saving: 'border-warning/40',
  saved:
    'border-accent-primary/50 shadow-[0_-6px_20px_-12px_var(--color-accent-primary)]',
  error: 'border-danger/50 shadow-[0_-6px_20px_-12px_var(--color-danger)]',
};
