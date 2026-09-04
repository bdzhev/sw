import type { NumberFieldSize } from './NumberField.types';

/**
 * Only what differs between sizes. The shared input classes stay in the template
 * — splitting them all out here would mean two near-identical strings to keep in
 * step. `md` is the original look, so every existing call site is unchanged.
 */
export const inputSizeClasses: Record<NumberFieldSize, string> = {
  sm: 'px-1 text-base',
  md: 'px-2 text-xl',
};
