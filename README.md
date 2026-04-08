# sw

Full-stack app with a Hono/Bun backend, Vue frontend, and PostgreSQL.

## Prerequisites

- [Docker](https://www.docker.com)

## Setup

1. Generate `.env`:
   ```sh
   ./init.sh
   ```
   This creates `.env` from `.env.example` with a random `JWT_SECRET`.
   Open `.env` and set `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `DATABASE_URL` to match.

2. Start the app:
   ```sh
   docker compose up -d
   ```

   - Frontend: http://localhost:8080
   - Backend: http://localhost:3000

## Local dev

Requires [Bun](https://bun.sh). Start the database first:

```sh
docker compose up postgres -d
cd backend && bun run db:migrate
```

Then in separate terminals:

```sh
# backend
cd backend && bun install && bun run dev

# frontend
cd frontend && bun install && bun run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
