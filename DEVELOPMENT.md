# 🔥 Guide de Développement Efficace - SportEra

Ce guide présente les outils et commandes optimisés pour développer efficacement sur SportEra avec une visibilité complète sur les erreurs frontend et backend.

## 🚀 Démarrage Rapide

### Option 1: Démarrage avec logs intégrés (Recommandé)
```bash
# Démarrer tout avec logs en temps réel
make dev-start

# Ou pour un environnement spécifique
make dev-start ENV=dev
```

### Option 2: Démarrage séparé
```bash
# Terminal 1: Démarrer les services
make local

# Terminal 2: Surveiller les logs
make dev-logs

# Terminal 3: Surveiller TypeScript
make dev-compile
```

## 📋 Commandes de Logs Avancées

### Logs Colorés et Séparés
```bash
# Tous les logs avec couleurs
make dev-logs

# Logs par service
make dev-logs-frontend    # Frontend seulement
make dev-logs-backend     # Backend seulement
make dev-logs-mongo       # MongoDB seulement

# Avec options avancées
./scripts/dev-logs.sh -f --tail 50        # Frontend, 50 dernières lignes
./scripts/dev-logs.sh -b --no-follow      # Backend, sans suivi temps réel
./scripts/dev-logs.sh -e dev              # Environnement dev
```

### Options du Script de Logs
```bash
./scripts/dev-logs.sh [OPTIONS]

Options:
  -f, --frontend      Logs frontend seulement
  -b, --backend       Logs backend seulement
  -m, --mongo         Logs MongoDB seulement
  -a, --all           Tous les logs (défaut)
  -e, --env ENV       Environnement (local|dev|test|prod)
  --follow            Suivre en temps réel (défaut)
  --no-follow         Afficher existants seulement
  --tail N            N dernières lignes
```

## 🔨 Compilation TypeScript en Temps Réel

### Surveillance Continue
```bash
# Surveiller tous les projets TypeScript
make dev-compile

# Surveiller un projet spécifique
make dev-compile-frontend
make dev-compile-backend

# Avec options avancées
./scripts/dev-compile.sh -w              # Mode surveillance (défaut)
./scripts/dev-compile.sh -c              # Vérification unique
./scripts/dev-compile.sh -f -w           # Frontend en surveillance
./scripts/dev-compile.sh --fix           # Essayer de corriger automatiquement
```

### Vérification Rapide
```bash
# Vérification complète (TypeScript + services)
make dev-check

# Vérification TypeScript seulement
./scripts/dev-compile.sh --check
```

## 🛠️ Workflow de Développement Recommandé

### Setup Initial
```bash
# 1. Cloner et installer
git clone <repo>
cd SportEra

# 2. Démarrage rapide
make dev-start
```

### Développement Multi-Terminal

**Terminal 1: Services + Logs**
```bash
make dev-start
# Ou si déjà démarré:
make dev-logs
```

**Terminal 2: Compilation TypeScript**
```bash
make dev-compile
```

**Terminal 3: Développement**
```bash
# Votre éditeur de code
code .

# Ou commandes ponctuelles
make dev-check              # Vérification complète
make shell ENV=local SERVICE=backend  # Accès shell backend
```

### Debugging d'Erreurs

1. **Erreurs TypeScript**
   ```bash
   # Vérification immédiate
   make dev-check
   
   # Surveillance continue
   make dev-compile
   ```

2. **Erreurs Runtime**
   ```bash
   # Logs spécifiques
   make dev-logs-backend     # Pour erreurs backend
   make dev-logs-frontend    # Pour erreurs frontend
   ```

3. **Problèmes de Connectivité**
   ```bash
   # Statut des services
   make dev-check
   
   # Redémarrage propre
   make stop
   make dev-start --rebuild
   ```

## 🎯 Commandes par Cas d'Usage

### Nouveau Développeur
```bash
# Setup complet
make dev-start
# Puis garder ouvert pour voir tous les logs
```

### Debug d'un Bug Backend
```bash
# Terminal 1: Logs backend seulement
make dev-logs-backend

# Terminal 2: Compilation backend
make dev-compile-backend

# Terminal 3: Shell backend si nécessaire
make shell ENV=local SERVICE=backend
```

### Debug d'un Bug Frontend
```bash
# Terminal 1: Logs frontend seulement
make dev-logs-frontend

# Terminal 2: Compilation frontend
make dev-compile-frontend
```

### Vérification Avant Commit
```bash
# Vérification complète
make dev-check

# Si erreurs TypeScript:
make dev-compile --check
```

### Test d'une Feature
```bash
# Environnement de test
make dev-start ENV=test
make dev-logs ENV=test
```

## 🔧 Configuration Avancée

### Installation d'Outils Optionnels
```bash
# Pour une surveillance de fichiers plus efficace
brew install fswatch

# Pour des logs encore plus beaux
brew install bat  # Alternative à cat avec coloration
```

### Variables d'Environnement
```bash
# Dans votre .bashrc/.zshrc pour des raccourcis
alias ds='make dev-start'
alias dl='make dev-logs'
alias dc='make dev-compile'
alias dcheck='make dev-check'
```

## 📊 Monitoring et Performance

### Surveillance des Ressources
```bash
# Statut Docker
docker stats

# Logs système
docker system df

# Nettoyage si nécessaire
make clean ENV=local
```

### URLs de Développement
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017

## 🆘 Dépannage

### Problèmes Courants

1. **Port déjà utilisé**
   ```bash
   make stop
   make dev-start
   ```

2. **Erreurs de compilation persistantes**
   ```bash
   make dev-compile --check
   # Puis corriger les erreurs affichées
   ```

3. **Services qui ne démarrent pas**
   ```bash
   make dev-check
   docker-compose ps
   ```

4. **Logs trop verbeux**
   ```bash
   # Logs spécifiques seulement
   make dev-logs-backend
   # Ou avec moins de lignes
   ./scripts/dev-logs.sh --tail 20
   ```

### Commandes de Secours
```bash
# Reset complet
make stop
make clean ENV=local
make dev-start --rebuild

# Vérification après reset
make dev-check
```

## 💡 Conseils Pro

1. **Utilisez plusieurs terminaux** pour séparer logs/compilation/développement
2. **Gardez `make dev-compile` ouvert** pour voir les erreurs TypeScript immédiatement
3. **Utilisez `make dev-check`** avant chaque commit
4. **Filtrez les logs** avec les options spécifiques (-f, -b, -m)
5. **Surveillez les performances** avec `docker stats`

---

**🎉 Avec ces outils, vous avez une visibilité complète sur votre application SportEra !**