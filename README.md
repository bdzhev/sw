# sw

Full-stack app with a Hono/Bun backend, Vue frontend, and PostgreSQL.

## Prerequisites

- [Bun](https://bun.sh)
- [Docker](https://www.docker.com)

## Setup

1. Generate a `.env` at the project root:
   ```sh
   bun run init
   ```
   This creates `.env` from `.env.example` with a random `JWT_SECRET`.
   Open `.env` and set `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `DATABASE_URL`.

2. Run migrations:
   ```sh
   cd backend && bun run db:migrate
   ```

## Running

### With Docker

```sh
docker compose up
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3000

### Local dev (without Docker)

Start the database first:
```sh
docker compose up postgres
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
