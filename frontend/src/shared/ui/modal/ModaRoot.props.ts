export interface ModalRootProps {
  /**
   * Initial open state of the modal in uncontrolled mode.
   * Only used if `open` prop is not provided.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Controls the open state of the modal from the parent.
   * Can be used with `v-model:open` to bind the modal state.
   */
  open?: boolean;
  /**
   * If true, clicking outside the modal content will NOT close the modal.
   * Only has effect if modal is open.
   * @default false
   */
  disableOutsideClickClose?: boolean;
  /**
   * If true, the modal is considered controlled.
   * In controlled mode, parent must handle the `update:open` event or v-model binding.
   */
  isControlled?: boolean;
  /**
   * Callback to be called when the modal is toggled.
   */
  onToggle?: () => void;
  /**
   * Callback to be called when the modal is opened.
   */
  onModalOpen?: () => void;
  /**
   * Flag to state whether the modal is loading;
   */
  isLoading?: boolean;
}
