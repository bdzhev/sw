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

down:
	docker compose down

down-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

clean:
	docker compose down --rmi local --volumes

clean-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down --rmi local --volumes

.PHONY: dev prod prod-remote qr down down-dev clean clean-dev
