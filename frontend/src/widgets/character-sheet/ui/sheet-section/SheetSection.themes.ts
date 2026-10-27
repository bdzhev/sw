import type { SheetSectionHeadingLevel, SheetSectionVariant } from './SheetSection.types';

export const shellClasses: Record<SheetSectionVariant, string> = {
  card: 'gap-3 rounded-lg border border-border bg-bg-secondary p-4 md:p-6',
  plain: 'gap-3',
  accent:
    'gap-3 rounded-lg border border-accent-primary/30 bg-bg-secondary/40 p-3 md:p-4',
};

export const headingTags: Record<SheetSectionHeadingLevel, string> = {
  2: 'h2',
  3: 'h3',
};
