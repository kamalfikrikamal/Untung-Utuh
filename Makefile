# ─────────────────────────────────────────────────────────────────────────────
# Makefile — MERN Stack Docker shortcuts
# ─────────────────────────────────────────────────────────────────────────────

.PHONY: dev stag prod down-dev down-stag down-prod logs-dev logs-stag logs-prod test-backend test-frontend setup

# ── Setup ─────────────────────────────────────────────────────────────────────
setup:
	@echo "Setting up environment files..."
	@[ -f backend/.env ] || cp backend/.env.example backend/.env
	@[ -f frontend/.env ] || cp frontend/.env.example frontend/.env
	@[ -f .env ] || cp .env.example .env
	@echo "Done. Edit backend/.env, frontend/.env, and .env with your real values."

# ── Development ───────────────────────────────────────────────────────────────
dev:
	docker compose up --build

dev-d:
	docker compose up --build -d

down-dev:
	docker compose down

logs-dev:
	docker compose logs -f

# ── Staging ───────────────────────────────────────────────────────────────────
stag:
	docker compose -f docker-compose.staging.yml up --build

stag-d:
	docker compose -f docker-compose.staging.yml up --build -d

down-stag:
	docker compose -f docker-compose.staging.yml down

logs-stag:
	docker compose -f docker-compose.staging.yml logs -f

# ── Production ────────────────────────────────────────────────────────────────
prod:
	docker compose -f docker-compose.prod.yml up --build -d

down-prod:
	docker compose -f docker-compose.prod.yml down

logs-prod:
	docker compose -f docker-compose.prod.yml logs -f

# ── Tests ─────────────────────────────────────────────────────────────────────
test-backend:
	cd backend && npm install && npm test

test-frontend:
	cd frontend && npm install && npm test

test-all: test-backend test-frontend

# ── Cleanup ───────────────────────────────────────────────────────────────────
clean:
	docker compose down -v --remove-orphans
	docker compose -f docker-compose.staging.yml down -v --remove-orphans
	docker compose -f docker-compose.prod.yml down -v --remove-orphans
