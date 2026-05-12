# Commandes disponibles :
#   make dev        → démarre l'environnement de développement
#   make dev-down   → arrête l'environnement de développement
#   make test       → lance les tests unitaires (backend)
#   make test-cov   → lance les tests avec rapport de couverture
#   make qa         → démarre l'environnement QA
#   make qa-down    → arrête l'environnement QA
#   make prod       → démarre l'environnement de production
#   make prod-down  → arrête l'environnement de production

COMPOSE_BASE   = docker compose -f docker-compose.yml
COMPOSE_DEV    = $(COMPOSE_BASE) --env-file .env.dev -f docker-compose.dev.yml

dev:
	$(COMPOSE_DEV) up --build

dev-down:
	$(COMPOSE_DEV) down

test:
	$(COMPOSE_DEV) exec backend npm test -- --forceExit

test-cov:
	$(COMPOSE_DEV) exec backend npm run test:cov -- --forceExit

qa:
	$(COMPOSE_BASE) --env-file .env.qa -f docker-compose.qa.yml up --build

qa-down:
	$(COMPOSE_BASE) --env-file .env.qa -f docker-compose.qa.yml down

prod:
	$(COMPOSE_BASE) --env-file .env.prod -f docker-compose.prod.yml up --build

prod-down:
	$(COMPOSE_BASE) --env-file .env.prod -f docker-compose.prod.yml down

.PHONY: dev dev-down test test-cov qa qa-down prod prod-down
