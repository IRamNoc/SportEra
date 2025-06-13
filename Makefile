# SportEra Development Makefile - Architecture Refactorisée
# Utilise la nouvelle architecture Docker unifiée

.PHONY: help local dev test prod stop clean build logs status shell backup restore dev-start dev-logs dev-compile dev-check

# Variables
DEPLOY_SCRIPT := ./scripts/deploy.sh

# Default target
help:
	@echo "🚀 SportEra Development Commands (Architecture Refactorisée)"
	@echo ""
	@echo "🔥 Commandes de développement rapide:"
	@echo "  make dev-start ENV=     - Démarrer avec logs en temps réel (local|dev|test)"
	@echo "  make dev-logs ENV=      - Afficher logs colorés en temps réel"
	@echo "  make dev-compile        - Compiler TypeScript en temps réel"
	@echo "  make dev-check          - Vérifier TypeScript + statut services"
	@echo ""
	@echo "Environnements:"
	@echo "  make local              - Démarrer l'environnement local"
	@echo "  make dev                - Démarrer l'environnement de développement"
	@echo "  make test               - Démarrer l'environnement de test"
	@echo "  make prod               - Démarrer l'environnement de production"
	@echo ""
	@echo "Gestion des conteneurs:"
	@echo "  make stop ENV=          - Arrêter un environnement (local|dev|test|prod)"
	@echo "  make clean ENV=         - Nettoyer un environnement"
	@echo "  make build ENV=         - Construire les images d'un environnement"
	@echo ""
	@echo "Monitoring:"
	@echo "  make logs ENV=          - Afficher les logs d'un environnement"
	@echo "  make status ENV=        - Vérifier le statut d'un environnement"
	@echo ""
	@echo "Développement:"
	@echo "  make shell ENV= SERVICE= - Accéder au shell d'un service"
	@echo "    Services: backend, frontend, mongodb"
	@echo ""
	@echo "Utilitaires:"
	@echo "  make generate-env       - Générer les fichiers .env depuis la config"
	@echo "  make validate-env       - Valider la configuration"
	@echo ""
	@echo "💡 Exemples recommandés:"
	@echo "  make dev-start          # Démarrage rapide avec logs"
	@echo "  make dev-logs ENV=dev   # Logs colorés environnement dev"
	@echo "  make dev-compile        # Surveillance TypeScript"
	@echo "  make dev-check          # Vérification complète"

# Environment variables
ENV ?= local
SERVICE ?= backend

# Local development (default docker-compose.yml)
local:
	@echo "🏠 Starting local development environment..."
	docker-compose down --remove-orphans || true
	docker-compose up --build -d
	@echo "✅ Local environment started"
	@echo "Frontend: http://localhost:3001"
	@echo "Backend: http://localhost:3000"

# Development environment
dev:
	@echo "🔧 Starting development environment..."
	docker-compose -f docker-compose.dev.yml down --remove-orphans || true
	docker-compose -f docker-compose.dev.yml up --build -d
	@echo "✅ Development environment started"
	@echo "Frontend: http://localhost:3001"
	@echo "Backend: http://localhost:3000"

# Development commands
dev-detached:
	docker-compose -f docker-compose.dev.yml up --build -d

dev-stop:
	docker-compose -f docker-compose.dev.yml down

# Cleaning commands
clean-full:
	@echo "🧹 Nettoyage complet automatique..."
	./scripts/clean-restart.sh 1

clean-docker:
	@echo "🐳 Nettoyage Docker uniquement..."
	./scripts/clean-restart.sh 2

clean-node:
	@echo "📦 Nettoyage Node.js uniquement..."
	./scripts/clean-restart.sh 3

emergency-clean:
	@echo "🚨 NETTOYAGE D'URGENCE - SUPPRESSION DE TOUT!"
	@echo "⚠️  Appuyez sur Ctrl+C dans les 5 secondes pour annuler..."
	@sleep 5
	./scripts/emergency-clean.sh

restart:
	@echo "🔄 Redémarrage simple..."
	./scripts/clean-restart.sh 5

# Test environment
test:
	@echo "🧪 Starting test environment..."
	docker-compose -f docker-compose.test.yml down --remove-orphans || true
	docker-compose -f docker-compose.test.yml up --build -d
	@echo "✅ Test environment started"
	@echo "Frontend: http://localhost:3003"
	@echo "Backend: http://localhost:3002"

