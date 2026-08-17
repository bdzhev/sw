export interface InputProps {
  /**
   * Rendered on the real `<input>`, so an outside `<label for>` resolves.
   * Omit and one is generated.
   */
  id?: string;
  type?: string;
  /**
   * On-screen keyboard for a numeric field that must stay a **text** input.
   * `type="number"` is not the way to ask for digits here: Vue's `v-model` casts
   * the model to a number whenever the element's type is `number`, which breaks
   * every schema that treats an empty box as "unset", and the browser also drops
   * an in-progress `-`.
   */
  inputMode?: 'text' | 'numeric' | 'decimal';
  placeholder?: string;
  autocomplete?: string;
  /** Paints the error ring. The message itself belongs to the caller. */
  hasError?: boolean;
  isDisabled?: boolean;
}
