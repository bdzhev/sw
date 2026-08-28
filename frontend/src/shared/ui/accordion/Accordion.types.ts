export interface AccordionProps {
  /**
   * `single` closes the open panel when another opens — one thing readable at a
   * time. `multiple` leaves that to the reader.
   */
  type?: 'single' | 'multiple';
  /** `single` only: allow closing the open panel by tapping its own trigger. */
  isCollapsible?: boolean;
}
