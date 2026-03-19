dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --remove-orphans

prod:
	docker compose up --build

down:
	docker compose down

down-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

clean:
	docker compose down --rmi local --volumes

clean-dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down --rmi local --volumes
