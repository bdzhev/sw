export interface ItemDetailPayload {
  title: string;
  description: string | null;
  meta: string;
}

export interface PendingItemDelete {
  rowId: string;
  name: string;
}
