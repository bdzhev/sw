# stat_wizard — Frontend

Vue 3 + Vite frontend for stat_wizard. Communicates with the [backend API](../backend) via REST.

## Stack

- **Vue 3** + Vite (rolldown-vite)
- **TypeScript**
- **Tailwind CSS v4**
- **Pinia** — state management
- **TanStack Query** — server state / caching
- **Vue Router**
- **Bun** — package manager and runtime

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
