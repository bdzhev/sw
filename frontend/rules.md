# Frontend rules

**Read this before writing or moving any file in `frontend/`.** These rules override habit, override what surrounding legacy code looks like, and override any framework's default scaffolding.

**Agents: never run `git commit`, in any form, `--amend` included.** Finish the work, run the checks below, report what changed, and leave it in the working tree — commits are the maintainer's. Staging, `git mv` and branches are fine when asked for.

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
config/   static data — option lists, label maps, limits
api/      queries, mutations, transport
```

`config/` is a fifth segment, for static data — option lists, label maps, limits, and the local `types.ts` that describes them.

**Segments are siblings. A segment never nests inside another segment.** There is no `ui/some-tab/model/`, no `ui/some-tab/config/`. If a slice is big enough that its composables need grouping, group them _inside_ the segment by area:

```
widgets/character-sheet/
  index.ts
  ui/       sheet-header/  main-tab/  skills-tab/  combat-tab/  traits-tab/
  model/    sheet-tabs/  traits/  combat/
  config/   main/  skills/  combat/  traits/
  lib/      main/formatters.ts   combat/attack-math.ts
```

`model/traits/useTraitForm/` is right; `ui/traits-tab/model/useTraitForm/` is not. Inside a slice, cross-segment imports use the slice's own alias path (`@widgets/character-sheet/config/traits`) rather than climbing `../../../` — a deep relative breaks the moment anything moves.

**Logic lives in `model/`, not in the `.vue`.** A component is a template plus a call into its composable or store.

**A page slice that grows into a real surface becomes a widget.** `pages/character` is a six-line shell that renders `@widgets/character-sheet`; the sheet itself — seven tabs, a header, its own stores and rules data — is the widget. A page's job is routing and composition, not holding a feature.

This is a rule because four tabs of the character sheet were written in parallel and produced four different answers — `constants.ts` + `lib.ts`, `constants.ts` + `types.ts`, a bare `<domain>-math.ts`, and a segment nested inside `ui/`. The last one was the most organised and still wrong.

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
- **Every event handler is named `handle*`.** `handleClick`, `handleSubmit`, `handleSpendClick`, `handleToggleLanguage`. Not `onInput`, not `onBonusInput`, and not a bare verb like `toggle` / `submitTrait` / `openAdd`. The `handle` prefix is what makes a handler greppable and tells you at the binding site that you are looking at one.
- **An `@event` is a bare handler reference. Never a call, never an expression.**

  ```vue
  <!-- no -->
  <button @click="setRemaining(remaining - 1)">
  <button @click="stepAmmo(-1)">
  <button @click="emit('detail')">
  <button @click="handleSelectLanguage(language)">

  <!-- yes -->
  <button @click="handleSpendClick">
  ```

  This has no exceptions, including emit forwarding, and including a `v-for`.
  **If a handler needs to know which item was acted on, the item is a component
  that emits it** — the parent then binds `@select="handleSelect"` and reads the
  payload. A row that needs a callback is a row that wants to be a component;
  passing the item down through the template is the shortcut that avoids
  writing one, and it is what leaves list logic smeared across the parent.

  The same applies to a group control: `ToggleChipGroup` emits the value that
  changed, so its consumer binds a bare handler rather than closing over the
  item in the template.

- **A variant map lives in `<Component>.themes.ts` and is typed against its union.** An untyped map lets a variant be half-added — declared in the union, missing from the classes — and it still compiles:

  ```ts
  export const variantClasses: Record<ButtonVariant, string> = { ... };
  ```

- **Resolve a theme map inside a `computed`, never at setup scope.** `const theme = themes[props.variant]` runs once, so the class never updates when the prop changes. The old `icon-button/IconButton.vue` did exactly this.
- **Do not comment templates.** No prose restating a class list, and no notes on what a change fixed — that belongs in the design docs, not the markup. The rare exception is a line someone would otherwise "simplify" and break: a browser or library behaviour the code cannot show. Keep it to one line.
- Icons come from `lucide-vue-next`.
- **Check `src/shared/ui/` before hand-rolling a control.** A raw `<button>` carrying `role="switch"`, `role="checkbox"` or `aria-pressed`, or a raw `<input type="number">`, means you are rebuilding one of these:

  | want                              | use                                                                                       |
  | --------------------------------- | ----------------------------------------------------------------------------------------- |
  | two-state toggle                  | `@shared/ui/switch` (`v-model`) · `@shared/ui/form-switch` (vee-validate `name`)          |
  | tick box                          | `@shared/ui/checkbox`                                                                     |
  | number entry, with or without −/+ | `@shared/ui/number-field` — it owns clamping and parsing, so do not write another `clamp` |
  | multi-select chips                | `@shared/ui/toggle-chip-group` — emits the value that changed                             |
  | any button, including icon-only   | `@shared/ui/button` with `is-icon-only` (there is no separate `IconButton`)               |

  A control that genuinely has no primitive is a signal to add one, not to hand-roll it in a page slice. `traits-tab/pin-field` was a correct switch trapped where no other tab could import it, so two other tabs each built their own — one of them redrawing the track and thumb from scratch.

- Headless primitives come from `reka-ui`. **Overlays are already wrapped: `@shared/ui/dialog` (centred, with `DialogHeader`/`Body`/`Footer`/`CloseButton`), `@shared/ui/drawer` (off-canvas, swipe-to-close), `@shared/ui/select` (field-bound, portalled), `@shared/ui/slider`, `@shared/ui/tooltip` (needs one `TooltipProvider` at the app root, already in `App.vue`), `@shared/ui/confirm-dialog` on top of them.** **Any overlay must escape its container through a portal** — an ancestor with non-`visible` overflow clips an absolutely-positioned descendant, and `z-index` cannot undo that. This is what broke the old `shared/ui/select` inside a dialog. `@shared/ui/dropdown-menu` wraps reka's menu too — its root is **modal by default, and that is what locks body scroll**, so don't reach for `:modal="false"` to fix a positioning problem. Below `md` the character card skips the menu entirely and lays its two actions out as icon buttons: a menu costs a touch user an extra tap, and two actions do not need one. **Do not let a reka part derive displayed state from its children's mount lifecycle** — `SelectValue`'s label comes from a registry `SelectItemText` fills on mount, and closing the list remounts every item, so it blanks for a frame; derive that display from your own props instead (as `select/Select.vue` does). The hand-rolled `shared/ui/modal` they replaced is gone — do not rebuild that pattern: it had no focus trap, no Escape, no scroll lock, and positioned itself `absolute` inside `body`. Enter/leave animation for these is CSS keyframes keyed off `data-[state=open]`/`data-[state=closed]`, because reka's `Presence` holds the element mounted until the animation ends; a Vue `<Transition>` would need `forceMount` and manual presence. A dialog with no `DialogDescription` must pass `:aria-describedby="undefined"` — the JS value, not the string `"undefined"`, since reka reads the rendered attribute. **`shadcn-vue` is not installed and must not be initialized** — its CLI would write a `components.json`, a `cn` util, and its own CSS variables that collide with the `@theme` tokens below. Pull the underlying reka-ui primitive and wrap it in a folder following section 3, as `scroll-area/` does.

---

## 5. Tailwind v4

All configuration is **CSS-side, in `src/main.css`**: `@theme` for design tokens, `@utility` for custom utilities.

There is **no `tailwind.config.js`** — it was an empty stub that existed only so the old ESLint plugin had something to point at, and it is gone. Do not recreate it. Tooling that needs to know the design system reads `src/main.css` directly (see `sortTailwindcss.stylesheet` in `.oxfmtrc.json`).

- Use theme tokens — `bg-border`, `text-secondary`, `bg-accent-primary` — not raw palette values like `bg-slate-600`.
- **There is one colour vocabulary, and this is all of it**: `bg-primary`, `bg-secondary`, `bg-raised`, `bg-raised-hover`, `fg`, `muted`, `border`, `primary`, `secondary`, `accent-primary`, `accent-secondary`, `branding`, `danger`, `warning`. A second, older set (`primary-bg`, `primary-fg`, `secondary-bg`, `secondary-fg`, `primary-muted`, `primary-button*`, `secondary-button*`, `button-disabled`, `accent`, `accent-muted`, `error`) was deleted — if you find one in a snippet or an old branch, map it onto the list above rather than reviving it.
- **A multi-line value in `@theme` does not parse.** `--color-bg-raised-hover` was originally written as a `color-mix()` spread over four lines; Tailwind silently failed to register the token, so `hover:bg-secondary-button-hover` generated **no CSS at all** and the secondary button had no hover state for as long as it existed. Keep `@theme` values on one line.
- **A class naming a token that does not exist generates nothing — silently.** There is no error, no warning, and no failed build; the element just renders unstyled. After renaming or deleting a token, build and grep the emitted stylesheet (`dist/assets/*.css`) for the classes you expect, because neither `vue-tsc` nor `oxlint` can see this.
- Custom utilities already defined: `page-x`, `fade-bottom`, `fade-scroll-top`, `fade-scroll-bottom`, `fade-scroll-y`, `shimmer`, `shimmer-animate`, `loading-animation`, `bg-radial`.
- **Native scrollbars are hidden globally** by `::-webkit-scrollbar { display: none }` in `main.css`. Anything that needs a visible scroll affordance must render its own — use `@shared/ui/scroll-area`.
- Scrolling inside a flex column needs `min-h-0` on the scrolling child, otherwise it stretches to content height and never scrolls. `overflow-hidden` on an ancestor (e.g. `Card`) clips instead of scrolling — put the scroll container inside it.

### Responsive layout

**Write mobile-first.** Base classes describe the phone; `md:`/`lg:` add the wider layout on top. Some older components are still written the other way round (large base class, no mobile base) — those are bugs waiting to be rewritten, not a pattern to copy.

**Only the named breakpoints.** `sm:` `md:` `lg:`, never an arbitrary `min-[500px]:`. The values are declared as `--breakpoint-sm/md/lg` in `@theme` so retuning them is one line; an arbitrary variant escapes that.

`shared/lib/ui/breakpoints` is the **JS twin** of those tokens and the only place px breakpoint values may be written in TS. Change it and `@theme` together. Use it via:

- `useBreakpoint()` — reactive `isMobile` / `isTablet` / `isDesktop` / `isCompact`, for what CSS cannot express (canvas sizing, whether to mount something, animation offsets). If the answer is only visual, use a Tailwind variant instead.
- `mediaFrom('md')` / `mediaBelow('md')` — query strings for `matchMedia` and `gsap.matchMedia`.

**No `h-screen` on a full-height section, and no `w-screen` anywhere.** `100vh` counts the collapsible mobile browser chrome, so the bottom of the section sits under the address bar — use `min-h-[100svh]` (`svh`, not `dvh`: `dvh` resizes as the chrome hides, which makes pinned GSAP sections jump). `100vw` includes the desktop scrollbar gutter and causes horizontal overflow — `w-full`/`min-w-full` is what is always meant.

**Horizontal gutters come from `page-x`**, not a per-section `px-*` ladder.

**`translate-*` utilities are not `transform`.** In v4 they set the separate `translate` property (`translate: var(--tw-translate-x) var(--tw-translate-y)`). A `@keyframes` that animates `transform: translate(...)` therefore _stacks_ on top of them instead of overriding — a `-translate-1/2`-centred element animated that way visibly slides in offset and snaps into place when the animation ends. Animate `transform` for scale/rotate only, and let the utility own the translate.

**A `z-*` needs a `position` on the same element.** A z-index on a static box does nothing. This bit the landing layout: it relied on ScrollSmoother making its wrapper `fixed`, so the stacking silently collapsed on the viewports where the smoother is inert and an opaque background canvas painted over the page.

**Scroll-driven GSAP goes inside `gsap.matchMedia()`**, never a one-off `getDevice()` check at mount: a context rebuilds when the viewport crosses a breakpoint, a mount-time snapshot does not. `useScrollSmoother` and `useHorizontalScrollAnimation` both take a `mediaQuery` option defaulting to md and up, and are inert below it — a consumer that uses them owes its mobile users a non-pinned fallback layout (see `pain-section`).

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
