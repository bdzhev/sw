import DialogContent from './DialogContent.vue';

/**
 * The primitives that carry no design of ours are re-exported straight from
 * reka-ui, so consumers still have a single import surface without a layer of
 * pass-through components that do nothing.
 */
export { DialogRoot, DialogTrigger, DialogPortal, DialogClose } from 'reka-ui';

export { DialogContent };
export { DialogOverlay } from './dialog-overlay';
export { DialogTitle } from './dialog-title';
export { DialogDescription } from './dialog-description';
export { DialogHeader } from './dialog-header';
export { DialogBody } from './dialog-body';
export { DialogFooter } from './dialog-footer';
export { DialogCloseButton } from './dialog-close-button';
export type { DialogContentProps } from './DialogContent.types';
