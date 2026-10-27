export type AccordionItemVariant = 'card' | 'plain';

export interface AccordionItemProps {
  /** Identifies the panel to the root's model. Must be unique within one accordion. */
  value: string;
  /**
   * `card` — its own bordered surface, for a list of items.
   * `plain` — no surface, for a single collapsible inside a section that
   * already has one. Nesting a `card` there would draw a box inside a box, and
   * a consumer `class` cannot override a built-in utility of equal specificity.
   */
  variant?: AccordionItemVariant;
}
