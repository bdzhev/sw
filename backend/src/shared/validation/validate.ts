import type { Context } from 'hono';

/**
 * Structural rather than `ZodError`: the hook is handed Zod 4's core error
 * (`$ZodError`), which carries `issues` but not the class methods, so naming the
 * class here would not typecheck.
 */
interface IssueBag {
  issues: readonly { path: readonly PropertyKey[]; message: string }[];
}

/**
 * Turns Zod issues into the one-string `error` shape every handler here answers
 * with, so a validation failure reads like every other 4xx in the API rather
 * than like a library's internal dump.
 */
const formatIssues = (error: IssueBag): string => {
  return error.issues
    .map((issue) => {
      const path = issue.path.map(String).join('.');

      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join('; ');
};

/**
 * Pass this as `zValidator`'s third argument, every time:
 *
 * ```ts
 * charactersRoutes.post('/', zValidator('json', createCharacterSchema, errorHook), ...)
 * ```
 *
 * Without it the validator answers with its own body shape instead of `{ error }`.
 * And without a validator at all, a malformed JSON body reaches `c.req.json()`
 * and surfaces as a 500 rather than a 400.
 *
 * There is deliberately no `validateJson(schema)` wrapper around this. Such a
 * wrapper needs an explicit return type (oxlint `explicit-function-return-type`),
 * `zValidator` is overloaded so an instantiation expression over it has no single
 * signature to pick, and the type it actually returns is built from
 * `DefaultInput`, which the package does not export — so the only way to annotate
 * it is to copy the package's internal types and keep them in sync. Naming
 * `zValidator` at the call site is the cheaper trade.
 */
export const errorHook = (
  result: { success: boolean; error?: IssueBag },
  c: Context
): Response | undefined => {
  if (!result.success && result.error) {
    return c.json({ error: formatIssues(result.error) }, 400);
  }

  return undefined;
};
