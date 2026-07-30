# Frontend rules

**Read this before writing or moving any file in `frontend/`.** These rules override habit, override what surrounding legacy code looks like, and override any framework's default scaffolding.

Stack: Vue 3 (`<script setup>`) + Vite (rolldown-vite) + TypeScript + Tailwind v4 + Bun.

---

## 1. Tooling

Bun only. Never `npm`, `npx`, `yarn`, or `pnpm` — not for installs, not for one-off tool runs.

```sh
bun install
bun add <pkg>
bun run dev          # vite dev server
bun run type-check   # vue-tsc --build
bun run lint         # oxlint --fix
bun run format       # oxfmt --write .
```

For a one-off binary: `bunx <tool>`.

---

## 2. Architecture — Feature-Sliced Design

Layers, each with a path alias declared in **both** `vite.config.ts` and `tsconfig.app.json`:

```
@shared → @entities → @features → @widgets → @pages
```

Imports point **down** that list only. `@shared` imports nothing from the others; `@pages` may import from any. A cross-import that goes up the list is a bug, not a shortcut.

Inside a slice, segment by purpose:

```
model/    composables, stores, form state
ui/       components
lib/      pure helpers
api/      queries, mutations, transport
```

---

## 3. Component folders

**This is the rule that gets broken most often. Read it fully.**

Every component is a **kebab-case folder**. Inside it: the component file, its types file, an `index.ts`, and — if it has sub-components — one **kebab-case folder per sub-component, as a direct child**.

```
src/shared/ui/scroll-area/
  ScrollArea.vue           # root component, PascalCase, name matches the folder
  ScrollArea.types.ts      # its props interface
  index.ts                 # the folder's only public entry point
  scroll-bar/              # sub-component — its own folder, direct child
    ScrollBar.vue
    ScrollBar.types.ts
    index.ts
```

Rules, stated individually so none of them get skimmed past:

1. **No `components/` wrapper folder.** A sub-component folder sits directly inside its parent's folder. `scroll-area/scroll-bar/` — never `scroll-area/components/scroll-bar/`.
2. **No `Base` prefix.** The file is `ScrollArea.vue`, not `BaseScrollArea.vue`. The PascalCase filename is the kebab-case folder name.
3. **Types go in `<Component>.types.ts`**, never `.props.ts`. It exports `interface <Component>Props`. Import it with `import type`.
4. **Every folder has an `index.ts`**, and it is the only thing outsiders may import. Consumers write `@shared/ui/scroll-area` — never `@shared/ui/scroll-area/ScrollArea.vue`, never `@shared/ui/scroll-area/scroll-bar/ScrollBar.vue`.
5. **Nesting is recursive.** A sub-component with its own sub-component repeats the same shape, one level deeper. There is no special case at any depth.
6. **No top-level `src/shared/ui/index.ts` barrel.** Don't add one — it defeats code splitting and creates import cycles.

`index.ts` shape — default-import the `.vue`, re-export named, re-export the sub-folder:

```ts
// scroll-area/index.ts
import ScrollArea from './ScrollArea.vue';

export { ScrollArea };
export { ScrollBar } from './scroll-bar';
export type { ScrollAreaProps, ScrollAreaOrientation } from './ScrollArea.types';
export type { ScrollBarProps } from './scroll-bar';
```

```ts
// scroll-area/scroll-bar/index.ts
import ScrollBar from './ScrollBar.vue';

export { ScrollBar };
export type { ScrollBarProps } from './ScrollBar.types';
```

The parent imports its child through that child's `index.ts`, not the `.vue` directly:

```ts
import { ScrollBar } from './scroll-bar';
```

### Legacy patterns — do not copy, do not extend

Much of `src/shared/ui` predates these rules. Three dead patterns you will encounter:

| Legacy                        | Current             |
| ----------------------------- | ------------------- |
| `BaseCard.vue`                | `Card.vue`          |
| `card/components/CardHeader/` | `card/card-header/` |
| `BaseCard.props.ts`           | `Card.types.ts`     |

These are being migrated branch by branch. When you touch such a folder: **write new files the current way; do not rewrite the surrounding legacy files** unless the migration is the task you were asked to do. Never add a new file _into_ a legacy `components/` folder — create the properly-placed folder instead.

### Compound components

Components sharing state across a subtree use `provide`/`inject`:

