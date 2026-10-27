import DropdownMenuContent from './DropdownMenuContent.vue';

/**
 * The primitives that carry no design of ours are re-exported straight from
 * reka-ui, so consumers still have a single import surface without a layer of
 * pass-through components that do nothing.
 *
 * `DropdownMenuRoot` is modal by default, and that is what locks body scroll
 * while the menu is open — don't pass `:modal="false"` to work around a
 * positioning problem, the content is portalled and collision-aware already.
 */
export { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal } from 'reka-ui';

export { DropdownMenuContent };
export { DropdownMenuItem } from './dropdown-menu-item';
export type {
  DropdownMenuContentProps,
  DropdownMenuAlign,
  DropdownMenuSide,
} from './DropdownMenuContent.types';