# Production environment
prod:
	@echo "🚀 Starting production environment..."
	@if [ ! -f .env.production ]; then \
		echo "❌ .env.production file not found!"; \
		echo "Please copy .env.production.example to .env.production and configure it."; \
		exit 1; \
	fi
	docker-compose -f docker-compose.prod.yml down --remove-orphans || true
	docker-compose -f docker-compose.prod.yml up --build -d
	@echo "✅ Production environment started"
	@echo "Application: https://localhost"

# Stop all environments
stop:
	@echo "🛑 Stopping all environments..."
	docker-compose down --remove-orphans || true
	docker-compose -f docker-compose.dev.yml down --remove-orphans || true
	docker-compose -f docker-compose.test.yml down --remove-orphans || true
	docker-compose -f docker-compose.prod.yml down --remove-orphans || true
	@echo "✅ All environments stopped"

# Clean everything
clean:
	@echo "🧹 Lancement du script de nettoyage interactif..."
	./scripts/clean-restart.sh

# Show logs
logs:
	@if [ "$(ENV)" = "local" ]; then \
		docker-compose logs -f; \
	elif [ "$(ENV)" = "dev" ]; then \
		docker-compose -f docker-compose.dev.yml logs -f; \
	elif [ "$(ENV)" = "test" ]; then \
		docker-compose -f docker-compose.test.yml logs -f; \
	elif [ "$(ENV)" = "prod" ]; then \
		docker-compose -f docker-compose.prod.yml logs -f; \
	else \
		echo "❌ Invalid environment: $(ENV)"; \
		echo "Valid environments: local, dev, test, prod"; \
	fi

# Build specific environment
build:
	@if [ "$(ENV)" = "local" ]; then \
		docker-compose build --no-cache; \
	elif [ "$(ENV)" = "dev" ]; then \
		docker-compose -f docker-compose.dev.yml build --no-cache; \
	elif [ "$(ENV)" = "test" ]; then \
		docker-compose -f docker-compose.test.yml build --no-cache; \
	elif [ "$(ENV)" = "prod" ]; then \
		docker-compose -f docker-compose.prod.yml build --no-cache; \
	else \
		echo "❌ Invalid environment: $(ENV)"; \
		echo "Valid environments: local, dev, test, prod"; \
	fi

# Health check
health:
	@echo "🏥 Checking health of $(ENV) environment..."
	@if [ "$(ENV)" = "local" ]; then \
		docker-compose ps; \
	elif [ "$(ENV)" = "dev" ]; then \
		docker-compose -f docker-compose.dev.yml ps; \
	elif [ "$(ENV)" = "test" ]; then \
		docker-compose -f docker-compose.test.yml ps; \
	elif [ "$(ENV)" = "prod" ]; then \
		docker-compose -f docker-compose.prod.yml ps; \
	else \
		echo "❌ Invalid environment: $(ENV)"; \
		echo "Valid environments: local, dev, test, prod"; \
	fi

# Access container shell
shell:
	@echo "🐚 Accessing $(SERVICE) shell in $(ENV) environment..."
	@if [ "$(ENV)" = "local" ]; then \
		docker-compose exec $(SERVICE) sh; \
	elif [ "$(ENV)" = "dev" ]; then \
		docker-compose -f docker-compose.dev.yml exec $(SERVICE) sh; \
	elif [ "$(ENV)" = "test" ]; then \
		docker-compose -f docker-compose.test.yml exec $(SERVICE) sh; \
	elif [ "$(ENV)" = "prod" ]; then \
		docker-compose -f docker-compose.prod.yml exec $(SERVICE) sh; \
	else \
		echo "❌ Invalid environment: $(ENV)"; \
		echo "Valid environments: local, dev, test, prod"; \
	fi

# Database backup (production)
backup-db:
	@echo "💾 Creating database backup..."
	@mkdir -p backups
	docker-compose -f docker-compose.prod.yml exec mongodb mongodump --authenticationDatabase admin -u admin -p $(MONGO_PASSWORD) --db sportera --out /tmp/backup
	docker cp sportera-mongo-prod:/tmp/backup ./backups/backup-$(shell date +%Y%m%d-%H%M%S)
	@echo "✅ Database backup completed"

# Database restore (production)
restore-db:
	@echo "📥 Restoring database backup..."
	@read -p "Enter backup directory name: " backup_dir && \
	docker cp ./backups/$$backup_dir sportera-mongo-prod:/tmp/restore && \
	docker-compose -f docker-compose.prod.yml exec mongodb mongorestore --authenticationDatabase admin -u admin -p $(MONGO_PASSWORD) --db sportera --drop /tmp/restore/sportera
	@echo "✅ Database restore completed"

