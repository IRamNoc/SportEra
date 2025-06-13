#!/bin/bash

# Script de compilation TypeScript en temps réel
# Surveille les changements et compile automatiquement

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
    echo "🔧 SportEra TypeScript Compiler"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help          Afficher cette aide"
    echo "  -w, --watch         Mode surveillance (défaut)"
    echo "  -c, --check         Vérification unique"
    echo "  -f, --frontend      Compiler seulement le frontend"
    echo "  -b, --backend       Compiler seulement le backend"
    echo "  -a, --all           Compiler frontend et backend (défaut)"
    echo "  --fix               Essayer de corriger automatiquement les erreurs"
    echo ""
    echo "Exemples:"
    echo "  $0                  # Surveillance frontend + backend"
    echo "  $0 -c               # Vérification unique"
    echo "  $0 -f -w            # Surveillance frontend seulement"
    echo "  $0 -b --check       # Vérification backend seulement"
}

# Variables par défaut
MODE="watch"
TARGET="all"
FIX=false

# Parser les arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -w|--watch)
            MODE="watch"
            shift
            ;;
        -c|--check)
            MODE="check"
            shift
            ;;
        -f|--frontend)
            TARGET="frontend"
            shift
            ;;
        -b|--backend)
            TARGET="backend"
            shift
            ;;
        -a|--all)
            TARGET="all"
            shift
            ;;
        --fix)
            FIX=true
            shift
            ;;
        *)
            echo "Option inconnue: $1"
            show_help
            exit 1
            ;;
    esac
done

# Fonction pour vérifier si TypeScript est installé
check_typescript() {
    local dir=$1
    local name=$2
    
    # Sauvegarder le répertoire actuel
    local original_dir=$(pwd)
    
    if [ -d "$dir" ]; then
        cd "$dir"
        if [ -f "package.json" ] && [ -f "tsconfig.json" ]; then
            if npm list typescript &> /dev/null || npm list -g typescript &> /dev/null; then
                echo -e "${GREEN}✅ TypeScript disponible pour $name${NC}"
                cd "$original_dir"
                return 0
            else
                echo -e "${YELLOW}⚠️  TypeScript non installé pour $name${NC}"
                cd "$original_dir"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️  Configuration TypeScript manquante pour $name${NC}"
            cd "$original_dir"
            return 1
        fi
    else
        echo -e "${RED}❌ Répertoire $name non trouvé${NC}"
        return 1
    fi
}

# Fonction pour compiler TypeScript
compile_typescript() {
    local dir=$1
    local name=$2
    local watch_mode=$3
    
    echo -e "${BLUE}🔨 Compilation $name...${NC}"
    
    # Sauvegarder le répertoire actuel
    local original_dir=$(pwd)
    
    if [ -d "$dir" ]; then
        cd "$dir"
        
        if [ "$watch_mode" = "true" ]; then
            echo -e "${CYAN}👀 Mode surveillance activé pour $name${NC}"
            if [ "$FIX" = "true" ]; then
                npx tsc --watch --pretty --preserveWatchOutput &
            else
                npx tsc --noEmit --watch --pretty --preserveWatchOutput &
            fi
        else
            echo -e "${CYAN}🔍 Vérification unique pour $name${NC}"
            if [ "$FIX" = "true" ]; then
                npx tsc --pretty
            else
                npx tsc --noEmit --pretty
            fi
            
            local exit_code=$?
            if [ $exit_code -eq 0 ]; then
                echo -e "${GREEN}✅ $name: Aucune erreur TypeScript${NC}"
            else
                echo -e "${RED}❌ $name: Erreurs TypeScript détectées${NC}"
            fi
            
            # Retourner au répertoire original
            cd "$original_dir"
            return $exit_code
        fi
        
        # Retourner au répertoire original
        cd "$original_dir"
    else
        echo -e "${RED}❌ Répertoire $dir non trouvé${NC}"
        return 1
    fi
}

# Fonction pour surveiller les fichiers avec fswatch (si disponible)
watch_with_fswatch() {
    local dir=$1
    local name=$2
    
    if command -v fswatch &> /dev/null; then
        echo -e "${CYAN}👀 Surveillance avancée avec fswatch pour $name${NC}"
        fswatch -o "$dir/src" | while read f; do
            echo -e "${YELLOW}🔄 Changement détecté dans $name, recompilation...${NC}"
            cd "$dir"
            npx tsc --noEmit --pretty
            cd - > /dev/null
        done &
    else
        echo -e "${YELLOW}💡 Installez fswatch pour une surveillance plus efficace: brew install fswatch${NC}"
        compile_typescript "$dir" "$name" "true"
    fi
}

# Fonction principale
main() {
    echo -e "${GREEN}🚀 SportEra TypeScript Compiler${NC}"
    echo -e "${CYAN}Mode: $MODE, Cible: $TARGET${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Vérifier les répertoires et TypeScript
    FRONTEND_OK=false
    BACKEND_OK=false
    
    if [ "$TARGET" = "all" ] || [ "$TARGET" = "frontend" ]; then
        if check_typescript "frontend" "Frontend"; then
            FRONTEND_OK=true
        fi
    fi
    
    if [ "$TARGET" = "all" ] || [ "$TARGET" = "backend" ]; then
        if check_typescript "backend" "Backend"; then
            BACKEND_OK=true
        fi
    fi
    
    # Compiler selon le mode
    if [ "$MODE" = "watch" ]; then
        echo -e "\n${GREEN}🔄 Démarrage de la surveillance...${NC}"
        echo -e "${YELLOW}💡 Appuyez sur Ctrl+C pour arrêter${NC}\n"
        
        # Fonction de nettoyage
        cleanup() {
            echo -e "\n${YELLOW}🛑 Arrêt de la surveillance...${NC}"
            jobs -p | xargs -r kill
            exit 0
        }
        trap cleanup SIGINT SIGTERM
        
        if [ "$FRONTEND_OK" = "true" ]; then
            watch_with_fswatch "frontend" "Frontend"
        fi
        
        if [ "$BACKEND_OK" = "true" ]; then
            watch_with_fswatch "backend" "Backend"
        fi
        
        # Attendre indéfiniment
        wait
    else
        # Mode vérification unique
        echo -e "\n${BLUE}🔍 Vérification TypeScript...${NC}\n"
        
        ERRORS=0
        
        if [ "$FRONTEND_OK" = "true" ]; then
            compile_typescript "frontend" "Frontend" "false"
            if [ $? -ne 0 ]; then
                ERRORS=$((ERRORS + 1))
            fi
        fi
        
        if [ "$BACKEND_OK" = "true" ]; then
            compile_typescript "backend" "Backend" "false"
            if [ $? -ne 0 ]; then
                ERRORS=$((ERRORS + 1))
            fi
        fi
        
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        if [ $ERRORS -eq 0 ]; then
            echo -e "${GREEN}🎉 Aucune erreur TypeScript détectée!${NC}"
            exit 0
        else
            echo -e "${RED}❌ $ERRORS projet(s) avec des erreurs TypeScript${NC}"
            exit 1
        fi
    fi
}

# Exécuter le script principal
main