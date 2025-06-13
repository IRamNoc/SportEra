#!/bin/bash

# Script de démarrage pour le développement SportEra
# Lance les services et affiche les logs en temps réel

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour afficher l'aide
show_help() {
    echo "🚀 SportEra Development Starter"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Afficher cette aide"
    echo "  -e, --env ENV       Environnement (local|dev|test) [défaut: local]"
    echo "  --no-logs           Ne pas afficher les logs après le démarrage"
    echo "  --rebuild           Forcer la reconstruction des images"
    echo "  --clean             Nettoyer avant de démarrer"
    echo "  --check-only        Vérifier seulement le statut des services"
    echo ""
    echo "Exemples:"
    echo "  $0                  # Démarrer en local avec logs"
    echo "  $0 -e dev           # Démarrer en environnement dev"
    echo "  $0 --rebuild        # Reconstruire et démarrer"
    echo "  $0 --check-only     # Vérifier le statut seulement"
}

# Variables par défaut
ENV="local"
SHOW_LOGS=true
REBUILD=false
CLEAN=false
CHECK_ONLY=false

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -e|--env)
            ENV="$2"
            shift 2
            ;;
        --no-logs)
            SHOW_LOGS=false
            shift
            ;;
        --rebuild)
            REBUILD=true
            shift
            ;;
        --clean)
            CLEAN=true
            shift
            ;;
        --check-only)
            CHECK_ONLY=true
            shift
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
        FRONTEND_PORT="3001"
        BACKEND_PORT="3000"
        ;;
    "dev")
        COMPOSE_FILE="docker-compose.dev.yml"
        FRONTEND_PORT="3001"
        BACKEND_PORT="3000"
        ;;
    "test")
        COMPOSE_FILE="docker-compose.test.yml"
        FRONTEND_PORT="3003"
        BACKEND_PORT="3002"
        ;;
    *)
        echo -e "${RED}❌ Environnement invalide: $ENV${NC}"
        echo "Environnements valides: local, dev, test"
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

# Fonction pour vérifier le statut des services
check_services() {
    echo -e "${CYAN}🔍 Vérification du statut des services...${NC}"
    docker-compose -f "$COMPOSE_FILE" ps
    
    echo -e "\n${YELLOW}🌐 URLs des services:${NC}"
    echo -e "${GREEN}Frontend: http://localhost:$FRONTEND_PORT${NC}"
    echo -e "${BLUE}Backend:  http://localhost:$BACKEND_PORT${NC}"
    echo -e "${MAGENTA}MongoDB:  mongodb://localhost:27017${NC}"
    
    # Vérifier la connectivité
    echo -e "\n${CYAN}🔗 Test de connectivité:${NC}"
    
    # Test backend
    if curl -s "http://localhost:$BACKEND_PORT/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend accessible${NC}"
    else
        echo -e "${RED}❌ Backend non accessible${NC}"
    fi
    
    # Test frontend
    if curl -s "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend accessible${NC}"
    else
        echo -e "${RED}❌ Frontend non accessible${NC}"
    fi
}

# Si on veut seulement vérifier
if [ "$CHECK_ONLY" = true ]; then
    check_services
    exit 0
fi

# Nettoyer si demandé
if [ "$CLEAN" = true ]; then
    echo -e "${YELLOW}🧹 Nettoyage de l'environnement $ENV...${NC}"
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans --volumes
fi

# Arrêter les services existants
echo -e "${YELLOW}🛑 Arrêt des services existants...${NC}"
docker-compose -f "$COMPOSE_FILE" down --remove-orphans

# Construire les images si demandé
if [ "$REBUILD" = true ]; then
    echo -e "${BLUE}🔨 Reconstruction des images...${NC}"
    docker-compose -f "$COMPOSE_FILE" build --no-cache
fi

# Démarrer les services
echo -e "${GREEN}🚀 Démarrage de l'environnement $ENV...${NC}"
docker-compose -f "$COMPOSE_FILE" up -d --build

# Attendre que les services soient prêts
echo -e "${CYAN}⏳ Attente du démarrage des services...${NC}"
sleep 10

# Vérifier le statut
check_services

# Afficher les logs si demandé
if [ "$SHOW_LOGS" = true ]; then
    echo -e "\n${GREEN}📋 Affichage des logs en temps réel...${NC}"
    echo -e "${YELLOW}💡 Appuyez sur Ctrl+C pour arrêter l'affichage des logs${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Utiliser le script de logs si disponible
    if [ -f "./scripts/dev-logs.sh" ]; then
        ./scripts/dev-logs.sh -e "$ENV"
    else
        docker-compose -f "$COMPOSE_FILE" logs -f
    fi
else
    echo -e "\n${GREEN}✅ Services démarrés avec succès!${NC}"
    echo -e "${YELLOW}💡 Pour voir les logs: make logs ENV=$ENV${NC}"
    echo -e "${YELLOW}💡 Ou utilisez: ./scripts/dev-logs.sh -e $ENV${NC}"
fi