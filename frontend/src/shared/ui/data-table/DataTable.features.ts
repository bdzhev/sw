import { tableFeatures } from '@tanstack/vue-table';

/**
 * Core only. v9 registers features explicitly, so sorting, filtering and
 * grouping are opt-in — add the feature and its row-model slot here once a table
 * actually needs one, rather than bundling all of them for the tables that
 * don't.
 *
 * A module constant because the adapter watches the options it is given: a
 * feature set rebuilt per render would rebuild the table with it.
 */
export const dataTableFeatures = tableFeatures({});

export type DataTableFeatures = typeof dataTableFeatures;
