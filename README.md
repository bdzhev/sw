# Stat Wizard

A tool for Dungeon Masters and home game hosts to manage D&D characters and generate stats for new players.

New to D&D? Not sure what your stats should be? Stat Wizard walks you through a short quiz and figures out your character's ability scores based on your answers — no rulebook required.

## Features

- Create and manage D&D characters
- Stat generation quiz for new players
- Supports all core classes and races

## Stack

- **Backend** — Hono + Bun + PostgreSQL (Drizzle ORM)
- **Frontend** — Vue 3 + Vite + Tailwind CSS
- **Auth** — JWT + refresh tokens

---

## Self-hosting

### Prerequisites

- [Docker](https://www.docker.com)

### Setup

1. Clone the repo and generate your `.env`:
   ```sh
   git clone https://github.com/bdzhev/sw
   cd sw
   ./init.sh
   ```
   Open `.env` and set `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `DATABASE_URL` to match.

2. Start the app:
   ```sh
   docker compose up -d
   ```

   - Frontend: http://localhost:8080
   - Backend: http://localhost:3000

---

## Local dev

Requires [Bun](https://bun.sh).

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
