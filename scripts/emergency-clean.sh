#!/bin/bash

# Script d'urgence pour SportEra - Nettoyage brutal et redémarrage
# Usage: ./scripts/emergency-clean.sh
# ATTENTION: Ce script supprime TOUT sans confirmation!

set -e

echo "🚨 NETTOYAGE D'URGENCE SPORTERA - SUPPRESSION DE TOUT!"
echo "⏰ Début du processus..."

# Arrêter tous les conteneurs Docker (même ceux qui ne répondent pas)
echo "🛑 Arrêt forcé de tous les conteneurs..."
docker kill $(docker ps -q) 2>/dev/null || true

# Supprimer tous les conteneurs
echo "🗑️  Suppression de tous les conteneurs..."
docker rm -f $(docker ps -aq) 2>/dev/null || true

# Supprimer toutes les images
echo "🖼️  Suppression de toutes les images..."
docker rmi -f $(docker images -q) 2>/dev/null || true

# Supprimer tous les volumes
echo "💾 Suppression de tous les volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null || true

# Nettoyage système complet
echo "🧹 Nettoyage système Docker..."
docker system prune -af --volumes 2>/dev/null || true

# Supprimer tous les node_modules
echo "📦 Suppression des node_modules..."
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# Supprimer les fichiers de lock
echo "🔒 Suppression des fichiers de lock..."
find . -name "package-lock.json" -delete 2>/dev/null || true
find . -name "yarn.lock" -delete 2>/dev/null || true

# Supprimer les caches
echo "🗂️  Suppression des caches..."
rm -rf frontend/.next 2>/dev/null || true
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true
npm cache clean --force 2>/dev/null || true
yarn cache clean 2>/dev/null || true

# Réinstaller les dépendances
echo "⬇️  Réinstallation des dépendances..."
[ -f "package.json" ] && npm install
[ -f "backend/package.json" ] && (cd backend && npm install)
[ -f "frontend/package.json" ] && (cd frontend && npm install)

# Reconstruire et démarrer
echo "🔨 Reconstruction des images..."
docker-compose -f docker-compose.dev.yml build --no-cache

echo "🚀 Démarrage des services..."
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Attente du démarrage des services..."
sleep 10

echo "📊 État des services:"
docker-compose -f docker-compose.dev.yml ps

echo "✅ NETTOYAGE D'URGENCE TERMINÉ!"
echo "🌐 Frontend: http://localhost:3001"
echo "🔧 Backend: http://localhost:3000"
echo "📋 Logs: docker-compose -f docker-compose.dev.yml logs -f"