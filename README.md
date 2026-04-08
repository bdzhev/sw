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

Only [Docker](https://www.docker.com) required — no need to clone the repo or install anything else. Images are published automatically to GitHub Container Registry on every push to `main`.

1. Download the compose file and generate your `.env`:
   ```sh
   curl -O https://raw.githubusercontent.com/bdzhev/sw/main/docker-compose.yml
   curl -O https://raw.githubusercontent.com/bdzhev/sw/main/.env.example
   curl -O https://raw.githubusercontent.com/bdzhev/sw/main/init.sh
   chmod +x init.sh && ./init.sh
   ```
   Open `.env` and set `POSTGRES_USER` and `POSTGRES_PASSWORD`.

2. Start the app:
   ```sh
   docker compose up -d
   ```

   - Frontend: http://localhost:8080
   - Backend: http://localhost:3000

---

## Local dev

```sh
make dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

On first run, also migrate the database:

```sh
cd backend && bun run db:migrate
```