# Update production
update-prod:
	@echo "🔄 Updating production environment..."
	git pull origin main
	docker-compose -f docker-compose.prod.yml build --no-cache
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ Production update completed"

# ============================================================================
# 🔥 NOUVELLES COMMANDES DE DÉVELOPPEMENT EFFICACES
# ============================================================================

# Démarrage rapide avec logs en temps réel
dev-start:
	@echo "🚀 Démarrage rapide SportEra..."
	@if [ -f "./scripts/dev-start.sh" ]; then \
		./scripts/dev-start.sh -e $(or $(ENV),local); \
	else \
		echo "❌ Script dev-start.sh non trouvé"; \
		echo "💡 Utilisez: make local ou make dev à la place"; \
	fi

# Logs colorés en temps réel
dev-logs:
	@echo "📋 Affichage des logs SportEra..."
	@if [ -f "./scripts/dev-logs.sh" ]; then \
		./scripts/dev-logs.sh -e $(or $(ENV),local); \
	else \
		echo "❌ Script dev-logs.sh non trouvé"; \
		echo "💡 Utilisez: make logs ENV=$(or $(ENV),local) à la place"; \
	fi

# Compilation TypeScript en temps réel
dev-compile:
	@echo "🔨 Compilation TypeScript SportEra..."
	@if [ -f "./scripts/dev-compile.sh" ]; then \
		./scripts/dev-compile.sh; \
	else \
		echo "❌ Script dev-compile.sh non trouvé"; \
		echo "💡 Vérification manuelle:"; \
		echo "   cd backend && npx tsc --noEmit"; \
		echo "   cd frontend && npx tsc --noEmit"; \
	fi

# Vérification complète (TypeScript + services)
dev-check:
	@echo "🔍 Vérification complète SportEra..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "📋 1. Vérification TypeScript..."
	@if [ -f "./scripts/dev-compile.sh" ]; then \
		./scripts/dev-compile.sh --check; \
	else \
		echo "⚠️  Script dev-compile.sh non trouvé, vérification manuelle:"; \
		cd backend && npx tsc --noEmit && echo "✅ Backend OK" || echo "❌ Backend erreurs"; \
		cd frontend && npx tsc --noEmit && echo "✅ Frontend OK" || echo "❌ Frontend erreurs"; \
	fi
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "🐳 2. Vérification des services Docker..."
	@if [ -f "./scripts/dev-start.sh" ]; then \
		./scripts/dev-start.sh --check-only -e $(or $(ENV),local); \
	else \
		docker-compose ps; \
	fi
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "✅ Vérification complète terminée!"

# Commandes rapides pour les logs spécifiques
dev-logs-frontend:
	@./scripts/dev-logs.sh -f -e $(or $(ENV),local)

dev-logs-backend:
	@./scripts/dev-logs.sh -b -e $(or $(ENV),local)

dev-logs-mongo:
	@./scripts/dev-logs.sh -m -e $(or $(ENV),local)

# Compilation spécifique
dev-compile-frontend:
	@./scripts/dev-compile.sh -f

dev-compile-backend:
	@./scripts/dev-compile.sh -b

# Aide pour les nouvelles commandes
dev-help:
	@echo "🔥 SportEra - Commandes de développement avancées"
	@echo ""
	@echo "🚀 Démarrage rapide:"
	@echo "  make dev-start          # Démarrer + logs temps réel (local)"
	@echo "  make dev-start ENV=dev  # Démarrer + logs temps réel (dev)"
	@echo ""
	@echo "📋 Logs avancés:"
	@echo "  make dev-logs           # Tous les logs colorés"
	@echo "  make dev-logs-frontend  # Logs frontend seulement"
	@echo "  make dev-logs-backend   # Logs backend seulement"
	@echo "  make dev-logs-mongo     # Logs MongoDB seulement"
	@echo ""
	@echo "🔨 Compilation TypeScript:"
	@echo "  make dev-compile        # Surveillance temps réel"
	@echo "  make dev-compile-frontend # Frontend seulement"
	@echo "  make dev-compile-backend  # Backend seulement"
	@echo ""
	@echo "🔍 Vérifications:"
	@echo "  make dev-check          # Vérification complète"
	@echo ""
	@echo "💡 Workflow recommandé:"
	@echo "  1. make dev-start       # Démarrer tout"
	@echo "  2. make dev-compile     # Surveiller TypeScript (terminal 2)"
	@echo "  3. Développer avec logs en temps réel!"