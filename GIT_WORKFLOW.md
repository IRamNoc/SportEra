# Git Workflow - SportEra

## Structure des branches

Ce projet utilise une stratégie de branching inspirée de **Git Flow** adaptée pour un projet web moderne.

### Branches principales

#### 🌟 `main`
- **Rôle** : Branche de production stable
- **Contenu** : Code prêt pour la production
- **Protection** : Aucun commit direct autorisé
- **Déploiement** : Automatique vers l'environnement de production

#### 🚀 `production`
- **Rôle** : Branche de pré-production
- **Contenu** : Code testé et validé avant mise en production
- **Source** : Merge depuis `develop` via Pull Request
- **Déploiement** : Environnement de staging/pré-production

#### 🔧 `develop`
- **Rôle** : Branche de développement principale
- **Contenu** : Dernières fonctionnalités développées
- **Source** : Merge des branches de fonctionnalités
- **Déploiement** : Environnement de développement

### Branches de travail

#### 🌿 Branches de fonctionnalités : `feature/nom-fonctionnalite`
```bash
# Créer une nouvelle fonctionnalité
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Développer la fonctionnalité...
git add .
git commit -m "feat: add user authentication system"
git push origin feature/user-authentication

# Créer une Pull Request vers develop
```

#### 🐛 Branches de correction : `bugfix/nom-bug`
```bash
# Corriger un bug
git checkout develop
git pull origin develop
git checkout -b bugfix/login-error

# Corriger le bug...
git add .
git commit -m "fix: resolve login validation error"
git push origin bugfix/login-error

# Créer une Pull Request vers develop
```

#### 🚨 Branches de hotfix : `hotfix/nom-hotfix`
```bash
# Correction urgente en production
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# Appliquer le correctif...
git add .
git commit -m "hotfix: patch critical security vulnerability"
git push origin hotfix/critical-security-fix

# Créer des Pull Requests vers main ET develop
```

## Workflow de développement

### 1. Développement quotidien
```bash
# Toujours partir de develop à jour
git checkout develop
git pull origin develop

# Créer une branche de fonctionnalité
git checkout -b feature/ma-nouvelle-fonctionnalite

# Développer, commiter, pousser
git add .
git commit -m "feat: description de la fonctionnalité"
git push origin feature/ma-nouvelle-fonctionnalite
```

### 2. Intégration
```bash
# Pull Request: feature/* → develop
# Après validation et tests, merge dans develop

# Pull Request: develop → production (pour staging)
# Après tests en staging

# Pull Request: production → main (pour production)
```

### 3. Déploiement
- **Develop** → Environnement de développement (auto)
- **Production** → Environnement de staging (auto)
- **Main** → Environnement de production (auto)

## Conventions de commit

Utiliser la convention **Conventional Commits** :

```bash
# Types de commits
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage, style
refactor: refactorisation
test: ajout/modification de tests
chore: tâches de maintenance

# Exemples
git commit -m "feat: add user registration endpoint"
git commit -m "fix: resolve database connection timeout"
git commit -m "docs: update API documentation"
git commit -m "refactor: optimize database queries"
```

## Règles importantes

### ✅ À faire
- Toujours créer une branche pour chaque fonctionnalité/correction
- Faire des commits atomiques avec des messages clairs
- Tester localement avant de pousser
- Créer des Pull Requests pour toute intégration
- Maintenir `develop` à jour avant de créer une nouvelle branche
- Supprimer les branches de fonctionnalités après merge

### ❌ À éviter
- Commits directs sur `main`, `production`, ou `develop`
- Branches de fonctionnalités trop longues (max 1-2 semaines)
- Messages de commit vagues ("fix", "update", "changes")
- Merge de branches non testées
- Garder des branches obsolètes

## Commandes utiles

```bash
# Voir toutes les branches
git branch -a

# Nettoyer les branches locales supprimées sur le remote
git remote prune origin

# Supprimer une branche locale
git branch -d feature/nom-branche

# Supprimer une branche distante
git push origin --delete feature/nom-branche

# Voir l'historique graphique
git log --oneline --graph --all

# Synchroniser avec le remote
git fetch --all
git pull origin develop
```

## Configuration recommandée

```bash
# Configuration globale Git
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Aliases utiles
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
```

Ce workflow assure une intégration continue propre et une traçabilité complète du développement du projet SportEra.