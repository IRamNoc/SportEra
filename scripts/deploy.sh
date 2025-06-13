#!/bin/bash

# Script de déploiement simple pour SportEra

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"

# Fonction d'aide
show_help() {
    echo -e "${BLUE}🚀 Script de déploiement SportEra${NC}"
    echo ""
    echo "Usage: $0 [ACTION]"
    echo ""
    echo "Actions disponibles:"
    echo "  start       - Démarrer les services"
    echo "  stop        - Arrêter les services"
    echo "  restart     - Redémarrer les services"
    echo "  build       - Construire les images"
    echo "  logs        - Afficher les logs"
    echo "  clean       - Nettoyer les ressources"
    echo ""
    echo "Exemples:"
    echo "  $0 start"
    echo "  $0 build"
    echo "  $0 logs"
}

# Fonction pour afficher les messages
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier que Docker est installé
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
}

# Démarrer les services
start_services() {
    log_info "Démarrage des services SportEra..."
    cd "$PROJECT_ROOT"
    docker-compose up -d
    log_success "Services démarrés avec succès!"
    log_info "Frontend: http://localhost:3001"
    log_info "Backend: http://localhost:3000"
    log_info "MongoDB: localhost:27017"
}

# Arrêter les services
stop_services() {
    log_info "Arrêt des services SportEra..."
    cd "$PROJECT_ROOT"
    docker-compose down
    log_success "Services arrêtés avec succès!"
}

# Redémarrer les services
restart_services() {
    log_info "Redémarrage des services SportEra..."
    stop_services
    start_services
}

# Construire les images
build_services() {
    log_info "Construction des images Docker..."
    cd "$PROJECT_ROOT"
    docker-compose build
    log_success "Images construites avec succès!"
}

# Afficher les logs
show_logs() {
    log_info "Affichage des logs..."
    cd "$PROJECT_ROOT"
    docker-compose logs -f
}

# Nettoyer les ressources
clean_resources() {
    log_info "Nettoyage des ressources Docker..."
    cd "$PROJECT_ROOT"
    docker-compose down -v
    docker system prune -f
    log_success "Ressources nettoyées avec succès!"
}

# Fonction principale
main() {
    check_docker
    
    case "${1:-start}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        build)
            build_services
            ;;
        logs)
            show_logs
            ;;
        clean)
            clean_resources
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "Action inconnue: $1"
            show_help
            exit 1
            ;;
    esac
}

# Exécuter la fonction principale
main "$@"