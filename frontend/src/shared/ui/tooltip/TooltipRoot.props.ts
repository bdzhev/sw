import type { Placement } from '@floating-ui/vue';

export interface TooltipRootProps {
  /**
   * Selector to an element to which dropdown menu content
   * should be portalled.
   */
  portalTo?: string;
  delay?: number;
  placement?: Placement;
  offset?: number;
}
