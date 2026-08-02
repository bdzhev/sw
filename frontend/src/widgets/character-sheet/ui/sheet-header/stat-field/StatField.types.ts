export interface StatFieldProps {
  label: string;
  modelValue: number;
  /** Read-only fields still show here (level, speed) — they just don't edit. */
  readonly?: boolean;
  min?: number;
  max?: number;
}
