# stat_wizard — Frontend

> ⚠️ **Read [rules.md](./rules.md) before touching anything in this folder.**
> It defines the code conventions — FSD layers, component folder structure, Tailwind v4 setup — and is the single source of truth. Human or agent, no code goes in without reading it first.

Vue 3 + Vite frontend for stat_wizard. Communicates with the [backend API](../backend) via REST.

## Stack

- **Vue 3** + Vite (rolldown-vite)
- **TypeScript**
- **Tailwind CSS v4**
- **Pinia** — state management
- **TanStack Query** — server state / caching
- **Vue Router**
- **Bun** — package manager and runtime

## Conventions

Full rules: **[rules.md](./rules.md)** — mandatory reading before any change. Keep it updated rather than duplicating rules here.

Short version:

- **Bun only** — never npm/npx.
- Every component is a kebab-case folder: `scroll-area/ScrollArea.vue` + `ScrollArea.types.ts` + `index.ts`, with sub-components in their own nested folder (`scroll-area/scroll-bar/`). No `components/` wrapper folders, no `Base` prefix, no `.props.ts` — all three are legacy patterns being removed branch by branch.
- No `cva`/`cn`/`clsx`, no `shadcn-vue` — headless primitives come from `reka-ui`, variants are plain `:class` objects.
- Tailwind config is CSS-side in `src/main.css`; `tailwind.config.js` is an empty stub.

## Project Setup

```sh
bun install
```

### Dev server

```sh
bun run dev
```

### Type-check, compile and minify for production

```sh
bun run build
```

### Lint

```sh
bun run lint
```

## Environment

No `.env` file needed. The API URL defaults to `http://localhost:3000` for local dev.

In Docker, `API_URL` is injected at container startup via the root `.env` — see the project root README.

## Docker

Build and run via the root `docker-compose.yml`:

```sh
# from the project root (sw/)
docker compose up --build
```

The frontend is served by nginx on port `8080`.
