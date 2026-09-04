export interface FieldLabelProps {
  /**
   * The id of the control this labels, so clicking the label focuses it. Omit
   * only when there is no control — a caption over a read-only value.
   */
  fieldId?: string;
  /** Keep the name for screen readers, drop it visually. */
  isHidden?: boolean;
}
