export interface InputProps {
  /**
   * Rendered on the real `<input>`, so an outside `<label for>` resolves.
   * Omit and one is generated.
   */
  id?: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  /** Paints the error ring. The message itself belongs to the caller. */
  hasError?: boolean;
  isDisabled?: boolean;
}
