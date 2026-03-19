import type { Placement } from '@floating-ui/vue';
import type { Ref } from 'vue';

export interface DropdownMenuContext {
  isOpen: Ref<boolean>;
  toggleOpen: (val: boolean) => void;
  triggerEl: Ref<HTMLElement | null>;
  contentEl: Ref<HTMLElement | null>;
  portalTo: string;
  placement: Placement;
}
