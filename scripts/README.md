# Scripts de Nettoyage SportEra

Ce dossier contient des scripts pour nettoyer et redémarrer votre environnement SportEra en cas de problème.

## 🧹 Script de Nettoyage Interactif

### `clean-restart.sh`

Script principal avec menu interactif pour différents types de nettoyage.

**Usage:**
```bash
# Lancement interactif
./scripts/clean-restart.sh

# Ou via Makefile
make clean
```

**Options disponibles:**
1. **Nettoyage complet + redémarrage** (RECOMMANDÉ)
   - Supprime tous les conteneurs, images, volumes Docker
   - Supprime tous les node_modules
   - Supprime les fichiers de lock et caches
   - Réinstalle les dépendances
   - Reconstruit et redémarre les services

2. **Nettoyage Docker uniquement**
   - Supprime conteneurs, images, volumes, réseaux
   - Garde les node_modules intacts

3. **Nettoyage Node.js uniquement**
   - Supprime node_modules, fichiers de lock, caches
   - Réinstalle les dépendances
   - Garde Docker intact

4. **Nettoyage Docker + Node.js (sans redémarrage)**
   - Combine options 2 et 3
   - Ne redémarre pas les services

5. **Redémarrage simple**
   - Redémarre juste les services Docker
   - Aucun nettoyage

### Commandes Makefile

```bash
# Nettoyage interactif
make clean

# Nettoyage complet automatique
make clean-full

# Nettoyage Docker uniquement
make clean-docker

# Nettoyage Node.js uniquement
make clean-node

# Redémarrage simple
make restart
```

## 🚨 Script d'Urgence

### `emergency-clean.sh`

Script pour les situations extrêmes où plus rien ne fonctionne.

**⚠️ ATTENTION:** Ce script supprime TOUT sans confirmation!

**Usage:**
```bash
# Exécution directe
./scripts/emergency-clean.sh

# Ou via Makefile (avec délai de sécurité de 5 secondes)
make emergency-clean
```

**Ce que fait ce script:**
- Tue brutalement tous les conteneurs Docker
- Supprime tous les conteneurs, images, volumes
- Supprime tous les node_modules récursivement
- Supprime tous les fichiers de lock
- Supprime tous les caches
- Réinstalle toutes les dépendances
- Reconstruit et redémarre tout

## 🎯 Quand Utiliser Quel Script?

### Problèmes Légers
- **Erreur de compilation:** `make clean-node`
- **Problème Docker mineur:** `make restart`
- **Mise à jour dépendances:** `make clean-node`

### Problèmes Modérés
- **Conflits Docker:** `make clean-docker`
- **Problèmes de cache:** `make clean-full`
- **Après changement de branche:** `make clean-full`

### Problèmes Graves
- **Plus rien ne marche:** `make emergency-clean`
- **Corruption de données:** `make emergency-clean`
- **Environnement complètement cassé:** `make emergency-clean`

## 📋 Vérifications Post-Nettoyage

Après un nettoyage, vérifiez que tout fonctionne:

```bash
# Vérifier l'état des services
docker-compose -f docker-compose.dev.yml ps

# Vérifier les logs
docker-compose -f docker-compose.dev.yml logs

# Tester les URLs
# Frontend: http://localhost:3001
# Backend: http://localhost:3000
```

## 🔧 Dépannage

### Le script ne s'exécute pas
```bash
# Vérifier les permissions
ls -la scripts/

# Rendre exécutable si nécessaire
chmod +x scripts/*.sh
```

### Erreurs Docker
```bash
# Vérifier que Docker est démarré
docker info

# Redémarrer Docker Desktop si nécessaire
```

### Erreurs Node.js
```bash
# Vérifier la version Node.js
node --version
npm --version

# Nettoyer le cache npm global
npm cache clean --force
```

## 🚀 Conseils d'Utilisation

1. **Sauvegardez vos données importantes** avant un nettoyage complet
2. **Fermez votre éditeur** avant de supprimer node_modules
3. **Utilisez le nettoyage interactif** pour choisir précisément ce dont vous avez besoin
4. **Le script d'urgence** est vraiment pour les cas désespérés
5. **Vérifiez toujours** que les services redémarrent correctement après nettoyage

## 📝 Logs et Debugging

Tous les scripts affichent des messages colorés pour suivre le processus:
- 🔵 Bleu: Étapes en cours
- 🟢 Vert: Succès
- 🟡 Jaune: Avertissements
- 🔴 Rouge: Erreurs

En cas de problème, les logs Docker sont affichés automatiquement à la fin du processus.