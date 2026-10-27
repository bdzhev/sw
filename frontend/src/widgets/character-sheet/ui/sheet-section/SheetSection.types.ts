export type SheetSectionVariant = 'card' | 'plain' | 'accent';

export type SheetSectionHeadingLevel = 2 | 3;

export interface SheetSectionProps {
  /** Omit for an unlabelled grouping, e.g. the main tab's general section. */
  title?: string;
  /** Helper line under the title. */
  description?: string;
  /**
   * `card` — bordered surface, the default.
   * `plain` — heading and content only, for a subsection nested in a card.
   * `accent` — the pinned quick-reference surface.
   */
  variant?: SheetSectionVariant;
  /** `3` for a subsection nested inside another section. */
  headingLevel?: SheetSectionHeadingLevel;
}
