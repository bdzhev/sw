import type { Placement } from '@floating-ui/vue';
import type { Ref } from 'vue';

export interface TooltipContext {
  portalTo: string;
  isOpen: Ref<boolean>;
  triggerRef: Ref<HTMLElement | null>;
  contentRef: Ref<HTMLElement | null>;
  placement: Placement;
  offset: number;
}
