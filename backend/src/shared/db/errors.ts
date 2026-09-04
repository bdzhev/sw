import { SQL } from 'bun';

/**
 * PostgreSQL SQLSTATE codes, from Appendix A of the Postgres manual:
 * https://www.postgresql.org/docs/current/errcodes-appendix.html
 *
 * Only the codes this app actually branches on are listed. Add more as needed,
 * keeping the official condition name in the comment so the number stays
 * traceable back to the manual.
 */
export const PG_ERROR = {
  /** 23503 foreign_key_violation */
  FOREIGN_KEY_VIOLATION: '23503',
  /** 22P02 invalid_text_representation — e.g. a value outside a pgEnum */
  INVALID_TEXT_REPRESENTATION: '22P02',
  /** 23505 unique_violation */
  UNIQUE_VIOLATION: '23505',
  /** 23514 check_violation */
  CHECK_VIOLATION: '23514',
} as const;

export type PgErrorCode = (typeof PG_ERROR)[keyof typeof PG_ERROR];

/** Depth cap so a malformed or cyclic `cause` chain can't spin forever. */
const MAX_CAUSE_DEPTH = 5;

/**
 * Two things make a naive `err.code === '23503'` check silently never match:
 *
 * 1. Bun's SQL driver does not put the SQLSTATE in `code` the way node-postgres
 *    does — for any server-side error `code` is the constant string
 *    `'ERR_POSTGRES_SERVER_ERROR'`, and the SQLSTATE lives in `errno`.
 * 2. Drizzle does not rethrow the driver error directly. It wraps it in a
 *    `DrizzleQueryError` (message: `Failed query: ...`) and hangs the original
 *    `SQL.PostgresError` off `cause`.
 *
 * So we walk the `cause` chain and read `errno`. Always branch on DB errors
 * through this helper rather than touching either field directly.
 */
export const isPgError = (err: unknown, code: PgErrorCode): boolean => {
  let current: unknown = err;

  for (let depth = 0; depth < MAX_CAUSE_DEPTH; depth += 1) {
    if (current instanceof SQL.PostgresError) {
      return current.errno === code;
    }
    if (typeof current !== 'object' || current === null) {
      return false;
    }
    current = (current as { cause?: unknown }).cause;
  }

  return false;
};
