export interface StatFieldProps {
  label: string;
  /** Read-only fields still show here (level) — they just don't edit. */
  isReadonly?: boolean;
  min?: number;
  max?: number;
}
