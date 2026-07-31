import Toast from './Toast.vue';

/**
 * The primitives that carry no design of ours are re-exported straight from
 * reka-ui, so consumers still have a single import surface without a layer of
 * pass-through components that do nothing.
 */
export { ToastProvider, ToastAction, ToastPortal } from 'reka-ui';

export { Toast };
export { Toaster } from './toaster';
export { ToastViewport } from './toast-viewport';
export { ToastTitle } from './toast-title';
export { ToastDescription } from './toast-description';
export { ToastCloseButton } from './toast-close-button';
export type { ToastProps } from './Toast.types';
