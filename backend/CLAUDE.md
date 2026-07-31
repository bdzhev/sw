# Backend

**Read [rules.md](./rules.md) in full before writing, moving, or deleting any file in `backend/`.** It is the single source of truth for conventions — module structure, schema/migration flow, tooling, and style.

Section 4 (**Database errors**) is not optional reading. Branching on `err.code` for a Postgres error is wrong in two independent ways here and fails silently — the branch just never runs, with no lint error and no type error. Always go through `isPgError` from `src/shared/db/errors.ts`.

Section 3 (**Request validation**) is the other one to read before adding a route: every body and query string is validated with a Zod schema, and there are no hand-rolled `if (!field) return 400` guards.
