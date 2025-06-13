#!/bin/bash

# Script pour afficher les logs de développement en temps réel
# avec une séparation claire entre frontend et backend

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour afficher l'aide
show_help() {
    echo "🚀 SportEra Development Logs"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Afficher cette aide"
    echo "  -f, --frontend      Afficher seulement les logs frontend"
    echo "  -b, --backend       Afficher seulement les logs backend"
    echo "  -m, --mongo         Afficher seulement les logs MongoDB"
    echo "  -a, --all           Afficher tous les logs (défaut)"
    echo "  -e, --env ENV       Environnement (local|dev|test|prod) [défaut: local]"
    echo "  --follow            Suivre les logs en temps réel (défaut)"
    echo "  --no-follow         Afficher les logs existants seulement"
    echo "  --tail N            Afficher les N dernières lignes [défaut: 100]"
    echo ""
    echo "Exemples:"
    echo "  $0                  # Tous les logs en temps réel"
    echo "  $0 -f               # Seulement frontend"
    echo "  $0 -b --tail 50     # Backend, 50 dernières lignes"
    echo "  $0 -e dev           # Environnement dev"
}

# Variables par défaut
ENV="local"
SERVICE="all"
FOLLOW="-f"
TAIL="100"

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -f|--frontend)
            SERVICE="frontend"
            shift
            ;;
        -b|--backend)
            SERVICE="backend"
            shift
            ;;
        -m|--mongo)
            SERVICE="mongodb"
            shift
            ;;
        -a|--all)
            SERVICE="all"
            shift
            ;;
        -e|--env)
            ENV="$2"
            shift 2
            ;;
        --follow)
            FOLLOW="-f"
            shift
            ;;
        --no-follow)
            FOLLOW=""
            shift
            ;;
        --tail)
            TAIL="$2"
            shift 2
            ;;
        *)
            echo "Option inconnue: $1"
            show_help
            exit 1
            ;;
    esac
done

# Déterminer le fichier docker-compose
COMPOSE_FILE="docker-compose.yml"
case $ENV in
    "local")
        COMPOSE_FILE="docker-compose.yml"
        ;;
    "dev")
        COMPOSE_FILE="docker-compose.dev.yml"
        ;;
    "test")
        COMPOSE_FILE="docker-compose.test.yml"
        ;;
    "prod")
        COMPOSE_FILE="docker-compose.prod.yml"
        ;;
    *)
        echo -e "${RED}❌ Environnement invalide: $ENV${NC}"
        echo "Environnements valides: local, dev, test, prod"
        exit 1
        ;;
esac

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose n'est pas installé${NC}"
    exit 1
fi

# Vérifier que le fichier docker-compose existe
if [ ! -f "$COMPOSE_FILE" ]; then
    echo -e "${RED}❌ Fichier $COMPOSE_FILE non trouvé${NC}"
    exit 1
fi

# Fonction pour afficher les logs avec couleurs
show_logs() {
    local service=$1
    local color=$2
    
    echo -e "${color}🔍 Affichage des logs pour: $service (environnement: $ENV)${NC}"
    echo -e "${CYAN}📁 Fichier: $COMPOSE_FILE${NC}"
    echo -e "${YELLOW}⏰ $(date)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ "$service" = "all" ]; then
        docker-compose -f "$COMPOSE_FILE" logs --tail="$TAIL" $FOLLOW
    else
        docker-compose -f "$COMPOSE_FILE" logs --tail="$TAIL" $FOLLOW "$service"
    fi
}

# Fonction pour afficher les logs avec séparation par service
show_logs_separated() {
    echo -e "${GREEN}🚀 SportEra Development Logs - Environnement: $ENV${NC}"
    echo -e "${CYAN}📁 Fichier: $COMPOSE_FILE${NC}"
    echo -e "${YELLOW}⏰ $(date)${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Créer des fichiers temporaires pour les logs
    TEMP_DIR=$(mktemp -d)
    FRONTEND_LOG="$TEMP_DIR/frontend.log"
    BACKEND_LOG="$TEMP_DIR/backend.log"
    MONGO_LOG="$TEMP_DIR/mongo.log"
    
    # Fonction de nettoyage
    cleanup() {
        rm -rf "$TEMP_DIR"
        exit 0
    }
    trap cleanup SIGINT SIGTERM
    
    # Lancer les logs en arrière-plan
    docker-compose -f "$COMPOSE_FILE" logs $FOLLOW --tail="$TAIL" frontend 2>&1 | \
        sed "s/^/$(echo -e "${GREEN}[FRONTEND]${NC}") /" > "$FRONTEND_LOG" &
    
    docker-compose -f "$COMPOSE_FILE" logs $FOLLOW --tail="$TAIL" backend 2>&1 | \
        sed "s/^/$(echo -e "${BLUE}[BACKEND]${NC}") /" > "$BACKEND_LOG" &
    
    docker-compose -f "$COMPOSE_FILE" logs $FOLLOW --tail="$TAIL" mongodb 2>&1 | \
        sed "s/^/$(echo -e "${MAGENTA}[MONGODB]${NC}") /" > "$MONGO_LOG" &
    
    # Afficher les logs en temps réel
    tail -f "$FRONTEND_LOG" "$BACKEND_LOG" "$MONGO_LOG" 2>/dev/null
}

# Afficher les logs selon le service demandé
case $SERVICE in
    "frontend")
        show_logs "frontend" "$GREEN"
        ;;
    "backend")
        show_logs "backend" "$BLUE"
        ;;
    "mongodb")
        show_logs "mongodb" "$MAGENTA"
        ;;
    "all")
        if [ "$FOLLOW" = "-f" ]; then
            show_logs_separated
        else
            show_logs "all" "$CYAN"
        fi
        ;;
esac