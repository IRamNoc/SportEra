#!/bin/bash

# Script de nettoyage et redémarrage complet pour SportEra
# Usage: ./scripts/clean-restart.sh

set -e

echo "🧹 Début du nettoyage complet de SportEra..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour arrêter tous les conteneurs Docker
stop_all_containers() {
    print_step "Arrêt de tous les conteneurs Docker..."
    if [ "$(docker ps -q)" ]; then
        docker stop $(docker ps -q)
        print_success "Tous les conteneurs ont été arrêtés"
    else
        print_warning "Aucun conteneur en cours d'exécution"
    fi
}

# Fonction pour supprimer tous les conteneurs
remove_all_containers() {
    print_step "Suppression de tous les conteneurs Docker..."
    if [ "$(docker ps -aq)" ]; then
        docker rm -f $(docker ps -aq)
        print_success "Tous les conteneurs ont été supprimés"
    else
        print_warning "Aucun conteneur à supprimer"
    fi
}

# Fonction pour supprimer toutes les images
remove_all_images() {
    print_step "Suppression de toutes les images Docker..."
    if [ "$(docker images -q)" ]; then
        docker rmi -f $(docker images -q)
        print_success "Toutes les images ont été supprimées"
    else
        print_warning "Aucune image à supprimer"
    fi
}

# Fonction pour supprimer tous les volumes
remove_all_volumes() {
    print_step "Suppression de tous les volumes Docker..."
    if [ "$(docker volume ls -q)" ]; then
        docker volume rm $(docker volume ls -q) 2>/dev/null || true
        print_success "Tous les volumes ont été supprimés"
    else
        print_warning "Aucun volume à supprimer"
    fi
}

# Fonction pour supprimer tous les réseaux
remove_all_networks() {
    print_step "Suppression des réseaux Docker personnalisés..."
    docker network prune -f
    print_success "Réseaux Docker nettoyés"
}

# Fonction pour nettoyer le système Docker
clean_docker_system() {
    print_step "Nettoyage complet du système Docker..."
    docker system prune -af --volumes
    print_success "Système Docker nettoyé"
}

# Fonction pour supprimer les node_modules
remove_node_modules() {
    print_step "Suppression des node_modules..."
    
    # Frontend
    if [ -d "frontend/node_modules" ]; then
        rm -rf frontend/node_modules
        print_success "node_modules du frontend supprimés"
    fi
    
    # Backend
    if [ -d "backend/node_modules" ]; then
        rm -rf backend/node_modules
        print_success "node_modules du backend supprimés"
    fi
    
    # Root
    if [ -d "node_modules" ]; then
        rm -rf node_modules
        print_success "node_modules racine supprimés"
    fi
}

# Fonction pour supprimer les fichiers de lock
remove_lock_files() {
    print_step "Suppression des fichiers de lock..."
    
    find . -name "package-lock.json" -type f -delete 2>/dev/null || true
    find . -name "yarn.lock" -type f -delete 2>/dev/null || true
    
    print_success "Fichiers de lock supprimés"
}

# Fonction pour supprimer les caches
remove_caches() {
    print_step "Suppression des caches..."
    
    # Cache npm
    if command -v npm &> /dev/null; then
        npm cache clean --force 2>/dev/null || true
    fi
    
    # Cache yarn
    if command -v yarn &> /dev/null; then
        yarn cache clean 2>/dev/null || true
    fi
    
    # Cache Next.js
    if [ -d "frontend/.next" ]; then
        rm -rf frontend/.next
    fi
    
    # Cache TypeScript
    find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
    
    print_success "Caches supprimés"
}

# Fonction pour réinstaller les dépendances
reinstall_dependencies() {
    print_step "Réinstallation des dépendances..."
    
    # Root
    if [ -f "package.json" ]; then
        print_step "Installation des dépendances racine..."
        npm install
    fi
    
    # Backend
    if [ -f "backend/package.json" ]; then
        print_step "Installation des dépendances backend..."
        cd backend
        npm install
        cd ..
    fi
    
    # Frontend
    if [ -f "frontend/package.json" ]; then
        print_step "Installation des dépendances frontend..."
        cd frontend
        npm install
        cd ..
    fi
    
    print_success "Toutes les dépendances ont été réinstallées"
}

