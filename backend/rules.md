# Backend rules

**Read this before writing or moving any file in `backend/`.** These rules override habit and override any framework's default scaffolding.

**Agents: never run `git commit`, in any form, `--amend` included.** Finish the work, run the checks below, report what changed, and leave it in the working tree — commits are the maintainer's. Staging, `git mv` and branches are fine when asked for.

Stack: Bun + Hono + Drizzle ORM (Bun's built-in `SQL` driver) + PostgreSQL + jose (JWT).

---

## 1. Tooling

Bun only. Never `npm`, `npx`, `yarn`, or `pnpm` — not for installs, not for one-off tool runs.

```sh
bun install
bun add <pkg>
bun run dev          # bun --watch src/app/server.ts, env from ../.env
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

`src/shared/db/migrations/` (generated migrations) is excluded from both lint and format — see `ignorePatterns` in each config.

---

## 2. Structure

Three layers, borrowed from the frontend's FSD setup so both halves of the repo read the same way:

| layer   | path                  | holds                                                                         | may import from  |
| ------- | --------------------- | ----------------------------------------------------------------------------- | ---------------- |
| app     | `src/app/`            | the composition root — cors, static, middleware mounting, `app.route()` calls | modules, shared  |
| modules | `src/modules/<name>/` | one folder per domain area: routers, services, validation                     | shared only      |
| shared  | `src/shared/`         | `db/`, `middleware/`, and (as they appear) `lib/`, `config/`                  | nothing above it |

**Imports point down only.** A module never imports another module, and nothing imports from `app/`. If two modules need the same thing, it moves to `shared/` — or it belongs in one module and the split was wrong.

- **File naming is `<subject>.<role>.ts`**: `users.routes.ts`, `character.actions.service.ts`, `quiz.stats.ts`. Not camelCase, not bare `index`-plus-guesswork.
- **Every module folder has an `index.ts`** and it is the module's only public surface. Import `@/modules/characters`, never `@/modules/characters/character.routes`. Same for `@/shared/db`.
- **Three path aliases, and they are how you cross a layer or module boundary**: `@shared/*` → `src/shared/*`, `@modules/*` → `src/modules/*`, and `@/*` → `src/*`. Prefer the specific two; `@/*` still resolves but nothing in `src/` uses it. Import a module or shared area through its `index.ts` barrel (`@shared/middleware`, not `@shared/middleware/auth`).
- **Relative imports are for staying inside your own module, at any depth.** `./sibling`, `./child`, and `../shared-piece` are all fine within one module — a module never reaches into itself by alias. Once a path leaves the module, it uses an alias. (This is what lets `collections/attacks/attacks.routes.ts` import `../collection.schemas`.)
- **A module may nest below its own folder** when it outgrows a flat list — `modules/characters/collections/attacks/` — and each such folder carries an `index.ts` that is its only entry point, same rule as the module root. `modules/characters/` reached seventeen flat files before this was introduced; that is roughly the threshold.
- **A router symbol's name matches its mount path segment** + `Routes`: `charactersRoutes` → `/characters`, `characterRoutes` → `/character`. Both live in `modules/characters/` and the plural/singular split is deliberate (collection vs single resource), so this naming rule is the thing that stops a silent mis-mount — swapping them type-checks fine and breaks every route.
- Routers are mounted in `src/app/server.ts` with `app.route('/prefix', routes)`, and auth is applied by mounting `authMiddleware` on the path **before** the route: `app.use('/characters/*', authMiddleware)`.
- Protected handlers read the user via `c.get('userId')`, typed by `new Hono<{ Variables: AuthVariables }>()`.
- **`authMiddleware` lives in `shared/middleware/`, not `app/`,** even though only `app/server.ts` mounts it: its `AuthVariables` type is imported by every protected module router, and `shared` is the only layer they're allowed to reach.
- **No repository layer.** Drizzle's query builder _is_ the repository; handlers call it directly. Add a `.service.ts` only where there is real logic to hold — a multi-table transaction, a derivation shared by several handlers. A file that only forwards arguments is not a layer.
- Sub-resources of one entity stay in that entity's module (`modules/characters/attacks.routes.ts`), mounted onto its router. They share its ownership check; a separate module would have to import it sideways.

---

## 3. Request validation

**Every route that reads a body or a query string validates it with Zod first.** No hand-rolled `if (!name) return 400` guards, no destructuring straight out of `c.req.json()`.

```ts
import { zValidator } from '@hono/zod-validator';
import { errorHook } from '@/shared/validation';

charactersRoutes.post(
  '/',
  zValidator('json', createCharacterSchema, errorHook),
  async (c) => {
    const { name, characterClass, race } = c.req.valid('json');
    // ...
  }
);
```

- **Schemas live in the module, in `<subject>.schemas.ts`**, next to the routes they guard, and export their inferred input type (`export type CreateCharacterInput = z.infer<typeof createCharacterSchema>`).
- **Always pass `errorHook`** (from `@/shared/validation`) as the third argument. Without it the validator answers with its own body shape instead of the `{ error: string }` every other response here uses.
- **Read the parsed value with `c.req.valid('json' | 'query')`**, never from `c.req.json()` again. It is typed from the schema, which is what lets the handler drop its field whitelist and hand the result straight to Drizzle with no cast.
- **There is deliberately no `validateJson(schema)` wrapper.** One would need an explicit return type (§7), `zValidator` is overloaded so an instantiation expression over it has no single signature, and its real return type is built from `DefaultInput`, which the package does not export — so annotating it means copying package internals and keeping them in sync. Naming `zValidator` at the call site is the cheaper trade.
- **Enum members come off the Drizzle `pgEnum`**, never retyped: `z.enum(characterRaceEnum.enumValues)`. A retyped list drifts, and then the validator accepts a value Postgres rejects.
- **Query params are strings.** Coerce (`z.coerce.number()`), give a default, and **bound anything that reaches `LIMIT`** so a client cannot ask for the whole table.
- **PATCH schemas are `.partial().strict()` plus a non-empty `.refine`.** `.strict()` is load-bearing, not tidiness: a field the route must not write (`level`, which moves only through the level-up action) has to be a **400**, because silently dropping it lets the caller believe a write it never got had succeeded. The `.refine` keeps an empty body from becoming a no-op 200.
- **Zod is v4 on the backend, v3 on the frontend.** Deliberate: backend validation was greenfield so it took the current line, and bumping the frontend is its own job (vee-validate resolver compatibility). Don't copy frontend schema idioms over without checking them.

Validation does not replace §4's SQLSTATE branches — it makes them backstops. `22P02` can now only fire from a route that forgot a schema, which is exactly when a 500 would be most confusing, so the branch stays.

---

## 4. Database errors — read this fully

**Never branch on `err.code`.** It does not contain what you expect, and a comparison against it fails _silently_ — the branch simply never runs. Two independent reasons stack up:

1. **Bun's driver is not node-postgres.** Every tutorial and every `pg`-based snippet assumes `err.code` holds the five-character SQLSTATE. With Bun's `SQL`, `code` is always the constant string `'ERR_POSTGRES_SERVER_ERROR'`; the SQLSTATE lives in **`err.errno`**.
2. **Drizzle wraps the driver error.** It does not rethrow the `SQL.PostgresError`. It throws a `DrizzleQueryError` — whose only fields are `query`, `params`, and `cause` — and hangs the original driver error off `cause`.

So the thing you catch is a wrapper with no SQLSTATE on it at all, and the driver error underneath puts the SQLSTATE somewhere other than where you'd look.

**Do not try to classify errors from the Drizzle layer.** Drizzle exports only `DrizzleError`, `DrizzleQueryError`, and `TransactionRollbackError`. There is no `UniqueViolationError`, no error category, no code field. `DrizzleQueryError` tells you _which query_ failed, never _why_. The "why" only exists as the Postgres SQLSTATE on `cause`.

**Always go through the guard in `src/shared/db/errors.ts`:**

```ts
import { db, characters, isPgError, PG_ERROR } from '@/shared/db';

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

**No magic numbers.** Add codes to `PG_ERROR` in `src/shared/db/errors.ts`, named after the official condition name from [Appendix A of the Postgres manual](https://www.postgresql.org/docs/current/errcodes-appendix.html), with the number in a doc comment so it stays traceable:

```ts
export const PG_ERROR = {
  /** 23503 foreign_key_violation */
  FOREIGN_KEY_VIOLATION: '23503',
} as const;
```

Do not add a `pg`-error-code npm package. They all encode the node-postgres convention (`code` = SQLSTATE), which is wrong for this stack and would walk you straight back into problem 1.

If you add a code, **verify the branch actually fires** against a real database. Both bugs above were invisible to lint, invisible to `tsc`, and invisible to reading the code.

---

## 5. Schema & migrations

- Schema is defined in `src/shared/db/schema.ts` with `pgTable` / `pgEnum`. Enums are declared once and reused; don't inline string unions in a column.
- Change flow: edit `schema.ts` → `bun run db:generate` → review the generated SQL → `bun run db:migrate`.
- **Never hand-edit anything in `src/shared/db/migrations/`.** It is generated, and it is excluded from lint and format.
- **`bunx drizzle-kit check` before you generate.** It validates the snapshot chain and needs no database. It caught a real breakage once (see section 8) where `generate` refused to run and wrote nothing — the failure mode is an error about snapshots "pointing to a parent snapshot ... which is a collision", not anything about your schema edit.
- The chain it checks: each `meta/NNNN_snapshot.json` carries its own `id` and its parent's `prevId`. `0000` is the only one whose `prevId` is all-zeros. Two snapshots sharing a `prevId` is the collision.

---

## 6. Queries

**A `LIMIT`/`OFFSET` query must carry a deterministic `ORDER BY`, ending in a unique column.** SQL guarantees no row order without one, so the planner is free to return page 1 as any ten rows it likes — which means a row can appear on two pages, another can never appear at all, and neither shows up as an error. This shipped: `GET /characters` paged without ordering, so from the eleventh character on, a newly created one was frequently absent from the list while the row sat in the table. There is no symptom to debug — the response is a valid 200 with ten valid rows.

- The unique tail column is not decoration. `ORDER BY created_at DESC` alone reorders rows sharing a timestamp between two identical queries, which reproduces the bug at page boundaries. Use `ORDER BY created_at DESC, id DESC`.
- List endpoints return `{ items, total }`, not a bare array. The client cannot derive "is there another page" from a page's length without guessing, and the guess is wrong as soon as the client mutates a cached page.
- `db.$count(table, where)` is the count helper; run it alongside the page with `Promise.all`.

---

## 7. Types & style

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

## 8. Known cruft

Not rules, just things not to be confused by:

- **`pg` is an unused dependency.** The driver is Bun's built-in `SQL` via `drizzle-orm/bun-sql`; nothing in `src/` imports `pg`. Do not reach for `pg`'s `DatabaseError` — those errors are never thrown here.
- Several `catch (err)` blocks still collapse every failure into a generic 500. Giving them specific SQLSTATE branches is welcome, following section 4. Done so far: `23503` on character create, `22P02` on a bad enum, `23505` on a duplicate username at register.
- **The `0000` migration metadata was hand-authored at some point** — `_journal.json`'s first entry has a suspiciously round `when` (1775000000000), and `0000_snapshot.json` carried an all-zeros `id` identical to its own `prevId`. That made `0000` and `0001` both claim the all-zeros parent, so `drizzle-kit generate` aborted with a collision and silently produced no migration. Repaired by giving `0000` a real uuid `id` and pointing `0001.prevId` at it; `drizzle-kit check` now passes. If you ever hand-edit migration metadata again, the chain is the invariant to preserve.

---

## 9. Auth

- **Passwords are hashed with `Bun.password.hash` / `.verify`** (argon2id, built into the runtime). No `bcrypt`, no `argon2` npm package — neither is installed and neither is needed. The salt and parameters live inside the returned `$argon2id$…` string, so there is no second column to manage.
- **Never compare a password with `===`.** The rows used to hold plaintext and login compared directly; both are fixed, and a comparison operator anywhere near a password field is the sign it has regressed.
- **Login answers one message for both "no such user" and "wrong password".** Register's `409` does disclose that a username is taken — it has to, that is the point of the response — so the login path is where enumeration is worth denying.
- **Uniqueness is decided by the unique index, not a preceding `SELECT`.** Check-then-insert leaves a window where two simultaneous registrations both pass the check and the loser 500s. Branch on `23505` instead (§4).
- **Mount auth middleware with a wildcard**: `app.use('/users/*', authMiddleware)`, never a single literal path. `app.use('/users/me', …)` protected exactly one route and left `GET /users` — which returned every row including the password column — reachable with no session at all. A literal mount means every route added later is public by default.
- **Project columns on any query against `users`.** `select()` pulls the password hash into the handler for no reason; `select({ id, username })` is the default posture.
