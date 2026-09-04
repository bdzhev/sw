/**
 * What the info dialog shows, regardless of which collection it came from.
 *
 * Lives in `config/` because both `useTraitsUi` and `useEquipmentUi` fill it and
 * one `DetailDialog` renders it. It was declared twice, identically, under two
 * names — `DetailPayload` and `ItemDetailPayload` — which is how a shared shape
 * drifts apart.
 */
export interface DetailPayload {
  title: string;
  description: string | null;
  meta: string;
}
