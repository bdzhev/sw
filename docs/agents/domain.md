# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root — it points at one `CONTEXT.md` per context. Read each one relevant to the topic.
- **`frontend/CONTEXT.md`** / **`backend/CONTEXT.md`** — the per-context glossaries.
- **`docs/adr/`** at the root for system-wide decisions, and **`frontend/docs/adr/`** / **`backend/docs/adr/`** for decisions scoped to one side.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

This is a **multi-context** repo. `frontend/` and `backend/` are separately installed
projects — each has its own `package.json`, lockfile and `tsconfig.json` — so each owns its
domain docs, and the root holds only what spans both.

```
/
├── CONTEXT-MAP.md                 ← points at both contexts
├── docs/
│   ├── agents/                    ← this config
│   └── adr/                       ← system-wide decisions (API contract, auth, deployment)
├── frontend/
│   ├── CONTEXT.md
│   └── docs/adr/                  ← frontend-only decisions
└── backend/
    ├── CONTEXT.md
    └── docs/adr/                  ← backend-only decisions
```

Note that the seed template for this file describes contexts as `src/<context>/`. Here the
context boundary is the top-level project directory instead, so a context-scoped ADR lives at
`frontend/docs/adr/`, not `src/frontend/docs/adr/`.

## Three doc homes — don't confuse them

This repo already had two places for written knowledge before domain docs arrived. Keep them apart:

- **`frontend/rules.md`, `backend/rules.md`** (with their sibling `CLAUDE.md` files) — *how to
  write code here*: FSD layers, component folder shape, Tailwind setup, lint and formatter
  ownership. Conventions, not domain.
- **`CONTEXT.md` + `docs/adr/`** — *what the domain means and what was decided*: the glossary the
  code should speak, and the decision record behind the architecture.
- **The Obsidian vault**, outside the repo — feature plans, build stages, design notes and
  wireframes. These stay there; do not migrate them into `docs/`.

When a skill's output needs a convention, cite `rules.md`. When it needs a domain term or a past
decision, cite `CONTEXT.md` or an ADR.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in the relevant `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_
