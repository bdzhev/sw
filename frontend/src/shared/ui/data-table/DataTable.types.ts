import type { ColumnDef, RowData } from '@tanstack/vue-table';

import type { DataTableFeatures } from './DataTable.features';

/**
 * `unknown` as the cell-value type is what `useTable` itself takes: the defs are
 * heterogeneous, so a column helper's narrower per-column type has to widen here.
 */
export type DataTableColumns<TData extends RowData> = ColumnDef<
  DataTableFeatures,
  TData,
  unknown
>[];

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumns<TData>;
  data: TData[];
  /** Rendered `sr-only`: a table needs an accessible name. */
  caption: string;
  /**
   * Extra header classes by column id, for the alignment a column def has no
   * opinion about — a numeric column's header follows its cells to the right.
   */
  headerClasses?: Record<string, string>;
}