- injection key → `constants.ts` (e.g. `RADIO_CTX_KEY`, `TOOLTIP_CTX_KEY`)
- context type → `types.ts` (the shared shape, distinct from a single component's `.types.ts`)
- children read it with `inject<Ctx>(KEY)!`

See `src/shared/ui/radio/` and `src/shared/ui/tooltip/`.

---

## 4. Writing a component

- `<script setup lang="ts">`, props via `withDefaults(defineProps<XProps>(), { ... })`.
- **No `cva`, no `cn`, no `clsx`, no `tailwind-merge`** — none are installed, and none should be. Variants are string-union types resolved into a `:class` object or array:

  ```ts
  type CardVariant = 'primary' | 'secondary' | 'outline';
  const isOutline = variant === 'outline';
  ```

  ```vue
  <div :class="{ 'ring-2 ring-border': !isOutline, 'rounded-md': size === 'md' }"></div>
  ```

- When a consumer's `class` must land on a specific inner element rather than the root, use `defineOptions({ inheritAttrs: false })` + explicit `v-bind="$attrs"`.
- Icons come from `lucide-vue-next`.
- Headless primitives come from `reka-ui`. **`shadcn-vue` is not installed and must not be initialized** — its CLI would write a `components.json`, a `cn` util, and its own CSS variables that collide with the `@theme` tokens below. Pull the underlying reka-ui primitive and wrap it in a folder following section 3, as `scroll-area/` does.

---

## 5. Tailwind v4

All configuration is **CSS-side, in `src/main.css`**: `@theme` for design tokens, `@utility` for custom utilities.

There is **no `tailwind.config.js`** — it was an empty stub that existed only so the old ESLint plugin had something to point at, and it is gone. Do not recreate it. Tooling that needs to know the design system reads `src/main.css` directly (see `sortTailwindcss.stylesheet` in `.oxfmtrc.json`).

- Use theme tokens — `bg-border`, `text-secondary`, `bg-accent-primary` — not raw palette values like `bg-slate-600`.
- Custom utilities already defined: `fade-bottom`, `fade-scroll-top`, `fade-scroll-bottom`, `fade-scroll-y`, `shimmer`, `shimmer-animate`, `loading-animation`, `bg-radial`.
- **Native scrollbars are hidden globally** by `::-webkit-scrollbar { display: none }` in `main.css`. Anything that needs a visible scroll affordance must render its own — use `@shared/ui/scroll-area`.
- Scrolling inside a flex column needs `min-h-0` on the scrolling child, otherwise it stretches to content height and never scrolls. `overflow-hidden` on an ancestor (e.g. `Card`) clips instead of scrolling — put the scroll container inside it.

---

## 6. Lint & types

ESLint and Prettier are **gone**. The toolchain is **oxlint** (`.oxlintrc.json`) + **oxfmt** (`.oxfmtrc.json`). Two things that used to be lint rules are now the formatter's job:

- **Import order** — `sortImports` in `.oxfmtrc.json`: builtin → external → `@shared` → `@entities` → `@features` → `@widgets` → `@pages` → relative, blank line between groups. Custom groups use **glob** patterns (`@shared/**`), not regex.
- **Tailwind class order** — `sortTailwindcss` in `.oxfmtrc.json`, pointed at `src/main.css` via `stylesheet`, with `attributes: [":class"]` so Vue bindings are covered too. Because it reads `main.css`, `@utility` definitions sort correctly. Two caveats: utilities whose body is only a nested rule (`shimmer`, `loading-animation`) sort as unknown and land at the front, and **if the `stylesheet` path is wrong oxfmt silently skips Tailwind sorting entirely** rather than erroring — so treat a sudden loss of class ordering as a bad path.

oxlint covers correctness (its `correctness` category is on) plus the house rules `arrow-body-style`, `curly`, `no-console`. What was lost in the move, permanently until oxlint can parse Vue templates ([oxc#15761](https://github.com/oxc-project/oxc/issues/15761)):

- All `eslint-plugin-vue` **template** rules (`require-v-for-key`, `no-mutating-props`, `valid-v-slot`, …). `vue-tsc` catches most real template breakage instead.
- `better-tailwindcss`'s `no-conflicting-classes` and `no-unregistered-classes`. No oxlint plugin can restore these here: class names live in `<template>`, which oxlint cannot see, and the JS-side detection surface (`cn`/`clsx`/`cva`/`className`) is banned by section 4.
- `padding-line-between-statements` (deprecated stylistic rule, no oxlint equivalent).
- `no-unused-vars` does **not** apply to `.vue` files in oxlint. `noUnusedLocals`/`noUnusedParameters` in `tsconfig.app.json` cover it instead, and `vue-tsc` understands template usage, so this is better coverage than before.

Run before committing:

```sh
bun run lint
bun run type-check
```

husky + lint-staged gate every commit. The hook lives at the **repo root** (`.husky/pre-commit`, husky is a root devDependency — a subdir install cannot find `.git`); it invokes `lint-staged` once per package, with that package as the cwd so each picks up its own config. Frontend's task list is `frontend/lint-staged.config.mjs`: `oxlint --fix --max-warnings=0` then `oxfmt --write` on staged `.ts`/`.vue`, `oxfmt --write` on staged `.css`/`.json`/`.md`/`.html`/`.yml`.

**Order matters — oxlint first, oxfmt last.** This is the reverse of the old prettier-then-eslint order. Class and import ordering are now formatter concerns, so the formatter must get the final word; the conflict that motivated the old ordering no longer exists.

**Type-checking now runs in the hook.** It is the last entry in the `.ts`/`.vue` task list, written as a function so lint-staged calls it **once for the whole group** rather than per file — TypeScript needs whole-program context. It must be a function task for that reason; a plain glob entry would re-check the project once per staged file. Because it runs inside lint-staged, it sees the staged snapshot rather than your full working tree.

Consequence: a type error **anywhere** blocks **any** commit, not just in the files you staged. That is intentional. A full forced rebuild is ~2s, so the cost is small.

Anything auto-fixable is fixed and re-staged; anything left — an oxlint error **or warning**, or any type error — fails the hook, and lint-staged reverts the working tree to its pre-hook state.
