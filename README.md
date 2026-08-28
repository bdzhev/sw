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

3. Fill the spell library (once per database):
   ```sh
   docker compose exec backend bun run db:seed
   ```
   The spell data ships inside the image, so this needs no network. It is
   idempotent — re-running it changes nothing — and skipping it leaves the
   spellcasting tab's search with nothing to find.

---

## Local dev

```sh
make dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Database migrations run automatically on startup. The spell library does not —
seed it once per database:

```sh
make seed-dev      # make seed, for a prod-style stack
```

`backend/src/modules/spells/spells.data.json` is a committed snapshot, so seeding
works offline and every checkout gets identical rows. `bun run spells:refresh`
re-pulls it from the SRD API and rewrites that file; it is the only part that
touches the network, and it is not part of any normal run.

---

## Attribution

Spell data is taken from the D&D 5e System Reference Document, pulled via
[dnd5eapi.co](https://www.dnd5eapi.co) ([5e-bits/5e-database](https://github.com/5e-bits/5e-database)).

> This work includes material taken from the System Reference Document 5.1
> ("SRD 5.1") by Wizards of the Coast LLC and available at
> <https://dnd.wizards.com/resources/systems-reference-document>. The SRD 5.1 is
> licensed under the Creative Commons Attribution 4.0 International License
> available at <https://creativecommons.org/licenses/by/4.0/legalcode>.
