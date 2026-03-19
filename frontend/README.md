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

Create a `.env` file in this directory:

```env
VITE_API_URL=http://localhost:3000
```

## Auth

Authentication is handled via Google OAuth through the backend. Clicking "Sign in with Google" redirects to `GET /auth/google`. After the OAuth flow, the backend redirects back to `/auth/callback?token=<jwt>`, where the frontend stores the access token in memory and fetches the current user.

Token refresh is automatic — the HTTP client retries failed 401 requests using a `POST /auth/refresh` call backed by an httpOnly refresh cookie.

## Docker

Build and run via the root `docker-compose.yml`:

```sh
# from the project root (sw/)
docker compose up --build
```

The frontend is served by nginx on port `8080`.
