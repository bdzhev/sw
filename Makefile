# The frontend's vitest suite. Runs on the host, not in a container, and needs
# `bun run` rather than `bun test` — the bare form uses Bun's own runner, which
# does not read vite.config.ts and so cannot resolve the @shared/@widgets
# aliases. Pass extra args through, e.g. `make front-test ARGS=--watch`.
front-test:
	bun run --cwd frontend test $(ARGS)

dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --remove-orphans

# Builds the images from source — the ghcr ones are amd64-only.
prod:
	-@bun run scripts/printJoinQr.ts 8080
	docker compose -f docker-compose.yml -f docker-compose.build.yml up --build

# Runs the published ghcr images instead of building. amd64 hosts only.
prod-remote:
	-@bun run scripts/printJoinQr.ts 8080
	docker compose up --pull always

# Reprints the join QR once compose has scrolled it away. 5173 for a dev run.
qr:
	@bun run scripts/printJoinQr.ts $(or $(PORT),8080)

# Fills the shared spell library from the committed snapshot in
# backend/src/modules/spells. No network, and idempotent — every row upserts on
# its slug, so re-running is a no-op. Needed once per database.
seed:
	docker compose exec backend bun run db:seed

seed-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend bun run db:seed

down:
	docker compose down

down-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

clean:
	docker compose down --rmi local --volumes

clean-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down --rmi local --volumes

.PHONY: front-test dev prod prod-remote qr seed seed-dev down down-dev clean clean-dev