# Fonction pour reconstruire et démarrer les services
rebuild_and_start() {
    print_step "Reconstruction et démarrage des services..."
    
    # Construction des images Docker
    docker-compose -f docker-compose.dev.yml build --no-cache
    
    # Démarrage des services
    docker-compose -f docker-compose.dev.yml up -d
    
    print_success "Services reconstruits et démarrés"
}

# Fonction pour vérifier l'état des services
check_services() {
    print_step "Vérification de l'état des services..."
    
    sleep 5
    
    echo "État des conteneurs:"
    docker-compose -f docker-compose.dev.yml ps
    
    echo "\nLogs récents:"
    docker-compose -f docker-compose.dev.yml logs --tail=10
}

# Menu interactif
show_menu() {
    echo -e "\n${BLUE}🚀 Script de nettoyage SportEra${NC}"
    echo "Choisissez une option:"
    echo "1) Nettoyage complet + redémarrage (RECOMMANDÉ)"
    echo "2) Nettoyage Docker uniquement"
    echo "3) Nettoyage Node.js uniquement"
    echo "4) Nettoyage Docker + Node.js (sans redémarrage)"
    echo "5) Redémarrage simple (sans nettoyage)"
    echo "6) Quitter"
    echo -n "Votre choix [1-6]: "
}

# Fonction principale
main() {
    # Vérifier qu'on est dans le bon répertoire
    if [ ! -f "docker-compose.dev.yml" ]; then
        print_error "Ce script doit être exécuté depuis la racine du projet SportEra"
        exit 1
    fi
    
    # Si aucun argument, afficher le menu
    if [ $# -eq 0 ]; then
        show_menu
        read choice
    else
        choice=$1
    fi
    
    case $choice in
        1)
            echo -e "\n${RED}⚠️  ATTENTION: Ceci va supprimer TOUS les conteneurs, images, volumes Docker et node_modules!${NC}"
            echo -n "Êtes-vous sûr? (y/N): "
            read confirm
            if [[ $confirm =~ ^[Yy]$ ]]; then
                stop_all_containers
                remove_all_containers
                remove_all_images
                remove_all_volumes
                remove_all_networks
                clean_docker_system
                remove_node_modules
                remove_lock_files
                remove_caches
                reinstall_dependencies
                rebuild_and_start
                check_services
                print_success "Nettoyage complet terminé! 🎉"
                echo -e "\n${GREEN}✨ Votre environnement SportEra est maintenant propre et opérationnel!${NC}"
                echo -e "${BLUE}🌐 Frontend: http://localhost:3001${NC}"
                echo -e "${BLUE}🔧 Backend: http://localhost:3000${NC}"
            else
                print_warning "Opération annulée"
            fi
            ;;
        2)
            stop_all_containers
            remove_all_containers
            remove_all_images
            remove_all_volumes
            remove_all_networks
            clean_docker_system
            print_success "Nettoyage Docker terminé!"
            ;;
        3)
            remove_node_modules
            remove_lock_files
            remove_caches
            reinstall_dependencies
            print_success "Nettoyage Node.js terminé!"
            ;;
        4)
            stop_all_containers
            remove_all_containers
            remove_all_images
            remove_all_volumes
            remove_all_networks
            clean_docker_system
            remove_node_modules
            remove_lock_files
            remove_caches
            reinstall_dependencies
            print_success "Nettoyage complet terminé (sans redémarrage)!"
            ;;
        5)
            docker-compose -f docker-compose.dev.yml down
            docker-compose -f docker-compose.dev.yml up -d
            check_services
            print_success "Redémarrage terminé!"
            ;;
        6)
            print_warning "Au revoir!"
            exit 0
            ;;
        *)
            print_error "Option invalide"
            exit 1
            ;;
    esac
}

# Gestion des signaux pour un arrêt propre
trap 'print_error "Script interrompu par l'"'"'utilisateur"; exit 1' INT TERM

# Exécution du script
main "$@"