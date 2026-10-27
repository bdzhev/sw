export interface PendingDelete {
  kind: 'trait' | 'resource';
  rowId: string;
  name: string;
}
