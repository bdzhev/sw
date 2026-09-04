import type { AccordionItemVariant } from './AccordionItem.types';

export const surfaceClasses: Record<AccordionItemVariant, string> = {
  card: 'overflow-hidden rounded-md border border-border',
  plain: 'overflow-hidden',
};

/** `card` insets its actions slot off the surface edge; `plain` has no edge. */
export const headerClasses: Record<AccordionItemVariant, string> = {
  card: 'pr-2',
  plain: '',
};

/** The trigger keeps its 44px target either way; only the inset changes. */
export const triggerClasses: Record<AccordionItemVariant, string> = {
  card: 'p-3',
  plain: 'py-2',
};

export const contentClasses: Record<AccordionItemVariant, string> = {
  card: 'px-3 pb-3',
  plain: 'pb-1',
};
