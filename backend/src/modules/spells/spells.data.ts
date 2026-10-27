import type { spells } from '@shared/db';

/**
 * One row of the committed snapshot, in our column shape rather than the API's
 * — the mapping happens once in `spells.refresh.ts`, so seeding stays a plain
 * bulk upsert with no third-party shape to reason about.
 */
export type SpellRow = typeof spells.$inferInsert;

/**
 * Resolved off this module rather than the working directory: both scripts are
 * run through `bun run` from `backend/`, but the container's entrypoint runs
 * from wherever it happens to be.
 */
export const SPELLS_DATA_PATH = new URL('./spells.data.json', import.meta.url);
