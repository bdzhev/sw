/** What the info dialog shows, regardless of which collection it came from. */
export interface DetailPayload {
  title: string;
  description: string | null;
  meta: string;
}

export interface PendingDelete {
  kind: 'trait' | 'resource';
  rowId: string;
  name: string;
}
