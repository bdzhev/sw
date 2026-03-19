import type { Placement } from '@floating-ui/vue';

export interface DropdownMenuRootProps {
  defaultOpen?: boolean;
  closeOnOutsideClick?: boolean;
  /**
   * Selector to an element to which dropdown menu content
   * should be portalled.
   */
  portalTo?: string;
  /**
   * Placement of the dropdown menu.
   */
  placement?: Placement;
}
