# Backend rules

**Read this before writing or moving any file in `backend/`.** These rules override habit and override any framework's default scaffolding.

Stack: Bun + Hono + Drizzle ORM (Bun's built-in `SQL` driver) + PostgreSQL + jose (JWT).

---

## 1. Tooling

Bun only. Never `npm`, `npx`, `yarn`, or `pnpm` — not for installs, not for one-off tool runs.

```sh
bun install
bun add <pkg>
bun run dev          # bun --watch src/index.ts, env from ../.env
bun run lint         # oxlint
bun run lint:fix     # oxlint --fix
bun run format       # oxfmt --write .
bun run typecheck    # tsc --noEmit
bun run db:generate  # drizzle-kit generate
bun run db:migrate   # drizzle-kit migrate
```

For a one-off binary: `bunx <tool>`.

**There is no ESLint and no Prettier.** Lint is `oxlint` (`.oxlintrc.json`), formatting is `oxfmt` (`.oxfmtrc.json`). husky + lint-staged gate every commit; the hook lives at the **repo root** (`.husky/pre-commit`) and invokes `lint-staged` once per package with that package as cwd. This package's task list is `lint-staged.config.mjs`: `oxlint --fix --max-warnings=0` then `oxfmt --write` on staged `.ts`, `oxfmt --write` on staged `.json`/`.md`/`.yml`.

Order matters — **oxlint first, oxfmt last**, so the formatter gets the final word on style. Type-checking is the last entry in the `.ts` task list, written as a **function** so lint-staged runs it once for the whole group rather than per file; TypeScript needs whole-program context. A type error anywhere blocks any commit, and an oxlint **warning** fails the hook too (`--max-warnings=0`).

`src/drizzle/` (generated migrations) is excluded from both lint and format — see `ignorePatterns` in each config.

---

## 2. Structure

```
src/
  index.ts              app wiring: cors, static, middleware, route mounting
  db/
    db.ts               Bun SQL client + drizzle instance + migrate
    schema.ts           pgTable / pgEnum definitions
    types.ts            shared domain types
    errors.ts           Postgres error codes + isPgError guard
    index.ts            the module's public entry point
  middlewares/
    auth.ts             authMiddleware + AuthVariables
  routes/
    <name>/
      <name>Route.ts    the Hono sub-app
      index.ts          re-exports it, e.g. export { userRoutes } from './usersRoute';
```

- **Every folder has an `index.ts`**, and it is what outsiders import. Import `../../db`, never `../../db/schema`.
- Routes are mounted in `src/index.ts` with `app.route('/prefix', routes)`, and auth is applied by mounting `authMiddleware` on the path **before** the route: `app.use('/characters/*', authMiddleware)`.
- Protected handlers read the user via `c.get('userId')`, typed by `new Hono<{ Variables: AuthVariables }>()`.
- Imports use **relative paths**. The `@/*` alias is configured in `tsconfig.json` but used in exactly one file (`routes/quiz/quizData.ts`) — do not spread it further without converting the rest.

---

## 3. Database errors — read this fully

**Never branch on `err.code`.** It does not contain what you expect, and a comparison against it fails _silently_ — the branch simply never runs. Two independent reasons stack up:

1. **Bun's driver is not node-postgres.** Every tutorial and every `pg`-based snippet assumes `err.code` holds the five-character SQLSTATE. With Bun's `SQL`, `code` is always the constant string `'ERR_POSTGRES_SERVER_ERROR'`; the SQLSTATE lives in **`err.errno`**.
2. **Drizzle wraps the driver error.** It does not rethrow the `SQL.PostgresError`. It throws a `DrizzleQueryError` — whose only fields are `query`, `params`, and `cause` — and hangs the original driver error off `cause`.

So the thing you catch is a wrapper with no SQLSTATE on it at all, and the driver error underneath puts the SQLSTATE somewhere other than where you'd look.

**Do not try to classify errors from the Drizzle layer.** Drizzle exports only `DrizzleError`, `DrizzleQueryError`, and `TransactionRollbackError`. There is no `UniqueViolationError`, no error category, no code field. `DrizzleQueryError` tells you _which query_ failed, never _why_. The "why" only exists as the Postgres SQLSTATE on `cause`.

**Always go through the guard in `src/db/errors.ts`:**

```ts
import { db, characters, isPgError, PG_ERROR } from '../../db';

try {
  await db.insert(characters).values({ ... });
} catch (err) {
  if (isPgError(err, PG_ERROR.FOREIGN_KEY_VIOLATION)) {
    return c.json({ error: 'User not found' }, 404);
  }
  console.error(err);

  return c.json({ error: 'Failed to create character' }, 500);
}
```

`isPgError` walks the `cause` chain (depth-capped), checks `instanceof SQL.PostgresError`, and compares `errno`. It is the single seam between Drizzle's wrapper and the driver's codes — so both quirks above are handled in exactly one place.

**No magic numbers.** Add codes to `PG_ERROR` in `src/db/errors.ts`, named after the official condition name from [Appendix A of the Postgres manual](https://www.postgresql.org/docs/current/errcodes-appendix.html), with the number in a doc comment so it stays traceable:

```ts
export const PG_ERROR = {
  /** 23503 foreign_key_violation */
  FOREIGN_KEY_VIOLATION: '23503',
} as const;
```

Do not add a `pg`-error-code npm package. They all encode the node-postgres convention (`code` = SQLSTATE), which is wrong for this stack and would walk you straight back into problem 1.

If you add a code, **verify the branch actually fires** against a real database. Both bugs above were invisible to lint, invisible to `tsc`, and invisible to reading the code.

---

## 4. Schema & migrations

- Schema is defined in `src/db/schema.ts` with `pgTable` / `pgEnum`. Enums are declared once and reused; don't inline string unions in a column.
- Change flow: edit `schema.ts` → `bun run db:generate` → review the generated SQL → `bun run db:migrate`.
- **Never hand-edit anything in `src/drizzle/`.** It is generated, and it is excluded from lint and format.

---

## 5. Types & style

Enforced by `oxlint` (see `.oxlintrc.json`), so these are not suggestions:

- `arrow-body-style: always` — arrow functions use a block body and an explicit `return`, including in config files.
- `curly: all` — every `if` gets braces, even single-statement ones.
- `explicit-function-return-type` (warn) — annotate return types on named functions. Expressions, typed function expressions and higher-order functions are exempt.
- `consistent-type-imports` (warn) — `import type { X }` for type-only imports.
- `no-explicit-any` (warn) — and since `--max-warnings=0` gates the hook, a stray `any` blocks the commit. Type Hono helpers with `Context` from `hono`; let `catch` bindings stay implicitly `unknown` (`strict` enables `useUnknownInCatchVariables`, so a bare `catch (err)` is already `unknown` — annotating it `any` is the only way to lose that).
- `no-console` is **not enabled** here (unlike the frontend, which restricts it to `warn`/`error`) — `console.error(err)` in a catch before returning a 500 is the established pattern.
- oxlint's `correctness` category is on.

Formatting is oxfmt's job, not yours: `printWidth` 80, single quotes, semicolons, `trailingComma: 'es5'`.

Handlers return `c.json(...)` with an explicit status: `c.json({ error: 'User not found' }, 404)`. Error responses use an `error` key.

---

## 6. Known cruft

Not rules, just things not to be confused by:

- **`pg` is an unused dependency.** The driver is Bun's built-in `SQL` via `drizzle-orm/bun-sql`; nothing in `src/` imports `pg`. Do not reach for `pg`'s `DatabaseError` — those errors are never thrown here.
- Several `catch (err)` blocks collapse every failure into a generic 500. Giving them specific SQLSTATE branches (e.g. `23505` unique_violation for a duplicate username on register) is welcome, following section 3.
